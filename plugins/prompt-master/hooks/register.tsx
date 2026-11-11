import { atom, read, update } from 'claude-code'
import type { EngineInterface, Register } from 'claude-code'

const isBusy = atom({ plugin: 'prompt-master', key: 'isBusy' } as const, false)

const SYSTEM = `You are Prompt Master. You rewrite a user's rough prompt for an AI assistant into a better prompt.
Rules:
- Keep the user's intent, facts, names, files and constraints exactly; never invent requirements.
- Write in the same language as the rough prompt (Arabic stays Arabic, English stays English).
- Make it clear and specific: state the goal, the relevant context, the expected output (format, length, audience) and any constraints.
- Use short sections or bullets only when the task has several parts; keep simple asks short.
- Where something important is missing, add a short line asking the assistant to state its assumptions rather than guessing.
- Reply with the rewritten prompt only: no preamble, no quotes, no explanation.`

async function rewrite($: EngineInterface, rough: string) {
  const r = await $.model.complete({
    model: 'sonnet',
    system: SYSTEM,
    prompt: `Rough prompt:\n<rough>\n${rough}\n</rough>`,
    maxTokens: 2048,
    timeoutMs: 60000,
  })
  return r.isAnswered ? r.text.trim() : undefined
}

// One-click: rewrite whatever is in the prompt box, in place.
async function improveDraft($: EngineInterface) {
  if (await read($, isBusy)) return
  const { text } = await $.prompt.read()
  if (!text.trim()) {
    $.ui.toast('Prompt Master: type a rough prompt first')
    return
  }
  await update($, isBusy, () => true)
  $.ui.status('Prompt Master: rewriting…')
  try {
    const better = await rewrite($, text)
    if (!better) {
      $.ui.toast('Prompt Master: could not rewrite, your draft is unchanged')
      return
    }
    await $.prompt.fill({ text: better, mode: 'replace' })
    $.ui.toast('Prompt Master: improved prompt ready, review and send')
  } finally {
    $.ui.status(undefined)
    await update($, isBusy, () => false)
  }
}

export const register: Register = on => {
  on('session.start', async ($, e, next) => {
    await $.command.register({
      name: 'pm',
      description: 'Prompt Master: rewrite a rough prompt into a better one (/pm <your prompt>)',
    })
    return next(e)
  })

  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    if (e.props.hasSurvey) return next(e)
    const { Box, Button, Text } = $.ui.resolve(e)
    const busy = await read($, isBusy)
    return (
      <Box>
        {busy ? (
          <Text dimColor>✨ Prompt Master is rewriting your prompt…</Text>
        ) : (
          <Button key="pm" label="✨ Prompt Master" onPress={() => improveDraft($)} />
        )}
      </Box>
    )
  })

  // /pm <rough prompt>: works on every surface, including the mobile app.
  on('command.run', { command: 'pm' }, async ($, e) => {
    const rough = e.args.trim() || (await $.prompt.read()).text.trim()
    if (!rough) return { text: 'Usage: /pm <your rough prompt>' }
    const better = await rewrite($, rough)
    if (!better) return { text: 'Prompt Master could not rewrite that prompt. Please try again.' }
    const filled = await $.prompt.fill({ text: better, mode: 'replace' })
    return {
      text: filled.isFilled
        ? '✨ Improved prompt is in your prompt box. Review it, then send.'
        : `✨ Improved prompt (copy and send it):\n\n${better}`,
      isTextDisplayOnly: true,
    }
  })
}

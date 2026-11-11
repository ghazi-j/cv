import { expect, test } from 'claude-code/testing'

const BAND = {
  plugin: 'prompt-master',
  component: 'AbovePrompt',
  props: {
    hasSurvey: false,
    isCollapsed: false,
    isWorking: false,
    maxRows: 10,
    bodyColumns: 60,
    scroll: { offset: 0, bodyRows: 9 },
    view: {},
  },
} as const

const REPLY = {
  isAnswered: true as const,
  text: 'Write a 150-word LinkedIn post announcing...',
  usage: {
    input_tokens: 1,
    output_tokens: 1,
    cache_creation_input_tokens: 0,
    cache_read_input_tokens: 0,
  },
}

const RUN = {
  origin: { kind: 'composer' },
  presentation: { isFullscreen: false, columns: 80 },
} as const

test('/pm rewrites the rough prompt into the prompt box', async ($, on) => {
  const filled: string[] = []
  on('model.complete', () => ({ value: REPLY }))
  on('prompt.fill', (_, e) => {
    filled.push(e.text)
    return { isFilled: true, text: e.text, cursor: e.text.length }
  })

  const r = await $.command.run({ ...RUN, command: 'pm', args: 'linkedin post new route' })

  expect(filled).toEqual([REPLY.text])
  expect(r.text).toContain('Review it, then send')
})

test('/pm shows the prompt when there is no box to fill', async ($, on) => {
  on('model.complete', () => ({ value: REPLY }))
  on('prompt.fill', () => ({ isFilled: false, refusal: 'no_composer', text: '', cursor: 0 }))

  const r = await $.command.run({ ...RUN, command: 'pm', args: 'rough' })

  expect(r.text).toContain(REPLY.text)
})

test('the band shows the Prompt Master button', async ($, on) => {
  const ui = await $.ui.mount({ ...BAND, surface: 'desktop' })
  const btn = await ui.find({ key: 'pm' })
  expect(btn).toBeDefined()
  await ui.unmount()
})

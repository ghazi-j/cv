# Prompt Master

A Claude Code mod that rewrites a rough prompt into a clear, well-structured one before you send it.
It keeps your intent, facts and language (Arabic stays Arabic), and adds the goal, context,
expected output and constraints without inventing new requirements.

## Use

- **Button (terminal and desktop):** type a rough prompt, then press **✨ Prompt Master** in the
  bar above the prompt box. Your draft is replaced with the improved prompt; review it and send.
- **Command (every surface, including mobile):** `/pm <your rough prompt>`.

The rewrite runs on the session's own Sonnet model and is billed like normal usage.

## Install

At the prompt of a Claude Code terminal session:

```
/plugin install prompt-master --marketplace ghazi-j/cv
```

Answer `y` to add the marketplace, then pick a scope. From a shell:

```
claude plugin install prompt-master --marketplace ghazi-j/cv
```

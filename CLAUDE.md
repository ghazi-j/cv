# File-to-Markdown conversion (MarkItDown)

This repo is set up with Microsoft MarkItDown (https://github.com/microsoft/markitdown).
A SessionStart hook (`.claude/hooks/install-markitdown.sh`) installs Python and
`markitdown[all]` automatically if they are missing.

When the user asks (in English or Arabic, e.g. "حوّل هذا الملف إلى Markdown") to convert a file:

1. If `markitdown` is not on PATH, run `.claude/hooks/install-markitdown.sh` first.
2. Convert: `markitdown "<input>" -o "converted/<name>.md"`
   - URLs (web pages, YouTube) also work: `markitdown "<url>" -o converted/<name>.md`
3. Show a short preview of the result and send the .md file to the user.
4. Only commit/push the converted file if the user asks to keep it in the repo.

Supported inputs: PDF, Word (.docx), PowerPoint (.pptx), Excel (.xlsx/.xls), HTML,
CSV, JSON, XML, images (EXIF/OCR metadata), audio (transcription), ZIP, EPUB, Outlook .msg, YouTube URLs.

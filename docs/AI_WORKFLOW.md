# AI Workflow

1. Upload PDF to `/api/extract` — server extracts text via `pdf-parse`.
2. Store extracted text (and optionally vectorize) in Supabase.
3. `/api/chat` accepts user messages and (future) runs retrieval + LLM to answer.
4. `/api/summarize` and `/api/quiz` call LLM to produce summaries and quizzes from provided text.

Local development: set `OPENAI_API_KEY` in `.env.local` to enable real LLM calls.

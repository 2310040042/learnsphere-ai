# Architecture Overview

LearnSphere AI (prototype)

- Frontend: Next.js (app router), React, TypeScript, Tailwind CSS
- Backend: Next.js API routes (server runtime enabled for Node)
- AI Layer: OpenAI Chat Completions (fallback echo when not configured)
- Storage: Supabase (metadata); vector/RAG planned via Supabase Vector or pgvector

Design Notes

- PDF parsing runs server-side in `/api/extract` and stores extracted text for RAG.
- Chat routes can be connected to a retrieval layer to implement RAG; current endpoints accept text/document payloads.

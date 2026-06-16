import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const text = (body?.text ?? "").toString();
    if (!text) return NextResponse.json({ error: "Missing 'text'" }, { status: 400 });

    const openaiKey = process.env.OPENAI_API_KEY;
    if (openaiKey) {
      try {
        const resp = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${openaiKey}`,
          },
          body: JSON.stringify({
            model: "gpt-3.5-turbo",
            messages: [
              { role: "system", content: "You are an assistant that summarizes educational text concisely." },
              { role: "user", content: `Summarize the following text in 5 bullet points:\n\n${text}` },
            ],
            max_tokens: 400,
          }),
        });

        if (!resp.ok) return NextResponse.json({ error: "LLM error" }, { status: 502 });
        const data = await resp.json();
        const summary = data?.choices?.[0]?.message?.content ?? "";
        return NextResponse.json({ summary }, { status: 200 });
      } catch (err) {
        console.error("/api/summarize error:", err);
        return NextResponse.json({ error: "LLM call failed" }, { status: 502 });
      }
    }

    // Fallback: naive summary (first 500 chars)
    return NextResponse.json({ summary: text.slice(0, 500) + (text.length > 500 ? "..." : "") }, { status: 200 });
  } catch (err) {
    console.error("/api/summarize unexpected:", err);
    return NextResponse.json({ error: (err as any)?.message ?? String(err ?? "Unknown") }, { status: 500 });
  }
}

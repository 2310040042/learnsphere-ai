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
        const prompt = `Create 5 short multiple-choice questions (question + 4 options with the correct answer indicated) from the following educational text:\n\n${text}`;
        const resp = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${openaiKey}`,
          },
          body: JSON.stringify({ model: "gpt-3.5-turbo", messages: [{ role: "user", content: prompt }], max_tokens: 800 }),
        });

        if (!resp.ok) return NextResponse.json({ error: "LLM error" }, { status: 502 });
        const data = await resp.json();
        const quiz = data?.choices?.[0]?.message?.content ?? "";
        return NextResponse.json({ quiz }, { status: 200 });
      } catch (err) {
        console.error("/api/quiz error:", err);
        return NextResponse.json({ error: "LLM call failed" }, { status: 502 });
      }
    }

    // Fallback: simple question from start of text
    const fallback = `Q: What is the main topic?\nA: ${text.slice(0, 120)}`;
    return NextResponse.json({ quiz: fallback }, { status: 200 });
  } catch (err) {
    console.error("/api/quiz unexpected:", err);
    return NextResponse.json({ error: (err as any)?.message ?? String(err ?? "Unknown") }, { status: 500 });
  }
}

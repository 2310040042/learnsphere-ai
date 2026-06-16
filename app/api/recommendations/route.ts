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
        const prompt = `Given the following study text, suggest 5 focused study actions or revision topics tailored to a student preparing for exams:\n\n${text}`;
        const resp = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${openaiKey}`,
          },
          body: JSON.stringify({ model: "gpt-3.5-turbo", messages: [{ role: "user", content: prompt }], max_tokens: 400 }),
        });

        if (!resp.ok) return NextResponse.json({ error: "LLM error" }, { status: 502 });
        const data = await resp.json();
        const recommendations = data?.choices?.[0]?.message?.content ?? "";
        return NextResponse.json({ recommendations }, { status: 200 });
      } catch (err) {
        console.error("/api/recommendations error:", err);
        return NextResponse.json({ error: "LLM call failed" }, { status: 502 });
      }
    }

    // Fallback: naive recommendation
    return NextResponse.json({ recommendations: "Review key headings and create concept flashcards." }, { status: 200 });
  } catch (err) {
    console.error("/api/recommendations unexpected:", err);
    return NextResponse.json({ error: (err as any)?.message ?? String(err ?? "Unknown") }, { status: 500 });
  }
}

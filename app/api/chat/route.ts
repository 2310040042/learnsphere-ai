import { NextResponse } from "next/server";
import { supabase } from "@/src/lib/supabase";

export async function POST(req: Request) {
  const { question } = await req.json();

  const { data } = await supabase
    .from("document_chunks")
    .select("content")
    .limit(1);

  const text = data?.[0]?.content || "No document found";

  return NextResponse.json({
    answer: text,
  });
}
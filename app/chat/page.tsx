"use client";

import { useState } from "react";

export default function ChatPage() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  async function askQuestion() {
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question,
        }),
      });

      const data = await res.json();

      setAnswer(data.answer || data.error);
    } catch (err) {
      console.error(err);
    }

    setLoading(false);
  }

  return (
    <main className="min-h-screen p-10">
      <h1 className="text-3xl font-bold mb-5">
        Ask Questions
      </h1>

      <textarea
        className="border p-3 w-full"
        rows={4}
        value={question}
        onChange={(e) =>
          setQuestion(e.target.value)
        }
      />

      <button
        onClick={askQuestion}
        className="bg-blue-500 text-white px-4 py-2 mt-4"
      >
        Ask
      </button>

      {loading && <p>Thinking...</p>}

      {answer && (
        <div className="mt-6 p-4 border rounded">
          {answer}
        </div>
      )}
    </main>
  );
}
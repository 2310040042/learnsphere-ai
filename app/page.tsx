export default function Home() {
  return (
    <main className="min-h-screen bg-slate-100 p-10">
      <h1 className="text-4xl font-bold text-center">
        LearnSphere AI
      </h1>

      <p className="text-center mt-4 text-gray-600">
        Personalized AI Learning Assistant
      </p>

      <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold">Upload PDF</h2>
          <p>Upload learning materials.</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold">AI Chat</h2>
          <p>Ask questions from documents.</p>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-semibold">Quiz Generator</h2>
          <p>Create quizzes automatically.</p>
        </div>
      </div>
    </main>
  );
}
export default function App() {
  return (
    <div className="min-h-screen bg-bg text-text font-body p-6">
      <h1 className="text-3xl font-display text-primary">
        Tailwind is working 🎯
      </h1>
      <button className="mt-6 rounded-xl bg-accent px-6 py-3 text-black shadow-glow">
        Focus-friendly button
      </button>
     <button className="rounded-xl bg-accent px-6 py-3 text-primary shadow-(--shadow-glow)">
  Glow
</button>


    </div>
  );
}

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 text-gray-900">

      {/* NAVBAR */}
      <header className="flex items-center justify-between px-10 py-6 border-b bg-white/70 backdrop-blur">
        <h1 className="text-2xl font-bold text-indigo-700">
          AI-PNAS
        </h1>

        <nav className="flex gap-6 text-sm font-medium text-gray-600">
          <a href="#about" className="hover:text-indigo-600">About</a>
          <a href="#founders" className="hover:text-indigo-600">Founders</a>
          <a href="#service" className="hover:text-indigo-600">Service</a>
          <a href="#ai" className="hover:text-indigo-600">AI System</a>
          <a href="#who" className="hover:text-indigo-600">WHO Rules</a>
        </nav>

        <button className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700">
          Get Started
        </button>
      </header>

      {/* HERO */}
      <section className="text-center px-6 py-24 max-w-5xl mx-auto">
        <h2 className="text-5xl md:text-6xl font-extrabold leading-tight">
          AI-Powered Pediatric <br />
          Nutritional Assessment System
        </h2>

        <p className="mt-6 text-lg text-gray-600">
          A smart AI platform designed to detect Severe Acute Malnutrition (SAM)
          early using computer vision, anthropometric data, and WHO standards.
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <button className="px-6 py-3 bg-indigo-600 text-white rounded-xl shadow hover:bg-indigo-700">
            Start Detection
          </button>

          <button className="px-6 py-3 bg-white border rounded-xl hover:bg-gray-100">
            Learn More
          </button>
        </div>
      </section>

      {/* FEATURES */}
      <section className="grid md:grid-cols-3 gap-6 px-10 max-w-6xl mx-auto pb-20">

        <div className="bg-white p-6 rounded-2xl shadow">
          <h3 className="text-xl font-semibold text-indigo-700">🧠 AI Analysis</h3>
          <p className="text-gray-600 mt-2">
            Detects early malnutrition patterns using AI and growth data.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <h3 className="text-xl font-semibold text-indigo-700">📊 Data Driven</h3>
          <p className="text-gray-600 mt-2">
            Combines anthropometric measurements and WHO standards.
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <h3 className="text-xl font-semibold text-indigo-700">⚡ Fast Screening</h3>
          <p className="text-gray-600 mt-2">
            Instant detection and classification of nutrition status.
          </p>
        </div>

      </section>

      {/* FOUNDERS */}
      <section id="founders" className="bg-white py-20 px-10">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold mb-10">Founders</h3>

          <div className="grid md:grid-cols-2 gap-8">

            <div className="p-6 border rounded-xl shadow-sm">
              <h4 className="text-xl font-semibold text-indigo-700">Belay Kassanew</h4>
              <p className="text-gray-600">Public Health & Computer Science</p>
              <p className="text-gray-500 mt-2">
                Passionate young entrepreneur building AI solutions for healthcare.
              </p>
            </div>

            <div className="p-6 border rounded-xl shadow-sm">
              <h4 className="text-xl font-semibold text-indigo-700">Addisu Yirdaw</h4>
              <p className="text-gray-600">Computer Science & Business Administration</p>
              <p className="text-gray-500 mt-2">
                Focused on technology-driven healthcare innovation and entrepreneurship.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* SERVICE */}
      <section id="service" className="py-20 px-10">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold mb-6">Our Service</h3>

          <div className="space-y-4 text-gray-600">
            <p>✔ Register child and fill nutritional assessment form</p>
            <p>✔ Enter anthropometric measurements (weight, height, MUAC, BMI)</p>
            <p>✔ Health professionals can input manually</p>
            <p>✔ Non-professionals use AI camera (computer vision estimation)</p>
            <p>✔ Automatic WHO-based nutrition classification</p>
          </div>
        </div>
      </section>

      {/* AI SYSTEM */}
      <section id="ai" className="bg-white py-20 px-10">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold mb-6">AI Workflow</h3>

          <div className="space-y-2 text-gray-600">
            <p>1. User registration & child profile</p>
            <p>2. Data input or AI camera capture</p>
            <p>3. Computer vision estimation</p>
            <p>4. WHO growth standard analysis</p>
            <p>5. Nutrition status prediction (SAM / MAM / Normal)</p>
          </div>
        </div>
      </section>

      {/* WHO RULES */}
      <section id="who" className="py-20 px-10">
        <div className="max-w-6xl mx-auto">
          <h3 className="text-3xl font-bold mb-6">WHO Interpretation Rules</h3>

          <div className="bg-white p-6 rounded-xl shadow text-sm text-gray-600 space-y-2">
            <p>• Weight → low = undernutrition</p>
            <p>• Height → low = stunting</p>
            <p>• BMI → underweight / normal / overweight / obesity</p>
            <p>• MUAC &lt; 115mm → Severe Acute Malnutrition (SAM)</p>
            <p>• MUAC 115–125mm → Moderate Acute Malnutrition (MAM)</p>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="text-center py-10 text-gray-500 text-sm">
        © 2026 AI-PNAS — AI-Powered Pediatric Nutrition System
      </footer>

    </main>
  );
}
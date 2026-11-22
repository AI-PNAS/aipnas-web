import Link from 'next/link';
import Image from 'next/image';
import Header from '@/app/components/Header';

const pillars = [
  'Computer vision-assisted anthropometric assessment',
  'WHO-informed growth monitoring and interpretation',
  'AI-assisted screening support for clinical review',
  'Human verification and responsible follow-up decisions',
];

const founders = [
  {
    name: 'Belay Kassanew',
    role: 'Founder | Public Health Lead',
    initials: 'BK',
    image: '/belay.png',
    responsibilities: [
      'Public health vision and leadership',
      'Child nutrition assessment strategy',
      'WHO-based malnutrition screening',
      'Product development and innovation',
      'Public health research and impact',
    ],
  },
  {
    name: 'Addisu Yirdaw',
    role: 'Co-Founder | Technology Lead',
    initials: 'AY',
    responsibilities: [
      'Software development',
      'Platform architecture and implementation',
      'Technology development',
      'Technical innovation',
      'Digital product development',
    ],
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <Header currentPage="about" />

      <div className="mx-auto max-w-5xl px-6 py-16 md:px-10">
        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm md:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-teal-700">About AI PNAS</p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-900 md:text-5xl">
            AI-assisted support for safer pediatric growth monitoring.
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-slate-600">
            AI PNAS helps families and health professionals track child growth, assess nutritional risk,
            and review measurements with a clear clinical workflow. It is designed to support early,
            practical decisions without replacing professional assessment.
          </p>
        </section>

        <section className="mt-10 grid gap-8 md:grid-cols-2">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-semibold text-slate-900">The problem</h2>
            <p className="mt-4 text-base leading-8 text-slate-600">
              Malnutrition and growth problems in children can be difficult to detect early when monitoring
              is inconsistent, fragmented, or based only on routine checkups. In many settings, families and
              clinicians need a simple way to gather reliable measurements and review trends over time.
            </p>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-2xl font-semibold text-slate-900">Our approach</h2>
            <ul className="mt-4 space-y-3 text-base leading-7 text-slate-600">
              {pillars.map((item) => (
                <li key={item} className="flex gap-3">
                  <span className="mt-1 inline-flex h-2.5 w-2.5 shrink-0 rounded-full bg-teal-600" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className="mt-10">
          <div className="text-center">
            <p className="text-sm font-bold uppercase tracking-[0.25em] text-teal-700">Leadership</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">Meet the Founders</h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-slate-600">
              Combining public health expertise and technology to improve child nutrition worldwide.
            </p>
            <p className="mt-3 text-sm font-bold text-slate-800">
              Two Founders. One Mission. Healthier Futures for Every Child.
            </p>
          </div>
          <div className="mt-8 grid gap-6 md:grid-cols-2">
            {founders.map((founder, index) => (
              <article
                key={founder.name}
                className="founder-card rounded-[2rem] border border-slate-200 bg-white p-7 shadow-sm"
                style={{ animationDelay: `${index * 140}ms` }}
              >
                <div className="flex items-center gap-5">
                  {founder.image ? (
                    <Image
                      src={founder.image}
                      alt="Belay Kassanew"
                      width={160}
                      height={160}
                      className="h-20 w-20 shrink-0 rounded-full border-4 border-white object-cover shadow-lg"
                    />
                  ) : (
                    <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full border-4 border-white bg-gradient-to-br from-blue-700 to-teal-600 text-2xl font-black text-white shadow-lg">
                      {founder.initials}
                    </div>
                  )}
                  <div>
                    <h3 className="text-2xl font-black text-slate-950">{founder.name}</h3>
                    <p className="mt-2 text-sm font-bold text-blue-700">{founder.role}</p>
                  </div>
                </div>
                <ul className="mt-6 space-y-2.5 text-sm leading-6 text-slate-600">
                  {founder.responsibilities.map((responsibility) => (
                    <li key={responsibility} className="flex gap-3">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-teal-600" />
                      <span>{responsibility}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-10 rounded-[2rem] border border-teal-100 bg-teal-50 p-8 md:p-10">
          <h2 className="text-2xl font-semibold text-slate-900">Responsible AI</h2>
          <p className="mt-4 text-base leading-8 text-slate-700">
            AI PNAS provides AI-assisted screening support and does not replace professional clinical
            assessment. Results should be reviewed by an appropriately trained health professional before
            treatment or referral decisions are made.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/services" className="rounded-full bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-700">
              View services
            </Link>
            <Link href="/login" className="rounded-full border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 transition hover:bg-slate-100">
              Create account
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

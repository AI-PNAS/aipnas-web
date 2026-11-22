import Header from '@/app/components/Header';
import Image from 'next/image';

export default function TeamPage() {
  const team = [
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
  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      <Header currentPage="our-team" />
      <section className="mx-auto max-w-5xl px-6 py-16 md:px-10">
        <p className="text-sm font-bold uppercase tracking-[0.25em] text-blue-700">Our Team</p>
        <h1 className="mt-4 text-4xl font-black md:text-6xl">Public-health insight backed by practical technology.</h1>
        <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
          Combining public health expertise and technology to improve child nutrition worldwide.
        </p>
        <h2 className="mt-10 text-2xl font-black text-slate-950">Meet the Founders</h2>
        <div className="mt-6 grid gap-5 md:grid-cols-2">
          {team.map((member) => (
            <article key={member.name} className="founder-card rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-4">
                {member.image ? (
                  <Image src={member.image} alt="Belay Kassanew" width={128} height={128} className="h-16 w-16 shrink-0 rounded-full border-4 border-white object-cover shadow-lg" />
                ) : (
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full border-4 border-white bg-gradient-to-br from-blue-700 to-teal-600 text-xl font-black text-white shadow-lg">
                    {member.initials}
                  </div>
                )}
                <div>
                  <h3 className="text-xl font-black text-slate-950">{member.name}</h3>
                  <p className="mt-1 text-sm font-bold text-blue-700">{member.role}</p>
                </div>
              </div>
              <ul className="mt-5 space-y-2 text-sm leading-6 text-slate-600">
                {member.responsibilities.map((responsibility) => (
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
    </main>
  );
}

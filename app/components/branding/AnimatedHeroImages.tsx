'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

const IMAGES = [
  'https://github.com/user-attachments/assets/08ef4f1f-b9f8-4392-895b-0971d4b19dea',
  'https://github.com/user-attachments/assets/5a69f2fa-a685-42e5-ba1e-83b583c42850',
];

export default function AnimatedHeroImages() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => setActiveIndex((prev) => (prev + 1) % IMAGES.length), 3200);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="relative h-64 overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
      {IMAGES.map((image, index) => (
        <div key={image} className={`absolute inset-0 transition-opacity duration-700 ${activeIndex === index ? 'opacity-100' : 'opacity-0'}`}>
          <Image src={image} alt="AI PNAS pediatric workflow preview" fill unoptimized className="object-cover" />
        </div>
      ))}
      <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/55 to-transparent p-3 text-xs text-white">
        Clinical screening workflow preview
      </div>
    </div>
  );
}

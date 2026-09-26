import Image from 'next/image';
import Link from 'next/link';

interface BrandMarkProps {
  compact?: boolean;
  withLink?: boolean;
}

const LOGO_URL = 'https://github.com/user-attachments/assets/e29d3a51-0b54-4936-a0d2-ede7daf9d745';

function BrandContent({ compact }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <Image src={LOGO_URL} alt="AI PNAS logo" width={compact ? 38 : 46} height={compact ? 38 : 46} unoptimized className="h-auto w-auto" />
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.25em] text-teal-700">AI PNAS</p>
        {!compact && <p className="text-sm text-slate-600">AI-assisted pediatric nutrition platform</p>}
      </div>
    </div>
  );
}

export default function BrandMark({ compact, withLink = false }: BrandMarkProps) {
  if (withLink) {
    return (
      <Link href="/" className="inline-flex">
        <BrandContent compact={compact} />
      </Link>
    );
  }

  return <BrandContent compact={compact} />;
}

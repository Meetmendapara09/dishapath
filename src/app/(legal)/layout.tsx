import { Logo } from '@/components/logo';
import Link from 'next/link';

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="container mx-auto h-20 flex items-center justify-between px-4 md:px-6 border-b">
        <Logo />
        <Link href="/" className="text-sm font-medium hover:text-primary">
          Back to Home
        </Link>
      </header>
      <main className="flex-1 py-12 md:py-16 lg:py-20">
        <div className="container mx-auto px-4 md:px-6">
          <article className="prose prose-sm md:prose-base lg:prose-lg max-w-4xl mx-auto">
            {children}
          </article>
        </div>
      </main>
    </div>
  );
}

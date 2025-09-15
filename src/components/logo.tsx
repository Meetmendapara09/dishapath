import { GraduationCap } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("flex items-center gap-2 font-headline text-xl font-bold text-foreground", className)}>
      <GraduationCap className="h-6 w-6 text-primary" />
      <span>Disha Path</span>
    </Link>
  );
}

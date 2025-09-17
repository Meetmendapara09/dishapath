"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Lightbulb, BookOpen, Building, Trophy, ClipboardEdit, MessageSquare, Library } from 'lucide-react';
import { SidebarMenu, SidebarMenuItem, SidebarMenuButton } from '@/components/ui/sidebar';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: Home, tooltip: 'Dashboard' },
  { href: '/quiz', label: 'Aptitude Quiz', icon: Lightbulb, tooltip: 'Aptitude Quiz' },
  { href: '/counselor', label: 'AI Counselor', icon: MessageSquare, tooltip: 'AI Counselor' },
  { href: '/careers', label: 'Explore Careers', icon: BookOpen, tooltip: 'Explore Careers' },
  { href: '/colleges', label: 'Find Colleges', icon: Building, tooltip: 'Find Colleges' },
  { href: '/scholarships', label: 'Scholarships', icon: Trophy, tooltip: 'Scholarships' },
  { href: '/exams', label: 'Exams', icon: ClipboardEdit, tooltip: 'Exams' },
  { href: '/materials', label: 'Study Materials', icon: Library, tooltip: 'Study Materials' },
];

export function AppNav() {
  const pathname = usePathname();

  return (
    <SidebarMenu>
      {navItems.map((item) => (
        <SidebarMenuItem key={item.href}>
          <SidebarMenuButton asChild isActive={pathname.startsWith(item.href)} tooltip={item.tooltip}>
            <Link href={item.href}>
              <item.icon />
              {item.label}
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}

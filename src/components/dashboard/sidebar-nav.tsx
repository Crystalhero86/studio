'use client';

import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarContent,
} from '@/components/ui/sidebar';
import { Separator } from '@/components/ui/separator';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { LayoutDashboard, PenSquare, History, Leaf, Settings, LogOut } from 'lucide-react';
import { UserNav } from './user-nav';

const menuItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/log', label: 'Log Activity', icon: PenSquare },
  { href: '/dashboard/history', label: 'History', icon: History },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <>
      <SidebarHeader>
        <Link href="/dashboard" className="flex items-center gap-2 font-bold">
            <Leaf className="h-6 w-6 text-primary" />
            <span className="font-headline text-xl group-data-[collapsible=icon]:hidden">CarbonTrace</span>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {menuItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <Link href={item.href} legacyBehavior passHref>
                <SidebarMenuButton
                  isActive={pathname === item.href}
                  tooltip={item.label}
                >
                  <item.icon />
                  <span>{item.label}</span>
                </SidebarMenuButton>
              </Link>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="hidden md:flex flex-col gap-2">
        <Separator className="my-2" />
        <SidebarMenu>
          <SidebarMenuItem>
             <SidebarMenuButton tooltip="Settings">
                <Settings />
                <span>Settings</span>
              </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
             <SidebarMenuButton tooltip="Log Out">
                <LogOut />
                <span>Log Out</span>
              </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <Separator className="my-2" />
        <div className="px-2 group-data-[collapsible=icon]:hidden">
            <UserNav isMobile={false} />
        </div>
      </SidebarFooter>
    </>
  );
}

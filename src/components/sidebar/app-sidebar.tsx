'use client';

import * as React from 'react';
import {
  ActivityIcon,
  Apple,
  Bot,
  LayoutDashboard,
  LifeBuoy,
  ListChecks,
  MoonIcon,
  Send,
} from 'lucide-react';
import { NavMain } from '@/components/sidebar/nav-main';
import { NavSecondary } from '@/components/sidebar/nav-secondary';
import { NavUser } from '@/components/sidebar/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import Image from 'next/image';
import after42Logo from '../../../public/keyboard-button.png';

const data = {
  user: {
    name: 'shadcn',
    email: 'm@example.com',
    avatar: '/avatars/shadcn.jpg',
  },
  navMain: [
    {
      title: 'Accueil',
      url: '/dashboard',
      icon: LayoutDashboard,
      isActive: true,
      items: [
        {
          title: 'Tableau de bord',
          url: '/dashboard',
        },
        {
          title: 'Mon profil',
          url: '/profile',
        },
        {
          title: 'Mes informations',
          url: '/my-info',
        },
      ],
    },
    {
      title: 'Mes programmes',
      url: '#',
      icon: ListChecks,
      isActive: true,
      items: [
        {
          title: 'Alimentation',
          icon: Apple,
          url: '#',
        },
        {
          title: 'Sommeil',
          icon: MoonIcon,
          url: '#',
        },
        {
          title: 'Activité physique',
          icon: ActivityIcon,
          url: '#',
        },
      ],
    },
  ],
  navSecondary: [
    {
      title: 'Oto',
      url: '/chat',

      icon: Bot,
    },
    {
      title: 'Support',
      url: '#',
      icon: LifeBuoy,
    },
    {
      title: 'Feedback',
      url: '#',
      icon: Send,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant='inset' {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className='flex items-center justify-center'>
            <Image src={after42Logo} alt='After42' width={100} height={100} />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className='mt-auto' />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}

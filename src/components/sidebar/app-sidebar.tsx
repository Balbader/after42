'use client';

import * as React from 'react';
import {
  ActivityIcon,
  Apple,
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
import after42Logo from '../../../public/binary-code.png';

export type SidebarUser = {
  id: string;
  name: string;
  email: string;
  avatar?: string;
};

const data = {
  navMain: [
    {
      title: 'Home',
      url: '/dashboard',
      icon: LayoutDashboard,
      isActive: true,
      items: [
        {
          title: 'Dashboard',
          url: '/dashboard',
        },
        {
          title: 'My profile',
          url: '/profile',
        },
      ],
    },
    {
      title: 'Challenges',
      url: '#',
      icon: ListChecks,
      isActive: true,
      items: [
        {
          title: 'All',
          icon: Apple,
          url: '#',
        },
        {
          title: 'My Challenges',
          icon: MoonIcon,
          url: '#',
        },
        {
          title: 'My Offers',
          icon: ActivityIcon,
          url: '#',
        },
      ],
    },
  ],
  navSecondary: [
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

export function AppSidebar({
  user,
  ...props
}: { user: SidebarUser | null } & React.ComponentProps<typeof Sidebar>) {
  const avatar = user?.avatar ?? '/binary-code.png';
  return (
    <Sidebar variant='inset' {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className='flex items-center justify-center'>
            <Image src={after42Logo} alt='After42' width={50} height={50} />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
        <NavSecondary items={data.navSecondary} className='mt-auto' />
      </SidebarContent>
      <SidebarFooter>
        <NavUser
          user={{
            name: user?.name ?? '',
            email: user?.email ?? '',
            avatar,
          }}
        />
      </SidebarFooter>
    </Sidebar>
  );
}

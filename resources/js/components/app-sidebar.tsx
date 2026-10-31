import { Link, usePage } from '@inertiajs/react';
import { BookOpen, FolderGit2, Home, LayoutGrid, Moon, Package, Sun, ShoppingBag } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { useAppearance } from '@/hooks/use-appearance';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard as adminDashboard, orders as adminOrders } from '@/routes/admin';
import { index as shopIndex } from '@/routes/shop';
import { index as ordersIndex } from '@/routes/orders';
import type { NavItem } from '@/types';

const mainNavItems: NavItem[] = [
    {
        title: 'Home',
        href: shopIndex(),
        icon: Home,
    },
    {
        title: 'My Orders',
        href: ordersIndex(),
        icon: ShoppingBag,
    },
];

const footerNavItems: NavItem[] = [
    {
        title: 'Repository',
        href: 'https://github.com/laravel/react-starter-kit',
        icon: FolderGit2,
    },
    {
        title: 'Documentation',
        href: 'https://laravel.com/docs/starter-kits#react',
        icon: BookOpen,
    },
];

export function AppSidebar() {
    const { appearance, updateAppearance } = useAppearance();
    const { auth } = usePage().props as any;
    const isAdmin = auth?.user?.is_admin;
    const items = isAdmin
        ? [
              { title: 'Dashboard', href: adminDashboard(), icon: LayoutGrid },
              { title: 'Inventory', href: '/admin/products', icon: Package },
              { title: 'Orders', href: adminOrders(), icon: ShoppingBag },
          ]
        : [
              { title: 'Home', href: shopIndex(), icon: Home },
              { title: 'My Orders', href: ordersIndex(), icon: ShoppingBag },
          ];
    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={shopIndex()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={items} />
            </SidebarContent>

            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton onClick={() => updateAppearance(appearance === 'dark' ? 'light' : 'dark')}>
                            {appearance === 'dark' ? <Sun /> : <Moon />}
                            <span>{appearance === 'dark' ? 'Light mode' : 'Dark mode'}</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}

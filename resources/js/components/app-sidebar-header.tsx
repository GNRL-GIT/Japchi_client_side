import { Link, router, usePage } from '@inertiajs/react';
import { Search, ShoppingBag } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { index as cartIndex } from '@/routes/cart';
import { index as shopIndex } from '@/routes/shop';
import type { BreadcrumbItem as BreadcrumbItemType } from '@/types';

type PageProps = {
    filters?: { search?: string; category?: string };
};

export function AppSidebarHeader({
    breadcrumbs = [],
}: {
    breadcrumbs?: BreadcrumbItemType[];
}) {
    const page = usePage<PageProps>();
    const currentSearch = page.props.filters?.search ?? '';
    const [search, setSearch] = useState(currentSearch);

    useEffect(() => {
        setSearch(currentSearch);
    }, [currentSearch]);

    const submitSearch = () => {
        router.get(
            shopIndex(),
            {
                search: search || undefined,
                category: page.props.filters?.category || undefined,
                page: 1,
            },
            { preserveScroll: true },
        );
    };

    return (
        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-sidebar-border/50 px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4">
            <div className="flex min-w-0 flex-1 items-center gap-2">
                <SidebarTrigger className="-ml-1" />
                <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>
            <div className="hidden flex-1 items-center justify-center gap-2 md:flex">
                <div className="relative w-full max-w-md lg:max-w-xl">
                    <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && submitSearch()}
                        placeholder="Search products..."
                        aria-label="Search products"
                        className="h-9 pl-9"
                    />
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    className="h-9 shrink-0"
                    onClick={submitSearch}
                >
                    Search
                </Button>
            </div>
            <div className="flex flex-1 items-center justify-end">
                <Button
                    asChild
                    size="sm"
                    className="h-9 bg-green-700 hover:bg-green-800"
                >
                    <Link href={cartIndex()}>
                        <ShoppingBag className="h-4 w-4" />
                        <span className="hidden sm:inline">Cart</span>
                    </Link>
                </Button>
            </div>
        </header>
    );
}

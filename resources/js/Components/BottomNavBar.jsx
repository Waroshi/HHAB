// resources/js/Components/BottomNavBar.jsx
// Displays the bottom navigation used by authenticated app screens.
// Exists to keep app navigation reusable across authenticated pages.
// RELATED FILES: resources/js/Layouts/AuthenticatedLayout.jsx, resources/js/Pages/Dashboard.jsx, routes/web.php

import { Link } from '@inertiajs/react';

const navItems = [
    { label: 'ホーム', routeName: 'dashboard', active: 'dashboard' },
    { label: '取引一覧', routeName: 'transactions.index', active: 'transactions.*' },
    { label: '読み取り', routeName: 'readings.index', active: 'readings.*' },
    { label: 'カレンダー', routeName: 'calendar.index', active: 'calendar.*' },
    { label: 'レポート', routeName: 'reports.index', active: 'reports.*' },
];

export default function BottomNavBar() {
    const visibleNavItems = navItems.filter((item) =>
        route().has(item.routeName),
    );
    const gridColumnClassName =
        visibleNavItems.length === 5 ? 'grid-cols-5' : 'grid-cols-4';

    return (
        <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-gray-200 bg-white dark:border-neutral-800 dark:bg-neutral-900">
            <div
                className={`mx-auto grid max-w-md ${gridColumnClassName}`}
            >
                {visibleNavItems.map((item) => {
                    const isActive = route().current(item.active);

                    return (
                        <Link
                            key={item.label}
                            href={route(item.routeName)}
                            className={[
                                'flex min-w-0 flex-col items-center justify-center whitespace-nowrap px-1 py-3 text-[10px] font-medium transition-colors focus-visible:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[#113A28] dark:hover:bg-neutral-800 dark:focus-visible:bg-neutral-800 dark:focus-visible:ring-brand-300 sm:text-xs',
                                isActive
                                    ? 'text-[#113A28] dark:text-brand-300'
                                    : 'text-gray-500 hover:text-[#113A28] dark:text-neutral-400 dark:hover:text-brand-300',
                            ].join(' ')}
                        >
                            {item.label}
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}

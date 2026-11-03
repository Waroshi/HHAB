// resources/js/Components/BottomNavBar.jsx
// Displays the bottom navigation used by authenticated app screens.
// Exists to keep app navigation reusable across authenticated pages.
// RELATED FILES: resources/js/Layouts/AuthenticatedLayout.jsx, resources/js/Pages/Dashboard.jsx, routes/web.php

import {
    CalendarIcon,
    CameraIcon,
    ChartIcon,
    HomeIcon,
    ListIcon,
} from '@/Components/Icons';
import { Link } from '@inertiajs/react';

const navItems = [
    {
        label: 'ホーム',
        routeName: 'dashboard',
        active: 'dashboard',
        icon: HomeIcon,
    },
    {
        label: '取引一覧',
        routeName: 'transactions.index',
        active: 'transactions.*',
        icon: ListIcon,
    },
    {
        label: '読み取り',
        routeName: 'readings.index',
        active: 'readings.*',
        icon: CameraIcon,
        isCenter: true,
    },
    {
        label: 'カレンダー',
        routeName: 'calendar.index',
        active: 'calendar.*',
        icon: CalendarIcon,
    },
    {
        label: 'レポート',
        routeName: 'reports.index',
        active: 'reports.*',
        icon: ChartIcon,
    },
];

const GRID_COLUMN_CLASS_NAMES = {
    1: 'grid-cols-1',
    2: 'grid-cols-2',
    3: 'grid-cols-3',
    4: 'grid-cols-4',
    5: 'grid-cols-5',
};

export default function BottomNavBar() {
    const visibleNavItems = navItems.filter((item) =>
        route().has(item.routeName),
    );

    if (visibleNavItems.length === 0) {
        return null;
    }

    const gridColumnClassName =
        GRID_COLUMN_CLASS_NAMES[visibleNavItems.length];

    return (
        <nav
            aria-label="メインナビゲーション"
            className="fixed inset-x-0 bottom-0 z-50 border-t border-gray-200 bg-white shadow-[0_-2px_8px_rgba(0,0,0,0.04)] dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-black/20"
        >
            <div
                className={`mx-auto grid max-w-md ${gridColumnClassName}`}
            >
                {visibleNavItems.map((item) => {
                    const isActive = route().current(item.active);
                    const Icon = item.icon;

                    if (item.isCenter) {
                        return (
                            <Link
                                key={item.label}
                                href={route(item.routeName)}
                                aria-current={isActive ? 'page' : undefined}
                                className={[
                                    'group relative flex min-h-16 min-w-0 flex-col items-center justify-end px-0.5 pb-2 text-[10px] font-bold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-500 dark:focus-visible:ring-brand-300 sm:text-xs',
                                    isActive
                                        ? 'text-brand-700 dark:text-brand-300'
                                        : 'text-gray-600 hover:text-brand-700 dark:text-neutral-300 dark:hover:text-brand-300',
                                ].join(' ')}
                            >
                                <span
                                    aria-hidden="true"
                                    className={[
                                        'absolute -top-5 flex size-14 items-center justify-center rounded-full bg-brand-600 text-white shadow-md ring-4 ring-white transition-colors group-hover:bg-brand-700 group-active:bg-brand-800 dark:bg-brand-500 dark:ring-neutral-900 dark:group-hover:bg-brand-400 dark:group-active:bg-brand-600',
                                        isActive
                                            ? 'ring-brand-100 dark:ring-brand-800'
                                            : '',
                                    ].join(' ')}
                                >
                                    <Icon size={24} />
                                </span>
                                <span className="max-w-full truncate">
                                    {item.label}
                                </span>
                            </Link>
                        );
                    }

                    return (
                        <Link
                            key={item.label}
                            href={route(item.routeName)}
                            aria-current={isActive ? 'page' : undefined}
                            className={[
                                'flex min-h-16 min-w-0 flex-col items-center justify-center gap-0.5 px-0.5 py-2 text-[10px] font-medium transition-colors hover:bg-gray-50 focus-visible:bg-gray-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-500 dark:hover:bg-neutral-800 dark:focus-visible:bg-neutral-800 dark:focus-visible:ring-brand-300 sm:text-xs',
                                isActive
                                    ? 'font-bold text-brand-700 dark:text-brand-300'
                                    : 'text-gray-500 hover:text-brand-700 dark:text-neutral-400 dark:hover:text-brand-300',
                            ].join(' ')}
                        >
                            <span
                                aria-hidden="true"
                                className={[
                                    'flex size-7 items-center justify-center rounded-lg transition-colors',
                                    isActive
                                        ? 'bg-brand-50 dark:bg-brand-800/50'
                                        : '',
                                ].join(' ')}
                            >
                                <Icon size={20} />
                            </span>
                            <span className="max-w-full truncate whitespace-nowrap">
                                {item.label}
                            </span>
                        </Link>
                    );
                })}
            </div>
        </nav>
    );
}

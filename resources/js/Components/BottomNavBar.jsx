// resources/js/Components/BottomNavBar.jsx
// Displays the bottom navigation used by authenticated app screens.
// Exists to keep app navigation reusable across authenticated pages.
// RELATED FILES: resources/js/Layouts/AuthenticatedLayout.jsx, resources/js/Pages/Dashboard.jsx, routes/web.php

import { Link } from '@inertiajs/react';

const navItems = [
    { label: 'ホーム', routeName: 'dashboard', active: 'dashboard' },
    { label: '読み取り', routeName: 'profile.edit', active: 'profile.edit' },
];

export default function BottomNavBar() {
    return (
        <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-gray-200 bg-white">
            <div className="mx-auto grid max-w-md grid-cols-2">
                {navItems.map((item) => {
                    const isActive = route().current(item.active);

                    return (
                        <Link
                            key={item.label}
                            href={route(item.routeName)}
                            className={[
                                'flex flex-col items-center justify-center px-2 py-3 text-xs font-medium',
                                isActive
                                    ? 'text-[#113A28]'
                                    : 'text-gray-500 hover:text-[#113A28]',
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

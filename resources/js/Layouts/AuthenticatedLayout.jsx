// resources/js/Layouts/AuthenticatedLayout.jsx
// Provides the shared layout for app screens.
// Exists to keep navigation and page chrome in one place during development.
// RELATED FILES: resources/js/Components/BottomNavBar.jsx, resources/js/Pages/Dashboard.jsx, resources/js/Pages/Profile/Edit.jsx

import BottomNavBar from '@/Components/BottomNavBar';
import { MenuThemeContext } from '@/Components/MenuContent';
import SideMenu from '@/Components/SideMenu';
import { useTheme } from '@/theme';
import { Link, router } from '@inertiajs/react';
import { useEffect, useState } from 'react';

export default function AuthenticatedLayout({ header, children }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const themeSettings = useTheme();

    function closeMenu() {
        setIsMenuOpen(false);
    }

    useEffect(() => {
        if (!isMenuOpen) return;

        // 戻る・進むによる遷移でも閉じる。閉じたら監視を解除する。
        return router.on('navigate', () => setIsMenuOpen(false));
    }, [isMenuOpen]);

    return (
        <MenuThemeContext.Provider value={themeSettings}>
            <div className="min-h-screen bg-gray-100 dark:bg-neutral-950">
                <header className="border-b border-neutral-200 bg-white text-neutral-900 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-100">
                    <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                        <Link
                            href={route('dashboard')}
                            className="rounded-md text-lg font-bold tracking-wide focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 dark:focus-visible:ring-brand-300 dark:focus-visible:ring-offset-neutral-950"
                        >
                            HHAB
                        </Link>

                        <button
                            type="button"
                            onClick={() => setIsMenuOpen(true)}
                            aria-label="メニューを開く"
                            aria-expanded={isMenuOpen}
                            aria-controls={isMenuOpen ? 'side-menu' : undefined}
                            aria-haspopup="dialog"
                            className="inline-flex size-11 items-center justify-center rounded-md text-neutral-700 transition-colors hover:bg-neutral-100 hover:text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 dark:text-neutral-200 dark:hover:bg-neutral-800 dark:hover:text-neutral-100 dark:focus-visible:ring-brand-300 dark:focus-visible:ring-offset-neutral-950"
                        >
                            <svg
                                aria-hidden="true"
                                className="size-6"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                            >
                                <path
                                    d="M4 6h16M4 12h16M4 18h16"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                />
                            </svg>
                        </button>
                    </div>
                </header>

                {header && (
                    <header className="bg-white shadow dark:border-b dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-100 dark:shadow-black/30">
                        <div className="mx-auto max-w-7xl px-4 py-6 dark:[&>*]:text-neutral-100 sm:px-6 lg:px-8">
                            {header}
                        </div>
                    </header>
                )}

                {/* 遷移後のフォーカス先にする。通常のTab順には追加しない。 */}
                <main tabIndex={-1} className="pb-20 focus:outline-none">{children}</main>
                <BottomNavBar />
            </div>
            {isMenuOpen && <SideMenu onClose={closeMenu} />}
        </MenuThemeContext.Provider>
    );
}

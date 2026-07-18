import {
    BellIcon,
    ChevronRightIcon,
    DocumentIcon,
    LogoutIcon,
    PaletteIcon,
    TagIcon,
    UserIcon,
} from '@/Components/Icons';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { THEME_OPTIONS, useTheme } from '@/theme';
import { Head, Link, usePage } from '@inertiajs/react';

function MenuRow({ icon: Icon, label, href, disabled = false }) {
    const rowContent = (
        <>
            <span
                aria-hidden="true"
                className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-300"
            >
                <Icon size={18} />
            </span>
            <span className="min-w-0 flex-1 text-left text-sm font-bold">
                {label}
            </span>
            {disabled ? (
                <span className="shrink-0 rounded-full bg-neutral-100 px-2 py-1 text-[10px] font-bold text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400">
                    検討中
                </span>
            ) : (
                <ChevronRightIcon
                    aria-hidden="true"
                    size={18}
                    className="shrink-0 text-neutral-300 dark:text-neutral-600"
                />
            )}
        </>
    );

    if (disabled) {
        return (
            <button
                type="button"
                disabled
                className="flex min-h-14 w-full cursor-not-allowed items-center gap-3 px-4 py-3.5 opacity-60"
            >
                {rowContent}
            </button>
        );
    }

    return (
        <Link
            href={href}
            className="flex min-h-14 items-center gap-3 px-4 py-3.5 transition hover:bg-neutral-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-500 active:bg-neutral-100 dark:hover:bg-neutral-800/60 dark:focus-visible:ring-brand-300 dark:active:bg-neutral-800"
        >
            {rowContent}
        </Link>
    );
}

export default function Menu() {
    const user = usePage().props.auth?.user;
    const { theme, setTheme } = useTheme();
    const userName =
        typeof user?.name === 'string' && user.name.trim()
            ? user.name
            : 'ユーザー';
    const userEmail =
        typeof user?.email === 'string' && user.email.trim()
            ? user.email
            : 'メール未設定';
    const userInitial = userName.slice(0, 1);

    return (
        <AuthenticatedLayout>
            <Head title="メニュー" />

            <div className="mx-auto min-h-screen max-w-lg px-4 py-6 text-neutral-900 dark:text-neutral-100 sm:px-6 sm:py-8">
                <header>
                    <h1 className="text-2xl font-bold">メニュー</h1>
                    <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                        アカウントと表示設定
                    </p>
                </header>

                <section
                    aria-label="ユーザー情報"
                    className="mt-6 flex items-center gap-3 rounded-2xl border border-neutral-200 bg-white p-4 dark:border-neutral-800 dark:bg-neutral-900"
                >
                    <span
                        aria-hidden="true"
                        className="flex size-12 shrink-0 items-center justify-center rounded-full bg-brand-50 text-lg font-extrabold text-brand-600 dark:bg-brand-800/40 dark:text-brand-300"
                    >
                        {userInitial}
                    </span>
                    <div className="min-w-0 flex-1">
                        <p className="truncate font-bold">{userName}</p>
                        <p className="truncate text-sm text-neutral-500 dark:text-neutral-400">
                            {userEmail}
                        </p>
                    </div>
                </section>

                <section
                    aria-label="メニュー一覧"
                    className="mt-6 divide-y divide-neutral-200 overflow-hidden rounded-2xl border border-neutral-200 bg-white dark:divide-neutral-800 dark:border-neutral-800 dark:bg-neutral-900"
                >
                    <MenuRow
                        icon={UserIcon}
                        label="プロフィール・アカウント設定"
                        href={route('profile.edit')}
                    />
                    <MenuRow icon={TagIcon} label="カテゴリ設定" disabled />
                    <MenuRow icon={BellIcon} label="通知設定" disabled />
                    <div className="px-4 py-4">
                        <div className="flex items-center gap-3">
                            <span
                                aria-hidden="true"
                                className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-300"
                            >
                                <PaletteIcon size={18} />
                            </span>
                            <span className="text-sm font-bold">
                                テーマ設定
                            </span>
                        </div>

                        <div
                            role="group"
                            aria-label="テーマ設定"
                            className="mt-3 grid grid-cols-3 gap-2"
                        >
                            {THEME_OPTIONS.map((option) => {
                                const isSelected = theme === option.value;

                                return (
                                    <button
                                        key={option.value}
                                        type="button"
                                        aria-pressed={isSelected}
                                        onClick={() => setTheme(option.value)}
                                        className={[
                                            'min-w-0 whitespace-nowrap rounded-xl border px-1 py-2.5 text-xs font-bold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2 dark:focus-visible:ring-brand-300 dark:focus-visible:ring-offset-neutral-900',
                                            isSelected
                                                ? 'border-brand-500 bg-brand-50 text-brand-700 dark:border-brand-400 dark:bg-brand-800/40 dark:text-brand-300'
                                                : 'border-neutral-200 bg-white text-neutral-500 hover:border-brand-300 hover:text-brand-600 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-300 dark:hover:border-brand-600 dark:hover:text-brand-300',
                                        ].join(' ')}
                                    >
                                        {option.label}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                    <MenuRow icon={DocumentIcon} label="利用規約" disabled />
                </section>

                <Link
                    href={route('logout')}
                    method="post"
                    as="button"
                    className="mt-6 flex min-h-14 w-full items-center justify-center gap-3 rounded-2xl border border-expense/20 bg-white px-4 py-3.5 text-expense transition hover:bg-expense/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-expense focus-visible:ring-offset-2 active:bg-expense/10 dark:border-expense/40 dark:bg-neutral-900 dark:hover:bg-expense/10 dark:focus-visible:ring-offset-neutral-950 dark:active:bg-expense/15"
                >
                    <span aria-hidden="true">
                        <LogoutIcon size={18} />
                    </span>
                    <span className="text-sm font-bold">ログアウト</span>
                </Link>
            </div>
        </AuthenticatedLayout>
    );
}

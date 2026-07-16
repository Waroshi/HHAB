import Card from '@/Components/Card';
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
import { Head, Link, usePage } from '@inertiajs/react';

function MenuRow({ icon: Icon, label, description, href, disabled = false }) {
    const rowContent = (
        <>
            <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-neutral-100 text-neutral-500 dark:bg-neutral-800 dark:text-neutral-300">
                <Icon size={18} />
            </span>
            <span className="min-w-0 flex-1 text-left">
                <span className="block text-sm font-bold">{label}</span>
                {description && (
                    <span className="mt-0.5 block text-xs text-neutral-500 dark:text-neutral-400">
                        {description}
                    </span>
                )}
            </span>
            {disabled ? (
                <span className="shrink-0 rounded-full bg-neutral-100 px-2 py-1 text-[10px] font-bold text-neutral-500 dark:bg-neutral-800 dark:text-neutral-400">
                    検討中
                </span>
            ) : (
                <ChevronRightIcon
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
                className="flex w-full cursor-not-allowed items-center gap-3 px-4 py-3.5 opacity-60"
            >
                {rowContent}
            </button>
        );
    }

    return (
        <Link
            href={href}
            className="flex items-center gap-3 px-4 py-3.5 transition hover:bg-neutral-50 active:bg-neutral-100 dark:hover:bg-neutral-800/40 dark:active:bg-neutral-800/60"
        >
            {rowContent}
        </Link>
    );
}

export default function Menu() {
    const user = usePage().props.auth?.user;
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

            <div className="mx-auto max-w-md px-5 py-6 text-neutral-900 dark:text-neutral-100">
                <header>
                    <h1 className="text-2xl font-bold">メニュー</h1>
                    <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                        各種設定
                    </p>
                </header>

                <section className="mt-6">
                    <h2 className="mb-2 px-1 text-xs font-bold text-neutral-500 dark:text-neutral-400">
                        アカウント
                    </h2>
                    <Card className="overflow-hidden">
                        <div className="flex items-center gap-3 p-4">
                            <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-brand-50 text-lg font-extrabold text-brand-600 dark:bg-brand-800/40 dark:text-brand-300">
                                {userInitial}
                            </span>
                            <div className="min-w-0">
                                <p className="truncate font-bold">{userName}</p>
                                <p className="truncate text-xs text-neutral-500 dark:text-neutral-400">
                                    {userEmail}
                                </p>
                            </div>
                        </div>
                        <div className="border-t border-neutral-100 dark:border-neutral-800">
                            <MenuRow
                                icon={UserIcon}
                                label="プロフィール・アカウント設定"
                                description="氏名、メールアドレス、パスワードなど"
                                href={route('profile.edit')}
                            />
                        </div>
                    </Card>
                </section>

                <section className="mt-6">
                    <h2 className="mb-2 px-1 text-xs font-bold text-neutral-500 dark:text-neutral-400">
                        アプリ設定
                    </h2>
                    <Card className="divide-y divide-neutral-100 overflow-hidden dark:divide-neutral-800">
                        <MenuRow icon={TagIcon} label="カテゴリ設定" disabled />
                        <MenuRow icon={BellIcon} label="通知設定" disabled />
                        <MenuRow icon={PaletteIcon} label="テーマ設定" disabled />
                    </Card>
                </section>

                <section className="mt-6">
                    <h2 className="mb-2 px-1 text-xs font-bold text-neutral-500 dark:text-neutral-400">
                        その他
                    </h2>
                    <Card className="divide-y divide-neutral-100 overflow-hidden dark:divide-neutral-800">
                        <MenuRow icon={DocumentIcon} label="利用規約" disabled />
                        <Link
                            href={route('logout')}
                            method="post"
                            as="button"
                            className="flex w-full items-center gap-3 px-4 py-3.5 text-left text-expense transition hover:bg-neutral-50 active:bg-neutral-100 dark:hover:bg-neutral-800/40 dark:active:bg-neutral-800/60"
                        >
                            <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-expense/10">
                                <LogoutIcon size={18} />
                            </span>
                            <span className="flex-1 text-sm font-bold">
                                ログアウト
                            </span>
                        </Link>
                    </Card>
                </section>
            </div>
        </AuthenticatedLayout>
    );
}

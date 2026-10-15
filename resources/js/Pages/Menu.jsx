import MenuContent from '@/Components/MenuContent';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Menu() {
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

                {/* サイドメニューと同じ内容・操作を使う。 */}
                <MenuContent />
            </div>
        </AuthenticatedLayout>
    );
}

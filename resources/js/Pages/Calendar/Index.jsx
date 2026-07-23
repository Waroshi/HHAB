import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Calendar() {
    return (
        <AuthenticatedLayout>
            <Head title="カレンダー" />

            <section className='py-10'>
                <div className='mx-auto max-w-7xl sm:px-6 lg:px-8'>
                    <div className='bg-white p-6 shadow-sm sm:rounded-lg'>
                        <h1 className='text-xl font-semibold text-gray-900'>カレンダー
                        </h1>
                        <p className='mt-2 text-sm text-gray-500'>

                        </p>
                    </div>
                </div>
            </section>
        </AuthenticatedLayout>
    );
}

import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';

export default function Dashboard() {
    return (
        <AuthenticatedLayout>
            <Head title="Dashboard" />

            <section className="border-b border-[#dfe5d2] bg-white">
                <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
                    <h1 className="text-xl font-semibold text-[#233023]">
                        Dashboard
                    </h1>
                </div>
            </section>

            <section className="py-10">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="bg-white p-6 shadow-sm sm:rounded-lg">
                        <p className="text-gray-900">
                            uououououououououououououououououououououououououououo
                        </p>
                    </div>
                </div>
            </section>
        </AuthenticatedLayout>
    );
}
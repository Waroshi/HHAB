// resources/js/Pages/Dashboard.jsx
// Shows a trial dashboard screen for the household budget app.
// Exists to verify the Inertia React page can render in the browser.
// RELATED FILES: routes/web.php, resources/js/app.js, resources/views/app.blade.php
import { useForm } from '@inertiajs/react';

export default function Dashboard({ summary = { monthExpenses: 0 } }) {
    const form = useForm({
        amount: '',
        category: '',
        spent_at: '',
    });

    return (
        <main className="min-h-screen bg-gray-50 p-4">
            <h1 className="text-xl font-bold text-gray-900">Dashboard</h1>

            <section className="mt-4 rounded-lg bg-white p-4 shadow-sm">
                <p className="text-sm text-gray-500">This month's expenses</p>
                <p className="mt-1 text-2xl font-bold">
                    {summary.monthExpenses.toLocaleString()} yen
                </p>
            </section>
        </main>
    );
}

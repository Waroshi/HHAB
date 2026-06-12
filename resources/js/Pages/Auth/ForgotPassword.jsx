import InputError from '@/Components/InputError';
import { Head, Link, useForm } from '@inertiajs/react';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        <div className="relative flex min-h-screen flex-col overflow-hidden bg-[#50C868] font-sans">
            <Head title="Forgot Password" />

            <div
                className="absolute left-0 right-0 top-0 z-0 bg-[#113A28]"
                style={{
                    height: '55%',
                    clipPath: 'polygon(0 0, 100% 0, 100% 75%, 0 100%)',
                }}
            />

            <div className="relative z-10 mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-6 py-12 sm:px-12">
                <div className="mb-8">
                    <h1 className="text-4xl font-bold tracking-wide text-white">
                        Forgot?
                    </h1>
                    <p className="mt-2 text-sm text-white opacity-90">
                        Enter your email to reset your password
                    </p>
                </div>

                <div className="w-full rounded-[2rem] bg-white p-8 shadow-2xl">
                    {status && (
                        <div className="mb-4 text-sm font-medium text-green-600">
                            {status}
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-6">
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-gray-800"
                            >
                                Email address
                            </label>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                autoComplete="username"
                                className="mt-1 block w-full border-0 border-b border-gray-300 bg-transparent px-0 py-2 text-base text-black transition-colors placeholder-gray-400 focus:border-[#113A28] focus:ring-0"
                                required
                            />
                            <InputError message={errors.email} className="mt-2" />
                        </div>

                        <div className="pt-6">
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full rounded-full bg-[#113A28] py-3.5 text-base font-medium text-white shadow-md transition-colors hover:bg-[#0c291c] disabled:opacity-60"
                            >
                                Send reset link
                            </button>
                        </div>
                    </form>
                </div>

                <div className="mt-10 text-center text-sm text-[#113A28]">
                    Remember your password?{' '}
                    <Link href={route('login')} className="font-bold hover:underline">
                        Sign in
                    </Link>
                </div>
            </div>
        </div>
    );
}

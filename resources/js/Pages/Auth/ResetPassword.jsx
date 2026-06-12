// resources/js/Pages/Auth/ResetPassword.jsx
// Shows the password reset form reached from an emailed reset link.
// Exists so users can set a new password after requesting a reset.
// RELATED FILES: resources/js/Pages/Auth/ForgotPassword.jsx, resources/js/Pages/Auth/Login.jsx, resources/js/Components/InputError.jsx

import InputError from '@/Components/InputError';
import { Head, Link, useForm } from '@inertiajs/react';

export default function ResetPassword({ token, email }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        token,
        email,
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();

        post(route('password.store'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <div className="relative flex min-h-screen flex-col overflow-hidden bg-[#50C868] font-sans">
            <Head title="Reset Password" />

            <div
                className="absolute left-0 right-0 top-0 z-0 bg-[#113A28]"
                style={{
                    height: '55%',
                    clipPath: 'polygon(0 0, 100% 0, 100% 75%, 0 100%)',
                }}
            />

            <div className="relative z-10 mx-auto flex w-full max-w-md flex-1 flex-col justify-center px-6 py-10 sm:px-12">
                <div className="mb-6">
                    <h1 className="text-4xl font-bold tracking-wide text-white">
                        Reset
                    </h1>
                    <p className="mt-2 text-sm text-white opacity-90">
                        Create a new password for your account
                    </p>
                </div>

                <div className="w-full rounded-[2rem] bg-white p-8 shadow-2xl">
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
                                className="mt-1 block w-full border-0 border-b border-gray-300 bg-transparent px-0 py-2 text-base text-black transition-colors focus:border-[#113A28] focus:ring-0"
                                required
                            />
                            <InputError message={errors.email} className="mt-2" />
                        </div>

                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-gray-800"
                            >
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                autoComplete="new-password"
                                className="mt-1 block w-full border-0 border-b border-gray-300 bg-transparent px-0 py-2 text-base text-black transition-colors focus:border-[#113A28] focus:ring-0"
                                required
                                autoFocus
                            />
                            <InputError message={errors.password} className="mt-2" />
                        </div>

                        <div>
                            <label
                                htmlFor="password_confirmation"
                                className="block text-sm font-medium text-gray-800"
                            >
                                Confirm password
                            </label>
                            <input
                                id="password_confirmation"
                                type="password"
                                name="password_confirmation"
                                value={data.password_confirmation}
                                onChange={(e) =>
                                    setData('password_confirmation', e.target.value)
                                }
                                autoComplete="new-password"
                                className="mt-1 block w-full border-0 border-b border-gray-300 bg-transparent px-0 py-2 text-base text-black transition-colors focus:border-[#113A28] focus:ring-0"
                                required
                            />
                            <InputError
                                message={errors.password_confirmation}
                                className="mt-2"
                            />
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full rounded-full bg-[#113A28] py-3.5 text-base font-medium text-white shadow-md transition-colors hover:bg-[#0c291c] disabled:opacity-60"
                            >
                                Reset password
                            </button>
                        </div>
                    </form>
                </div>

                <div className="mt-8 text-center text-sm font-medium text-white">
                    Back to{' '}
                    <Link
                        href={route('login')}
                        className="font-bold text-[#113A28] hover:underline"
                    >
                        Sign in
                    </Link>
                </div>
            </div>
        </div>
    );
}

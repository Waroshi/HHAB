// resources/js/Pages/Auth/Login.jsx
// Shows the login form for existing users.
// Exists so users can sign in and navigate to password reset or registration.
// RELATED FILES: resources/js/Pages/Auth/Register.jsx, resources/js/Pages/Auth/ForgotPassword.jsx, resources/js/Components/InputError.jsx

import AuthPhoneShell from '@/Components/AuthPhoneShell';
import InputError from '@/Components/InputError';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Login({ status, canResetPassword }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        // 全体の背景色（下部の明るい緑）
        <div className="relative min-h-screen bg-[#50C868] overflow-hidden flex flex-col font-sans">
            <Head title="Log in" />

            {/* 上部の濃い緑の背景（clip-pathを使って斜めにカット） */}
            <div 
                className="absolute top-0 left-0 right-0 bg-[#113A28] z-0"
                style={{ height: '55%', clipPath: 'polygon(0 0, 100% 0, 100% 75%, 0 100%)' }}
            ></div>

            {/* コンテンツエリア */}
            <div className="relative z-10 flex-1 flex flex-col justify-center px-6 py-12 sm:px-12 max-w-md mx-auto w-full">
                
                {/* ヘッダーテキスト */}
                <div className="mb-8">
                    <h1 className="text-white text-4xl font-bold tracking-wide">Welcome</h1>
                    <p className="text-white text-sm mt-2 opacity-90">Login to access your account</p>
                </div>

                {/* 白いカードパネル */}
                <div className="bg-white rounded-[2rem] p-8 shadow-2xl w-full">
                    {status && (
                        <div className="mb-4 text-sm font-medium text-green-600">
                            {status}
                        </div>
                    )}

                    <form onSubmit={submit} className="space-y-6">
                        {/* Email入力欄 */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-800">
                                Email address
                            </label>
                            <input
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                autoComplete="username"
                                className="mt-1 block w-full border-0 border-b border-gray-300 px-0 py-2 focus:ring-0 focus:border-[#113A28] bg-transparent transition-colors text-black text-base placeholder-gray-400"
                                required
                            />
                            <InputError message={errors.email} className="mt-2" />
                        </div>

                        {/* Password入力欄とForgotリンク */}
                        <div>
                            <div className="flex justify-between items-center">
                                <label htmlFor="password" className="block text-sm font-medium text-gray-800">
                                    Password
                                </label>
                                {canResetPassword && (
                                    <Link
                                        href={route('password.request')}
                                        className="text-xs font-medium text-[#50C868] hover:text-[#3da351] transition-colors"
                                    >
                                        Forgot?
                                    </Link>
                                )}
                            </div>
                            <input
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                autoComplete="current-password"
                                className="mt-1 block w-full border-0 border-b border-gray-300 px-0 py-2 focus:ring-0 focus:border-[#113A28] bg-transparent transition-colors text-black text-base"
                                required
                            />
                            <InputError message={errors.password} className="mt-2" />
                        </div>

                        {/* ボタンエリア */}
                        <div className="pt-6 space-y-4">
                            {/* サインインボタン */}
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full bg-[#113A28] text-white rounded-full py-3.5 text-base font-medium hover:bg-[#0c291c] transition-colors shadow-md disabled:opacity-60"
                            >
                                Sign in
                            </button>
                        </div>
                    </form>
                </div>

                {/* フッターリンク */}
                <div className="mt-10 text-center text-sm text-[#113A28]">
                    Don't have an account?{' '}
                    <Link href={route('register')} className="font-bold hover:underline">
                        Sign Up
                    </Link>
                </div>
            </div>
        </div>
    );
}

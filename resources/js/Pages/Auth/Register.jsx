import AuthPhoneShell from '@/Components/AuthPhoneShell';
import InputError from '@/Components/InputError';
import TextInput from '@/Components/TextInput';
import { Head, Link, useForm } from '@inertiajs/react';

export default function Register() {
    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('register'), {
            onFinish: () => reset('password', 'password_confirmation'),
        });
    };

    return (
        <div className="relative min-h-screen bg-[#50C868] overflow-hidden flex flex-col font-sans">
            <Head title="Register" />

            <div 
                className="absolute top-0 left-0 right-0 bg-[#113A28] z-0"
                style={{ height: '55%', clipPath: 'polygon(0 0, 100% 0, 100% 75%, 0 100%)' }}
            ></div>

            <div className="relative z-10 flex-1 flex flex-col justify-center px-6 py-10 sm:px-12 max-w-md mx-auto w-full">
                
                <div className="mb-6">
                    <h1 className="text-white text-4xl font-bold tracking-wide">Register</h1>
                    <p className="text-white text-sm mt-2 opacity-90">Create a new account</p>
                </div>
                
                <div className="bg-white rounded-[2rem] p-8 shadow-2xl w-full">
                    <form onSubmit={submit} className="space-y-6">
                        
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-800">
                                Name
                            </label>
                            <input
                                id="name"
                                type="text"
                                name="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                autoComplete="name"
                                className="mt-1 block w-full border-0 border-b border-gray-300 px-0 py-2 focus:ring-0 focus:border-[#113A28] bg-transparent transition-colors text-black text-base"
                                required
                            />
                            <InputError message={errors.name} className="mt-2" />
                        </div>
                        
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
                                className="mt-1 block w-full border-0 border-b border-gray-300 px-0 py-2 focus:ring-0 focus:border-[#113A28] bg-transparent transition-colors text-black text-base"
                                required
                            />
                            <InputError message={errors.email} className="mt-2" />
                        </div>
                        
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-800">
                                Password
                            </label>
                            <input
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                autoComplete="new-password"
                                className="mt-1 block w-full border-0 border-b border-gray-300 px-0 py-2 focus:ring-0 focus:border-[#113A28] bg-transparent transition-colors text-black text-base"
                                required
                            />
                            <InputError message={errors.password} className="mt-2" />
                        </div>
                        
                        <div>
                            <label htmlFor="password_confirmation" className="block text-sm font-medium text-gray-800">
                                Confirm password
                            </label>
                            <input
                                id="password_confirmation"
                                type="password"
                                name="password_confirmation"
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                autoComplete="new-password"
                                className="mt-1 block w-full border-0 border-b border-gray-300 px-0 py-2 focus:ring-0 focus:border-[#113A28] bg-transparent transition-colors text-black text-base"
                                required
                            />
                            <InputError message={errors.password_confirmation} className="mt-2" />
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={processing}
                                className="w-full bg-[#113A28] text-white rounded-full py-3.5 text-base font-medium hover:bg-[#0c291c] transition-colors shadow-md disabled:opacity-60"
                            >
                                Sign up
                            </button>
                        </div>
                    </form>
                </div>

                <div className="mt-8 text-center text-sm text-white font-medium">
                    Already have account?{' '}
                    <Link href={route('login')} className="font-bold text-[#113A28] hover:underline">
                        Sign in
                    </Link>
                </div>
            </div>
        </div>
    );
}

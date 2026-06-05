import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/Layouts/GuestLayout';
import { Head, useForm } from '@inertiajs/react';

export default function ForgotPassword({ status }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('password.email'));
    };

    return (
        // GuestLayoutを捨てて、画面全体を独自のグラデーション背景にする
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-blue-100 p-4 font-sans">
            <Head title="パスワード再設定" />

            {/* スマホ風の角丸（rounded-3xl）と美しい影（shadow-xl）を持つ白いカード */}
            <div className="w-full max-w-md bg-white rounded-[2rem] shadow-xl p-8 border border-blue-50">
                
                <div className="text-center mb-8">
                    {/* アクセントとなるアイコン */}
                    <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-sm">
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path>
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800">パスワードをリセット</h2>
                    <p className="text-gray-500 mt-2 text-sm leading-relaxed">
                        ご登録のメールアドレスを入力してください。<br/>
                        再設定用のリンクをお送りします。
                    </p>
                </div>

                {status && (
                    <div className="mb-6 p-4 bg-blue-50 text-blue-700 text-sm font-medium rounded-xl text-center border border-blue-100">
                        {status}
                    </div>
                )}

                <form onSubmit={submit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2 ml-1">
                            メールアドレス
                        </label>
                        <input
                            type="email"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            // スマホで押しやすいように高さを出し（py-3）、フォーカス時に青く光るように設定
                            className="w-full px-4 py-3 rounded-xl border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all bg-gray-50 focus:bg-white text-gray-800"
                            placeholder="mail@example.com"
                            required
                        />
                        <InputError message={errors.email} className="mt-2 ml-1" />
                    </div>

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={processing}
                            // 立体感のあるモダンなボタンデザイン
                            className="w-full py-3.5 bg-blue-600 text-white rounded-xl font-bold text-lg hover:bg-blue-700 active:bg-blue-800 transition-all shadow-md hover:shadow-lg disabled:opacity-50"
                        >
                            リンクを送信する
                        </button>
                    </div>
                </form>

                {/* ログイン画面への戻るリンク */}
                <div className="mt-8 text-center">
                    <Link 
                        href={route('login')} 
                        className="text-sm text-gray-500 hover:text-blue-600 font-medium transition-colors"
                    >
                        ログイン画面に戻る
                    </Link>
                </div>
            </div>
        </div>
    );
}
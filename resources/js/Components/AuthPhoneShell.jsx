// resources/js/Components/AuthPhoneShell.jsx
// Provides a phone-like authentication screen frame.
// Exists so login and signup share the same visual structure.
// RELATED FILES: resources/js/Pages/Auth/Login.jsx, resources/js/Pages/Auth/Register.jsx, resources/js/Components/InputError.jsx

import { Link } from '@inertiajs/react';

export default function AuthPhoneShell({
    title,
    subtitle,
    backHref = '/',
    children,
    panel = 'light',
}) {
    const isLightPanel = panel === 'light';

    return (
        <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#459f9b] px-4 py-8">
            <DecorativeDots />

            <section className="relative z-10 w-full max-w-[23rem] rounded-[2.25rem] border-[7px] border-[#111111] bg-[#eef3d2] p-1 shadow-2xl shadow-[#1f5f5b]/40">
                <div className="relative min-h-[42rem] overflow-hidden rounded-[1.75rem] bg-white">
                    <div className="absolute left-1/2 top-3 z-20 h-6 w-24 -translate-x-1/2 rounded-full bg-black" />

                    <div
                        className={
                            isLightPanel
                                ? 'absolute inset-x-0 top-0 h-[15rem] bg-[#eef3d2]'
                                : 'absolute inset-0 bg-[#a8c97d]'
                        }
                    />
                    <div
                        className={
                            isLightPanel
                                ? 'absolute inset-x-0 top-[13rem] h-24 -skew-y-6 bg-white'
                                : 'absolute inset-x-0 top-[13rem] h-24 -skew-y-[24deg] bg-[#eef3d2]'
                        }
                    />

                    <div className="relative z-10 flex min-h-[42rem] flex-col px-7 pb-10 pt-16">
                        <Link
                            href={backHref}
                            aria-label="Back"
                            className="mb-8 flex h-9 w-9 items-center justify-center rounded-full text-3xl leading-none text-black transition hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-[#356b35]"
                        >
                            <span aria-hidden="true">&#8592;</span>
                        </Link>

                        <div>
                            <h1 className="text-2xl font-extrabold text-black">
                                {title}
                            </h1>
                            <p className="mt-3 max-w-[16rem] text-sm leading-5 text-black">
                                {subtitle}
                            </p>
                        </div>

                        <div className="mt-auto">{children}</div>
                    </div>
                </div>
            </section>
        </main>
    );
}

function DecorativeDots() {
    return (
        <>
            <span className="absolute left-[4%] top-[9%] h-10 w-10 rounded-full bg-[#63bd4e]" />
            <span className="absolute right-[4%] top-[11%] h-10 w-10 rounded-full bg-[#63bd4e]" />
            <span className="absolute bottom-[6%] left-[7%] h-28 w-28 rounded-full bg-[#63bd4e]" />
            <span className="absolute bottom-[7%] right-[6%] h-28 w-28 rounded-full bg-[#63bd4e]" />
            <span className="absolute left-[13%] top-[47%] h-16 w-16 rounded-full bg-[#63bd4e]" />
            <span className="absolute right-[10%] top-[50%] h-16 w-16 rounded-full bg-[#63bd4e]" />
            <span className="absolute left-1/2 top-[25%] h-20 w-20 rounded-full bg-[#63bd4e]" />
            <span className="absolute bottom-[11%] left-[55%] h-9 w-9 rounded-full bg-[#63bd4e]" />
            <span className="absolute left-[65%] top-[2%] h-5 w-5 rounded-full bg-[#63bd4e]" />
        </>
    );
}

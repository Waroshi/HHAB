// ============================================================
// 貼り付け先: resources/js/Pages/Scan.jsx（新規作成）
// 役割: レシート撮影画面。
//       <input type="file" capture="environment"> でスマホの背面カメラを起動し、
//       撮影した画像をプレビューし、読み取り結果画面へ進む。
// ============================================================
import { useEffect, useRef, useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { BackIcon } from '../Components/Icons';

// 四隅のコーナーガイドの配置クラス（左上・右上・左下・右下）
const CORNER_GUIDE_CLASSNAMES = [
    'top-0 left-0 border-t-4 border-l-4 rounded-tl-lg',
    'top-0 right-0 border-t-4 border-r-4 rounded-tr-lg',
    'bottom-0 left-0 border-b-4 border-l-4 rounded-bl-lg',
    'bottom-0 right-0 border-b-4 border-r-4 rounded-br-lg',
];

// 撮影前のプレースホルダーに描く「レシート風の行」の幅（%）
const PLACEHOLDER_LINE_WIDTHS = [84, 66, 90, 48, 72];

export default function Scan() {
    const fileInputRef = useRef(null);
    const [previewImageUrl, setPreviewImageUrl] = useState(null);
    const [isReading, setIsReading] = useState(false);

    useEffect(() => {
        if (!previewImageUrl) {
            return undefined;
        }

        return () => {
            URL.revokeObjectURL(previewImageUrl);
        };
    }, [previewImageUrl]);

    // ファイル選択（＝カメラ撮影）が完了したときの処理。
    // プレビューを表示しつつ、読み取り結果画面へ進む。
    const handleReceiptSelected = (changeEvent) => {
        const selectedFile = changeEvent.target.files?.[0];
        if (!selectedFile) {
            return;
        }

        setPreviewImageUrl(URL.createObjectURL(selectedFile));
        setIsReading(true);

        router.visit(route('readings.result'), {
            onFinish: () => setIsReading(false),
        });
    };

    // 撮影操作から、非表示のファイル入力を発火させる
    const openCamera = () => {
        fileInputRef.current?.click();
    };

    let guideMessage = 'レシートを枠内に合わせてください';
    if (isReading) {
        guideMessage = '読み取り中…';
    }

    return (
        // カメラ画面だけは常に暗い背景にしたいので AppLayout を使わない
        <div className="mx-auto flex min-h-dvh max-w-md flex-col overflow-x-hidden bg-neutral-950 text-neutral-100">
            <Head title="レシートを読む" />

            <header className="relative px-4 pb-4 pt-5 sm:px-5">
                <Link
                    href={route('dashboard')}
                    aria-label="戻る"
                    className="absolute left-4 top-4 inline-flex size-11 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-400 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950 active:bg-white/20"
                >
                    <span aria-hidden="true">
                        <BackIcon size={20} />
                    </span>
                </Link>

                <div className="px-12 text-center">
                    <h1 className="text-xl font-bold tracking-tight">
                        レシートを読む
                    </h1>
                    <p className="mt-2 text-sm leading-relaxed text-neutral-400">
                        レシート全体が写るように撮影してください
                    </p>
                </div>
            </header>

            <main className="flex flex-1 flex-col px-4 pb-[calc(env(safe-area-inset-bottom)+1.5rem)] sm:px-6">
                {/* ---------- 撮影・プレビュー領域 ---------- */}
                <section
                    aria-label="レシート撮影プレビュー"
                    className="relative mx-auto aspect-[3/4] w-full max-w-sm overflow-hidden rounded-2xl border border-neutral-700 bg-neutral-900 shadow-sm"
                >
                    {CORNER_GUIDE_CLASSNAMES.map((cornerClassName) => (
                        <span
                            key={cornerClassName}
                            aria-hidden="true"
                            className={`pointer-events-none absolute z-10 size-8 border-brand-400 ${cornerClassName}`}
                        />
                    ))}

                    <div className="absolute inset-3 flex items-center justify-center overflow-hidden rounded-xl border border-neutral-700/80 bg-neutral-800/80">
                        {previewImageUrl ? (
                            <img
                                src={previewImageUrl}
                                alt="撮影したレシート"
                                className="size-full bg-neutral-950/40 object-contain"
                            />
                        ) : (
                            <div className="flex w-3/4 flex-col items-center px-3 text-center">
                                <svg
                                    aria-hidden="true"
                                    className="size-10 text-neutral-500"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                >
                                    <path d="M7 3h10a2 2 0 0 1 2 2v16l-3-2-2 2-2-2-2 2-2-2-3 2V5a2 2 0 0 1 2-2Z" />
                                    <path d="M8 8h8M8 12h8M8 16h5" />
                                </svg>
                                <div className="mt-5 w-full space-y-2.5 opacity-50">
                                    {PLACEHOLDER_LINE_WIDTHS.map((lineWidthPercent) => (
                                        <div
                                            key={lineWidthPercent}
                                            style={{ width: `${lineWidthPercent}%` }}
                                            className="mx-auto h-1.5 rounded bg-neutral-500"
                                        />
                                    ))}
                                </div>
                                <p className="mt-5 text-xs leading-relaxed text-neutral-400">
                                    枠の中にレシート全体を収めてください
                                </p>
                            </div>
                        )}
                    </div>
                </section>

                {/* ---------- 画像選択・撮影操作 ---------- */}
                <div className="mt-4">
                    <label htmlFor="receipt-image" className="sr-only">
                        レシート画像
                    </label>
                    <input
                        id="receipt-image"
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        capture="environment"
                        className="hidden"
                        onChange={handleReceiptSelected}
                    />
                    <button
                        type="button"
                        aria-label="撮影する"
                        disabled={isReading}
                        onClick={openCamera}
                        className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-brand-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-300 focus-visible:ring-offset-2 focus-visible:ring-offset-neutral-950 active:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                        <svg
                            aria-hidden="true"
                            className="size-5"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path d="M4 7h3l1.5-2h7L17 7h3a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2Z" />
                            <circle cx="12" cy="13" r="3.5" />
                        </svg>
                        レシートを撮影・選択
                    </button>
                </div>

                <p
                    aria-live="polite"
                    className="mt-3 min-h-5 text-center text-sm font-medium text-neutral-300"
                >
                    {guideMessage}
                </p>

                <aside className="mt-4 rounded-xl border border-neutral-800 bg-neutral-900/70 px-4 py-3">
                    <p className="text-xs leading-relaxed text-neutral-400">
                        明るい場所で撮影すると、レシートを確認しやすくなります。
                    </p>
                </aside>
            </main>
        </div>
    );
}

// レシート画像を撮影・選択する画面。カメラを使えるかは端末に依存する。
import { useEffect, useRef, useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { BackIcon } from '../Components/Icons';
import ExpenseForm, { CATEGORY_OPTIONS, PAYMENT_METHOD_OPTIONS } from '@/Components/ExpenseForm';

function createManualExpense() {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');

    return {
        storeName: '',
        purchasedAt: `${year}-${month}-${day}`,
        totalAmount: '',
        category: '',
        paymentMethod: '',
        memo: '',
    };
}

function validateManualExpense(expense) {
    const errors = {};
    const date = new Date(`${expense.purchasedAt}T00:00:00Z`);
    if (!/^\d{4}-\d{2}-\d{2}$/.test(expense.purchasedAt)
        || Number.isNaN(date.getTime())
        || date.toISOString().slice(0, 10) !== expense.purchasedAt) {
        errors.purchasedAt = '日付を正しく入力してください。';
    }

    const amount = expense.totalAmount;
    if (amount === '') {
        errors.totalAmount = '合計金額を入力してください。';
    } else if (!/^[0-9]+$/.test(amount) || Number(amount) <= 0) {
        errors.totalAmount = '金額は1円以上の半角整数で入力してください（0・負数・小数は使えません）。';
    } else if (!Number.isSafeInteger(Number(amount))) {
        errors.totalAmount = '金額が大きすぎます。入力内容を確認してください。';
    }
    if (!CATEGORY_OPTIONS.includes(expense.category)) {
        errors.category = 'カテゴリを選択してください。';
    }
    if (!PAYMENT_METHOD_OPTIONS.includes(expense.paymentMethod)) {
        errors.paymentMethod = '支払い方法を選択してください。';
    }
    return errors;
}

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
    const [isManualEntry, setIsManualEntry] = useState(false);
    const [manualExpense, setManualExpense] = useState(createManualExpense);
    const [hasChecked, setHasChecked] = useState(false);
    const [checkMessage, setCheckMessage] = useState('');
    const receiptMethodRef = useRef(null);
    const manualEntryButtonRef = useRef(null);
    const previousModeRef = useRef(false);
    const errors = hasChecked ? validateManualExpense(manualExpense) : {};

    useEffect(() => {
        if (isManualEntry !== previousModeRef.current) {
            if (isManualEntry) {
                manualEntryButtonRef.current?.focus({ preventScroll: true });
            } else {
                receiptMethodRef.current?.focus({ preventScroll: true });
            }
        }
        if (isManualEntry !== previousModeRef.current) {
            window.scrollTo({ top: 0, behavior: 'instant' });
        }
        previousModeRef.current = isManualEntry;
    }, [isManualEntry]);

    const updateManualExpense = (field, value) => {
        setManualExpense((currentExpense) => {
            const nextExpense = { ...currentExpense };
            nextExpense[field] = value;
            return nextExpense;
        });
        setCheckMessage('');
    };

    const checkManualExpense = (event) => {
        event.preventDefault();
        setHasChecked(true);
        const nextErrors = validateManualExpense(manualExpense);
        const firstErrorField = Object.keys(nextErrors)[0];
        if (firstErrorField) {
            setCheckMessage('入力内容を確認してください。まだ保存されていません。');
            event.currentTarget.elements.namedItem(firstErrorField)?.focus();
            return;
        }
        setCheckMessage('入力内容に問題はありません。保存機能は未接続のため、まだ保存されていません。');
    };

    // 次のEffect実行前と画面終了時に、前回のObject URLを解放してメモリに残さない。
    useEffect(() => {
        if (!previewImageUrl) {
            return undefined;
        }

        return () => {
            URL.revokeObjectURL(previewImageUrl);
        };
    }, [previewImageUrl]);

    // 選んだ画像はプレビュー用。ここでは画像を送信・解析せず、結果画面へ移動する。
    const handleReceiptSelected = (changeEvent) => {
        const selectedFile = changeEvent.target.files?.[0];
        if (!selectedFile) {
            return;
        }

        const previewUrl = URL.createObjectURL(selectedFile);
        setPreviewImageUrl(previewUrl);

        if (!route().has('readings.result')) {
            return;
        }

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

    const inputMethodSwitch = (
        <div role="group" aria-label="入力方法" className="mt-4 flex gap-1 rounded-[14px] border-0 border-current bg-[#dce3de] p-1 dark:bg-[#35473b]">
            <button
                ref={receiptMethodRef}
                type="button"
                aria-pressed={!isManualEntry}
                disabled={isReading}
                onClick={() => setIsManualEntry(false)}
                className="min-h-[52px] flex-1 rounded-[10px] border-0 bg-transparent px-2 py-2 text-sm font-bold text-[#526158] dark:text-[#b3c0b7] aria-pressed:bg-white aria-pressed:text-brand-700 aria-pressed:shadow-[0_1px_4px_#0000000d] hover:!text-[#202923] dark:aria-pressed:bg-[#19201c] dark:aria-pressed:text-brand-200 dark:hover:!text-[#eef4f0] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-brand-700 focus-visible:shadow-none focus-visible:border-brand-700 dark:focus-visible:outline-brand-200 dark:focus-visible:border-brand-200"
            >
                {!isManualEntry && <span aria-hidden="true">✓ </span>}レシート
                <span className="mt-0.5 block text-xs font-medium">{isManualEntry ? '撮影・画像選択' : '選択中'}</span>
            </button>
            <button
                ref={manualEntryButtonRef}
                type="button"
                aria-pressed={isManualEntry}
                disabled={isReading}
                onClick={() => setIsManualEntry(true)}
                className="min-h-[52px] flex-1 rounded-[10px] border-0 bg-transparent px-2 py-2 text-sm font-bold text-[#526158] dark:text-[#b3c0b7] aria-pressed:bg-white aria-pressed:text-brand-700 aria-pressed:shadow-[0_1px_4px_#0000000d] hover:!text-[#202923] dark:aria-pressed:bg-[#19201c] dark:aria-pressed:text-brand-200 dark:hover:!text-[#eef4f0] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-brand-700 focus-visible:shadow-none focus-visible:border-brand-700 dark:focus-visible:outline-brand-200 dark:focus-visible:border-brand-200"
            >
                {isManualEntry && <span aria-hidden="true">✓ </span>}手入力
                <span className="mt-0.5 block text-xs font-medium">{isManualEntry ? '選択中' : '画像なしで入力'}</span>
            </button>
        </div>
    );

    // 入力方法を切り替えても見出しと位置を揃える。
    const entryHeader = (
        <header className="flex items-start gap-4 max-[374px]:gap-3">
            {isManualEntry ? (
                <button
                    type="button"
                    onClick={() => setIsManualEntry(false)}
                    aria-label="レシート画面に戻る"
                    className="inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-[#dce3de] dark:border-[#35473b] bg-white dark:bg-[#19201c] text-[#202923] dark:text-[#eef4f0] hover:bg-brand-50 dark:hover:bg-[#24392d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-brand-700 focus-visible:shadow-none focus-visible:border-brand-700 dark:focus-visible:outline-brand-200 dark:focus-visible:border-brand-200"
                >
                    <span aria-hidden="true">
                        <BackIcon size={20} />
                    </span>
                </button>
            ) : (
                <Link
                    href={route('dashboard')}
                    aria-label="戻る"
                    className="inline-flex size-11 shrink-0 items-center justify-center rounded-full border border-[#dce3de] dark:border-[#35473b] bg-white dark:bg-[#19201c] text-[#202923] dark:text-[#eef4f0] hover:bg-brand-50 dark:hover:bg-[#24392d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-brand-700 focus-visible:shadow-none focus-visible:border-brand-700 dark:focus-visible:outline-brand-200 dark:focus-visible:border-brand-200"
                >
                    <span aria-hidden="true">
                        <BackIcon size={20} />
                    </span>
                </Link>
            )}
            <div>
                <p className="text-[11px] font-semibold tracking-[0.08em] text-[#526158] dark:text-[#b3c0b7]">HHAB / 支出の入力</p>
                <h1 className="mt-1 text-[22px] font-bold leading-[1.4] tracking-tight">支出を入力</h1>
                <p className="mt-1.5 text-sm leading-[1.5] text-[#526158] dark:text-[#b3c0b7]">レシート撮影、または手入力で。</p>
            </div>
        </header>
    );

    if (isManualEntry) {
        return (
            <div className="min-h-dvh bg-gray-100 pt-5 pb-[calc(env(safe-area-inset-bottom)+32px)] text-[#202923] dark:text-[#eef4f0] [color-scheme:light] dark:bg-[#0f1411] dark:[color-scheme:dark]">
                <Head title="支出を手入力" />
                <div className="mx-auto max-w-md px-5 max-[374px]:px-4">
                    {entryHeader}
                    {inputMethodSwitch}
                    <main>
                        <aside className="mx-0.5 my-[18px] flex gap-2.5 text-xs leading-[1.8] text-[#526158] dark:text-[#b3c0b7]">
                            <span aria-hidden="true" className="mt-0.5 inline-flex size-[18px] shrink-0 items-center justify-center rounded-full border border-current font-serif font-bold">i</span>
                            <div>
                                <p><strong className="font-semibold text-[#202923] dark:text-[#eef4f0]">入力内容はまだ保存されません</strong></p>
                                <p>再読み込み・別画面への移動で消えます。入力方法の切り替えでは保持されます。</p>
                            </div>
                        </aside>
                        <form noValidate onSubmit={checkManualExpense} className="overflow-hidden rounded-[20px] border border-[#dce3de] dark:border-[#35473b] bg-white dark:bg-[#19201c] shadow-[0_6px_24px_#16352305]">
                            <ExpenseForm
                                values={manualExpense}
                                onChange={updateManualExpense}
                                isEditing={true}
                                isManual={true}
                                errors={errors}
                                storeLabel="店舗名・購入先"
                                basicHeading={<h2 className="text-sm font-bold leading-6">支出の基本情報</h2>}
                                otherHeading={<h2 className="text-sm font-bold leading-6">分類とメモ</h2>}
                            />
                            <div className="border-t p-5 border-[#dce3de] dark:border-[#35473b]">
                            <p role="status" className="mb-4 text-[13px] leading-[1.8] empty:m-0 text-[#202923] dark:text-[#eef4f0]">{checkMessage}</p>
                            <button
                                type="submit"
                                className="min-h-12 w-full rounded-[10px] bg-brand-700 text-sm leading-[1.5] font-bold text-white hover:bg-brand-800 dark:bg-brand-200 dark:text-[#19201c] dark:hover:bg-[#c4ecd7] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-brand-700 focus-visible:shadow-none focus-visible:border-brand-700 dark:focus-visible:outline-brand-200 dark:focus-visible:border-brand-200"
                            >
                                入力内容を確認する
                            </button>
                            <p className="mt-3 text-center text-[11px] leading-[1.7] text-[#526158] dark:text-[#b3c0b7]">内容の確認のみ行います。保存はされません。</p>
                            </div>
                        </form>
                    </main>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-dvh bg-gray-100 pt-5 pb-[calc(env(safe-area-inset-bottom)+32px)] text-[#202923] dark:text-[#eef4f0] [color-scheme:light] dark:bg-[#0f1411] dark:[color-scheme:dark]">
            <Head title="レシートを読む" />
            <div className="mx-auto max-w-md px-5 max-[374px]:px-4">
                {entryHeader}
                {inputMethodSwitch}
            <main className="mt-5">
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
                        className="min-h-12 w-full rounded-[10px] bg-brand-700 text-sm leading-[1.5] font-bold text-white hover:bg-brand-800 dark:bg-brand-200 dark:text-[#19201c] dark:hover:bg-[#c4ecd7] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-brand-700 focus-visible:shadow-none focus-visible:border-brand-700 dark:focus-visible:outline-brand-200 dark:focus-visible:border-brand-200 flex items-center justify-center gap-2 disabled:opacity-40"
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
                    className="mt-3 min-h-5 text-center text-[13px] text-[#202923] dark:text-[#eef4f0]"
                >
                    {guideMessage}
                </p>

                <aside className="mt-4 py-3 text-[#526158] dark:text-[#b3c0b7]">
                    <p className="text-xs leading-relaxed">
                        明るい場所で撮影すると、レシートを確認しやすくなります。
                    </p>
                </aside>
            </main>
            </div>
        </div>
    );
}

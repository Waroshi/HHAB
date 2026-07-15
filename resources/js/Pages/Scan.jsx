// ============================================================
// 貼り付け先: resources/js/Pages/Scan.jsx（新規作成）
// 役割: レシート撮影画面。
//       <input type="file" capture="environment"> でスマホの背面カメラを起動し、
//       撮影した画像を POST /scan で Laravel に送って読み取り結果画面へ進む。
// ============================================================
import { useRef, useState } from 'react';
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
    const [isUploading, setIsUploading] = useState(false);

    // ファイル選択（＝カメラ撮影）が完了したときの処理。
    // プレビューを表示しつつ、すぐにサーバーへアップロードする。
    const handleReceiptSelected = (changeEvent) => {
        const selectedFile = changeEvent.target.files?.[0];
        if (!selectedFile) {
            return;
        }

        setPreviewImageUrl(URL.createObjectURL(selectedFile));
        setIsUploading(true);

        // 画像ファイルを送るため forceFormData で multipart/form-data にする
        router.post('/scan', { receipt: selectedFile }, {
            forceFormData: true,
            onFinish: () => setIsUploading(false),
        });
    };

    // 中央のシャッターボタンから、非表示のファイル入力を発火させる
    const openCamera = () => {
        fileInputRef.current?.click();
    };

    let guideMessage = 'レシートを枠内に合わせてください';
    if (isUploading) {
        guideMessage = '読み取り中…';
    }

    return (
        // カメラ画面だけは常に暗い背景にしたいので AppLayout を使わない
        <div className="mx-auto max-w-md min-h-dvh flex flex-col bg-neutral-950 text-white">
            <Head title="レシートを読む" />

            <header className="relative flex items-center justify-center px-5 pt-5 pb-3">
                <Link
                    href="/dashboard"
                    aria-label="戻る"
                    className="absolute left-4 p-2 rounded-full bg-white/10 active:bg-white/20"
                >
                    <BackIcon size={20} />
                </Link>
                <h1 className="text-base font-bold">レシートを読む</h1>
            </header>

            {/* ---------- 撮影ガイド枠 ---------- */}
            <main className="flex-1 flex flex-col items-center justify-center px-8">
                <div className="relative w-full aspect-[3/4] max-h-[55vh]">
                    {CORNER_GUIDE_CLASSNAMES.map((cornerClassName) => (
                        <span
                            key={cornerClassName}
                            className={`absolute size-8 border-brand-400 ${cornerClassName}`}
                        />
                    ))}

                    <div className="absolute inset-3 rounded-xl bg-neutral-800/80 overflow-hidden
                                    flex items-center justify-center">
                        {previewImageUrl ? (
                            <img
                                src={previewImageUrl}
                                alt="撮影したレシート"
                                className="size-full object-contain"
                            />
                        ) : (
                            <div className="w-2/3 space-y-2.5 opacity-40">
                                {PLACEHOLDER_LINE_WIDTHS.map((lineWidthPercent) => (
                                    <div
                                        key={lineWidthPercent}
                                        style={{ width: `${lineWidthPercent}%` }}
                                        className="h-1.5 rounded bg-neutral-500"
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <p className="mt-5 text-sm text-neutral-300">{guideMessage}</p>
            </main>

            {/* ---------- シャッターボタン ---------- */}
            <footer className="pb-[calc(env(safe-area-inset-bottom)+2rem)] flex justify-center">
                <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    onChange={handleReceiptSelected}
                />
                <button
                    aria-label="撮影する"
                    disabled={isUploading}
                    onClick={openCamera}
                    className="size-[72px] rounded-full border-4 border-white/90 p-1.5
                               transition active:scale-95 disabled:opacity-40"
                >
                    <span className="block size-full rounded-full bg-brand-500" />
                </button>
            </footer>
        </div>
    );
}

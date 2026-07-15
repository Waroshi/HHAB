// ============================================================
// 貼り付け先: resources/js/Pages/Calendar.jsx（新規作成）
// 役割: カレンダー画面。セル区切りのグリッド型デザイン
//       （日曜=赤・土曜=青・選択日は丸ハイライト）で、
//       日別の支出額とヒートマップの濃淡を表示する。
// ============================================================
import Card from '@/Components/Card';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import { Head } from '@inertiajs/react';
import { useMemo, useState } from 'react';

// TODO: バックエンド接続後に実データへ置き換えるプロトタイプ用データ
// デモ用の日別支出。キーは「日」、値は支出額。
// Laravel側からは { 3: 1200, 5: 860, ... } の形で渡す想定。
const demoDailySpending = {
    3: 1200, 5: 860, 9: 2430, 12: 3280, 16: 540, 19: 4980, 25: 1760,
};

const WEEKDAY_HEADERS = [
    { label: '日', colorClassName: 'text-red-400' },
    { label: '月', colorClassName: '' },
    { label: '火', colorClassName: '' },
    { label: '水', colorClassName: '' },
    { label: '木', colorClassName: '' },
    { label: '金', colorClassName: '' },
    { label: '土', colorClassName: 'text-blue-400' },
];

// ヒートマップ凡例に使う濃淡クラス（薄い→濃い）
const HEATMAP_LEVEL_CLASSNAMES = [
    'bg-brand-500/5',
    'bg-brand-500/10',
    'bg-brand-500/20',
    'bg-brand-500/30',
];

// 支出額の大きさに応じてセルの背景の濃さを決める。
// その月の最大支出額を基準にした相対値で判定する。
function getHeatmapClassName(spendingAmount, maxSpendingAmount) {
    if (!spendingAmount) {
        return '';
    }

    const spendingRatio = spendingAmount / maxSpendingAmount;

    if (spendingRatio > 0.75) return HEATMAP_LEVEL_CLASSNAMES[3];
    if (spendingRatio > 0.5)  return HEATMAP_LEVEL_CLASSNAMES[2];
    if (spendingRatio > 0.25) return HEATMAP_LEVEL_CLASSNAMES[1];
    return HEATMAP_LEVEL_CLASSNAMES[0];
}

// 月のカレンダーセルを作る。
// 月初の曜日ぶんだけ先頭に null（空セル）を詰め、
// 末尾も7の倍数になるまで null で埋めて、7列のグリッドに揃える。
function buildCalendarCells(year, month) {
    const firstDayWeekIndex = new Date(year, month - 1, 1).getDay(); // 0=日曜
    const daysInMonth = new Date(year, month, 0).getDate();

    const calendarCells = [];

    for (let blankIndex = 0; blankIndex < firstDayWeekIndex; blankIndex++) {
        calendarCells.push(null);
    }
    for (let dayNumber = 1; dayNumber <= daysInMonth; dayNumber++) {
        calendarCells.push(dayNumber);
    }
    while (calendarCells.length % 7 !== 0) {
        calendarCells.push(null);
    }

    return calendarCells;
}

export default function Calendar({
    year = new Date().getFullYear(),
    month = new Date().getMonth() + 1, // 1〜12
    dailySpending = demoDailySpending,
    monthlyTotal = 42500,
    highSpendingDayCount = 3,
    paydayLabel = '給料日 5/25',
}) {
    // 表示中の月が今月であれば、今日の日付を初期選択にする
    const today = new Date();
    const isCurrentMonth =
        (today.getFullYear() === year && today.getMonth() + 1 === month);

    let initialSelectedDay = null;
    if (isCurrentMonth) {
        initialSelectedDay = today.getDate();
    }

    const [selectedDay, setSelectedDay] = useState(initialSelectedDay);

    const calendarCells = useMemo(() => {
        return buildCalendarCells(year, month);
    }, [year, month]);

    // ヒートマップの基準になる、その月の最大支出額。
    // 支出が1件もない月でも 0 除算にならないよう最低値を 1 にしている。
    const maxSpendingAmount = Math.max(1, ...Object.values(dailySpending));

    return (
        <AuthenticatedLayout>
            <Head title="カレンダー" />

            <div className="mx-auto max-w-md px-5 pb-8 pt-4">
                <header className="pb-3">
                    <h1 className="text-xl font-extrabold tracking-tight">カレンダー</h1>
                    <p className="mt-0.5 text-xs text-neutral-500 dark:text-neutral-400">
                        {year}年{month}月
                    </p>
                </header>

                {/* ---------- 今月の支出サマリー ---------- */}
                <Card as="section" className="p-4 flex items-center justify-between">
                    <div>
                        <p className="text-xs text-neutral-500 dark:text-neutral-400">今月の支出</p>
                        <p className="tabular-nums text-2xl font-extrabold mt-0.5">
                            ¥{monthlyTotal.toLocaleString()}
                        </p>
                    </div>
                    <div className="text-right">
                        <p className="text-xs font-bold text-brand-600 dark:text-brand-300">
                            多い日 {highSpendingDayCount}日
                        </p>
                        <p className="text-[11px] text-neutral-400 mt-0.5">{paydayLabel}</p>
                    </div>
                </Card>

                {/* ---------- カレンダー本体（セル区切りのグリッド型） ---------- */}
                <section className="mt-4 rounded-2xl overflow-hidden
                                    bg-white dark:bg-black
                                    border border-neutral-200 dark:border-neutral-800">

                    {/* 曜日ヘッダー */}
                    <div className="grid grid-cols-7 text-center text-xs font-bold py-3
                                    text-neutral-500 dark:text-neutral-300">
                        {WEEKDAY_HEADERS.map((weekday) => (
                            <span key={weekday.label} className={weekday.colorClassName}>
                                {weekday.label}
                            </span>
                        ))}
                    </div>

                    {/* 日付セル。gap-px と背景色でセル間の細い区切り線を表現している */}
                    <div className="grid grid-cols-7 gap-px bg-neutral-200 dark:bg-neutral-800">
                        {calendarCells.map((dayNumber, cellIndex) => {
                            const isBlankCell = (dayNumber === null);

                            if (isBlankCell) {
                                return (
                                    <div
                                        key={cellIndex}
                                        className="aspect-[3/4] bg-neutral-50 dark:bg-black"
                                    />
                                );
                            }

                            const spendingAmount = dailySpending[dayNumber];
                            const isSelected = (dayNumber === selectedDay);
                            const heatmapClassName =
                                getHeatmapClassName(spendingAmount, maxSpendingAmount);

                            // 選択中の日付は数字を丸で囲んで強調する
                            let dayNumberClassName = '';
                            if (isSelected) {
                                dayNumberClassName =
                                    'bg-neutral-900 text-white dark:bg-white dark:text-neutral-900 font-bold';
                            }

                            return (
                                <button
                                    key={cellIndex}
                                    onClick={() => setSelectedDay(dayNumber)}
                                    className={`aspect-[3/4] flex flex-col items-center pt-2 px-0.5
                                                bg-white dark:bg-neutral-900
                                                active:bg-neutral-100 dark:active:bg-neutral-800
                                                transition ${heatmapClassName}`}
                                >
                                    <span className={`size-7 flex items-center justify-center rounded-full
                                                      text-sm tabular-nums font-medium ${dayNumberClassName}`}>
                                        {dayNumber}
                                    </span>

                                    {spendingAmount && (
                                        <span className="mt-1 text-[9px] tabular-nums font-bold text-expense">
                                            {spendingAmount.toLocaleString()}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </section>

                {/* ---------- ヒートマップの凡例 ---------- */}
                <p className="mt-3 flex items-center justify-between text-[11px] text-neutral-400 px-1">
                    少ない
                    <span className="flex gap-1">
                        {HEATMAP_LEVEL_CLASSNAMES.map((levelClassName) => (
                            <span
                                key={levelClassName}
                                className={`size-3 rounded ${levelClassName}
                                            border border-neutral-200 dark:border-neutral-700`}
                            />
                        ))}
                    </span>
                    多い
                </p>
            </div>
        </AuthenticatedLayout>
    );
}

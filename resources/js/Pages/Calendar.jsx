// ============================================================
// 貼り付け先: resources/js/Pages/Calendar.jsx（新規作成）
// 役割: カレンダー画面。長方形の日付セルと支出レベルを表示し、
//       選択した日の支出額を確認できる。
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
    { label: '日', colorClassName: 'text-red-400 dark:text-red-300' },
    { label: '月', colorClassName: '' },
    { label: '火', colorClassName: '' },
    { label: '水', colorClassName: '' },
    { label: '木', colorClassName: '' },
    { label: '金', colorClassName: '' },
    { label: '土', colorClassName: 'text-blue-400 dark:text-blue-300' },
];

// ヒートマップ凡例に使う濃淡クラス（薄い→濃い）
const HEATMAP_LEVEL_CLASSNAMES = [
    'bg-brand-500/5 dark:!bg-brand-500/10',
    'bg-brand-500/10 dark:!bg-brand-500/20',
    'bg-brand-500/20 dark:!bg-brand-500/30',
    'bg-brand-500/30 dark:!bg-brand-500/40',
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
    const selectedSpendingAmount =
        selectedDay === null ? null : (dailySpending[selectedDay] ?? 0);

    return (
        <AuthenticatedLayout>
            <Head title="カレンダー" />

            <div className="mx-auto max-w-lg px-4 pb-8 pt-6 text-neutral-900 dark:text-neutral-100 sm:px-6">
                <header>
                    <h1 className="text-2xl font-extrabold tracking-tight dark:text-neutral-50">
                        カレンダー
                    </h1>
                    <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
                        日ごとの支出を確認できます
                    </p>
                </header>

                <Card
                    as="section"
                    className="mt-4 overflow-hidden border border-neutral-200 dark:border-neutral-800"
                >
                    <div className="flex items-end justify-between gap-4 p-4">
                        <div>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                対象年月
                            </p>
                            <p className="mt-1 text-lg font-bold dark:text-neutral-50">
                                {year}年{month}月
                            </p>
                        </div>
                        <div className="min-w-0 text-right">
                            <p className="text-xs text-neutral-500 dark:text-neutral-400">
                                今月の支出
                            </p>
                            <p className="mt-1 truncate text-xl font-extrabold tabular-nums dark:text-neutral-50 sm:text-2xl">
                                ¥{monthlyTotal.toLocaleString()}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center justify-between gap-3 border-t border-neutral-100 px-4 py-2.5 text-[11px] dark:border-neutral-800">
                        <p className="font-bold text-brand-600 dark:text-brand-300">
                            多い日 {highSpendingDayCount}日
                        </p>
                        <p className="text-neutral-400 dark:text-neutral-400">
                            {paydayLabel}
                        </p>
                    </div>
                </Card>

                <section className="mt-4 overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-[0_1px_3px_rgba(0,0,0,0.04)] dark:border-neutral-800 dark:bg-neutral-900 dark:shadow-none">
                    <div className="grid grid-cols-7 bg-neutral-50 py-2.5 text-center text-xs font-bold text-neutral-500 dark:bg-neutral-950 dark:text-neutral-300">
                        {WEEKDAY_HEADERS.map((weekday) => (
                            <span
                                key={weekday.label}
                                className={weekday.colorClassName}
                            >
                                {weekday.label}
                            </span>
                        ))}
                    </div>

                    <div className="grid grid-cols-7 gap-px border-t border-neutral-200 bg-neutral-200 dark:border-neutral-800 dark:bg-neutral-800">
                        {calendarCells.map((dayNumber, cellIndex) => {
                            const isBlankCell = (dayNumber === null);

                            if (isBlankCell) {
                                return (
                                    <div
                                        key={cellIndex}
                                        aria-hidden="true"
                                        className="min-h-16 min-w-0 bg-neutral-50/80 dark:bg-neutral-950/80 sm:min-h-20"
                                    />
                                );
                            }

                            const spendingAmount = dailySpending[dayNumber];
                            const isSelected = (dayNumber === selectedDay);
                            const isToday =
                                isCurrentMonth && dayNumber === today.getDate();
                            const weekdayIndex = cellIndex % 7;
                            const isSunday = weekdayIndex === 0;
                            const isSaturday = weekdayIndex === 6;
                            const heatmapClassName =
                                getHeatmapClassName(spendingAmount, maxSpendingAmount);

                            let dayNumberClassName =
                                'text-neutral-700 dark:text-neutral-200';
                            if (isSelected) {
                                dayNumberClassName =
                                    'bg-brand-600 font-bold text-white shadow-sm dark:bg-neutral-100 dark:text-neutral-900';
                            } else if (isToday) {
                                dayNumberClassName =
                                    'font-semibold text-brand-700 ring-2 ring-inset ring-brand-500 dark:text-brand-300 dark:ring-brand-400';
                            } else if (isSunday) {
                                dayNumberClassName =
                                    'text-red-500 dark:text-red-300';
                            } else if (isSaturday) {
                                dayNumberClassName =
                                    'text-blue-500 dark:text-blue-300';
                            }

                            return (
                                <button
                                    key={cellIndex}
                                    type="button"
                                    onClick={() => setSelectedDay(dayNumber)}
                                    aria-pressed={isSelected}
                                    aria-label={`${year}年${month}月${dayNumber}日${isToday ? '、今日' : ''}${spendingAmount ? `、支出${spendingAmount.toLocaleString()}円` : '、支出なし'}`}
                                    className={`flex min-h-16 min-w-0 flex-col items-center bg-white px-0.5 py-1.5 text-center transition hover:ring-1 hover:ring-inset hover:ring-neutral-300 focus-visible:relative focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-brand-500 active:brightness-95 dark:bg-neutral-900 dark:hover:ring-neutral-600 dark:focus-visible:ring-brand-300 sm:min-h-20 sm:py-2 ${heatmapClassName}`}
                                >
                                    <span
                                        className={`flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-medium tabular-nums ${dayNumberClassName}`}
                                    >
                                        {dayNumber}
                                    </span>

                                    {spendingAmount && (
                                        <span
                                            className="mt-auto max-w-full truncate whitespace-nowrap text-[8px] font-bold tabular-nums text-expense dark:text-red-300 sm:text-[10px]"
                                        >
                                            ¥{spendingAmount.toLocaleString()}
                                        </span>
                                    )}
                                </button>
                            );
                        })}
                    </div>

                    <p className="flex items-center justify-between border-t border-neutral-100 bg-white px-4 py-3 text-[11px] text-neutral-400 dark:border-neutral-800 dark:bg-neutral-900 dark:text-neutral-400">
                        少ない
                        <span className="flex gap-1">
                            {HEATMAP_LEVEL_CLASSNAMES.map((levelClassName) => (
                                <span
                                    key={levelClassName}
                                    aria-hidden="true"
                                    className={`size-3 rounded-full border border-neutral-200 dark:border-neutral-700 ${levelClassName}`}
                                />
                            ))}
                        </span>
                        多い
                    </p>
                </section>

                <Card
                    as="section"
                    aria-live="polite"
                    className="mt-4 border border-neutral-200 p-4 dark:border-neutral-800"
                >
                    <p className="text-xs text-neutral-500 dark:text-neutral-400">
                        選択日の支出
                    </p>
                    {selectedDay === null ? (
                        <p className="mt-2 text-sm font-semibold text-neutral-700 dark:text-neutral-200">
                            日付を選択してください
                        </p>
                    ) : (
                        <div className="mt-2 flex items-end justify-between gap-3">
                            <p className="font-bold dark:text-neutral-50">
                                {year}年{month}月{selectedDay}日
                            </p>
                            {selectedSpendingAmount > 0 ? (
                                <p className="shrink-0 text-sm text-neutral-600 dark:text-neutral-300">
                                    支出：
                                    <span className="font-bold tabular-nums text-expense dark:text-red-300">
                                        {selectedSpendingAmount.toLocaleString()}円
                                    </span>
                                </p>
                            ) : (
                                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                                    支出はありません
                                </p>
                            )}
                        </div>
                    )}
                </Card>
            </div>
        </AuthenticatedLayout>
    );
}

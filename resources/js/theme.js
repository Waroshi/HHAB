// ============================================================
// 貼り付け先: resources/js/theme.js（新規作成）
// 役割: ダーク/ライトテーマの状態管理。
//       設定機能案の「ページに飛ばず矢印ですぐ選択できる」を実現するため、
//       テーマの状態はこのフックに一元化し、html の dark クラスを切り替える。
// ============================================================
import { useEffect, useState } from 'react';

const THEME_STORAGE_KEY = 'hhab-theme';

// テーマの選択肢。メニュー画面の矢印切り替えはこの配列の順に巡回する。
export const THEME_OPTIONS = [
    { value: 'light', label: 'ライト' },
    { value: 'dark',  label: 'ダーク' },
];

// 初回表示時のテーマを決める。
// 保存済みの設定があればそれを使い、なければOSの設定に合わせる。
function getInitialTheme() {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
    if (savedTheme !== null) {
        return savedTheme;
    }

    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (prefersDark) {
        return 'dark';
    }
    return 'light';
}

export function useTheme() {
    const [theme, setTheme] = useState(getInitialTheme);

    // テーマが変わるたびに、画面への反映（htmlのクラス）と
    // 次回起動用の保存（localStorage）を同時に行う。
    useEffect(() => {
        const isDark = (theme === 'dark');
        document.documentElement.classList.toggle('dark', isDark);
        localStorage.setItem(THEME_STORAGE_KEY, theme);
    }, [theme]);

    return { theme, setTheme };
}

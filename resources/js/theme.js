import { useCallback, useEffect, useState } from 'react';

// 選択したテーマはブラウザに保存し、次回表示でも同じ設定を使う。
const THEME_STORAGE_KEY = 'hhab-theme';
const SYSTEM_DARK_MODE_QUERY = '(prefers-color-scheme: dark)';

export const THEME_OPTIONS = [
    { value: 'light', label: 'ライト' },
    { value: 'dark', label: 'ダーク' },
    { value: 'system', label: '端末設定' },
];

const THEME_VALUES = THEME_OPTIONS.map(({ value }) => value);

// 現在選ばれている設定と、端末テーマの監視を止める関数を共有する。
// 監視を重複登録しないため、モジュール内で1組だけ保持する。
let selectedTheme = 'system';
let stopWatchingSystemTheme = null;

// 想定外の値が渡された場合は、安全な初期値として端末設定を使う。
function normalizeTheme(theme) {
    return THEME_VALUES.includes(theme) ? theme : 'system';
}

export function getStoredTheme() {
    if (typeof window === 'undefined') {
        return 'system';
    }

    try {
        return normalizeTheme(window.localStorage.getItem(THEME_STORAGE_KEY));
    } catch {
        // 保存領域を利用できない環境でも、端末設定で表示を続ける。
        return 'system';
    }
}

// 「端末設定」が選ばれている場合だけ、ブラウザの配色設定を確認する。
export function resolveTheme(theme) {
    const normalizedTheme = normalizeTheme(theme);

    if (normalizedTheme !== 'system') {
        return normalizedTheme;
    }

    if (
        typeof window === 'undefined' ||
        typeof window.matchMedia !== 'function'
    ) {
        return 'light';
    }

    return window.matchMedia(SYSTEM_DARK_MODE_QUERY).matches
        ? 'dark'
        : 'light';
}

export function applyTheme(theme) {
    selectedTheme = normalizeTheme(theme);
    const resolvedTheme = resolveTheme(selectedTheme);

    if (typeof document !== 'undefined') {
        // Tailwind の dark: クラスとブラウザ標準UIの配色をそろえる。
        document.documentElement.classList.toggle(
            'dark',
            resolvedTheme === 'dark',
        );
        document.documentElement.style.colorScheme = resolvedTheme;
    }

    return resolvedTheme;
}

export function setStoredTheme(theme) {
    const normalizedTheme = normalizeTheme(theme);

    if (typeof window !== 'undefined') {
        try {
            window.localStorage.setItem(
                THEME_STORAGE_KEY,
                normalizedTheme,
            );
        } catch {
            // 保存できなくても、この表示中は選択されたテーマを適用する。
        }
    }

    return normalizedTheme;
}

function watchSystemTheme() {
    if (
        stopWatchingSystemTheme ||
        typeof window === 'undefined' ||
        typeof window.matchMedia !== 'function'
    ) {
        return;
    }

    const mediaQuery = window.matchMedia(SYSTEM_DARK_MODE_QUERY);

    // 端末設定を選択中のときだけ、OS側のテーマ変更を画面へ反映する。
    const handleSystemThemeChange = () => {
        if (selectedTheme === 'system') {
            applyTheme('system');
        }
    };

    if (typeof mediaQuery.addEventListener === 'function') {
        mediaQuery.addEventListener('change', handleSystemThemeChange);
    } else {
        mediaQuery.addListener(handleSystemThemeChange);
    }

    const cleanup = () => {
        // 新旧ブラウザそれぞれの方法で、登録した監視を解除する。
        if (typeof mediaQuery.removeEventListener === 'function') {
            mediaQuery.removeEventListener('change', handleSystemThemeChange);
        } else {
            mediaQuery.removeListener(handleSystemThemeChange);
        }

        window.removeEventListener('pagehide', cleanup);
        stopWatchingSystemTheme = null;
    };

    // 画面を閉じる・移動するタイミングで監視を解除する。
    window.addEventListener('pagehide', cleanup, { once: true });
    stopWatchingSystemTheme = cleanup;
}

export function initializeTheme() {
    // 起動時に保存済みテーマを適用し、端末設定の変更監視を始める。
    const storedTheme = getStoredTheme();

    applyTheme(storedTheme);
    watchSystemTheme();

    return storedTheme;
}

export function useTheme() {
    const [theme, setThemeState] = useState(getStoredTheme);

    useEffect(() => {
        // React側の選択値が変わったときも、html要素へ反映する。
        applyTheme(theme);
    }, [theme]);

    const setTheme = useCallback((nextTheme) => {
        const storedTheme = setStoredTheme(nextTheme);

        applyTheme(storedTheme);
        setThemeState(storedTheme);
    }, []);

    return { theme, setTheme };
}

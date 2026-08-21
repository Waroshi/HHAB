import { useCallback, useEffect, useState } from 'react';

const THEME_STORAGE_KEY = 'hhab-theme';
const SYSTEM_DARK_MODE_QUERY = '(prefers-color-scheme: dark)';

export const THEME_OPTIONS = [
    { value: 'light', label: 'ライト' },
    { value: 'dark', label: 'ダーク' },
    { value: 'system', label: '端末設定' },
];

const THEME_VALUES = THEME_OPTIONS.map(({ value }) => value);

let selectedTheme = 'system';
let stopWatchingSystemTheme = null;

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
        return 'system';
    }
}

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
            // Apply the selected theme for this session even if storage is unavailable.
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
        if (typeof mediaQuery.removeEventListener === 'function') {
            mediaQuery.removeEventListener('change', handleSystemThemeChange);
        } else {
            mediaQuery.removeListener(handleSystemThemeChange);
        }

        window.removeEventListener('pagehide', cleanup);
        stopWatchingSystemTheme = null;
    };

    window.addEventListener('pagehide', cleanup, { once: true });
    stopWatchingSystemTheme = cleanup;
}

export function initializeTheme() {
    const storedTheme = getStoredTheme();

    applyTheme(storedTheme);
    watchSystemTheme();

    return storedTheme;
}

export function useTheme() {
    const [theme, setThemeState] = useState(getStoredTheme);

    useEffect(() => {
        applyTheme(theme);
    }, [theme]);

    const setTheme = useCallback((nextTheme) => {
        const storedTheme = setStoredTheme(nextTheme);

        applyTheme(storedTheme);
        setThemeState(storedTheme);
    }, []);

    return { theme, setTheme };
}

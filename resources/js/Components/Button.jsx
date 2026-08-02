const BUTTON_VARIANT_CLASS_NAMES = {
    primary: `w-full h-13 rounded-2xl bg-brand-500 text-white text-base font-bold
              flex items-center justify-center gap-2
              shadow-[0_4px_14px_rgba(34,160,107,0.35)]
              transition active:scale-[0.98] active:bg-brand-600
              disabled:opacity-40 disabled:shadow-none`,
    secondary: `w-full h-13 rounded-2xl bg-transparent text-brand-600 dark:text-brand-300
                text-base font-bold flex items-center justify-center
                border border-brand-200 dark:border-brand-700
                transition active:scale-[0.98] active:bg-brand-50 dark:active:bg-brand-800/30`,
    dangerGhost: `w-full h-13 rounded-2xl bg-expense/10 text-expense text-base font-bold
                  flex items-center justify-center gap-2 transition active:scale-[0.98]`,
};

export default function Button({
    children,
    variant = 'primary',
    className = '',
    ...props
}) {
    const variantClassName =
        BUTTON_VARIANT_CLASS_NAMES[variant] ??
        BUTTON_VARIANT_CLASS_NAMES.primary;

    return (
        <button
            className={`${variantClassName} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
}

import { forwardRef, useEffect, useImperativeHandle, useRef } from 'react';

// 親コンポーネントから ref.focus() を呼べる共通入力欄。
// 実際の input 要素は localRef で保持し、必要な操作だけを外へ公開する。
export default forwardRef(function TextInput(
    { type = 'text', className = '', isFocused = false, ...props },
    ref,
) {
    const localRef = useRef(null);

    // 親へ DOM 全体を渡さず、フォーカス操作だけを提供する。
    useImperativeHandle(ref, () => ({
        focus: () => localRef.current?.focus(),
    }));

    // isFocused が有効になったタイミングで入力欄へフォーカスする。
    useEffect(() => {
        if (isFocused) {
            localRef.current?.focus();
        }
    }, [isFocused]);

    return (
        <input
            {...props}
            type={type}
            className={
                'rounded-md border-gray-300 shadow-sm ' +
                'focus:border-indigo-500 focus:ring-indigo-500 ' +
                'dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 ' +
                'dark:placeholder-neutral-500 dark:focus:border-brand-400 ' +
                'dark:focus:ring-brand-400 dark:disabled:bg-neutral-800 ' +
                'dark:disabled:text-neutral-500 ' +
                className
            }
            ref={localRef}
        />
    );
});

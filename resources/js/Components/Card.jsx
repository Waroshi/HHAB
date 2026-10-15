// as で指定された要素を使い、画面間で共通のカード外観を付ける。
// 呼び出し側の className は最後に足すため、画面固有の余白なども指定できる。
export default function Card({
    as: Element = 'div',
    children,
    className = '',
    ...props
}) {
    return (
        <Element
            className={`bg-white dark:bg-neutral-900 rounded-2xl
                        shadow-[0_1px_3px_rgba(0,0,0,0.06)] dark:shadow-none
                        dark:border dark:border-neutral-800 ${className}`}
            {...props}
        >
            {children}
        </Element>
    );
}

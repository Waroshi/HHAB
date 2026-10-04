import {
    Dialog,
    DialogPanel,
    DialogTitle,
    Transition,
    TransitionChild,
} from '@headlessui/react';
import { useRef } from 'react';
import MenuContent from '@/Components/MenuContent';

function focusDestination() {
    // 成功した遷移先を使う。閉じる際のフォーカス復帰が終わってから移す。
    requestAnimationFrame(() => {
        const destination = document.querySelector('main');
        // ログイン画面など本文のない画面では、既存の入力フォーカスを尊重する。
        if (!destination) return;

        destination.focus({ preventScroll: true });
    });
}

export default function SideMenu({ onClose }) {
    const closeButtonRef = useRef(null);

    return (
        // 開くときだけ動かす。閉じるときは即座に背景の操作制限を解除する。
        <Transition appear show>
            <Dialog
                id="side-menu"
                onClose={onClose}
                initialFocus={closeButtonRef}
                className="relative z-[100]"
            >
                <TransitionChild
                    enter="transition-opacity duration-200 motion-reduce:transition-none"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                >
                    <div className="fixed inset-0 bg-black/30 dark:bg-black/50" />
                </TransitionChild>

                <div className="fixed inset-0 flex justify-end">
                    <TransitionChild
                        enter="transition-transform duration-200 ease-out motion-reduce:transition-none"
                        enterFrom="translate-x-full motion-reduce:translate-x-0"
                        enterTo="translate-x-0"
                    >
                        <DialogPanel className="flex h-dvh w-[90vw] max-w-[360px] flex-col overflow-hidden rounded-l-2xl border-l border-neutral-200 bg-neutral-50 text-neutral-900 shadow-xl dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-100">
                            <div className="flex shrink-0 items-center justify-between border-b border-neutral-200 bg-white px-4 py-3 dark:border-neutral-800 dark:bg-neutral-900">
                                <DialogTitle className="text-lg font-bold">
                                    メニュー
                                </DialogTitle>
                                <button
                                    ref={closeButtonRef}
                                    type="button"
                                    onClick={onClose}
                                    aria-label="メニューを閉じる"
                                    className="flex size-11 items-center justify-center rounded-xl text-neutral-500 hover:bg-neutral-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 dark:text-neutral-300 dark:hover:bg-neutral-800 dark:focus-visible:ring-brand-300"
                                >
                                    <svg aria-hidden="true" className="size-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="m6 6 12 12M6 18 18 6" strokeLinecap="round" />
                                    </svg>
                                </button>
                            </div>
                            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-4 pb-[max(1.5rem,env(safe-area-inset-bottom))]">
                                <MenuContent onNavigateStart={onClose} onNavigate={focusDestination} />
                            </div>
                        </DialogPanel>
                    </TransitionChild>
                </div>
            </Dialog>
        </Transition>
    );
}

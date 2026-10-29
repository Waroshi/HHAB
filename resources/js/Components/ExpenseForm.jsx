import InputLabel from '@/Components/InputLabel';
import TextInput from '@/Components/TextInput';

export const CATEGORY_OPTIONS = ['食費', '日用品', '交通費', '娯楽', 'その他'];
export const PAYMENT_METHOD_OPTIONS = [
    '現金',
    'クレジットカード',
    '電子マネー',
    'その他',
];

export default function ExpenseForm({
    values,
    onChange,
    isEditing,
    basicHeading,
    otherHeading,
    storeLabel = '店舗名',
    isManual = false,
    errors = {},
}) {
    return (
        <>
            <section className="min-w-0 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                {basicHeading}

                <div className="mt-4 space-y-4">
                    <div className="min-w-0">
                        <InputLabel
                            htmlFor="storeName"
                            value={isManual ? `${storeLabel}（任意）` : storeLabel}
                        />
                        {isManual && (
                            <p id="storeName-example" className="mt-1 text-xs text-neutral-500 dark:text-neutral-400">例：Amazon、Netflix</p>
                        )}
                        <TextInput
                            id="storeName"
                            aria-describedby={isManual ? 'storeName-example' : undefined}
                            value={values.storeName}
                            onChange={(event) =>
                                onChange(
                                    'storeName',
                                    event.target.value,
                                )
                            }
                            readOnly={!isEditing}
                            className="mt-1 block min-h-11 w-full min-w-0 break-words read-only:bg-neutral-100 read-only:text-neutral-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 dark:read-only:bg-neutral-800 dark:read-only:text-neutral-300 dark:focus-visible:ring-brand-300"
                        />
                    </div>

                    <div className="min-w-0">
                        <InputLabel htmlFor="purchasedAt" value={isManual ? '日付（必須）' : '日付'} />
                        <TextInput
                            id="purchasedAt"
                            required={isManual}
                            aria-invalid={Boolean(errors.purchasedAt)}
                            aria-describedby={errors.purchasedAt ? 'purchasedAt-error' : undefined}
                            type="date"
                            value={values.purchasedAt}
                            onChange={(event) =>
                                onChange(
                                    'purchasedAt',
                                    event.target.value,
                                )
                            }
                            readOnly={!isEditing}
                            className="mt-1 block min-h-11 w-full min-w-0 read-only:bg-neutral-100 read-only:text-neutral-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 dark:read-only:bg-neutral-800 dark:read-only:text-neutral-300 dark:focus-visible:ring-brand-300"
                        />
                        {errors.purchasedAt && (
                            <p id="purchasedAt-error" className="mt-1 text-sm text-red-700 dark:text-red-300">{errors.purchasedAt}</p>
                        )}
                    </div>
                </div>
            </section>

            <section className="min-w-0 rounded-2xl border border-brand-200 bg-brand-50 p-4 shadow-sm dark:border-brand-800 dark:bg-brand-800/20">
                <InputLabel
                    htmlFor="totalAmount"
                    value={isManual ? '合計金額（必須）' : '合計金額'}
                    className="font-bold text-brand-800 dark:text-brand-200"
                />
                <div className="relative mt-2 min-w-0">
                    <span
                        aria-hidden="true"
                        className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-xl font-bold text-brand-700 dark:text-brand-200"
                    >
                        ¥
                    </span>
                    <TextInput
                        id="totalAmount"
                        required={isManual}
                        aria-invalid={Boolean(errors.totalAmount)}
                        aria-describedby={errors.totalAmount ? 'totalAmount-error' : undefined}
                        type={isManual ? 'text' : 'number'}
                        inputMode={isManual ? 'numeric' : undefined}
                        min={isManual ? undefined : '0'}
                        value={values.totalAmount}
                        onChange={(event) =>
                            onChange(
                                'totalAmount',
                                event.target.value,
                            )
                        }
                        readOnly={!isEditing}
                        className="block min-h-12 w-full min-w-0 pl-8 text-xl font-bold tabular-nums text-brand-800 read-only:bg-white read-only:text-brand-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 dark:read-only:bg-neutral-900 dark:read-only:text-brand-200 dark:focus-visible:ring-brand-300"
                    />
                </div>
                {errors.totalAmount && (
                    <p id="totalAmount-error" className="mt-1 text-sm text-red-700 dark:text-red-300">{errors.totalAmount}</p>
                )}
            </section>

            <section className="min-w-0 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900">
                {otherHeading}

                <div className="mt-4 space-y-4">
                    <div className="min-w-0">
                        <InputLabel htmlFor="category" value={isManual ? 'カテゴリ（必須）' : 'カテゴリ'} />
                        <select
                            id="category"
                            required={isManual}
                            aria-invalid={Boolean(errors.category)}
                            aria-describedby={errors.category ? 'category-error' : undefined}
                            value={values.category}
                            onChange={(event) =>
                                onChange(
                                    'category',
                                    event.target.value,
                                )
                            }
                            disabled={!isEditing}
                            className="mt-1 block min-h-11 w-full min-w-0 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 disabled:bg-neutral-100 disabled:text-neutral-700 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:focus:border-brand-400 dark:focus:ring-brand-400 dark:focus-visible:ring-brand-300 dark:disabled:bg-neutral-800 dark:disabled:text-neutral-300"
                        >
                            {isManual && <option value="">選択してください</option>}
                            {CATEGORY_OPTIONS.map((category) => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                        {errors.category && (
                            <p id="category-error" className="mt-1 text-sm text-red-700 dark:text-red-300">{errors.category}</p>
                        )}
                    </div>

                    <div className="min-w-0">
                        <InputLabel
                            htmlFor="paymentMethod"
                            value={isManual ? '支払い方法（必須）' : '支払い方法'}
                        />
                        <select
                            id="paymentMethod"
                            required={isManual}
                            aria-invalid={Boolean(errors.paymentMethod)}
                            aria-describedby={errors.paymentMethod ? 'paymentMethod-error' : undefined}
                            value={values.paymentMethod}
                            onChange={(event) =>
                                onChange(
                                    'paymentMethod',
                                    event.target.value,
                                )
                            }
                            disabled={!isEditing}
                            className="mt-1 block min-h-11 w-full min-w-0 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 disabled:bg-neutral-100 disabled:text-neutral-700 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:focus:border-brand-400 dark:focus:ring-brand-400 dark:focus-visible:ring-brand-300 dark:disabled:bg-neutral-800 dark:disabled:text-neutral-300"
                        >
                            {isManual && <option value="">選択してください</option>}
                            {PAYMENT_METHOD_OPTIONS.map(
                                (paymentMethod) => (
                                    <option
                                        key={paymentMethod}
                                        value={paymentMethod}
                                    >
                                        {paymentMethod}
                                    </option>
                                ),
                            )}
                        </select>
                        {errors.paymentMethod && (
                            <p id="paymentMethod-error" className="mt-1 text-sm text-red-700 dark:text-red-300">{errors.paymentMethod}</p>
                        )}
                    </div>

                    <div className="min-w-0">
                        <InputLabel htmlFor="memo" value={isManual ? 'メモ（任意）' : 'メモ'} />
                        <textarea
                            id="memo"
                            rows="4"
                            value={values.memo}
                            onChange={(event) =>
                                onChange('memo', event.target.value)
                            }
                            readOnly={!isEditing}
                            className="mt-1 block min-h-28 w-full min-w-0 resize-y rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 read-only:bg-neutral-100 read-only:text-neutral-700 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:focus:border-brand-400 dark:focus:ring-brand-400 dark:focus-visible:ring-brand-300 dark:read-only:bg-neutral-800 dark:read-only:text-neutral-300"
                        />
                    </div>
                </div>
            </section>

        </>
    );
}

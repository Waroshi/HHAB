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
    // 共通入力部品の既定色を、手入力時だけ上書きする。
    const manualInputClass = 'block w-full min-w-0 !rounded-[10px] border !border-[#7c8981] !bg-white !text-[#202923] !shadow-none dark:!border-[#83978b] dark:!bg-[#19201c] dark:!text-[#eef4f0] placeholder:text-[13px] placeholder:font-normal placeholder:!text-[#526158] placeholder:opacity-100 dark:placeholder:!text-[#b3c0b7] aria-[invalid=true]:!border-red-700 dark:aria-[invalid=true]:!border-red-300 focus:outline focus:outline-2 focus:outline-offset-[3px] focus:outline-brand-700 focus:!ring-0 focus:!border-brand-700 dark:focus:outline-brand-200 dark:focus:!border-brand-200 mt-2 min-h-11 text-base';
    const manualAmountClass = 'block w-full min-w-0 !rounded-[10px] border !border-[#7c8981] !bg-brand-50 !text-brand-700 !shadow-none dark:!border-[#83978b] dark:!bg-[#24392d] dark:!text-brand-200 placeholder:text-[28px] placeholder:font-bold placeholder:!text-brand-700 placeholder:opacity-100 dark:placeholder:!text-brand-200 aria-[invalid=true]:!border-red-700 dark:aria-[invalid=true]:!border-red-300 focus:outline focus:outline-2 focus:outline-offset-[3px] focus:outline-brand-700 focus:!ring-0 focus:!border-brand-700 dark:focus:outline-brand-200 dark:focus:!border-brand-200 mt-0 min-h-[60px] pl-[38px] text-[28px] leading-7 font-bold tabular-nums tracking-tight';
    const manualLabelClass = '!text-[13px] !font-medium !text-[#202923] dark:!text-[#eef4f0]';
    const manualErrorClass = 'mt-1 text-xs leading-[1.7] text-red-700 dark:text-red-300';

    function fieldLabel(text, required = false) {
        if (!isManual) return text;
        return (
            <span className="flex items-center gap-2">
                {text}
                <span className="text-[10px] font-normal text-[#526158] dark:text-[#b3c0b7]">{required ? '必須' : '任意'}</span>
            </span>
        );
    }

    const amountSection = (
        <section className={isManual ? "p-5" : "min-w-0 rounded-2xl border border-brand-200 bg-brand-50 p-4 shadow-sm dark:border-brand-800 dark:bg-brand-800/20"}>
            <InputLabel
                htmlFor="totalAmount"
                value={fieldLabel('合計金額', true)}
                className={isManual ? manualLabelClass : "font-bold text-brand-800 dark:text-brand-200"}
            />
            <div className="relative mt-2 min-w-0">
                <span
                    aria-hidden="true"
                    className={isManual ? "pointer-events-none absolute inset-y-0 left-4 flex items-center text-2xl font-bold text-brand-700 dark:text-brand-200" : "pointer-events-none absolute inset-y-0 left-3 flex items-center text-xl font-bold text-brand-700 dark:text-brand-200"}
                >
                    ¥
                </span>
                <TextInput
                    id="totalAmount"
                    placeholder={isManual ? '0' : undefined}
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
                    className={isManual ? manualAmountClass : "block min-h-12 w-full min-w-0 pl-8 text-xl font-bold tabular-nums text-brand-800 read-only:bg-white read-only:text-brand-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 dark:read-only:bg-neutral-900 dark:read-only:text-brand-200 dark:focus-visible:ring-brand-300"}
                />
            </div>
            {errors.totalAmount && (
                <p id="totalAmount-error" className={isManual ? manualErrorClass : "mt-1 text-sm text-red-700 dark:text-red-300"}>{errors.totalAmount}</p>
            )}
        </section>
    );

    return (
        <>
            {isManual && amountSection}
            <section className={isManual ? "border-t p-5 border-[#dce3de] dark:border-[#35473b]" : "min-w-0 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900"}>
                {basicHeading}

                <div className={isManual ? "mt-4 grid gap-4" : "mt-4 space-y-4"}>
                    <div className="min-w-0">
                        <InputLabel className={isManual ? manualLabelClass : undefined}
                            htmlFor="storeName"
                            value={fieldLabel(storeLabel)}
                        />
                        <TextInput
                            id="storeName"
                            placeholder={isManual ? '例：スーパー、オンラインストア' : undefined}
                            value={values.storeName}
                            onChange={(event) =>
                                onChange(
                                    'storeName',
                                    event.target.value,
                                )
                            }
                            readOnly={!isEditing}
                            className={isManual ? manualInputClass : "mt-1 block min-h-11 w-full min-w-0 break-words read-only:bg-neutral-100 read-only:text-neutral-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 dark:read-only:bg-neutral-800 dark:read-only:text-neutral-300 dark:focus-visible:ring-brand-300"}
                        />
                    </div>

                    <div className="min-w-0">
                        <InputLabel className={isManual ? manualLabelClass : undefined} htmlFor="purchasedAt" value={fieldLabel('日付', true)} />
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
                            className={isManual ? manualInputClass : "mt-1 block min-h-11 w-full min-w-0 read-only:bg-neutral-100 read-only:text-neutral-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 dark:read-only:bg-neutral-800 dark:read-only:text-neutral-300 dark:focus-visible:ring-brand-300"}
                        />
                        {errors.purchasedAt && (
                            <p id="purchasedAt-error" className={isManual ? manualErrorClass : "mt-1 text-sm text-red-700 dark:text-red-300"}>{errors.purchasedAt}</p>
                        )}
                    </div>
                </div>
            </section>

            {!isManual && amountSection}

            <section className={isManual ? "border-t p-5 border-[#dce3de] dark:border-[#35473b]" : "min-w-0 rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm dark:border-neutral-800 dark:bg-neutral-900"}>
                {otherHeading}

                <div className={isManual ? "mt-4 grid gap-4" : "mt-4 space-y-4"}>
                    <div className="min-w-0">
                        <InputLabel className={isManual ? manualLabelClass : undefined} htmlFor="category" value={fieldLabel('カテゴリ', true)} />
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
                            className={isManual ? manualInputClass : "mt-1 block min-h-11 w-full min-w-0 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 disabled:bg-neutral-100 disabled:text-neutral-700 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:focus:border-brand-400 dark:focus:ring-brand-400 dark:focus-visible:ring-brand-300 dark:disabled:bg-neutral-800 dark:disabled:text-neutral-300"}
                        >
                            {isManual && <option value="">選択してください</option>}
                            {CATEGORY_OPTIONS.map((category) => (
                                <option key={category} value={category}>
                                    {category}
                                </option>
                            ))}
                        </select>
                        {errors.category && (
                            <p id="category-error" className={isManual ? manualErrorClass : "mt-1 text-sm text-red-700 dark:text-red-300"}>{errors.category}</p>
                        )}
                    </div>

                    <div className="min-w-0">
                        <InputLabel className={isManual ? manualLabelClass : undefined}
                            htmlFor="paymentMethod"
                            value={fieldLabel('支払い方法', true)}
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
                            className={isManual ? manualInputClass : "mt-1 block min-h-11 w-full min-w-0 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 disabled:bg-neutral-100 disabled:text-neutral-700 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:focus:border-brand-400 dark:focus:ring-brand-400 dark:focus-visible:ring-brand-300 dark:disabled:bg-neutral-800 dark:disabled:text-neutral-300"}
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
                            <p id="paymentMethod-error" className={isManual ? manualErrorClass : "mt-1 text-sm text-red-700 dark:text-red-300"}>{errors.paymentMethod}</p>
                        )}
                    </div>

                    <div className="min-w-0">
                        <InputLabel className={isManual ? manualLabelClass : undefined} htmlFor="memo" value={fieldLabel('メモ')} />
                        <textarea
                            id="memo"
                            rows={isManual ? 3 : 4}
                            value={values.memo}
                            onChange={(event) =>
                                onChange('memo', event.target.value)
                            }
                            readOnly={!isEditing}
                            className={isManual ? manualInputClass + ' min-h-24 resize-y' : "mt-1 block min-h-28 w-full min-w-0 resize-y rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 read-only:bg-neutral-100 read-only:text-neutral-700 dark:border-neutral-700 dark:bg-neutral-900 dark:text-neutral-100 dark:focus:border-brand-400 dark:focus:ring-brand-400 dark:focus-visible:ring-brand-300 dark:read-only:bg-neutral-800 dark:read-only:text-neutral-300"}
                        />
                    </div>
                </div>
            </section>

        </>
    );
}

import { forwardRef } from "react";

export default forwardRef(function Select(
    { options = [], value = "", onChange, placeholder = "Pilih opsi", className = "", ...props },
    ref
) {
    return (
        <select
            ref={ref}
            value={value}
            onChange={onChange}
            {...props}
            className={
                "rounded-md border-gray-300 text-gray-900 placeholder-gray-400 " +
                "shadow-sm focus:border-indigo-500 focus:ring-indigo-500 " +
                "dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:placeholder-gray-400 " +
                "dark:focus:border-indigo-600 dark:focus:ring-indigo-600 " +
                "transition-all duration-150 " +
                className
            }
        >
            {/* Placeholder / default option */}
            <option value="">{placeholder}</option>

            {/* Render semua opsi dari props */}
            {options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                    {opt.label}
                </option>
            ))}
        </select>
    );
});

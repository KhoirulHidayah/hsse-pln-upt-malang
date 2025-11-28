import { forwardRef, useRef, useImperativeHandle, useEffect } from "react";

export default forwardRef(function SelectInput(
    { className = "", children, isFocused = false, ...props },
    ref
) {
    const localRef = useRef(null);

    useImperativeHandle(ref, () => ({
        focus: () => localRef.current?.focus(),
    }));

    useEffect(() => {
        if (isFocused) {
            localRef.current?.focus();
        }
    }, [isFocused]);

    return (
        <select
            {...props}
            ref={localRef}
            className={
                "rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 " +
                "dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 " +
                "dark:focus:border-indigo-600 dark:focus:ring-indigo-600 " +
                className
            }
        >
            {children}
        </select>
    );
});

import { router } from "@inertiajs/react";

export default function Pagination({ links }) {
    if (!links || links.length === 0) return null;

    return (
        <div className="mt-4 flex gap-2 flex-wrap">
            {links.map((link, index) => (
                <button
                    key={index}
                    onClick={(e) => {
                        e.preventDefault();
                        if (!link.url) return;
                        router.get(link.url, {}, { preserveScroll: true, preserveState: true });
                    }}
                    dangerouslySetInnerHTML={{ __html: link.label }}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                        link.active
                            ? "bg-gradient-to-r from-cyan-600 to-teal-600 text-white shadow-md"
                            : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                    } ${!link.url ? "opacity-50 cursor-not-allowed" : ""}`}
                />
            ))}
        </div>
    );
}
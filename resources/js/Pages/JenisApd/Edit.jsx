import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextAreaInput from "@/Components/TextAreaInput";
import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, Link } from "@inertiajs/react";
// 🔄 Update Import: Ganti Heroicons ke Lucide-react
import { Pencil, X, Save } from "lucide-react"; 

export default function Edit({ auth, jenisApd }) {
    const { data, setData, put, errors, processing, reset } = useForm({
        nama_jenis: jenisApd.nama_jenis || "",
        deskripsi: jenisApd.deskripsi || "",
    });

    // Style konsisten untuk input, select, dan date
    const inputStyle = "mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 dark:focus:border-cyan-400 dark:focus:ring-cyan-400 text-sm h-9";
    const textareaStyle = "mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 dark:focus:border-cyan-400 dark:focus:ring-cyan-400 min-h-[100px] text-sm";
    const labelStyle = "text-sm font-medium text-gray-700 dark:text-gray-300";


    const onSubmit = (e) => {
        e.preventDefault();
        put(route("jenis-apd.update", jenisApd.id), {
            preserveScroll: true,
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                // 🔄 Header Style Konsisten (Gradient Icon)
                <div className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-teal-600 shadow-md">
                        <Pencil className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <h2 className="text-base font-semibold text-gray-800 dark:text-gray-200">
                            Edit Jenis APD
                        </h2>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400">
                            Perbarui data jenis APD
                        </p>
                    </div>
                </div>
            }
        >
            <Head title="Edit Jenis APD" />

            {/* 📐 Layout Adjustment: py-12 -> py-2 */}
            <div className="py-2">
                {/* 📐 PENTING: Mengubah max-w-4xl menjadi max-w-7xl agar space kanan kiri lebih terisi, seperti Create file */}
                <div className="mx-auto max-w-7xl sm:px-2 lg:px-2">
                    <div className="overflow-hidden bg-white shadow-md sm:rounded-lg dark:bg-gray-800">
                        {/* Padding container: p-6 -> p-3 */}
                        <div className="p-3 text-gray-900 dark:text-gray-100">
                            <form
                                onSubmit={onSubmit}
                                className="space-y-4" 
                            >
                                {/* Input: Nama Jenis APD */}
                                <div>
                                    <InputLabel
                                        htmlFor="nama_jenis"
                                        value="Nama Jenis APD"
                                        className={labelStyle} 
                                    />
                                    <TextInput
                                        id="nama_jenis"
                                        type="text"
                                        name="nama_jenis"
                                        value={data.nama_jenis}
                                        className={inputStyle} 
                                        isFocused={true}
                                        onChange={(e) =>
                                            setData("nama_jenis", e.target.value)
                                        }
                                    />
                                    <InputError
                                        message={errors.nama_jenis}
                                        className="mt-1" 
                                    />
                                </div>

                                {/* Input: Deskripsi */}
                                <div className="mt-4">
                                    <InputLabel
                                        htmlFor="deskripsi"
                                        value="Deskripsi"
                                        className={labelStyle} 
                                    />
                                    <TextAreaInput
                                        id="deskripsi"
                                        name="deskripsi"
                                        value={data.deskripsi}
                                        className={textareaStyle} 
                                        onChange={(e) =>
                                            setData("deskripsi", e.target.value)
                                        }
                                    />
                                    <InputError
                                        message={errors.deskripsi}
                                        className="mt-1" 
                                    />
                                </div>

                                {/* Tombol Aksi */}
                                <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-200 dark:border-gray-700">
                                    <Link
                                        href={route("jenis-apd.index")}
                                        // 🎨 Style Batal Konsisten
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 transition-all"
                                    >
                                        <X className="h-4 w-4" />
                                        Batal
                                    </Link>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        // 🎨 Style Simpan/Perbarui Konsisten (Gradient)
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-gradient-to-r from-cyan-600 to-teal-600 rounded-lg shadow-md hover:from-cyan-700 hover:to-teal-700 transition-all disabled:opacity-50"
                                    >
                                        <Save className="h-4 w-4" />
                                        Perbarui
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
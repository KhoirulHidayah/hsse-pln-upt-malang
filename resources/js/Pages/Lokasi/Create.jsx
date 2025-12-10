import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, Link } from "@inertiajs/react";
// Mengganti import icon lama dengan lucide-react untuk konsistensi
import { MapPin, Plus, X, Save } from "lucide-react"; 

export default function Create({ auth }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        nama_lokasi: "",
    });

    const onSubmit = (e) => {
        e.preventDefault();
        post(route("lokasi.store"), {
            onSuccess: () => reset(),
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                // 🔄 Header style baru (menggunakan ikon MapPin untuk identitas, atau Plus untuk operasi)
                <div className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-teal-600 shadow-md">
                        {/* Menggunakan ikon Plus sebagai tanda operasi 'Tambah' */}
                        <Plus className="h-5 w-5 text-white" /> 
                    </div>
                    <div>
                        <h2 className="text-base font-semibold text-gray-800 dark:text-gray-200">
                            Tambah Lokasi
                        </h2>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400">
                            Tambah data lokasi baru
                        </p>
                    </div>
                </div>
            }
        >
            <Head title="Tambah Lokasi" />

            {/* 📐 Layout dan Spacing baru */}
            <div className="py-2">
                {/* PERUBAHAN: Mengubah max-w-3xl menjadi max-w-7xl dan menyesuaikan padding */}
                <div className="mx-auto max-w-7xl sm:px-2 lg:px-2">
                    <div className="overflow-hidden bg-white shadow-md sm:rounded-lg dark:bg-gray-800">
                        <div className="p-3 text-gray-900 dark:text-gray-100">
                            <form
                                onSubmit={onSubmit}
                                className="space-y-4" // Mengganti space-y-6 menjadi space-y-4 untuk konsistensi
                            >
                                {/* 🏷️ Nama Lokasi */}
                                <div className="space-y-3">
                                    <div>
                                        <InputLabel
                                            htmlFor="nama_lokasi"
                                            value="Nama Lokasi"
                                            className="text-sm font-medium text-gray-700 dark:text-gray-300"
                                        />
                                        <TextInput
                                            id="nama_lokasi"
                                            name="nama_lokasi"
                                            value={data.nama_lokasi}
                                            onChange={(e) =>
                                                setData("nama_lokasi", e.target.value)
                                            }
                                            // 🎨 Style input baru
                                            className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 dark:focus:border-cyan-400 dark:focus:ring-cyan-400 text-sm h-9"
                                            autoComplete="off"
                                            isFocused={true} // Fokus otomatis pada input pertama
                                            placeholder="Contoh: ULTG Krian"
                                        />
                                        <InputError
                                            message={errors.nama_lokasi}
                                            className="mt-1"
                                        />
                                    </div>
                                </div>

                                {/* Tombol Aksi - Style baru */}
                                <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-200 dark:border-gray-700">
                                    <Link
                                        href={route("lokasi.index")}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 transition-all"
                                    >
                                        <X className="h-4 w-4" />
                                        Batal
                                    </Link>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-gradient-to-r from-cyan-600 to-teal-600 rounded-lg shadow-md hover:from-cyan-700 hover:to-teal-700 transition-all disabled:opacity-50"
                                    >
                                        <Save className="h-4 w-4" />
                                        Simpan
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
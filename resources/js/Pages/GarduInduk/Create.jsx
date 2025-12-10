import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, Link } from "@inertiajs/react";
// Mengganti ikon dari heroicons ke lucide-react, serta menambahkan ikon aksi
import { MapPinned, Plus, X, Save } from "lucide-react"; 

export default function Create({ auth, lokasis }) {
    const { data, setData, post, errors, processing, reset } = useForm({
        lokasi_id: "",
        nama_gardu_induk: "",
    });

    const onSubmit = (e) => {
        e.preventDefault();
        post(route("gardu-induk.store"), {
            onSuccess: () => reset(),
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                // 🔄 Header Style Konsisten
                <div className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-teal-600 shadow-md">
                        <Plus className="h-5 w-5 text-white" /> 
                    </div>
                    <div>
                        <h2 className="text-base font-semibold text-gray-800 dark:text-gray-200">
                            Tambah Gardu Induk
                        </h2>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400">
                            Tambahkan data Gardu Induk baru
                        </p>
                    </div>
                </div>
            }
        >
            <Head title="Tambah Gardu Induk" />

            {/* 📐 Layout dan Spacing Konsisten */}
            <div className="py-2">
                {/* PERUBAHAN: Mengubah max-w-3xl ke max-w-7xl dan padding ke sm:px-2 lg:px-2 */}
                <div className="mx-auto max-w-7xl sm:px-2 lg:px-2">
                    <div className="overflow-hidden bg-white shadow-md sm:rounded-lg dark:bg-gray-800">
                        {/* PERUBAHAN: Mengubah p-6 menjadi p-3 */}
                        <div className="p-3 text-gray-900 dark:text-gray-100">
                            <form
                                onSubmit={onSubmit}
                                // Menghilangkan p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg
                                className="space-y-4" 
                            >
                                {/* Lokasi terkait */}
                                <div className="space-y-3">
                                    <div>
                                        <InputLabel 
                                            htmlFor="lokasi_id" 
                                            value="Lokasi" 
                                            className="text-sm font-medium text-gray-700 dark:text-gray-300"
                                        />
                                        <select
                                            id="lokasi_id"
                                            name="lokasi_id"
                                            value={data.lokasi_id}
                                            onChange={(e) => setData("lokasi_id", e.target.value)}
                                            // 🎨 Style select konsisten
                                            className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 dark:focus:border-cyan-400 dark:focus:ring-cyan-400 text-sm h-9"
                                        >
                                            <option value="">-- Pilih Lokasi --</option>
                                            {lokasis.map((lokasi) => (
                                                <option key={lokasi.lokasi_id} value={lokasi.lokasi_id}>
                                                    {lokasi.nama_lokasi}
                                                </option>
                                            ))}
                                        </select>
                                        <InputError message={errors.lokasi_id} className="mt-1" />
                                    </div>

                                    {/* Nama Gardu Induk */}
                                    <div>
                                        <InputLabel 
                                            htmlFor="nama_gardu_induk" 
                                            value="Nama Gardu Induk" 
                                            className="text-sm font-medium text-gray-700 dark:text-gray-300"
                                        />
                                        <TextInput
                                            id="nama_gardu_induk"
                                            type="text"
                                            name="nama_gardu_induk"
                                            value={data.nama_gardu_induk}
                                            onChange={(e) => setData("nama_gardu_induk", e.target.value)}
                                            // 🎨 Style input konsisten
                                            className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 dark:focus:border-cyan-400 dark:focus:ring-cyan-400 text-sm h-9"
                                            isFocused={true}
                                            placeholder="Contoh: GI Wiyung"
                                        />
                                        <InputError message={errors.nama_gardu_induk} className="mt-1" />
                                    </div>
                                </div>

                                {/* Tombol Simpan / Batal - Style konsisten */}
                                <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-200 dark:border-gray-700">
                                    <Link
                                        href={route("gardu-induk.index")}
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
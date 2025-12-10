import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, Link } from "@inertiajs/react";
// Ganti Heroicons ke Lucide-react dan tambahkan MapPin
import { Pencil, X, Save, MapPin } from "lucide-react"; 

export default function Edit({ auth, garduInduk, lokasis }) {
    const { data, setData, post, errors, processing } = useForm({
        _method: "PUT",
        lokasi_id: garduInduk.lokasi_id || "",
        nama_gardu_induk: garduInduk.nama_gardu_induk || "",
    });

    // Style konsisten untuk input/select
    const inputStyle = "mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 dark:focus:border-cyan-400 dark:focus:ring-cyan-400 text-sm h-9";
    const labelStyle = "text-sm font-medium text-gray-700 dark:text-gray-300";

    const onSubmit = (e) => {
        e.preventDefault();
        post(route("gardu-induk.update", garduInduk.gardu_induk_id));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                // Header Style Konsisten (Gradient Icon)
                <div className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-teal-600 shadow-md">
                        <Pencil className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <h2 className="text-base font-semibold text-gray-800 dark:text-gray-200">
                            Edit Gardu Induk
                        </h2>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400">
                            Perbarui data Gardu Induk
                        </p>
                    </div>
                </div>
            }
        >
            <Head title="Edit Gardu Induk" />

            {/* Layout Adjustment: py-12 -> py-2 */}
            <div className="py-2">
                {/* Mengubah max-w-3xl menjadi max-w-7xl */}
                <div className="mx-auto max-w-7xl sm:px-2 lg:px-2">
                    <div className="overflow-hidden bg-white shadow-md sm:rounded-lg dark:bg-gray-800">
                        {/* Padding container: p-6 -> p-3 */}
                        <div className="p-3 text-gray-900 dark:text-gray-100">
                            <form 
                                onSubmit={onSubmit} 
                                className="space-y-4" // Ganti space-y-6 menjadi space-y-4
                            >
                                {/* Pilih Lokasi */}
                                <div>
                                    <InputLabel 
                                        htmlFor="lokasi_id" 
                                        value="Lokasi" 
                                        className={labelStyle}
                                    />
                                    <select
                                        id="lokasi_id"
                                        name="lokasi_id"
                                        value={data.lokasi_id}
                                        onChange={(e) => setData("lokasi_id", e.target.value)}
                                        // Terapkan style konsisten pada select
                                        className={inputStyle} 
                                    >
                                        <option value="">-- Pilih Lokasi --</option>
                                        {lokasis.map((lokasi) => (
                                            <option 
                                                key={lokasi.lokasi_id} 
                                                value={lokasi.lokasi_id}
                                            >
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
                                        className={labelStyle}
                                    />
                                    <TextInput
                                        id="nama_gardu_induk"
                                        type="text"
                                        name="nama_gardu_induk"
                                        value={data.nama_gardu_induk}
                                        onChange={(e) => setData("nama_gardu_induk", e.target.value)}
                                        className={inputStyle} // Terapkan style konsisten
                                    />
                                    <InputError message={errors.nama_gardu_induk} className="mt-1" />
                                </div>

                                {/* Tombol Aksi */}
                                <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-200 dark:border-gray-700">
                                    <Link
                                        href={route("gardu-induk.index")}
                                        // Style Batal Konsisten
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 transition-all"
                                    >
                                        <X className="h-4 w-4" />
                                        Batal
                                    </Link>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        // Style Simpan/Perbarui Konsisten (Gradient)
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
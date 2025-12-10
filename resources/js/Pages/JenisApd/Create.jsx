import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextAreaInput from "@/Components/TextAreaInput";
import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, Link } from "@inertiajs/react";
import { Shield, Plus, X, Save } from "lucide-react";

export default function Create({ auth }) {
    const { data, setData, post, errors, reset } = useForm({
        nama_jenis: "",
        deskripsi: "",
    });

    const onSubmit = (e) => {
        e.preventDefault();
        post(route("jenis-apd.store"), {
            onSuccess: () => reset(),
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-teal-600 shadow-md">
                        <Plus className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <h2 className="text-base font-semibold text-gray-800 dark:text-gray-200">
                            Tambah Jenis APD
                        </h2>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400">
                            Buat kategori Alat Pelindung Diri baru
                        </p>
                    </div>
                </div>
            }
        >
            <Head title="Tambah Jenis APD" />

            <div className="py-2">
                {/* PERUBAHAN: Mengubah lebar maksimum dari max-w-3xl menjadi max-w-7xl agar mirip dengan Index.jsx */}
                <div className="mx-auto max-w-7xl sm:px-2 lg:px-2">
                    <div className="overflow-hidden bg-white shadow-md sm:rounded-lg dark:bg-gray-800">
                        <div className="p-3">
                            <form onSubmit={onSubmit} className="space-y-4">
                                <div className="space-y-3">
                                    <div>
                                        <InputLabel htmlFor="nama_jenis" value="Nama Jenis APD" className="text-sm font-medium text-gray-700 dark:text-gray-300" />
                                        <TextInput id="nama_jenis" type="text" name="nama_jenis" value={data.nama_jenis} className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 dark:focus:border-cyan-400 dark:focus:ring-cyan-400 text-sm h-9" isFocused={true} onChange={(e) => setData("nama_jenis", e.target.value)} placeholder="Contoh: Helm Safety, Sarung Tangan" />
                                        <InputError message={errors.nama_jenis} className="mt-1" />
                                    </div>

                                    <div>
                                        <InputLabel htmlFor="deskripsi" value="Deskripsi" className="text-sm font-medium text-gray-700 dark:text-gray-300" />
                                        <TextAreaInput id="deskripsi" name="deskripsi" value={data.deskripsi} className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 dark:focus:border-cyan-400 dark:focus:ring-cyan-400 min-h-[100px] text-sm" onChange={(e) => setData("deskripsi", e.target.value)} placeholder="Jelaskan fungsi dan kegunaan jenis APD ini..." />
                                        <InputError message={errors.deskripsi} className="mt-1" />
                                    </div>
                                </div>

                                <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-200 dark:border-gray-700">
                                    <Link href={route("jenis-apd.index")} className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 transition-all">
                                        <X className="h-4 w-4" />
                                        Batal
                                    </Link>
                                    <button type="submit" className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-white bg-gradient-to-r from-cyan-600 to-teal-600 rounded-lg shadow-md hover:from-cyan-700 hover:to-teal-700 transition-all">
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
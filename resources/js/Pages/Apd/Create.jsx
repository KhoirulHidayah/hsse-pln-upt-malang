import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextAreaInput from "@/Components/TextAreaInput";
import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, Link } from "@inertiajs/react";
import { useState } from "react";
// Mengganti icon dari heroicons ke lucide-react, serta menambahkan ikon aksi
import { HardHat, Plus, X, Save, Upload } from "lucide-react"; 

export default function Create({ auth, jenisApds }) {
    const [preview, setPreview] = useState(null);

    const { data, setData, post, errors, processing, reset } = useForm({
        jenis_id: "",
        nama_apd: "",
        kode_apd: "",
        deskripsi: "",
        gambar: null,
        bahan: "",
        warna: "",
        ukuran: "",
        kemampuan: "",
        fungsi: "",
        standar: "",
        masa_penggunaan: "",
    });

    const onSubmit = (e) => {
        e.preventDefault();
        post(route("apd.store"), {
            forceFormData: true,
            onSuccess: () => {
                reset();
                setPreview(null);
            },
        });
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData("gambar", file);
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result);
            reader.readAsDataURL(file);
        } else {
            setPreview(null);
        }
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
                            Tambah Data APD
                        </h2>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400">
                            Input data Alat Pelindung Diri (APD) baru
                        </p>
                    </div>
                </div>
            }
        >
            <Head title="Tambah APD" />

            {/* 📐 Layout dan Spacing Konsisten */}
            <div className="py-2">
                {/* PERUBAHAN: Mengubah max-w-4xl ke max-w-7xl dan padding ke sm:px-2 lg:px-2 */}
                <div className="mx-auto max-w-7xl sm:px-2 lg:px-2">
                    {/* PERUBAHAN: Menghilangkan bayangan dan padding dari div ini */}
                    <div className="overflow-hidden bg-white shadow-md sm:rounded-lg dark:bg-gray-800">
                        <div className="p-3 text-gray-900 dark:text-gray-100">

                            <form
                                onSubmit={onSubmit}
                                encType="multipart/form-data"
                                // Menghilangkan p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg
                                className="space-y-4"
                            >

                                {/* PREVIEW GAMBAR */}
                                <div className="text-center">
                                    {preview ? (
                                        <>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2 font-medium">Pratinjau Gambar</p>
                                            <img
                                                src={preview}
                                                alt="Preview"
                                                className="mx-auto w-40 h-40 object-cover rounded-lg border border-gray-300 dark:border-gray-600 shadow"
                                            />
                                        </>
                                    ) : (
                                        <div className="mx-auto w-40 h-40 flex items-center justify-center bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-dashed border-gray-300 dark:border-gray-600 shadow">
                                            <p className="text-sm text-gray-400 italic">Belum ada gambar</p>
                                        </div>
                                    )}

                                    <div className="mt-3 max-w-md mx-auto">
                                        <InputLabel htmlFor="gambar" value="Upload Gambar" className="text-sm font-medium text-gray-700 dark:text-gray-300" />
                                        <input
                                            id="gambar"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            // 🎨 Style input file konsisten
                                            className="mt-1 block w-full text-sm text-gray-700 dark:text-gray-300
                                                file:mr-4 file:py-1.5 file:px-3
                                                file:rounded-lg file:border-0
                                                file:text-sm file:font-semibold
                                                file:bg-cyan-50 file:text-cyan-700 dark:file:bg-cyan-900/50 dark:file:text-cyan-400
                                                hover:file:bg-cyan-100 dark:hover:file:bg-cyan-900/70 transition-colors"
                                        />
                                        <InputError message={errors.gambar} className="mt-1" />
                                    </div>
                                </div>

                                {/* INFORMASI DASAR */}
                                {/* Mengubah border-t pt-4 menjadi border-t border-gray-200 dark:border-gray-700 pt-4 */}
                                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                                    <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">Informasi Dasar</h3>
                                    
                                    <div className="space-y-4">
                                        <div>
                                            <InputLabel htmlFor="jenis_id" value="Jenis APD" className="text-sm font-medium text-gray-700 dark:text-gray-300"/>
                                            <select
                                                id="jenis_id"
                                                name="jenis_id"
                                                value={data.jenis_id}
                                                onChange={(e) => setData("jenis_id", e.target.value)}
                                                // 🎨 Style select konsisten
                                                className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 dark:focus:border-cyan-400 dark:focus:ring-cyan-400 text-sm h-9"
                                            >
                                                <option value="">-- Pilih Jenis APD --</option>
                                                {jenisApds.map((jenis) => (
                                                    <option key={jenis.id} value={jenis.id}>
                                                        {jenis.nama_jenis}
                                                    </option>
                                                ))}
                                            </select>
                                            <InputError message={errors.jenis_id} className="mt-1" />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <InputLabel htmlFor="nama_apd" value="Nama APD" className="text-sm font-medium text-gray-700 dark:text-gray-300"/>
                                                <TextInput
                                                    id="nama_apd"
                                                    type="text"
                                                    value={data.nama_apd}
                                                    onChange={(e) => setData("nama_apd", e.target.value)}
                                                    // 🎨 Style input konsisten
                                                    className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 dark:focus:border-cyan-400 dark:focus:ring-cyan-400 text-sm h-9"
                                                />
                                                <InputError message={errors.nama_apd} className="mt-1" />
                                            </div>

                                            <div>
                                                <InputLabel htmlFor="kode_apd" value="Kode APD" className="text-sm font-medium text-gray-700 dark:text-gray-300"/>
                                                <TextInput
                                                    id="kode_apd"
                                                    type="text"
                                                    value={data.kode_apd}
                                                    onChange={(e) => setData("kode_apd", e.target.value)}
                                                    // 🎨 Style input konsisten
                                                    className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 dark:focus:border-cyan-400 dark:focus:ring-cyan-400 text-sm h-9"
                                                />
                                                <InputError message={errors.kode_apd} className="mt-1" />
                                            </div>
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="deskripsi" value="Deskripsi" className="text-sm font-medium text-gray-700 dark:text-gray-300"/>
                                            <TextAreaInput
                                                id="deskripsi"
                                                value={data.deskripsi}
                                                onChange={(e) => setData("deskripsi", e.target.value)}
                                                // 🎨 Style input konsisten
                                                className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 dark:focus:border-cyan-400 dark:focus:ring-cyan-400 min-h-[100px] text-sm"
                                            />
                                            <InputError message={errors.deskripsi} className="mt-1" />
                                        </div>
                                    </div>
                                </div>

                                {/* SPESIFIKASI APD */}
                                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                                    <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">Spesifikasi APD</h3>
                                    
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <InputLabel htmlFor="bahan" value="Bahan" className="text-sm font-medium text-gray-700 dark:text-gray-300"/>
                                                <TextInput
                                                    id="bahan"
                                                    type="text"
                                                    value={data.bahan}
                                                    onChange={(e) => setData("bahan", e.target.value)}
                                                    // 🎨 Style input konsisten
                                                    className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 dark:focus:border-cyan-400 dark:focus:ring-cyan-400 text-sm h-9"
                                                />
                                                <InputError message={errors.bahan} className="mt-1" />
                                            </div>

                                            <div>
                                                <InputLabel htmlFor="warna" value="Warna" className="text-sm font-medium text-gray-700 dark:text-gray-300"/>
                                                <TextInput
                                                    id="warna"
                                                    type="text"
                                                    value={data.warna}
                                                    onChange={(e) => setData("warna", e.target.value)}
                                                    // 🎨 Style input konsisten
                                                    className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 dark:focus:border-cyan-400 dark:focus:ring-cyan-400 text-sm h-9"
                                                />
                                                <InputError message={errors.warna} className="mt-1" />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <InputLabel htmlFor="ukuran" value="Ukuran" className="text-sm font-medium text-gray-700 dark:text-gray-300"/>
                                                <TextInput
                                                    id="ukuran"
                                                    type="text"
                                                    value={data.ukuran}
                                                    onChange={(e) => setData("ukuran", e.target.value)}
                                                    // 🎨 Style input konsisten
                                                    className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 dark:focus:border-cyan-400 dark:focus:ring-cyan-400 text-sm h-9"
                                                />
                                                <InputError message={errors.ukuran} className="mt-1" />
                                            </div>

                                            <div>
                                                <InputLabel htmlFor="kemampuan" value="Kemampuan" className="text-sm font-medium text-gray-700 dark:text-gray-300"/>
                                                <TextInput
                                                    id="kemampuan"
                                                    type="text"
                                                    value={data.kemampuan}
                                                    onChange={(e) => setData("kemampuan", e.target.value)}
                                                    // 🎨 Style input konsisten
                                                    className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 dark:focus:border-cyan-400 dark:focus:ring-cyan-400 text-sm h-9"
                                                />
                                                <InputError message={errors.kemampuan} className="mt-1" />
                                            </div>
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="fungsi" value="Fungsi" className="text-sm font-medium text-gray-700 dark:text-gray-300"/>
                                            <TextAreaInput
                                                id="fungsi"
                                                value={data.fungsi}
                                                onChange={(e) => setData("fungsi", e.target.value)}
                                                // 🎨 Style input konsisten
                                                className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 dark:focus:border-cyan-400 dark:focus:ring-cyan-400 min-h-[100px] text-sm"
                                            />
                                            <InputError message={errors.fungsi} className="mt-1" />
                                        </div>
                                    </div>
                                </div>

                                {/* STANDAR DAN PENGGUNAAN */}
                                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                                    <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">Standar dan Penggunaan</h3>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <InputLabel htmlFor="standar" value="Standar APD" className="text-sm font-medium text-gray-700 dark:text-gray-300"/>
                                            <TextInput
                                                id="standar"
                                                type="text"
                                                value={data.standar}
                                                onChange={(e) => setData("standar", e.target.value)}
                                                // 🎨 Style input konsisten
                                                className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 dark:focus:border-cyan-400 dark:focus:ring-cyan-400 text-sm h-9"
                                            />
                                            <InputError message={errors.standar} className="mt-1" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="masa_penggunaan" value="Masa Penggunaan" className="text-sm font-medium text-gray-700 dark:text-gray-300"/>
                                            <TextInput
                                                id="masa_penggunaan"
                                                type="text"
                                                value={data.masa_penggunaan}
                                                onChange={(e) => setData("masa_penggunaan", e.target.value)}
                                                // 🎨 Style input konsisten
                                                className="mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 dark:focus:border-cyan-400 dark:focus:ring-cyan-400 text-sm h-9"
                                            />
                                            <InputError message={errors.masa_penggunaan} className="mt-1" />
                                        </div>
                                    </div>
                                </div>

                                {/* Tombol Aksi - Style konsisten */}
                                <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-200 dark:border-gray-700">
                                    <Link
                                        href={route("apd.index")}
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
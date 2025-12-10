import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextAreaInput from "@/Components/TextAreaInput";
import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, Link } from "@inertiajs/react";
import { useState } from "react";
// Menggunakan Lucide-react
import { Pencil, X, Save, HardHat } from "lucide-react"; 

export default function Edit({ auth, apd, jenisApds }) {
    const [preview, setPreview] = useState(apd.gambar || null);

    const { data, setData, post, errors, processing } = useForm({
        _method: "PUT",
        jenis_id: apd.jenis_id || "",
        nama_apd: apd.nama_apd || "",
        kode_apd: apd.kode_apd || "",
        deskripsi: apd.deskripsi || "",
        gambar: null,
        bahan: apd.bahan || "",
        warna: apd.warna || "",
        ukuran: apd.ukuran || "",
        kemampuan: apd.kemampuan || "",
        fungsi: apd.fungsi || "",
        standar: apd.standar || "",
        masa_penggunaan: apd.masa_penggunaan || "",
    });

    // Style konsisten untuk input/select/textarea
    const inputStyle = "mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 dark:focus:border-cyan-400 dark:focus:ring-cyan-400 text-sm h-9";
    const textareaStyle = "mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 dark:focus:border-cyan-400 dark:focus:ring-cyan-400 text-sm";
    const labelStyle = "text-sm font-medium text-gray-700 dark:text-gray-300";

    const onSubmit = (e) => {
        e.preventDefault();
        post(route("apd.update", apd.id), {
            forceFormData: true,
            preserveScroll: true,
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
            setPreview(apd.gambar || null);
        }
    };

    return (
        <AuthenticatedLayout
            user={auth?.user}
            header={
                // Header Style Konsisten (Gradient Icon)
                <div className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-teal-600 shadow-md">
                        <HardHat className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <h2 className="text-base font-semibold text-gray-800 dark:text-gray-200">
                            Edit Data APD
                        </h2>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400">
                            Perbarui rincian Alat Pelindung Diri
                        </p>
                    </div>
                </div>
            }
        >
            <Head title="Edit APD" />

            {/* Layout Adjustment: py-12 -> py-2, max-w-4xl -> max-w-7xl */}
            <div className="py-2">
                <div className="mx-auto max-w-7xl sm:px-2 lg:px-2">
                    <div className="overflow-hidden bg-white shadow-md sm:rounded-lg dark:bg-gray-800">
                        {/* Padding container: p-6 -> p-3 */}
                        <div className="p-3 text-gray-900 dark:text-gray-100">

                            <form
                                onSubmit={onSubmit}
                                encType="multipart/form-data"
                                className="shadow-none sm:rounded-lg space-y-4" 
                            >

                                {/* PREVIEW GAMBAR (Diubah ke tampilan awal tanpa judul & border) */}
                                <div className="text-center">
                                    {preview ? (
                                        <>
                                            <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Pratinjau Gambar</p>
                                            <img
                                                src={preview}
                                                alt="Preview"
                                                className="mx-auto w-40 h-40 object-cover rounded-lg border border-gray-300 dark:border-gray-600 shadow-md"
                                            />
                                        </>
                                    ) : (
                                        <p className="text-sm text-gray-400 italic mb-2">Belum ada gambar</p>
                                    )}

                                    <div className="mt-4 max-w-md mx-auto">
                                        <InputLabel htmlFor="gambar" value="Ganti Gambar (Opsional)" className={labelStyle} />
                                        <input
                                            id="gambar"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            // Style input file konsisten
                                            className="mt-1 block w-full text-sm text-gray-700 dark:text-gray-300
                                                file:mr-4 file:py-1.5 file:px-3
                                                file:rounded-md file:border-0
                                                file:text-sm file:font-medium
                                                file:bg-cyan-50 file:text-cyan-700
                                                hover:file:bg-cyan-100 dark:file:bg-cyan-900 dark:file:text-cyan-300 dark:hover:file:bg-cyan-800"
                                        />
                                        <InputError message={errors.gambar} className="mt-2" />
                                    </div>
                                </div>
                                

                                {/* INFORMASI DASAR */}
                                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 space-y-4">
                                    <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">Informasi Dasar</h3>
                                    
                                    <div className="space-y-4">
                                        <div>
                                            <InputLabel htmlFor="jenis_id" value="Jenis APD" className={labelStyle} />
                                            <select
                                                id="jenis_id"
                                                name="jenis_id"
                                                value={data.jenis_id}
                                                onChange={(e) => setData("jenis_id", e.target.value)}
                                                className={inputStyle} 
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
                                                <InputLabel htmlFor="nama_apd" value="Nama APD" className={labelStyle} />
                                                <TextInput
                                                    id="nama_apd"
                                                    type="text"
                                                    value={data.nama_apd}
                                                    onChange={(e) => setData("nama_apd", e.target.value)}
                                                    className={inputStyle} 
                                                />
                                                <InputError message={errors.nama_apd} className="mt-1" />
                                            </div>

                                            <div>
                                                <InputLabel htmlFor="kode_apd" value="Kode APD" className={labelStyle} />
                                                <TextInput
                                                    id="kode_apd"
                                                    type="text"
                                                    value={data.kode_apd}
                                                    onChange={(e) => setData("kode_apd", e.target.value)}
                                                    className={inputStyle} 
                                                />
                                                <InputError message={errors.kode_apd} className="mt-1" />
                                            </div>
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="deskripsi" value="Deskripsi" className={labelStyle} />
                                            <TextAreaInput
                                                id="deskripsi"
                                                value={data.deskripsi}
                                                onChange={(e) => setData("deskripsi", e.target.value)}
                                                className={textareaStyle} 
                                            />
                                            <InputError message={errors.deskripsi} className="mt-1" />
                                        </div>
                                    </div>
                                </div>

                                {/* SPESIFIKASI APD */}
                                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 space-y-4">
                                    <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">Spesifikasi APD</h3>
                                    
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <InputLabel htmlFor="bahan" value="Bahan" className={labelStyle} />
                                                <TextInput
                                                    id="bahan"
                                                    type="text"
                                                    value={data.bahan}
                                                    onChange={(e) => setData("bahan", e.target.value)}
                                                    className={inputStyle} 
                                                />
                                                <InputError message={errors.bahan} className="mt-1" />
                                            </div>

                                            <div>
                                                <InputLabel htmlFor="warna" value="Warna" className={labelStyle} />
                                                <TextInput
                                                    id="warna"
                                                    type="text"
                                                    value={data.warna}
                                                    onChange={(e) => setData("warna", e.target.value)}
                                                    className={inputStyle} 
                                                />
                                                <InputError message={errors.warna} className="mt-1" />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <InputLabel htmlFor="ukuran" value="Ukuran" className={labelStyle} />
                                                <TextInput
                                                    id="ukuran"
                                                    type="text"
                                                    value={data.ukuran}
                                                    onChange={(e) => setData("ukuran", e.target.value)}
                                                    className={inputStyle} 
                                                />
                                                <InputError message={errors.ukuran} className="mt-1" />
                                            </div>

                                            <div>
                                                <InputLabel htmlFor="kemampuan" value="Kemampuan" className={labelStyle} />
                                                <TextInput
                                                    id="kemampuan"
                                                    type="text"
                                                    value={data.kemampuan}
                                                    onChange={(e) => setData("kemampuan", e.target.value)}
                                                    className={inputStyle} 
                                                />
                                                <InputError message={errors.kemampuan} className="mt-1" />
                                            </div>
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="fungsi" value="Fungsi" className={labelStyle} />
                                            <TextAreaInput
                                                id="fungsi"
                                                value={data.fungsi}
                                                onChange={(e) => setData("fungsi", e.target.value)}
                                                className={textareaStyle} 
                                            />
                                            <InputError message={errors.fungsi} className="mt-1" />
                                        </div>
                                    </div>
                                </div>

                                {/* STANDAR DAN PENGGUNAAN */}
                                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 space-y-4">
                                    <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">Standar dan Penggunaan</h3>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <InputLabel htmlFor="standar" value="Standar APD" className={labelStyle} />
                                            <TextInput
                                                id="standar"
                                                type="text"
                                                value={data.standar}
                                                onChange={(e) => setData("standar", e.target.value)}
                                                className={inputStyle} 
                                            />
                                            <InputError message={errors.standar} className="mt-1" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="masa_penggunaan" value="Masa Penggunaan" className={labelStyle} />
                                            <TextInput
                                                id="masa_penggunaan"
                                                type="text"
                                                value={data.masa_penggunaan}
                                                onChange={(e) => setData("masa_penggunaan", e.target.value)}
                                                className={inputStyle} 
                                            />
                                            <InputError message={errors.masa_penggunaan} className="mt-1" />
                                        </div>
                                    </div>
                                </div>

                                {/* Tombol Aksi */}
                                <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-200 dark:border-gray-700">
                                    <Link
                                        href={route("apd.index")}
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
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextAreaInput from "@/Components/TextAreaInput";
import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, Link } from "@inertiajs/react";
import { useState } from "react";
import { PlusCircleIcon } from "@heroicons/react/24/solid";

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
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200 flex items-center gap-2">
                        <PlusCircleIcon className="w-6 h-6 text-blue-600" />
                        Tambah Data APD
                    </h2>
                </div>
            }
        >
            <Head title="Tambah APD" />

            <div className="py-12">
                <div className="mx-auto max-w-4xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-6 text-gray-900 dark:text-gray-100">

                            <form
                                onSubmit={onSubmit}
                                encType="multipart/form-data"
                                className="p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg space-y-6"
                            >

                                {/* PREVIEW GAMBAR */}
                                <div className="text-center">
                                    {preview ? (
                                        <>
                                            <p className="text-sm text-gray-500 mb-2">Pratinjau Gambar</p>
                                            <img
                                                src={preview}
                                                alt="Preview"
                                                className="mx-auto w-40 h-40 object-cover rounded-lg border border-gray-300 shadow"
                                            />
                                        </>
                                    ) : (
                                        <p className="text-sm text-gray-400 italic mb-2">Belum ada gambar</p>
                                    )}

                                    <div className="mt-3">
                                        <InputLabel htmlFor="gambar" value="Upload Gambar" />
                                        <input
                                            id="gambar"
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="mt-1 block w-full text-sm text-gray-700 dark:text-gray-300
                                                file:mr-4 file:py-2 file:px-4
                                                file:rounded-md file:border-0
                                                file:text-sm file:font-semibold
                                                file:bg-blue-50 file:text-blue-700
                                                hover:file:bg-blue-100"
                                        />
                                        <InputError message={errors.gambar} className="mt-2" />
                                    </div>
                                </div>

                                {/* INFORMASI DASAR */}
                                <div className="border-t pt-4">
                                    <h3 className="text-lg font-semibold mb-4">Informasi Dasar</h3>
                                    
                                    <div className="space-y-4">
                                        <div>
                                            <InputLabel htmlFor="jenis_id" value="Jenis APD" />
                                            <select
                                                id="jenis_id"
                                                name="jenis_id"
                                                value={data.jenis_id}
                                                onChange={(e) => setData("jenis_id", e.target.value)}
                                                className="mt-1 block w-full rounded-md border-gray-300 dark:border-gray-700 
                                                    dark:bg-gray-900 dark:text-gray-300 focus:border-blue-600 focus:ring-blue-600 sm:text-sm"
                                            >
                                                <option value="">-- Pilih Jenis APD --</option>
                                                {jenisApds.map((jenis) => (
                                                    <option key={jenis.id} value={jenis.id}>
                                                        {jenis.nama_jenis}
                                                    </option>
                                                ))}
                                            </select>
                                            <InputError message={errors.jenis_id} className="mt-2" />
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <InputLabel htmlFor="nama_apd" value="Nama APD" />
                                                <TextInput
                                                    id="nama_apd"
                                                    type="text"
                                                    value={data.nama_apd}
                                                    onChange={(e) => setData("nama_apd", e.target.value)}
                                                    className="mt-1 block w-full"
                                                />
                                                <InputError message={errors.nama_apd} className="mt-2" />
                                            </div>

                                            <div>
                                                <InputLabel htmlFor="kode_apd" value="Kode APD" />
                                                <TextInput
                                                    id="kode_apd"
                                                    type="text"
                                                    value={data.kode_apd}
                                                    onChange={(e) => setData("kode_apd", e.target.value)}
                                                    className="mt-1 block w-full"
                                                />
                                                <InputError message={errors.kode_apd} className="mt-2" />
                                            </div>
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="deskripsi" value="Deskripsi" />
                                            <TextAreaInput
                                                id="deskripsi"
                                                value={data.deskripsi}
                                                onChange={(e) => setData("deskripsi", e.target.value)}
                                                className="mt-1 block w-full"
                                            />
                                            <InputError message={errors.deskripsi} className="mt-2" />
                                        </div>
                                    </div>
                                </div>

                                {/* SPESIFIKASI APD */}
                                <div className="border-t pt-4">
                                    <h3 className="text-lg font-semibold mb-4">Spesifikasi APD</h3>
                                    
                                    <div className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <InputLabel htmlFor="bahan" value="Bahan" />
                                                <TextInput
                                                    id="bahan"
                                                    type="text"
                                                    value={data.bahan}
                                                    onChange={(e) => setData("bahan", e.target.value)}
                                                    className="mt-1 block w-full"
                                                />
                                                <InputError message={errors.bahan} className="mt-2" />
                                            </div>

                                            <div>
                                                <InputLabel htmlFor="warna" value="Warna" />
                                                <TextInput
                                                    id="warna"
                                                    type="text"
                                                    value={data.warna}
                                                    onChange={(e) => setData("warna", e.target.value)}
                                                    className="mt-1 block w-full"
                                                />
                                                <InputError message={errors.warna} className="mt-2" />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <InputLabel htmlFor="ukuran" value="Ukuran" />
                                                <TextInput
                                                    id="ukuran"
                                                    type="text"
                                                    value={data.ukuran}
                                                    onChange={(e) => setData("ukuran", e.target.value)}
                                                    className="mt-1 block w-full"
                                                />
                                                <InputError message={errors.ukuran} className="mt-2" />
                                            </div>

                                            <div>
                                                <InputLabel htmlFor="kemampuan" value="Kemampuan" />
                                                <TextInput
                                                    id="kemampuan"
                                                    type="text"
                                                    value={data.kemampuan}
                                                    onChange={(e) => setData("kemampuan", e.target.value)}
                                                    className="mt-1 block w-full"
                                                />
                                                <InputError message={errors.kemampuan} className="mt-2" />
                                            </div>
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="fungsi" value="Fungsi" />
                                            <TextAreaInput
                                                id="fungsi"
                                                value={data.fungsi}
                                                onChange={(e) => setData("fungsi", e.target.value)}
                                                className="mt-1 block w-full"
                                            />
                                            <InputError message={errors.fungsi} className="mt-2" />
                                        </div>
                                    </div>
                                </div>

                                {/* STANDAR DAN PENGGUNAAN */}
                                <div className="border-t pt-4">
                                    <h3 className="text-lg font-semibold mb-4">Standar dan Penggunaan</h3>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <InputLabel htmlFor="standar" value="Standar APD" />
                                            <TextInput
                                                id="standar"
                                                type="text"
                                                value={data.standar}
                                                onChange={(e) => setData("standar", e.target.value)}
                                                className="mt-1 block w-full"
                                            />
                                            <InputError message={errors.standar} className="mt-2" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="masa_penggunaan" value="Masa Penggunaan" />
                                            <TextInput
                                                id="masa_penggunaan"
                                                type="text"
                                                value={data.masa_penggunaan}
                                                onChange={(e) => setData("masa_penggunaan", e.target.value)}
                                                className="mt-1 block w-full"
                                            />
                                            <InputError message={errors.masa_penggunaan} className="mt-2" />
                                        </div>
                                    </div>
                                </div>

                                {/* Tombol */}
                                <div className="flex justify-end space-x-2 pt-4 border-t">
                                    <Link
                                        href={route("apd.index")}
                                        className="min-w-[100px] py-2 px-4 bg-gray-100 text-gray-800 rounded shadow hover:bg-gray-200 text-sm"
                                    >
                                        Batal
                                    </Link>

                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="min-w-[100px] py-2 px-4 bg-blue-600 text-white rounded shadow hover:bg-blue-700 text-sm disabled:opacity-50"
                                    >
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
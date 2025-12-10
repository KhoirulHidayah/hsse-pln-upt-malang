import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextAreaInput from "@/Components/TextAreaInput";
import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, Link } from "@inertiajs/react";
// Ganti Heroicons ke Lucide-react
import { Eye, X, Save, Pencil } from "lucide-react"; 
import { useState, useEffect } from "react";

export default function Edit({ auth, monitoring, apds, lokasiList, garduList }) {
    const { data, setData, put, errors, processing } = useForm({
        apd_id: monitoring.apd_id || "",
        lokasi_id: monitoring.lokasi_id || "",
        gardu_induk_id: monitoring.gardu_induk_id || "",
        stok: monitoring.stok || "",
        tanggal_distribusi: monitoring.tanggal_distribusi || "",
        tanggal_pemeriksaan: monitoring.tanggal_pemeriksaan || "",
        tanggal_berakhir: monitoring.tanggal_berakhir || "",
        kondisi: monitoring.kondisi || "",
        catatan: monitoring.catatan || "",
    });

    // 🔹 Style konsisten untuk input, select, dan date
    const inputStyle = "mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 dark:focus:border-cyan-400 dark:focus:ring-cyan-400 text-sm h-9";
    const textareaStyle = "mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 dark:focus:border-cyan-400 dark:focus:ring-cyan-400 text-sm";
    const labelStyle = "text-sm font-medium text-gray-700 dark:text-gray-300";

    // 🔹 State untuk filter gardu induk berdasarkan lokasi
    const [filteredGardu, setFilteredGardu] = useState([]);

    useEffect(() => {
        if (data.lokasi_id) {
            const filtered = garduList.filter(
                (g) => String(g.lokasi_id) === String(data.lokasi_id)
            );
            setFilteredGardu(filtered);
        } else {
            setFilteredGardu([]);
        }
        // Jika lokasi berubah, reset gardu induk
        if (data.gardu_induk_id && !garduList.some(g => String(g.gardu_induk_id) === String(data.gardu_induk_id))) {
            setData('gardu_induk_id', '');
        }
    }, [data.lokasi_id, garduList]);

    const onSubmit = (e) => {
        e.preventDefault();
        put(route("monitoring-apd.update", { monitoring_apd: monitoring.monitoring_id }));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                // Header Style Konsisten (Gradient Icon)
                <div className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-teal-600 shadow-md">
                        <Eye className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <h2 className="text-base font-semibold text-gray-800 dark:text-gray-200">
                            Edit Monitoring APD
                        </h2>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400">
                            Perbarui data monitoring Alat Pelindung Diri
                        </p>
                    </div>
                </div>
            }
        >
            <Head title="Edit Monitoring APD" />

            {/* Layout Adjustment: py-12 -> py-2, max-w-4xl -> max-w-7xl */}
            <div className="py-2">
                <div className="mx-auto max-w-7xl sm:px-2 lg:px-2">
                    <div className="overflow-hidden bg-white shadow-md sm:rounded-lg dark:bg-gray-800">
                        {/* Padding container: p-6 -> p-3 */}
                        <div className="p-3 text-gray-900 dark:text-gray-100">
                            <form
                                onSubmit={onSubmit}
                                // Hapus p-4 sm:p-8 bg-white... dan ganti dengan space-y-4
                                className="space-y-4" 
                            >
                                {/* Dropdown APD */}
                                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 space-y-4">
                                    <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">APD dan Lokasi</h3>
                                    
                                    <div className="space-y-4">
                                        <div>
                                            <InputLabel htmlFor="apd_id" value="Nama APD" className={labelStyle} />
                                            <select
                                                id="apd_id"
                                                name="apd_id"
                                                value={data.apd_id}
                                                onChange={(e) => setData("apd_id", e.target.value)}
                                                className={inputStyle} // Terapkan style konsisten
                                            >
                                                <option value="">-- Pilih APD --</option>
                                                {apds.map((apd) => (
                                                    <option key={apd.id} value={apd.id}>
                                                        {apd.nama_apd}
                                                    </option>
                                                ))}
                                            </select>
                                            <InputError message={errors.apd_id} className="mt-1" />
                                        </div>

                                        {/* Lokasi & Gardu Induk */}
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div>
                                                <InputLabel htmlFor="lokasi_id" value="Lokasi" className={labelStyle} />
                                                <select
                                                    id="lokasi_id"
                                                    name="lokasi_id"
                                                    value={data.lokasi_id}
                                                    onChange={(e) => setData("lokasi_id", e.target.value)}
                                                    className={inputStyle} // Terapkan style konsisten
                                                >
                                                    <option value="">-- Pilih Lokasi --</option>
                                                    {lokasiList.map((lok) => (
                                                        <option key={lok.lokasi_id} value={lok.lokasi_id}>
                                                            {lok.nama_lokasi}
                                                        </option>
                                                    ))}
                                                </select>
                                                <InputError message={errors.lokasi_id} className="mt-1" />
                                            </div>

                                            <div>
                                                <InputLabel htmlFor="gardu_induk_id" value="Gardu Induk" className={labelStyle} />
                                                <select
                                                    id="gardu_induk_id"
                                                    name="gardu_induk_id"
                                                    value={data.gardu_induk_id}
                                                    onChange={(e) => setData("gardu_induk_id", e.target.value)}
                                                    className={inputStyle} // Terapkan style konsisten
                                                    disabled={!data.lokasi_id}
                                                >
                                                    <option value="">
                                                        {data.lokasi_id
                                                            ? "-- Pilih Gardu Induk --"
                                                            : "Pilih lokasi terlebih dahulu"}
                                                    </option>
                                                    {filteredGardu.map((gardu) => (
                                                        <option key={gardu.gardu_induk_id} value={gardu.gardu_induk_id}>
                                                            {gardu.nama_gardu_induk}
                                                        </option>
                                                    ))}
                                                </select>
                                                <InputError message={errors.gardu_induk_id} className="mt-1" />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Stok */}
                                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 space-y-4">
                                    <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">Informasi Stok dan Tanggal</h3>

                                    <div>
                                        <InputLabel htmlFor="stok" value="Jumlah Stok" className={labelStyle} />
                                        <TextInput
                                            id="stok"
                                            type="number"
                                            name="stok"
                                            value={data.stok}
                                            onChange={(e) => setData("stok", e.target.value)}
                                            className={inputStyle} // Terapkan style konsisten
                                        />
                                        <InputError message={errors.stok} className="mt-1" />
                                    </div>

                                    {/* Tanggal */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <InputLabel htmlFor="tanggal_distribusi" value="Tanggal Distribusi" className={labelStyle} />
                                            <TextInput
                                                id="tanggal_distribusi"
                                                type="date"
                                                name="tanggal_distribusi"
                                                value={data.tanggal_distribusi}
                                                onChange={(e) => setData("tanggal_distribusi", e.target.value)}
                                                className={inputStyle} // Terapkan style konsisten
                                            />
                                            <InputError message={errors.tanggal_distribusi} className="mt-1" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="tanggal_pemeriksaan" value="Tanggal Pemeriksaan" className={labelStyle} />
                                            <TextInput
                                                id="tanggal_pemeriksaan"
                                                type="date"
                                                name="tanggal_pemeriksaan"
                                                value={data.tanggal_pemeriksaan}
                                                onChange={(e) => setData("tanggal_pemeriksaan", e.target.value)}
                                                className={inputStyle} // Terapkan style konsisten
                                            />
                                            <InputError message={errors.tanggal_pemeriksaan} className="mt-1" />
                                        </div>

                                        <div>
                                            <InputLabel htmlFor="tanggal_berakhir" value="Tanggal Berakhir" className={labelStyle} />
                                            <TextInput
                                                id="tanggal_berakhir"
                                                type="date"
                                                name="tanggal_berakhir"
                                                value={data.tanggal_berakhir}
                                                onChange={(e) => setData("tanggal_berakhir", e.target.value)}
                                                className={inputStyle} // Terapkan style konsisten
                                            />
                                            <InputError message={errors.tanggal_berakhir} className="mt-1" />
                                        </div>
                                    </div>
                                </div>

                                {/* Kondisi & Catatan */}
                                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 space-y-4">
                                    <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">Kondisi dan Catatan</h3>
                                    
                                    {/* Kondisi */}
                                    <div>
                                        <InputLabel htmlFor="kondisi" value="Kondisi" className={labelStyle} />
                                        <select
                                            id="kondisi"
                                            name="kondisi"
                                            value={data.kondisi}
                                            onChange={(e) => setData("kondisi", e.target.value)}
                                            className={inputStyle} // Terapkan style konsisten
                                        >
                                            <option value="">-- Pilih Kondisi --</option>
                                            <option value="Baik">Baik</option>
                                            <option value="Rusak">Rusak</option>
                                            <option value="Perlu Diganti">Perlu Diganti</option>
                                        </select>
                                        <InputError message={errors.kondisi} className="mt-1" />
                                    </div>

                                    {/* Catatan */}
                                    <div>
                                        <InputLabel htmlFor="catatan" value="Catatan" className={labelStyle} />
                                        <TextAreaInput
                                            id="catatan"
                                            name="catatan"
                                            value={data.catatan}
                                            onChange={(e) => setData("catatan", e.target.value)}
                                            className={textareaStyle} // Terapkan style konsisten (textarea)
                                        />
                                        <InputError message={errors.catatan} className="mt-1" />
                                    </div>
                                </div>


                                {/* Tombol Simpan / Batal */}
                                <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-200 dark:border-gray-700">
                                    <Link
                                        href={route("monitoring-apd.index")}
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
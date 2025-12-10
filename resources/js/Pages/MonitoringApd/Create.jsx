import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextAreaInput from "@/Components/TextAreaInput";
import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, Link } from "@inertiajs/react";
// MENAMBAH IKON CalendarDays UNTUK VISUALISASI TANGGAL
import { Plus, X, Save, CalendarDays } from "lucide-react"; 
import { useState, useEffect } from "react";

// Menghapus 'apdDetails' dari props
export default function Create({ auth, apds, lokasiList, garduList }) {
    const { data, setData, post, errors, processing, reset } = useForm({
        apd_id: "",
        // Menghapus apd_detail_id
        lokasi_id: "",
        gardu_induk_id: "",
        stok: "",
        tanggal_distribusi: "",
        tanggal_pemeriksaan: "",
        tanggal_berakhir: "",
        kondisi: "",
        catatan: "",
    });

    // 🔹 State untuk daftar gardu induk yang difilter berdasarkan lokasi
    const [filteredGardu, setFilteredGardu] = useState([]);

    // 🔹 Update daftar gardu induk ketika lokasi berubah
    useEffect(() => {
        if (data.lokasi_id) {
            const filtered = garduList.filter(
                (g) => String(g.lokasi_id) === String(data.lokasi_id)
            );
            setFilteredGardu(filtered);
        } else {
            setFilteredGardu([]);
        }
        // reset gardu_induk_id saat lokasi berubah
        setData("gardu_induk_id", "");
    }, [data.lokasi_id]);

    const onSubmit = (e) => {
        e.preventDefault();
        post(route("monitoring-apd.store"), {
            onSuccess: () => reset(),
        });
    };

    // Style konsisten untuk input, select, dan date
    const inputStyle = "mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 dark:focus:border-cyan-400 dark:focus:ring-cyan-400 text-sm h-9";
    const textareaStyle = "mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 dark:focus:border-cyan-400 dark:focus:ring-cyan-400 min-h-[100px] text-sm";
    const labelStyle = "text-sm font-medium text-gray-700 dark:text-gray-300";

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
                            Tambah Monitoring APD
                        </h2>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400">
                            Input data monitoring APD baru
                        </p>
                    </div>
                </div>
            }
        >
            <Head title="Tambah Monitoring APD" />

            {/* 📐 Layout dan Spacing Konsisten */}
            <div className="py-2">
                {/* PERUBAHAN: Mengubah max-w-4xl ke max-w-7xl dan padding ke sm:px-2 lg:px-2 */}
                <div className="mx-auto max-w-7xl sm:px-2 lg:px-2">
                    <div className="overflow-hidden bg-white shadow-md sm:rounded-lg dark:bg-gray-800">
                        {/* PERUBAHAN: Mengubah p-6 menjadi p-3 */}
                        <div className="p-3 text-gray-900 dark:text-gray-100">
                            <form
                                onSubmit={onSubmit}
                                // Menghilangkan p-4 sm:p-8 bg-white dark:bg-gray-800 shadow sm:rounded-lg
                                className="space-y-4" // Mengganti space-y-6 menjadi space-y-4
                            >
                                {/* Dropdown APD */}
                                <div>
                                    <InputLabel htmlFor="apd_id" value="Nama APD" className={labelStyle} />
                                    <select
                                        id="apd_id"
                                        name="apd_id"
                                        value={data.apd_id}
                                        onChange={(e) => setData("apd_id", e.target.value)}
                                        className={inputStyle} // 🎨 Style konsisten
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
                                            className={inputStyle} // 🎨 Style konsisten
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
                                            className={inputStyle} // 🎨 Style konsisten
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

                                {/* Stok */}
                                <div>
                                    <InputLabel htmlFor="stok" value="Jumlah Stok" className={labelStyle} />
                                    <TextInput
                                        id="stok"
                                        type="number"
                                        name="stok"
                                        value={data.stok}
                                        onChange={(e) => setData("stok", e.target.value)}
                                        className={inputStyle} // 🎨 Style konsisten
                                    />
                                    <InputError message={errors.stok} className="mt-1" />
                                </div>

                                {/* Tanggal (Tampilan Kalender Lebih Bagus) */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <InputLabel 
                                            htmlFor="tanggal_distribusi" 
                                            // Tambahkan ikon CalendarDays di label
                                            value={<span className="flex items-center gap-1"><CalendarDays className="w-4 h-4"/> Tanggal Distribusi</span>} 
                                            className={labelStyle} 
                                        />
                                        <TextInput
                                            id="tanggal_distribusi"
                                            type="date"
                                            name="tanggal_distribusi"
                                            value={data.tanggal_distribusi}
                                            onChange={(e) => setData("tanggal_distribusi", e.target.value)}
                                            className={inputStyle} // 🎨 Style konsisten membuat date input lebih baik
                                        />
                                        <InputError message={errors.tanggal_distribusi} className="mt-1" />
                                    </div>

                                    <div>
                                        <InputLabel 
                                            htmlFor="tanggal_pemeriksaan" 
                                            // Tambahkan ikon CalendarDays di label
                                            value={<span className="flex items-center gap-1"><CalendarDays className="w-4 h-4"/> Tanggal Pemeriksaan</span>} 
                                            className={labelStyle} 
                                        />
                                        <TextInput
                                            id="tanggal_pemeriksaan"
                                            type="date"
                                            name="tanggal_pemeriksaan"
                                            value={data.tanggal_pemeriksaan}
                                            onChange={(e) => setData("tanggal_pemeriksaan", e.target.value)}
                                            className={inputStyle} // 🎨 Style konsisten membuat date input lebih baik
                                        />
                                        <InputError message={errors.tanggal_pemeriksaan} className="mt-1" />
                                    </div>

                                    <div>
                                        <InputLabel 
                                            htmlFor="tanggal_berakhir" 
                                            // Tambahkan ikon CalendarDays di label
                                            value={<span className="flex items-center gap-1"><CalendarDays className="w-4 h-4"/> Tanggal Berakhir</span>} 
                                            className={labelStyle} 
                                        />
                                        <TextInput
                                            id="tanggal_berakhir"
                                            type="date"
                                            name="tanggal_berakhir"
                                            value={data.tanggal_berakhir}
                                            onChange={(e) => setData("tanggal_berakhir", e.target.value)}
                                            className={inputStyle} // 🎨 Style konsisten membuat date input lebih baik
                                        />
                                        <InputError message={errors.tanggal_berakhir} className="mt-1" />
                                    </div>
                                </div>

                                {/* Kondisi */}
                                <div>
                                    <InputLabel htmlFor="kondisi" value="Kondisi" className={labelStyle} />
                                    <select
                                        id="kondisi"
                                        name="kondisi"
                                        value={data.kondisi}
                                        onChange={(e) => setData("kondisi", e.target.value)}
                                        className={inputStyle} // 🎨 Style konsisten
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
                                        className={textareaStyle} // 🎨 Style konsisten
                                    />
                                    <InputError message={errors.catatan} className="mt-1" />
                                </div>

                                {/* Tombol Simpan / Batal - Style konsisten */}
                                <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-200 dark:border-gray-700">
                                    <Link
                                        href={route("monitoring-apd.index")}
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
import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, Link } from "@inertiajs/react";
// 🔄 Update Import: Ganti Heroicons ke Lucide-react
import { FileText, Plus, X, Save, Trash2, CalendarDays } from "lucide-react";

export default function Create({ auth, configs }) {
    const today = new Date().toISOString().split('T')[0];

    const { data, setData, post, errors, processing } = useForm({
        // Field Baru
        no_seri: configs.no_seri_suggestion || "",
        no_dokumen: configs.no_dokumen_default || "",
        status_dokumen: null,
        copy_no: "",
        nomor_revisi: configs.nomor_revisi_default || "",
        nomor_edisi: configs.nomor_edisi_default || "",
        tanggal_efektif: configs.tanggal_efektif_default || today,
        lokasi: "Malang",

        // Field Lama
        tanggal: today,
        nama_penerima: "",
        jabatan_pengirim: "",
        nama_pengirim: "",
        
        // Detail Item
        items: [
            { item_nama: "", item_merk: "", jumlah: "", keadaan: "", cek: true },
        ],
    });

    // Style konsisten untuk input, select, dan date
    const inputStyle = "mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 dark:focus:border-cyan-400 dark:focus:ring-cyan-400 text-sm h-9";
    const labelStyle = "!text-sm font-medium text-gray-700 dark:text-gray-300";


    // Fungsi untuk handle perubahan status dokumen
    const handleStatusChange = (status) => {
        // Jika status yang diklik sama dengan yang sudah dipilih, uncheck (set null)
        // Jika berbeda, set status baru
        setData("status_dokumen", data.status_dokumen === status ? null : status);
    };

    const addItem = () => {
        setData("items", [
            ...data.items,
            { item_nama: "", item_merk: "", jumlah: "", keadaan: "", cek: true },
        ]);
    };

    const removeItem = (index) => {
        const rows = [...data.items];
        rows.splice(index, 1);
        setData("items", rows);
    };

    const updateItem = (index, field, value) => {
        const updated = [...data.items];
        updated[index][field] = field === 'cek' ? Boolean(value) : value;
        setData("items", updated);
    };

    const onSubmit = (e) => {
        e.preventDefault();
        post(route("serah-terima.store"));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                // 🔄 Header Style Konsisten (Gradient Icon)
                <div className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-teal-600 shadow-md">
                        <FileText className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <h2 className="text-base font-semibold text-gray-800 dark:text-gray-200">
                            Tambah Serah Terima Barang
                        </h2>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400">
                            Input data dokumen serah terima barang baru
                        </p>
                    </div>
                </div>
            }
        >
            <Head title="Tambah Serah Terima" />

            {/* 📐 Layout dan Spacing Konsisten (max-w-7xl, py-2) */}
            <div className="py-2">
                <div className="mx-auto max-w-7xl sm:px-2 lg:px-2">

                    <div className="overflow-hidden bg-white shadow-md sm:rounded-lg dark:bg-gray-800">
                        <div className="p-3 text-gray-900 dark:text-gray-100">

                            <form onSubmit={onSubmit} className="space-y-4"> {/* Mengubah space-y-6 menjadi space-y-4 */}

                                {/* INFORMASI DOKUMEN & UMUM */}
                                <div>
                                    <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">Informasi Dokumen & Umum</h3>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                                        {/* No Seri */}
                                        <div>
                                            <InputLabel htmlFor="no_seri" value="No. Seri (Wajib)" className={labelStyle} />
                                            <TextInput
                                                id="no_seri"
                                                type="text"
                                                value={data.no_seri}
                                                onChange={(e) => setData("no_seri", e.target.value)}
                                                className={inputStyle} // 🎨 Style konsisten
                                                required
                                            />
                                            <InputError message={errors.no_seri} className="mt-2" />
                                        </div>

                                        {/* No Dokumen */}
                                        <div>
                                            <InputLabel htmlFor="no_dokumen" value="No. Dokumen" className={labelStyle} />
                                            <TextInput
                                                id="no_dokumen"
                                                type="text"
                                                value={data.no_dokumen}
                                                onChange={(e) => setData("no_dokumen", e.target.value)}
                                                className={inputStyle} // 🎨 Style konsisten
                                            />
                                            <InputError message={errors.no_dokumen} className="mt-2" />
                                        </div>

                                        {/* Tanggal Transaksi */}
                                        <div>
                                            <InputLabel 
                                                htmlFor="tanggal" 
                                                value={<span className="flex items-center gap-1"><CalendarDays className="w-4 h-4"/> Tanggal Transaksi</span>} 
                                                className={labelStyle} 
                                            />
                                            <TextInput
                                                id="tanggal"
                                                type="date"
                                                value={data.tanggal}
                                                onChange={(e) => setData("tanggal", e.target.value)}
                                                className={inputStyle} // 🎨 Style konsisten
                                                required
                                            />
                                            <InputError message={errors.tanggal} className="mt-2" />
                                        </div>
                                        
                                        {/* Status Dokumen - Checkbox */}
                                        <div className="md:col-span-3">
                                            <InputLabel value="Status Dokumen" className="mb-2 !text-sm font-medium text-gray-700 dark:text-gray-300" />
                                            <div className="flex gap-6">
                                                {/* Checkbox MASTER */}
                                                <div className="flex items-center">
                                                    <input
                                                        id="status_master"
                                                        type="checkbox"
                                                        value="MASTER"
                                                        checked={data.status_dokumen === 'MASTER'}
                                                        onChange={() => handleStatusChange('MASTER')}
                                                        // 🎨 Style Checkbox Konsisten
                                                        className="w-4 h-4 text-cyan-600 bg-gray-100 border-gray-300 rounded focus:ring-cyan-500 dark:focus:ring-cyan-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                                    />
                                                    <InputLabel htmlFor="status_master" value="MASTER" className="ml-2 !text-sm !font-normal" />
                                                </div>

                                                {/* Checkbox COPY */}
                                                <div className="flex items-center">
                                                    <input
                                                        id="status_copy"
                                                        type="checkbox"
                                                        value="COPY"
                                                        checked={data.status_dokumen === 'COPY'}
                                                        onChange={() => handleStatusChange('COPY')}
                                                        // 🎨 Style Checkbox Konsisten
                                                        className="w-4 h-4 text-cyan-600 bg-gray-100 border-gray-300 rounded focus:ring-cyan-500 dark:focus:ring-cyan-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                                    />
                                                    <InputLabel htmlFor="status_copy" value="COPY" className="ml-2 !text-sm !font-normal" />
                                                </div>
                                            </div>
                                            <InputError message={errors.status_dokumen} className="mt-2" />
                                        </div>
                                        
                                        {/* Copy No */}
                                        <div>
                                            <InputLabel htmlFor="copy_no" value="Copy No." className={labelStyle} />
                                            <TextInput
                                                id="copy_no"
                                                type="text"
                                                value={data.copy_no}
                                                onChange={(e) => setData("copy_no", e.target.value)}
                                                className={inputStyle} // 🎨 Style konsisten
                                            />
                                            <InputError message={errors.copy_no} className="mt-2" />
                                        </div>

                                        {/* Nomor Revisi */}
                                        <div>
                                            <InputLabel htmlFor="nomor_revisi" value="No. Revisi" className={labelStyle} />
                                            <TextInput
                                                id="nomor_revisi"
                                                type="text"
                                                value={data.nomor_revisi}
                                                onChange={(e) => setData("nomor_revisi", e.target.value)}
                                                className={inputStyle} // 🎨 Style konsisten
                                            />
                                            <InputError message={errors.nomor_revisi} className="mt-2" />
                                        </div>

                                        {/* Nomor Edisi */}
                                        <div>
                                            <InputLabel htmlFor="nomor_edisi" value="No. Edisi" className={labelStyle} />
                                            <TextInput
                                                id="nomor_edisi"
                                                type="text"
                                                value={data.nomor_edisi}
                                                onChange={(e) => setData("nomor_edisi", e.target.value)}
                                                className={inputStyle} // 🎨 Style konsisten
                                            />
                                            <InputError message={errors.nomor_edisi} className="mt-2" />
                                        </div>

                                        {/* Tanggal Efektif */}
                                        <div>
                                            <InputLabel 
                                                htmlFor="tanggal_efektif" 
                                                value={<span className="flex items-center gap-1"><CalendarDays className="w-4 h-4"/> Tanggal Efektif</span>} 
                                                className={labelStyle} 
                                            />
                                            <TextInput
                                                id="tanggal_efektif"
                                                type="date"
                                                value={data.tanggal_efektif}
                                                onChange={(e) => setData("tanggal_efektif", e.target.value)}
                                                className={inputStyle} // 🎨 Style konsisten
                                            />
                                            <InputError message={errors.tanggal_efektif} className="mt-2" />
                                        </div>

                                        {/* Lokasi */}
                                        <div>
                                            <InputLabel htmlFor="lokasi" value="Lokasi" className={labelStyle} />
                                            <TextInput
                                                id="lokasi"
                                                type="text"
                                                value={data.lokasi}
                                                onChange={(e) => setData("lokasi", e.target.value)}
                                                className={inputStyle} // 🎨 Style konsisten
                                            />
                                            <InputError message={errors.lokasi} className="mt-2" />
                                        </div>
                                    </div>

                                    {/* INFORMASI PIHAK */}
                                    <h3 className="text-lg font-semibold mt-6 mb-4 border-t border-gray-200 dark:border-gray-700 pt-4 text-gray-800 dark:text-gray-100">Pihak yang Bersangkutan</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {/* Nama Penerima */}
                                        <div>
                                            <InputLabel htmlFor="nama_penerima" value="Nama Penerima" className={labelStyle} />
                                            <TextInput
                                                id="nama_penerima"
                                                type="text"
                                                value={data.nama_penerima}
                                                onChange={(e) => setData("nama_penerima", e.target.value)}
                                                className={inputStyle} // 🎨 Style konsisten
                                                required
                                            />
                                            <InputError message={errors.nama_penerima} className="mt-2" />
                                        </div>

                                        {/* Jabatan Pengirim */}
                                        <div>
                                            <InputLabel htmlFor="jabatan_pengirim" value="Jabatan Pengirim" className={labelStyle} />
                                            <TextInput
                                                id="jabatan_pengirim"
                                                type="text"
                                                value={data.jabatan_pengirim}
                                                onChange={(e) => setData("jabatan_pengirim", e.target.value)}
                                                className={inputStyle} // 🎨 Style konsisten
                                                required
                                            />
                                            <InputError message={errors.jabatan_pengirim} className="mt-2" />
                                        </div>

                                        {/* Nama Pengirim */}
                                        <div>
                                            <InputLabel htmlFor="nama_pengirim" value="Nama Pengirim" className={labelStyle} />
                                            <TextInput
                                                id="nama_pengirim"
                                                type="text"
                                                value={data.nama_pengirim}
                                                onChange={(e) => setData("nama_pengirim", e.target.value)}
                                                className={inputStyle} // 🎨 Style konsisten
                                                required
                                            />
                                            <InputError message={errors.nama_pengirim} className="mt-2" />
                                        </div>
                                    </div>
                                </div>

                                {/* ITEM DETAIL */}
                                <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                                    <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">Daftar Barang</h3>

                                    <div className="space-y-4">

                                        {data.items.map((row, index) => (
                                            <div
                                                key={index}
                                                className="grid grid-cols-1 md:grid-cols-6 gap-4 border border-gray-200 dark:border-gray-700 p-4 rounded-lg bg-gray-50 dark:bg-gray-700/30"
                                            >
                                                {/* Nama Item */}
                                                <div className="md:col-span-2">
                                                    <InputLabel value="Nama Barang" className={labelStyle} />
                                                    <TextInput
                                                        value={row.item_nama}
                                                        onChange={(e) => updateItem(index, "item_nama", e.target.value)}
                                                        className={inputStyle} // 🎨 Style konsisten
                                                        required
                                                    />
                                                    <InputError message={errors[`items.${index}.item_nama`]} />
                                                </div>

                                                {/* Merk */}
                                                <div>
                                                    <InputLabel value="Merk" className={labelStyle} />
                                                    <TextInput
                                                        value={row.item_merk}
                                                        onChange={(e) => updateItem(index, "item_merk", e.target.value)}
                                                        className={inputStyle} // 🎨 Style konsisten
                                                    />
                                                </div>

                                                {/* Jumlah */}
                                                <div>
                                                    <InputLabel value="Jumlah" className={labelStyle} />
                                                    <TextInput
                                                        value={row.jumlah}
                                                        onChange={(e) => updateItem(index, "jumlah", e.target.value)}
                                                        className={inputStyle} // 🎨 Style konsisten
                                                    />
                                                </div>

                                                {/* Keadaan */}
                                                <div>
                                                    <InputLabel value="Keadaan" className={labelStyle} />
                                                    <TextInput
                                                        value={row.keadaan}
                                                        onChange={(e) => updateItem(index, "keadaan", e.target.value)}
                                                        className={inputStyle} // 🎨 Style konsisten
                                                    />
                                                </div>
                                                
                                                {/* Cek - Checkbox */}
                                                <div className="flex flex-col justify-end pt-2">
                                                    <InputLabel htmlFor={`cek-${index}`} value="Sudah Cek" className={labelStyle} />
                                                    <div className="flex items-center h-9">
                                                        <input
                                                            id={`cek-${index}`}
                                                            type="checkbox"
                                                            checked={row.cek}
                                                            onChange={(e) => updateItem(index, "cek", e.target.checked)}
                                                            // 🎨 Style Checkbox Konsisten
                                                            className="w-4 h-4 text-cyan-600 bg-gray-100 border-gray-300 rounded focus:ring-cyan-500 dark:focus:ring-cyan-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                                                        />
                                                    </div>
                                                </div>

                                                {/* Hapus Row */}
                                                <div className="md:col-span-6 flex justify-end">
                                                    {data.items.length > 1 && (
                                                        <button
                                                            type="button"
                                                            onClick={() => removeItem(index)}
                                                            // 🎨 Style Hapus Baris Konsisten
                                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/50 transition-all"
                                                        >
                                                            <Trash2 className="w-4 h-4" />
                                                            Hapus Baris
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        ))}

                                        {/* Tambah Row */}
                                        <button
                                            type="button"
                                            onClick={addItem}
                                            // 🎨 Style Tambah Barang Konsisten
                                            className="flex items-center gap-2 text-teal-600 dark:text-cyan-400 hover:text-teal-700 dark:hover:text-cyan-300 text-sm transition-colors"
                                        >
                                            <Plus className="w-5 h-5" />
                                            Tambah Barang
                                        </button>
                                    </div>
                                </div>

                                {/* TOMBOL AKSI */}
                                <div className="flex items-center justify-end gap-2 pt-3 border-t border-gray-200 dark:border-gray-700">
                                    <Link
                                        href={route("serah-terima.index")}
                                        // 🎨 Style Batal Konsisten
                                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 transition-all"
                                    >
                                        <X className="h-4 w-4" />
                                        Batal
                                    </Link>

                                    <button
                                        type="submit"
                                        disabled={processing}
                                        // 🎨 Style Simpan Konsisten (Gradient)
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
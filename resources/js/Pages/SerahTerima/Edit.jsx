import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, Link } from "@inertiajs/react";
// Ganti Heroicons ke Lucide-react
import { PlusCircle, Trash2, Package, X, Save } from "lucide-react"; 

export default function Edit({ auth, data }) {
    const { data: formData, setData, put, errors, processing } = useForm({
        // Field Baru
        no_seri: data.no_seri ?? "",
        no_dokumen: data.no_dokumen ?? "",
        status_dokumen: data.status_dokumen ?? null,
        copy_no: data.copy_no ?? "",
        nomor_revisi: data.nomor_revisi ?? "",
        nomor_edisi: data.nomor_edisi ?? "",
        tanggal_efektif: data.tanggal_efektif ?? "",
        lokasi: data.lokasi ?? "",

        // Field Lama
        tanggal: data.tanggal ?? "",
        nama_penerima: data.nama_penerima ?? "",
        jabatan_pengirim: data.jabatan_pengirim ?? "",
        nama_pengirim: data.nama_pengirim ?? "",
        
        // Detail Item
        items: data.items ?? [],
    });

    // 🔹 Style konsisten untuk input
    const inputStyle = "mt-1 block w-full rounded-lg border-gray-300 dark:border-gray-600 dark:bg-gray-700 shadow-sm focus:border-cyan-500 focus:ring-cyan-500 dark:focus:border-cyan-400 dark:focus:ring-cyan-400 text-sm h-9";
    const labelStyle = "text-sm font-medium text-gray-700 dark:text-gray-300";
    // Style konsisten untuk checkbox
    const checkboxStyle = "w-4 h-4 text-cyan-600 bg-gray-100 border-gray-300 rounded focus:ring-cyan-500 dark:focus:ring-cyan-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600";


    // Fungsi untuk handle perubahan status dokumen
    const handleStatusChange = (status) => {
        // Jika status yang diklik sama dengan yang sudah dipilih, uncheck (set null)
        // Jika berbeda, set status baru
        setData("status_dokumen", formData.status_dokumen === status ? null : status);
    };

    const addItem = () => {
        setData("items", [
            ...formData.items,
            { item_nama: "", item_merk: "", jumlah: "", keadaan: "", cek: true },
        ]);
    };

    const removeItem = (index) => {
        const rows = [...formData.items];
        rows.splice(index, 1);
        setData("items", rows);
    };

    const updateItem = (index, field, value) => {
        const updated = [...formData.items];
        updated[index][field] = field === 'cek' ? Boolean(value) : value;
        setData("items", updated);
    };

    const onSubmit = (e) => {
        e.preventDefault();
        put(route("serah-terima.update", data.id));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                 // Header Style Konsisten (Gradient Icon)
                 <div className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-cyan-500 to-teal-600 shadow-md">
                        <Package className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <h2 className="text-base font-semibold text-gray-800 dark:text-gray-200">
                            Edit Serah Terima Barang
                        </h2>
                        <p className="text-[11px] text-gray-500 dark:text-gray-400">
                            Perbarui detail dokumen dan daftar barang
                        </p>
                    </div>
                </div>
            }
        >
            <Head title="Edit Serah Terima" />

            {/* Layout Adjustment: py-12 -> py-2, max-w-6xl -> max-w-7xl */}
            <div className="py-2">
                <div className="mx-auto max-w-7xl sm:px-2 lg:px-2">

                    <div className="overflow-hidden bg-white shadow-md sm:rounded-lg dark:bg-gray-800">
                        {/* Padding container: p-6 -> p-4 */}
                        <div className="p-4 text-gray-900 dark:text-gray-100">

                            <form onSubmit={onSubmit} className="space-y-6">

                                {/* INFORMASI DOKUMEN & UMUM */}
                                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 space-y-4">
                                    <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">Informasi Dokumen & Umum</h3>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                                        {/* No Seri */}
                                        <div>
                                            <InputLabel htmlFor="no_seri" value="No. Seri (Wajib)" className={labelStyle} />
                                            <TextInput
                                                id="no_seri"
                                                type="text"
                                                value={formData.no_seri}
                                                onChange={(e) => setData("no_seri", e.target.value)}
                                                className={inputStyle}
                                                required
                                            />
                                            <InputError message={errors.no_seri} className="mt-1" />
                                        </div>

                                        {/* No Dokumen */}
                                        <div>
                                            <InputLabel htmlFor="no_dokumen" value="No. Dokumen" className={labelStyle} />
                                            <TextInput
                                                id="no_dokumen"
                                                type="text"
                                                value={formData.no_dokumen}
                                                onChange={(e) => setData("no_dokumen", e.target.value)}
                                                className={inputStyle}
                                            />
                                            <InputError message={errors.no_dokumen} className="mt-1" />
                                        </div>

                                        {/* Tanggal */}
                                        <div>
                                            <InputLabel htmlFor="tanggal" value="Tanggal Transaksi" className={labelStyle} />
                                            <TextInput
                                                id="tanggal"
                                                type="date"
                                                value={formData.tanggal}
                                                onChange={(e) => setData("tanggal", e.target.value)}
                                                className={inputStyle}
                                                required
                                            />
                                            <InputError message={errors.tanggal} className="mt-1" />
                                        </div>
                                        
                                        {/* Status Dokumen - Checkbox */}
                                        <div className="md:col-span-3">
                                            <InputLabel value="Status Dokumen" className={`${labelStyle} mb-2`} />
                                            <div className="flex gap-6">
                                                {/* Checkbox MASTER */}
                                                <div className="flex items-center">
                                                    <input
                                                        id="status_master"
                                                        type="checkbox"
                                                        value="MASTER"
                                                        checked={formData.status_dokumen === 'MASTER'}
                                                        onChange={() => handleStatusChange('MASTER')}
                                                        className={checkboxStyle} // Style konsisten
                                                    />
                                                    <InputLabel htmlFor="status_master" value="MASTER" className="ml-2 !text-sm !font-normal" />
                                                </div>

                                                {/* Checkbox COPY */}
                                                <div className="flex items-center">
                                                    <input
                                                        id="status_copy"
                                                        type="checkbox"
                                                        value="COPY"
                                                        checked={formData.status_dokumen === 'COPY'}
                                                        onChange={() => handleStatusChange('COPY')}
                                                        className={checkboxStyle} // Style konsisten
                                                    />
                                                    <InputLabel htmlFor="status_copy" value="COPY" className="ml-2 !text-sm !font-normal" />
                                                </div>
                                            </div>
                                            <InputError message={errors.status_dokumen} className="mt-1" />
                                        </div>
                                        
                                        {/* Copy No */}
                                        <div>
                                            <InputLabel htmlFor="copy_no" value="Copy No." className={labelStyle} />
                                            <TextInput
                                                id="copy_no"
                                                type="text"
                                                value={formData.copy_no}
                                                onChange={(e) => setData("copy_no", e.target.value)}
                                                className={inputStyle}
                                            />
                                            <InputError message={errors.copy_no} className="mt-1" />
                                        </div>

                                        {/* Nomor Revisi */}
                                        <div>
                                            <InputLabel htmlFor="nomor_revisi" value="No. Revisi" className={labelStyle} />
                                            <TextInput
                                                id="nomor_revisi"
                                                type="text"
                                                value={formData.nomor_revisi}
                                                onChange={(e) => setData("nomor_revisi", e.target.value)}
                                                className={inputStyle}
                                            />
                                            <InputError message={errors.nomor_revisi} className="mt-1" />
                                        </div>

                                        {/* Nomor Edisi */}
                                        <div>
                                            <InputLabel htmlFor="nomor_edisi" value="No. Edisi" className={labelStyle} />
                                            <TextInput
                                                id="nomor_edisi"
                                                type="text"
                                                value={formData.nomor_edisi}
                                                onChange={(e) => setData("nomor_edisi", e.target.value)}
                                                className={inputStyle}
                                            />
                                            <InputError message={errors.nomor_edisi} className="mt-1" />
                                        </div>

                                        {/* Tanggal Efektif */}
                                        <div>
                                            <InputLabel htmlFor="tanggal_efektif" value="Tanggal Efektif" className={labelStyle} />
                                            <TextInput
                                                id="tanggal_efektif"
                                                type="date"
                                                value={formData.tanggal_efektif}
                                                onChange={(e) => setData("tanggal_efektif", e.target.value)}
                                                className={inputStyle}
                                            />
                                            <InputError message={errors.tanggal_efektif} className="mt-1" />
                                        </div>

                                        {/* Lokasi */}
                                        <div>
                                            <InputLabel htmlFor="lokasi" value="Lokasi" className={labelStyle} />
                                            <TextInput
                                                id="lokasi"
                                                type="text"
                                                value={formData.lokasi}
                                                onChange={(e) => setData("lokasi", e.target.value)}
                                                className={inputStyle}
                                            />
                                            <InputError message={errors.lokasi} className="mt-1" />
                                        </div>
                                    </div>
                                </div>

                                {/* INFORMASI PIHAK */}
                                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 space-y-4">
                                    <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">Pihak yang Bersangkutan</h3>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        {/* Nama Penerima */}
                                        <div>
                                            <InputLabel htmlFor="nama_penerima" value="Nama Penerima" className={labelStyle} />
                                            <TextInput
                                                id="nama_penerima"
                                                type="text"
                                                value={formData.nama_penerima}
                                                onChange={(e) => setData("nama_penerima", e.target.value)}
                                                className={inputStyle}
                                                required
                                            />
                                            <InputError message={errors.nama_penerima} className="mt-1" />
                                        </div>

                                        {/* Jabatan */}
                                        <div>
                                            <InputLabel htmlFor="jabatan_pengirim" value="Jabatan Pengirim" className={labelStyle} />
                                            <TextInput
                                                id="jabatan_pengirim"
                                                type="text"
                                                value={formData.jabatan_pengirim}
                                                onChange={(e) => setData("jabatan_pengirim", e.target.value)}
                                                className={inputStyle}
                                                required
                                            />
                                            <InputError message={errors.jabatan_pengirim} className="mt-1" />
                                        </div>

                                        {/* Nama Pengirim */}
                                        <div>
                                            <InputLabel htmlFor="nama_pengirim" value="Nama Pengirim" className={labelStyle} />
                                            <TextInput
                                                id="nama_pengirim"
                                                type="text"
                                                value={formData.nama_pengirim}
                                                onChange={(e) => setData("nama_pengirim", e.target.value)}
                                                className={inputStyle}
                                                required
                                            />
                                            <InputError message={errors.nama_pengirim} className="mt-1" />
                                        </div>
                                    </div>
                                </div>


                                {/* ITEM DETAIL */}
                                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg border border-gray-200 dark:border-gray-600 space-y-4">
                                    <h3 className="text-base font-semibold text-gray-900 dark:text-gray-100">Daftar Barang</h3>

                                    <div className="space-y-4">

                                        {formData.items.map((row, index) => (
                                            <div
                                                key={index}
                                                className="grid grid-cols-1 md:grid-cols-6 gap-4 border p-4 rounded-lg bg-gray-100 dark:bg-gray-800/50 dark:border-gray-600 relative"
                                            >
                                                {/* Nama Item */}
                                                <div className="md:col-span-2">
                                                    <InputLabel value="Nama Barang" className={labelStyle} />
                                                    <TextInput
                                                        value={row.item_nama}
                                                        onChange={(e) => updateItem(index, "item_nama", e.target.value)}
                                                        className={inputStyle}
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
                                                        className={inputStyle}
                                                    />
                                                </div>

                                                {/* Jumlah */}
                                                <div>
                                                    <InputLabel value="Jumlah" className={labelStyle} />
                                                    <TextInput
                                                        value={row.jumlah}
                                                        onChange={(e) => updateItem(index, "jumlah", e.target.value)}
                                                        className={inputStyle}
                                                    />
                                                </div>

                                                {/* Keadaan */}
                                                <div>
                                                    <InputLabel value="Keadaan" className={labelStyle} />
                                                    <TextInput
                                                        value={row.keadaan}
                                                        onChange={(e) => updateItem(index, "keadaan", e.target.value)}
                                                        className={inputStyle}
                                                    />
                                                </div>
                                                
                                                {/* Cek - Checkbox */}
                                                <div className="flex items-center justify-start pt-6">
                                                    <input
                                                        id={`cek-${index}`}
                                                        type="checkbox"
                                                        checked={row.cek}
                                                        onChange={(e) => updateItem(index, "cek", e.target.checked)}
                                                        className={checkboxStyle} // Style konsisten
                                                    />
                                                    <InputLabel htmlFor={`cek-${index}`} value="Sudah Cek" className="ml-2 !text-sm !font-normal" />
                                                </div>

                                                {/* Hapus Row */}
                                                {formData.items.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => removeItem(index)}
                                                        // Hapus button dari grid, pindahkan ke pojok kanan atas
                                                        className="absolute top-2 right-2 flex items-center gap-1 text-red-600 hover:text-red-700 text-xs font-medium bg-red-50/70 dark:bg-red-900/50 p-1.5 rounded-full transition-colors"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                )}
                                            </div>
                                        ))}

                                        {/* Tambah Row */}
                                        <button
                                            type="button"
                                            onClick={addItem}
                                            // Style konsisten
                                            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-cyan-600 dark:text-cyan-400 bg-cyan-50 dark:bg-cyan-900/30 border border-cyan-300 dark:border-cyan-700 rounded-lg shadow-sm hover:bg-cyan-100 dark:hover:bg-cyan-900 transition-all"
                                        >
                                            <PlusCircle className="w-4 h-4" />
                                            Tambah Barang
                                        </button>
                                    </div>
                                </div>

                                {/* TOMBOL */}
                                <div className="flex justify-end gap-2 pt-3 border-t border-gray-200 dark:border-gray-700">
                                    <Link
                                        href={route("serah-terima.index")}
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
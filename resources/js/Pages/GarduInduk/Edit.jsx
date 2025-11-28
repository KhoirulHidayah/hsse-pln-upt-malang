import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, Link } from "@inertiajs/react";
import { PencilSquareIcon } from "@heroicons/react/24/solid";

export default function Edit({ auth, garduInduk, lokasis }) {
    const { data, setData, post, errors, processing } = useForm({
        _method: "PUT",
        lokasi_id: garduInduk.lokasi_id || "",
        nama_gardu_induk: garduInduk.nama_gardu_induk || "",
    });

    const onSubmit = (e) => {
        e.preventDefault();
        post(route("gardu-induk.update", garduInduk.gardu_induk_id));
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200 flex items-center gap-2">
                        <PencilSquareIcon className="w-6 h-6 text-blue-600" />
                        Edit Gardu Induk
                    </h2>
                </div>
            }
        >
            <Head title="Edit Gardu Induk" />

            <div className="py-12">
                <div className="mx-auto max-w-3xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <form onSubmit={onSubmit} className="space-y-6">
                                {/* Pilih Lokasi */}
                                <div>
                                    <InputLabel htmlFor="lokasi_id" value="Lokasi" />
                                    <select
                                        id="lokasi_id"
                                        name="lokasi_id"
                                        value={data.lokasi_id}
                                        onChange={(e) => setData("lokasi_id", e.target.value)}
                                        className="mt-1 block w-full rounded-md border-gray-300 
                                            dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 
                                            focus:border-blue-600 focus:ring-blue-600 sm:text-sm"
                                    >
                                        <option value="">-- Pilih Lokasi --</option>
                                        {lokasis.map((lokasi) => (
                                            <option key={lokasi.lokasi_id} value={lokasi.lokasi_id}>
                                                {lokasi.nama_lokasi}
                                            </option>
                                        ))}
                                    </select>
                                    <InputError message={errors.lokasi_id} className="mt-2" />
                                </div>

                                {/* Nama Gardu Induk */}
                                <div>
                                    <InputLabel htmlFor="nama_gardu_induk" value="Nama Gardu Induk" />
                                    <TextInput
                                        id="nama_gardu_induk"
                                        type="text"
                                        name="nama_gardu_induk"
                                        value={data.nama_gardu_induk}
                                        onChange={(e) => setData("nama_gardu_induk", e.target.value)}
                                        className="mt-1 block w-full"
                                    />
                                    <InputError message={errors.nama_gardu_induk} className="mt-2" />
                                </div>

                                {/* Tombol Aksi */}
                                <div className="flex justify-end space-x-2 pt-4">
                                    <Link
                                        href={route("gardu-induk.index")}
                                        className="min-w-[100px] py-2 px-4 text-center bg-gray-100 
                                            text-gray-800 rounded shadow hover:bg-gray-200 text-sm"
                                    >
                                        Batal
                                    </Link>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="min-w-[100px] py-2 px-4 bg-blue-600 text-white 
                                            rounded shadow hover:bg-blue-700 text-sm disabled:opacity-50"
                                    >
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

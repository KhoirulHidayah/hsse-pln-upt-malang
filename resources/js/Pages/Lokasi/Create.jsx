import InputError from "@/Components/InputError";
import InputLabel from "@/Components/InputLabel";
import TextInput from "@/Components/TextInput";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, useForm, Link } from "@inertiajs/react";
import { PlusCircleIcon } from "@heroicons/react/24/solid";

export default function Create({ auth }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        nama_lokasi: "",
    });

    const onSubmit = (e) => {
        e.preventDefault();
        post(route("lokasi.store"), {
            onSuccess: () => reset(),
        });
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200 flex items-center gap-2">
                        <PlusCircleIcon className="w-6 h-6 text-blue-600" />
                        Tambah Lokasi
                    </h2>
                </div>
            }
        >
            <Head title="Tambah Lokasi" />

            <div className="py-12">
                <div className="mx-auto max-w-3xl sm:px-6 lg:px-8">
                    <div className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm sm:rounded-lg">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            <form
                                onSubmit={onSubmit}
                                className="space-y-6"
                            >
                                {/* 🏷️ Nama Lokasi */}
                                <div>
                                    <InputLabel
                                        htmlFor="nama_lokasi"
                                        value="Nama Lokasi"
                                    />
                                    <TextInput
                                        id="nama_lokasi"
                                        name="nama_lokasi"
                                        value={data.nama_lokasi}
                                        onChange={(e) =>
                                            setData("nama_lokasi", e.target.value)
                                        }
                                        className="mt-1 block w-full"
                                        autoComplete="off"
                                        placeholder="Contoh: ULTG Krian"
                                    />
                                    <InputError
                                        message={errors.nama_lokasi}
                                        className="mt-2"
                                    />
                                </div>

                                {/* Tombol Aksi */}
                                <div className="flex justify-end space-x-2">
                                    <Link
                                        href={route("lokasi.index")}
                                        className="px-4 py-2 bg-gray-100 text-gray-800 rounded shadow hover:bg-gray-200 text-sm"
                                    >
                                        Batal
                                    </Link>
                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 text-sm disabled:opacity-50"
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

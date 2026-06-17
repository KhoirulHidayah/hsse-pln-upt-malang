import { Head, Link, router } from "@inertiajs/react";
import { useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import Select from "@/Components/Select";
import {
    ChevronUpIcon,
    ChevronDownIcon,
} from "@heroicons/react/16/solid";
import {
    BarChart2,
    Award,
    AlertTriangle,
    XCircle,
    CheckCircle,
    Calculator,
    ListOrdered,
    BookOpen,
    SlidersHorizontal,
    TrendingUp,
} from "lucide-react";

// ──────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────
const statusColor = (s) => {
    if (s === "Layak")            return "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300";
    if (s === "Perlu Pengecekan") return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-300";
    return "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300";
};

const rankMedal = (r) => {
    if (r === 1) return "🥇";
    if (r === 2) return "🥈";
    if (r === 3) return "🥉";
    return r;
};

// ──────────────────────────────────────────────
// Komponen: Step Badge
// ──────────────────────────────────────────────
const StepBadge = ({ number, label, active, onClick }) => (
    <button
        onClick={() => onClick(number)}
        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all border ${
            active
                ? "bg-cyan-600 text-white border-cyan-600 shadow-md"
                : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-cyan-400"
        }`}
    >
        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold ${active ? "bg-white/20" : "bg-gray-100 dark:bg-gray-700"}`}>
            {number}
        </span>
        {label}
    </button>
);

// ──────────────────────────────────────────────
// Komponen: Modal Detail SAW per APD
// ──────────────────────────────────────────────
const DetailModal = ({ item, bobot, onClose }) => {
    if (!item) return null;

    const steps = [
        {
            title: "Step 1 — Konversi Nilai Kriteria",
            desc: "Setiap kriteria dikonversi ke skala 1–3 sesuai aturan fungsi nilai.",
            rows: [
                { label: "C1 – Masa Berlaku (Benefit)", nilai: item.c1, ket: item.c1 === 3 ? "Aktif (>90 hari)" : item.c1 === 2 ? "Peringatan (30–90 hari)" : "Kadaluwarsa (<30 hari)" },
                { label: "C2 – Masa Pakai (Cost)", nilai: item.c2, ket: item.c2 === 1 ? "Baru (<1 tahun)" : item.c2 === 2 ? "Sedang (1–2 tahun)" : "Lama (>2 tahun)" },
                { label: "C3 – Kondisi (Benefit)", nilai: item.c3, ket: item.c3 === 3 ? "Baik" : item.c3 === 2 ? "Perlu Diganti" : "Rusak" },
            ],
        },
        {
            title: "Step 2 — Normalisasi",
            desc: "Benefit: r = x / max | Cost: r = min / x. Max C1=3, Max C3=3, Min C2=1",
            rows: [
                { label: "r₁ = C1 / max(C1)", nilai: item.r1.toFixed(4), ket: `${item.c1} / 3 = ${item.r1.toFixed(4)}` },
                { label: "r₂ = min(C2) / C2", nilai: item.r2.toFixed(4), ket: `1 / ${item.c2} = ${item.r2.toFixed(4)}` },
                { label: "r₃ = C3 / max(C3)", nilai: item.r3.toFixed(4), ket: `${item.c3} / 3 = ${item.r3.toFixed(4)}` },
            ],
        },
        {
            title: "Step 3 — Pembobotan",
            desc: "Setiap nilai normalisasi dikalikan dengan bobot kriteria yang telah ditentukan.",
            rows: [
                { label: `w₁ × r₁  (bobot ${bobot.w1})`, nilai: item.v1.toFixed(4), ket: `${bobot.w1} × ${item.r1.toFixed(4)} = ${item.v1.toFixed(4)}` },
                { label: `w₂ × r₂  (bobot ${bobot.w2})`, nilai: item.v2.toFixed(4), ket: `${bobot.w2} × ${item.r2.toFixed(4)} = ${item.v2.toFixed(4)}` },
                { label: `w₃ × r₃  (bobot ${bobot.w3})`, nilai: item.v3.toFixed(4), ket: `${bobot.w3} × ${item.r3.toFixed(4)} = ${item.v3.toFixed(4)}` },
            ],
        },
        {
            title: "Step 4 — Nilai Preferensi (Vᵢ)",
            desc: "Vᵢ = Σ (wⱼ × rᵢⱼ) — jumlah semua hasil pembobotan",
            rows: [
                { label: "v₁ + v₂ + v₃", nilai: item.vi.toFixed(4), ket: `${item.v1.toFixed(4)} + ${item.v2.toFixed(4)} + ${item.v3.toFixed(4)} = ${item.vi.toFixed(4)}` },
            ],
        },
    ];

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-xl max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 z-10 bg-gradient-to-r from-cyan-600 to-teal-600 rounded-t-2xl p-5">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-cyan-100 text-xs font-medium">Detail Perhitungan SAW</p>
                            <h2 className="text-white font-bold text-lg">{item.nama}</h2>
                            <p className="text-cyan-100 text-xs">{item.kode} · {item.lokasi}</p>
                        </div>
                        <button onClick={onClose} className="h-9 w-9 rounded-xl bg-white/20 flex items-center justify-center text-white hover:bg-white/30">
                            <XCircle className="h-5 w-5" />
                        </button>
                    </div>
                    {/* Nilai akhir di header */}
                    <div className="mt-3 flex items-center gap-3">
                        <div className="bg-white/20 rounded-xl px-4 py-2 text-center">
                            <p className="text-cyan-100 text-xs">Nilai Vᵢ</p>
                            <p className="text-white font-bold text-xl">{item.vi.toFixed(4)}</p>
                        </div>
                        <div className="bg-white/20 rounded-xl px-4 py-2 text-center">
                            <p className="text-cyan-100 text-xs">Ranking</p>
                            <p className="text-white font-bold text-xl">{rankMedal(item.ranking)}</p>
                        </div>
                        <div className={`rounded-xl px-4 py-2 text-center ${item.status === "Layak" ? "bg-green-500/30" : item.status === "Perlu Pengecekan" ? "bg-yellow-500/30" : "bg-red-500/30"}`}>
                            <p className="text-cyan-100 text-xs">Status</p>
                            <p className="text-white font-bold text-sm">{item.status}</p>
                        </div>
                    </div>
                </div>

                {/* Steps */}
                <div className="p-5 space-y-5">
                    {steps.map((step, si) => (
                        <div key={si} className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
                            <div className={`flex items-center gap-2 px-4 py-3 ${si === 3 ? "bg-cyan-50 dark:bg-cyan-900/20" : "bg-gray-50 dark:bg-gray-800"}`}>
                                <span className="w-6 h-6 rounded-full bg-cyan-600 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">
                                    {si + 1}
                                </span>
                                <div>
                                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{step.title}</p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{step.desc}</p>
                                </div>
                            </div>
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b border-gray-100 dark:border-gray-700">
                                        <th className="px-4 py-2 text-left text-xs text-gray-500 font-medium">Kriteria</th>
                                        <th className="px-4 py-2 text-center text-xs text-gray-500 font-medium">Nilai</th>
                                        <th className="px-4 py-2 text-left text-xs text-gray-500 font-medium">Keterangan</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {step.rows.map((row, ri) => (
                                        <tr key={ri} className="border-b border-gray-50 dark:border-gray-800 last:border-0">
                                            <td className="px-4 py-2 text-gray-700 dark:text-gray-300">{row.label}</td>
                                            <td className="px-4 py-2 text-center font-bold text-cyan-700 dark:text-cyan-400">{row.nilai}</td>
                                            <td className="px-4 py-2 text-xs text-gray-500 font:mono">{row.ket}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {/* Hasil akhir step 4 */}
                            {si === 3 && (
                                <div className="px-4 py-3 bg-cyan-50 dark:bg-cyan-900/20 flex items-center justify-between">
                                    <span className="text-sm font-semibold text-cyan-800 dark:text-cyan-200">Nilai Preferensi (Vᵢ)</span>
                                    <span className="text-2xl font-bold text-cyan-700 dark:text-cyan-300">{item.vi.toFixed(4)}</span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="px-5 pb-5 text-right">
                    <button onClick={onClose} className="px-5 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600">
                        Tutup
                    </button>
                </div>
            </div>
        </div>
    );
};

// ──────────────────────────────────────────────
// HALAMAN UTAMA
// ──────────────────────────────────────────────
// ──────────────────────────────────────────────
// Komponen: Modal Edit Bobot Admin
// ──────────────────────────────────────────────
const BobotEditorModal = ({ bobotLokal, onSave, onClose }) => {
    const [draft, setDraft] = useState({
        w1: (bobotLokal.w1 * 100).toFixed(0),
        w2: (bobotLokal.w2 * 100).toFixed(0),
        w3: (bobotLokal.w3 * 100).toFixed(0),
    });

    const total = Number(draft.w1) + Number(draft.w2) + Number(draft.w3);
    const isValid = total === 100 && [draft.w1, draft.w2, draft.w3].every(v => Number(v) > 0 && Number(v) <= 100);

    const handleChange = (key, val) => {
        const num = val.replace(/[^0-9]/g, "");
        setDraft(d => ({ ...d, [key]: num }));
    };

    const handleSave = () => {
        if (!isValid) return;
        onSave({ w1: Number(draft.w1) / 100, w2: Number(draft.w2) / 100, w3: Number(draft.w3) / 100 });
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl w-full max-w-md">
                {/* Header */}
                <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-t-2xl p-5 flex items-center justify-between">
                    <div>
                        <p className="text-amber-100 text-xs font-medium">Panel Admin</p>
                        <h2 className="text-white font-bold text-lg">Edit Bobot Kriteria SAW</h2>
                        <p className="text-amber-100 text-xs">Total bobot harus = 100%</p>
                    </div>
                    <button onClick={onClose} className="h-9 w-9 rounded-xl bg-white/20 flex items-center justify-center text-white hover:bg-white/30">
                        <XCircle className="h-5 w-5" />
                    </button>
                </div>

                <div className="p-6 space-y-5">
                    {/* Info skala prioritas */}
                    <div className="p-3 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800 text-xs text-red-700 dark:text-red-300">
                        <p className="font-semibold mb-1">⚠ Skala Prioritas Aktif</p>
                        <p>Ranking 1 = APD paling <strong>Tidak Layak</strong> (nilai Vᵢ terendah). Prioritas tertinggi untuk segera ditindaklanjuti.</p>
                    </div>

                    {[
                        { key: "w1", label: "w₁ – Masa Berlaku", type: "Benefit", desc: "Semakin lama masa berlaku, semakin baik" },
                        { key: "w2", label: "w₂ – Masa Pakai",   type: "Cost",    desc: "Semakin lama dipakai, semakin buruk" },
                        { key: "w3", label: "w₃ – Kondisi",      type: "Benefit", desc: "Kondisi fisik APD" },
                    ].map(({ key, label, type, desc }) => (
                        <div key={key}>
                            <div className="flex items-center justify-between mb-1">
                                <div>
                                    <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">{label}</p>
                                    <p className="text-xs text-gray-400">{desc}</p>
                                </div>
                                <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${type === "Benefit" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{type}</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    min="1" max="99"
                                    value={draft[key]}
                                    onChange={e => handleChange(key, e.target.value)}
                                    className="w-20 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-center font-bold text-lg dark:bg-gray-800 dark:text-white focus:ring-2 focus:ring-amber-400 outline-none"
                                />
                                <span className="text-gray-500 font-medium">%</span>
                                <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2 overflow-hidden">
                                    <div
                                        className="h-full bg-gradient-to-r from-amber-400 to-orange-400 rounded-full transition-all"
                                        style={{ width: `${Math.min(Number(draft[key]), 100)}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* Total indicator */}
                    <div className={`p-3 rounded-xl border text-center font-semibold text-sm transition-colors ${
                        total === 100 ? "bg-green-50 border-green-200 text-green-700 dark:bg-green-900/20 dark:border-green-700 dark:text-green-300"
                                      : "bg-red-50 border-red-200 text-red-700 dark:bg-red-900/20 dark:border-red-700 dark:text-red-300"
                    }`}>
                        Total: {total}% {total === 100 ? "✓ Valid" : `— kurang ${100 - total}%`}
                    </div>

                    <div className="flex gap-2">
                        <button onClick={onClose} className="flex-1 py-2 rounded-xl text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600">
                            Batal
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={!isValid}
                            className="flex-1 py-2 rounded-xl text-sm font-medium bg-amber-500 text-white hover:bg-amber-600 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            Simpan & Hitung Ulang
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// ──────────────────────────────────────────────
// Helper: hitung ulang SAW dengan bobot baru
// Ranking 1 = Vᵢ terendah (paling tidak layak)
// ──────────────────────────────────────────────
const recalcSAW = (data, w) => {
    return data
        .map(a => {
            const v1 = w.w1 * a.r1;
            const v2 = w.w2 * a.r2;
            const v3 = w.w3 * a.r3;
            const vi = v1 + v2 + v3;
            const status = vi >= 0.75 ? "Layak" : vi >= 0.5 ? "Perlu Pengecekan" : "Tidak Layak";
            return { ...a, v1, v2, v3, vi, status };
        })
        .sort((a, b) => a.vi - b.vi)   // ascending: terendah = ranking 1
        .map((a, i) => ({ ...a, ranking: i + 1 }));
};

export default function Saw({ auth, alternatif, bobot, stats, lokasiList, garduList, filters }) {
    const [activeStep, setActiveStep] = useState(1);
    const [selectedItem, setSelectedItem] = useState(null);
    const [lokasiFilter, setLokasiFilter]     = useState(filters.lokasi_id || "");
    const [garduFilter, setGarduFilter]       = useState(filters.gardu_induk_id || "");
    const [kondisiFilter, setKondisiFilter]   = useState(filters.kondisi || "");
    const [sortField, setSortField]           = useState("ranking");
    const [sortDir, setSortDir]               = useState("asc");

    // ── State bobot yang bisa diedit ──
    const [bobotLokal, setBobotLokal] = useState(bobot);
    const [showBobotEditor, setShowBobotEditor] = useState(false);

    // ── Alternatif yang sudah dihitung ulang dengan bobot lokal ──
    const alternatifRecalc = recalcSAW(alternatif, bobotLokal);

    // ── Stats ulang ──
    const statsRecalc = {
        total:      alternatifRecalc.length,
        layak:      alternatifRecalc.filter(a => a.status === "Layak").length,
        perluCek:   alternatifRecalc.filter(a => a.status === "Perlu Pengecekan").length,
        tidakLayak: alternatifRecalc.filter(a => a.status === "Tidak Layak").length,
        avgVi:      alternatifRecalc.length ? (alternatifRecalc.reduce((s, a) => s + a.vi, 0) / alternatifRecalc.length).toFixed(4) : "0.0000",
    };

    const isCustomBobot = bobotLokal.w1 !== bobot.w1 || bobotLokal.w2 !== bobot.w2 || bobotLokal.w3 !== bobot.w3;

    // ── Sorting ──
    const toggleSort = (field) => {
        if (sortField === field) {
            setSortDir(sortDir === "asc" ? "desc" : "asc");
        } else {
            setSortField(field);
            setSortDir("asc");
        }
    };

    const sorted = [...alternatifRecalc].sort((a, b) => {
        const av = a[sortField], bv = b[sortField];
        if (typeof av === "string") return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
        return sortDir === "asc" ? av - bv : bv - av;
    });

    // ── Filter ──
    const applyFilter = () => {
        router.get(route("monitoring-apd.saw"), {
            lokasi_id: lokasiFilter,
            gardu_induk_id: garduFilter,
            kondisi: kondisiFilter,
        });
    };

    const resetFilter = () => {
        setLokasiFilter(""); setGarduFilter(""); setKondisiFilter("");
        router.get(route("monitoring-apd.saw"));
    };

    // ── Sort Header ──
    const SH = ({ field, label }) => (
        <th
            className="px-3 py-2 cursor-pointer select-none hover:bg-cyan-100 dark:hover:bg-gray-600 whitespace-nowrap"
            onClick={() => toggleSort(field)}
        >
            <div className="flex items-center gap-1">
                <span>{label}</span>
                <div className="flex flex-col">
                    <ChevronUpIcon className={`w-3 h-3 ${sortField === field && sortDir === "asc" ? "text-cyan-600" : "text-gray-400"}`} />
                    <ChevronDownIcon className={`w-3 h-3 -mt-1 ${sortField === field && sortDir === "desc" ? "text-cyan-600" : "text-gray-400"}`} />
                </div>
            </div>
        </th>
    );

    // ── Content per Step ──
    const renderStepContent = () => {
        switch (activeStep) {
            // ── STEP 1: Konversi Nilai ──
            case 1:
                return (
                    <div>
                        <div className="mb-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
                            <div className="flex items-start gap-3">
                                <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400 mt-0.5 flex-shrink-0" />
                                <div className="text-sm text-blue-800 dark:text-blue-200 space-y-1">
                                    <p className="font-semibold">Fungsi Konversi Nilai</p>
                                    <ul className="text-xs space-y-0.5 text-blue-700 dark:text-blue-300">
                                        <li>• <strong>C1 – Masa Berlaku:</strong> &gt;90 hari=3 | 30–90 hari=2 | &lt;30 hari=1</li>
                                        <li>• <strong>C2 – Masa Pakai:</strong> &lt;365 hari=1 | 365–730 hari=2 | &gt;730 hari=3</li>
                                        <li>• <strong>C3 – Kondisi:</strong> Baik=3 | Perlu Diganti=2 | Rusak=1</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-xl">
                            <table className="min-w-full text-sm">
                                <thead className="text-[11px] uppercase bg-gradient-to-r from-cyan-50 to-teal-50 dark:from-gray-700 dark:to-gray-600">
                                    <tr>
                                        <th className="px-3 py-2 text-center">No</th>
                                        <SH field="nama" label="Nama APD" />
                                        <th className="px-3 py-2">Lokasi</th>
                                        <th className="px-3 py-2">Kondisi</th>
                                        <SH field="c1" label="C1 Masa Berlaku" />
                                        <SH field="c2" label="C2 Masa Pakai" />
                                        <SH field="c3" label="C3 Kondisi" />
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                    {sorted.map((a, i) => (
                                        <tr key={a.id} className="hover:bg-cyan-50 dark:hover:bg-gray-700/50">
                                            <td className="px-3 py-2 text-center text-gray-500">{i + 1}</td>
                                            <td className="px-3 py-2 font-semibold">{a.nama}<p className="text-xs text-gray-400 font-normal">{a.kode}</p></td>
                                            <td className="px-3 py-2 text-xs text-gray-500">{a.lokasi}<br/>{a.gardu}</td>
                                            <td className="px-3 py-2"><span className={`px-2 py-0.5 rounded-full text-xs font-bold ${a.kondisi === "Baik" ? "bg-green-100 text-green-700" : a.kondisi === "Perlu Diganti" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}>{a.kondisi}</span></td>
                                            <td className="px-3 py-2 text-center"><span className={`inline-flex items-center justify-center w-7 h-7 rounded-full font-bold text-xs ${a.c1 === 3 ? "bg-green-100 text-green-700" : a.c1 === 2 ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}>{a.c1}</span></td>
                                            <td className="px-3 py-2 text-center"><span className={`inline-flex items-center justify-center w-7 h-7 rounded-full font-bold text-xs ${a.c2 === 1 ? "bg-green-100 text-green-700" : a.c2 === 2 ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}>{a.c2}</span></td>
                                            <td className="px-3 py-2 text-center"><span className={`inline-flex items-center justify-center w-7 h-7 rounded-full font-bold text-xs ${a.c3 === 3 ? "bg-green-100 text-green-700" : a.c3 === 2 ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}>{a.c3}</span></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );

            // ── STEP 2: Normalisasi ──
            case 2:
                return (
                    <div>
                        <div className="mb-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
                            <div className="flex items-start gap-3">
                                <Calculator className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                                <div className="text-sm text-purple-800 dark:text-purple-200 space-y-1">
                                    <p className="font-semibold">Rumus Normalisasi SAW</p>
                                    <ul className="text-xs text-purple-700 dark:text-purple-300 space-y-0.5">
                                        <li>• <strong>Benefit (C1, C3):</strong> rᵢⱼ = xᵢⱼ / max(xᵢⱼ)  → max=3</li>
                                        <li>• <strong>Cost (C2):</strong> rᵢⱼ = min(xᵢⱼ) / xᵢⱼ  → min=1</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-xl">
                            <table className="min-w-full text-sm">
                                <thead className="text-[11px] uppercase bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-gray-700 dark:to-gray-600">
                                    <tr>
                                        <th className="px-3 py-2 text-center">No</th>
                                        <th className="px-3 py-2">Nama APD</th>
                                        <th className="px-3 py-2 text-center">C1</th>
                                        <th className="px-3 py-2 text-center bg-blue-50 dark:bg-blue-900/30">r₁ = C1/3</th>
                                        <th className="px-3 py-2 text-center">C2</th>
                                        <th className="px-3 py-2 text-center bg-blue-50 dark:bg-blue-900/30">r₂ = 1/C2</th>
                                        <th className="px-3 py-2 text-center">C3</th>
                                        <th className="px-3 py-2 text-center bg-blue-50 dark:bg-blue-900/30">r₃ = C3/3</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                    {sorted.map((a, i) => (
                                        <tr key={a.id} className="hover:bg-purple-50 dark:hover:bg-gray-700/50">
                                            <td className="px-3 py-2 text-center text-gray-500">{i + 1}</td>
                                            <td className="px-3 py-2 font-semibold">{a.nama}</td>
                                            <td className="px-3 py-2 text-center text-gray-600">{a.c1}</td>
                                            <td className="px-3 py-2 text-center font-mono font-bold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30">{a.r1.toFixed(4)}</td>
                                            <td className="px-3 py-2 text-center text-gray-600">{a.c2}</td>
                                            <td className="px-3 py-2 text-center font-mono font-bold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30">{a.r2.toFixed(4)}</td>
                                            <td className="px-3 py-2 text-center text-gray-600">{a.c3}</td>
                                            <td className="px-3 py-2 text-center font-mono font-bold text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30">{a.r3.toFixed(4)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );

            // ── STEP 3: Pembobotan ──
            case 3:
                return (
                    <div>
                        <div className="mb-4 grid grid-cols-3 gap-3">
                            {[
                                { label: "w₁ – Masa Berlaku", nilai: bobotLokal.w1, persen: `${bobotLokal.w1 * 100}%`, type: "Benefit" },
                                { label: "w₂ – Masa Pakai",   nilai: bobotLokal.w2, persen: `${bobotLokal.w2 * 100}%`, type: "Cost" },
                                { label: "w₃ – Kondisi",      nilai: bobotLokal.w3, persen: `${bobotLokal.w3 * 100}%`, type: "Benefit" },
                            ].map((b, i) => (
                                <div key={i} className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800 text-center">
                                    <p className="text-xs text-amber-700 dark:text-amber-300 font-medium">{b.label}</p>
                                    <p className="text-3xl font-bold text-amber-800 dark:text-amber-200 mt-1">{b.persen}</p>
                                    <span className={`text-xs px-2 py-0.5 rounded-full ${b.type === "Benefit" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>{b.type}</span>
                                </div>
                            ))}
                        </div>
                        <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-xl">
                            <table className="min-w-full text-sm">
                                <thead className="text-[11px] uppercase bg-gradient-to-r from-amber-50 to-orange-50 dark:from-gray-700 dark:to-gray-600">
                                    <tr>
                                        <th className="px-3 py-2 text-center">No</th>
                                        <th className="px-3 py-2">Nama APD</th>
                                        <th className="px-3 py-2 text-center">r₁</th>
                                        <th className="px-3 py-2 text-center bg-amber-50 dark:bg-amber-900/30">w₁×r₁ ({bobotLokal.w1})</th>
                                        <th className="px-3 py-2 text-center">r₂</th>
                                        <th className="px-3 py-2 text-center bg-amber-50 dark:bg-amber-900/30">w₂×r₂ ({bobotLokal.w2})</th>
                                        <th className="px-3 py-2 text-center">r₃</th>
                                        <th className="px-3 py-2 text-center bg-amber-50 dark:bg-amber-900/30">w₃×r₃ ({bobotLokal.w3})</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                    {sorted.map((a, i) => (
                                        <tr key={a.id} className="hover:bg-amber-50 dark:hover:bg-gray-700/50">
                                            <td className="px-3 py-2 text-center text-gray-500">{i + 1}</td>
                                            <td className="px-3 py-2 font-semibold">{a.nama}</td>
                                            <td className="px-3 py-2 text-center text-gray-600 font-mono">{a.r1.toFixed(4)}</td>
                                            <td className="px-3 py-2 text-center font-mono font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30">{a.v1.toFixed(4)}</td>
                                            <td className="px-3 py-2 text-center text-gray-600 font-mono">{a.r2.toFixed(4)}</td>
                                            <td className="px-3 py-2 text-center font-mono font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30">{a.v2.toFixed(4)}</td>
                                            <td className="px-3 py-2 text-center text-gray-600 font-mono">{a.r3.toFixed(4)}</td>
                                            <td className="px-3 py-2 text-center font-mono font-bold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30">{a.v3.toFixed(4)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );

            // ── STEP 4: Nilai Preferensi ──
            case 4:
                return (
                    <div>
                        <div className="mb-4 p-4 bg-teal-50 dark:bg-teal-900/20 rounded-xl border border-teal-200 dark:border-teal-800">
                            <div className="flex items-start gap-3">
                                <TrendingUp className="h-5 w-5 text-teal-600 mt-0.5 flex-shrink-0" />
                                <div className="text-sm text-teal-800 dark:text-teal-200">
                                    <p className="font-semibold">Rumus Nilai Preferensi</p>
                                    <p className="text-xs text-teal-700 dark:text-teal-300 mt-0.5">
                                        Vᵢ = (w₁×r₁) + (w₂×r₂) + (w₃×r₃)  →  Layak ≥ 0.75 | Perlu Pengecekan ≥ 0.5 | Tidak Layak &lt; 0.5 · <strong>Ranking 1 = Vᵢ terendah (paling tidak layak)</strong>
                                    </p>
                                </div>
                            </div>
                        </div>
                        <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-xl">
                            <table className="min-w-full text-sm">
                                <thead className="text-[11px] uppercase bg-gradient-to-r from-teal-50 to-cyan-50 dark:from-gray-700 dark:to-gray-600">
                                    <tr>
                                        <th className="px-3 py-2 text-center">No</th>
                                        <SH field="nama" label="Nama APD" />
                                        <th className="px-3 py-2 text-center">w₁r₁</th>
                                        <th className="px-3 py-2 text-center">w₂r₂</th>
                                        <th className="px-3 py-2 text-center">w₃r₃</th>
                                        <SH field="vi" label="Vᵢ (Preferensi)" />
                                        <th className="px-3 py-2 text-center">Status</th>
                                        <th className="px-3 py-2 text-center">Detail</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                    {sorted.map((a, i) => (
                                        <tr key={a.id} className="hover:bg-teal-50 dark:hover:bg-gray-700/50">
                                            <td className="px-3 py-2 text-center text-gray-500">{i + 1}</td>
                                            <td className="px-3 py-2 font-semibold">{a.nama}</td>
                                            <td className="px-3 py-2 text-center font-mono text-xs">{a.v1.toFixed(4)}</td>
                                            <td className="px-3 py-2 text-center font-mono text-xs">{a.v2.toFixed(4)}</td>
                                            <td className="px-3 py-2 text-center font-mono text-xs">{a.v3.toFixed(4)}</td>
                                            <td className="px-3 py-2 text-center font-mono font-bold text-teal-700 dark:text-teal-300 text-base">{a.vi.toFixed(4)}</td>
                                            <td className="px-3 py-2"><span className={`px-2 py-0.5 rounded-full text-xs font-bold ${statusColor(a.status)}`}>{a.status}</span></td>
                                            <td className="px-3 py-2 text-center">
                                                <button onClick={() => setSelectedItem(a)} className="px-3 py-1 bg-cyan-600 text-white text-xs rounded-lg hover:bg-cyan-700">
                                                    Lihat
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );

            // ── STEP 5: Perangkingan ──
            case 5:
                return (
                    <div>
                        <div className="mb-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-xl border border-green-200 dark:border-green-800">
                            <div className="flex items-start gap-3">
                                <ListOrdered className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                                <div className="text-sm text-green-800 dark:text-green-200">
                                    <p className="font-semibold">Perangkingan Akhir</p>
                                    <p className="text-xs text-green-700 dark:text-green-300 mt-0.5">
                                        APD diurutkan berdasarkan Nilai Preferensi (Vᵢ) dari <strong>terendah ke tertinggi</strong>. Ranking 1 = APD paling <strong>Tidak Layak</strong> — prioritas utama untuk segera ditindaklanjuti.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Top 3 Podium — Prioritas Tidak Layak */}
                        {sorted.length >= 3 && (
                            <div className="grid grid-cols-3 gap-3 mb-5">
                                {[sorted[1], sorted[0], sorted[2]].filter(Boolean).map((a, i) => {
                                    const pos = i === 1 ? 1 : i === 0 ? 2 : 3;
                                    const h = pos === 1 ? "h-24" : pos === 2 ? "h-16" : "h-12";
                                    const bg = pos === 1 ? "from-red-500 to-rose-600" : pos === 2 ? "from-orange-400 to-amber-500" : "from-yellow-400 to-amber-400";
                                    const medal = pos === 1 ? "🚨" : pos === 2 ? "⚠️" : "🔔";
                                    return (
                                        <div key={a.id} className={`text-center order-${pos === 1 ? 2 : pos === 2 ? 1 : 3}`}>
                                            <p className="text-xs font-semibold text-gray-600 dark:text-gray-300 mb-1 truncate">{a.nama}</p>
                                            <p className="text-sm font-bold text-red-700 dark:text-red-300 mb-1">{a.vi.toFixed(4)}</p>
                                            <div className={`rounded-t-xl bg-gradient-to-b ${bg} ${h} flex items-start justify-center pt-2`}>
                                                <span className="text-2xl">{medal}</span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}

                        <div className="overflow-x-auto border border-gray-200 dark:border-gray-700 rounded-xl">
                            <table className="min-w-full text-sm">
                                <thead className="text-[11px] uppercase bg-gradient-to-r from-green-50 to-teal-50 dark:from-gray-700 dark:to-gray-600">
                                    <tr>
                                        <SH field="ranking" label="Ranking" />
                                        <SH field="nama" label="Nama APD" />
                                        <th className="px-3 py-2">Lokasi / Gardu</th>
                                        <th className="px-3 py-2 text-center">C1</th>
                                        <th className="px-3 py-2 text-center">C2</th>
                                        <th className="px-3 py-2 text-center">C3</th>
                                        <SH field="vi" label="Nilai Vᵢ" />
                                        <th className="px-3 py-2">Status</th>
                                        <th className="px-3 py-2 text-center">Detail</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100 dark:divide-gray-700">
                                    {sorted.map((a) => (
                                        <tr key={a.id} className={`hover:bg-green-50 dark:hover:bg-gray-700/50 ${a.ranking <= 3 ? "bg-yellow-50/50 dark:bg-yellow-900/10" : ""}`}>
                                            <td className="px-3 py-2 text-center font-bold text-xl">{rankMedal(a.ranking)}</td>
                                            <td className="px-3 py-2 font-semibold">{a.nama}<p className="text-xs text-gray-400 font-normal">{a.kode}</p></td>
                                            <td className="px-3 py-2 text-xs text-gray-500">{a.lokasi}<br/>{a.gardu}</td>
                                            <td className="px-3 py-2 text-center"><span className={`w-6 h-6 inline-flex items-center justify-center rounded-full font-bold text-xs ${a.c1 === 3 ? "bg-green-100 text-green-700" : a.c1 === 2 ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}>{a.c1}</span></td>
                                            <td className="px-3 py-2 text-center"><span className={`w-6 h-6 inline-flex items-center justify-center rounded-full font-bold text-xs ${a.c2 === 1 ? "bg-green-100 text-green-700" : a.c2 === 2 ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}>{a.c2}</span></td>
                                            <td className="px-3 py-2 text-center"><span className={`w-6 h-6 inline-flex items-center justify-center rounded-full font-bold text-xs ${a.c3 === 3 ? "bg-green-100 text-green-700" : a.c3 === 2 ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700"}`}>{a.c3}</span></td>
                                            <td className="px-3 py-2 text-center font-mono font-bold text-green-700 dark:text-green-300">{a.vi.toFixed(4)}</td>
                                            <td className="px-3 py-2"><span className={`px-2 py-0.5 rounded-full text-xs font-bold ${statusColor(a.status)}`}>{a.status}</span></td>
                                            <td className="px-3 py-2 text-center">
                                                <button onClick={() => setSelectedItem(a)} className="px-3 py-1 bg-cyan-600 text-white text-xs rounded-lg hover:bg-cyan-700">
                                                    Detail
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                );

            default: return null;
        }
    };

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-teal-600">
                            <BarChart2 className="h-5 w-5 text-white" />
                        </div>
                        <div>
                            <h2 className="text-base font-bold text-gray-800 dark:text-gray-200">Analisis SAW – APD</h2>
                            <p className="text-xs text-gray-500">Simple Additive Weighting · Step by Step</p>
                        </div>
                    </div>
                    <Link href={route("monitoring-apd.index")} className="text-sm text-cyan-600 hover:underline">
                        ← Kembali ke Monitoring
                    </Link>
                </div>
            }
        >
            <Head title="Analisis SAW APD" />

            {selectedItem && (
                <DetailModal item={selectedItem} bobot={bobotLokal} onClose={() => setSelectedItem(null)} />
            )}

            {showBobotEditor && (
                <BobotEditorModal
                    bobotLokal={bobotLokal}
                    onSave={setBobotLokal}
                    onClose={() => setShowBobotEditor(false)}
                />
            )}

            <div className="py-3">
                <div className="mx-auto max-w-7xl sm:px-3 lg:px-3 space-y-4">

                    {/* ── STATISTIK RINGKASAN ── */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {[
                            { label: "Total APD",        nilai: statsRecalc.total,      icon: <BarChart2 className="h-5 w-5 text-cyan-600" />,      bg: "bg-cyan-50 dark:bg-cyan-900/20",    text: "text-cyan-700 dark:text-cyan-300" },
                            { label: "Layak",            nilai: statsRecalc.layak,      icon: <CheckCircle className="h-5 w-5 text-green-600" />,   bg: "bg-green-50 dark:bg-green-900/20",  text: "text-green-700 dark:text-green-300" },
                            { label: "Perlu Pengecekan", nilai: statsRecalc.perluCek,   icon: <AlertTriangle className="h-5 w-5 text-yellow-600" />, bg: "bg-yellow-50 dark:bg-yellow-900/20",text: "text-yellow-700 dark:text-yellow-300" },
                            { label: "Tidak Layak",      nilai: statsRecalc.tidakLayak, icon: <XCircle className="h-5 w-5 text-red-600" />,         bg: "bg-red-50 dark:bg-red-900/20",     text: "text-red-700 dark:text-red-300" },
                        ].map((s, i) => (
                            <div key={i} className={`${s.bg} rounded-xl p-4 border border-transparent flex items-center gap-3`}>
                                <div className="flex-shrink-0">{s.icon}</div>
                                <div>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">{s.label}</p>
                                    <p className={`text-2xl font-bold ${s.text}`}>{s.nilai}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* ── PANEL ADMIN: BOBOT ── */}
                    <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-700 p-4">
                        <div className="flex items-center justify-between flex-wrap gap-3">
                            <div className="flex items-center gap-3">
                                <SlidersHorizontal className="h-5 w-5 text-amber-600" />
                                <div>
                                    <p className="text-sm font-semibold text-amber-800 dark:text-amber-200">Bobot Kriteria SAW</p>
                                    <p className="text-xs text-amber-600 dark:text-amber-400">
                                        w₁={bobotLokal.w1 * 100}% · w₂={bobotLokal.w2 * 100}% · w₃={bobotLokal.w3 * 100}%
                                        {isCustomBobot && <span className="ml-2 px-1.5 py-0.5 bg-amber-200 dark:bg-amber-800 rounded text-amber-800 dark:text-amber-200 font-bold">Dimodifikasi</span>}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <div className="text-xs text-red-600 dark:text-red-400 font-medium bg-red-50 dark:bg-red-900/30 px-3 py-1.5 rounded-lg border border-red-200 dark:border-red-700">
                                    🏆 Ranking 1 = Paling <strong>Tidak Layak</strong>
                                </div>
                                {isCustomBobot && (
                                    <button
                                        onClick={() => setBobotLokal(bobot)}
                                        className="px-3 py-1.5 text-xs rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600 font-medium"
                                    >
                                        Reset
                                    </button>
                                )}
                                <button
                                    onClick={() => setShowBobotEditor(true)}
                                    className="px-4 py-1.5 text-xs rounded-lg bg-amber-500 text-white hover:bg-amber-600 font-semibold flex items-center gap-1"
                                >
                                    <SlidersHorizontal className="h-3 w-3" />
                                    Edit Bobot
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* ── FILTER ── */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
                        <div className="flex items-center gap-2 mb-3">
                            <SlidersHorizontal className="h-4 w-4 text-gray-500" />
                            <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">Filter Data</span>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-2">
                            <Select className="h-9 text-sm" value={lokasiFilter} onChange={(e) => setLokasiFilter(e.target.value)} placeholder="Semua Lokasi" options={lokasiList.map(l => ({ value: l.lokasi_id, label: l.nama_lokasi }))} />
                            <Select className="h-9 text-sm" value={garduFilter} onChange={(e) => setGarduFilter(e.target.value)} placeholder="Semua Gardu" options={garduList.map(g => ({ value: g.gardu_induk_id, label: g.nama_gardu_induk }))} />
                            <Select className="h-9 text-sm" value={kondisiFilter} onChange={(e) => setKondisiFilter(e.target.value)} placeholder="Semua Kondisi" options={[{ value: "Baik", label: "Baik" }, { value: "Perlu Diganti", label: "Perlu Diganti" }, { value: "Rusak", label: "Rusak" }]} />
                            <div className="flex gap-2">
                                <button onClick={applyFilter} className="flex-1 bg-cyan-600 text-white text-sm rounded-lg hover:bg-cyan-700 font-medium">Terapkan</button>
                                <button onClick={resetFilter} className="px-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600">Reset</button>
                            </div>
                        </div>
                    </div>

                    {/* ── MAIN CARD ── */}
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700">
                        {/* Step Navigator */}
                        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex flex-wrap gap-2">
                                {[
                                    { n: 1, label: "Konversi Nilai" },
                                    { n: 2, label: "Normalisasi" },
                                    { n: 3, label: "Pembobotan" },
                                    { n: 4, label: "Nilai Preferensi" },
                                    { n: 5, label: "Perangkingan" },
                                ].map(s => (
                                    <StepBadge key={s.n} number={s.n} label={s.label} active={activeStep === s.n} onClick={setActiveStep} />
                                ))}
                            </div>

                            {/* Progress bar */}
                            <div className="mt-3 relative h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                                <div
                                    className="absolute inset-y-0 left-0 bg-gradient-to-r from-cyan-500 to-teal-500 rounded-full transition-all duration-500"
                                    style={{ width: `${(activeStep / 5) * 100}%` }}
                                />
                            </div>
                            <p className="text-xs text-gray-400 mt-1">Step {activeStep} dari 5</p>
                        </div>

                        {/* Content area */}
                        <div className="p-4">
                            {alternatif.length === 0 ? (
                                <div className="text-center py-12 text-gray-400">
                                    <BarChart2 className="h-16 w-16 mx-auto mb-3 opacity-20" />
                                    <p className="text-sm">Tidak ada data untuk dianalisis</p>
                                </div>
                            ) : (
                                renderStepContent()
                            )}
                        </div>

                        {/* Navigation buttons */}
                        <div className="px-4 pb-4 flex items-center justify-between border-t border-gray-100 dark:border-gray-700 pt-3">
                            <button
                                disabled={activeStep === 1}
                                onClick={() => setActiveStep(s => s - 1)}
                                className="px-4 py-2 rounded-lg text-sm font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                ← Sebelumnya
                            </button>
                            <span className="text-xs text-gray-400">{alternatifRecalc.length} APD · Rata-rata Vᵢ: {statsRecalc.avgVi}</span>
                            <button
                                disabled={activeStep === 5}
                                onClick={() => setActiveStep(s => s + 1)}
                                className="px-4 py-2 rounded-lg text-sm font-medium bg-cyan-600 text-white hover:bg-cyan-700 disabled:opacity-40 disabled:cursor-not-allowed"
                            >
                                Selanjutnya →
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
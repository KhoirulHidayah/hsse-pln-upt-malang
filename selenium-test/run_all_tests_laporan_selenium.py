from __future__ import annotations

import csv
import html
import re
import subprocess
import sys
import time
from datetime import datetime
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
LOG_DIR = BASE_DIR / "logs" / "selenium_all"
REPORT_DIR = BASE_DIR / "reports"
LOG_DIR.mkdir(parents=True, exist_ok=True)
REPORT_DIR.mkdir(parents=True, exist_ok=True)

# Sesuaikan nama file dengan file yang ada di folder selenium-test kamu.
# File yang tidak ada akan dilewati dan diberi status SKIPPED.
TEST_FILES = [
    # AUTH
    "test_ts01_ts05_auth.py",

    # JENIS APD
    "test_ts06_ts09_jenis_apd.py",

    # MASTER APD
    "test_ts10_ts14_master_apd.py",

    # LOKASI
    "test_ts15_ts18_lokasi.py",

    # GARDU INDUK
    "test_ts19_ts22_gardu_induk.py",

    # MONITORING APD
    "test_ts23_ts27_monitoring_apd.py",
    "test_ts28_ts29_import_template_monitoring_apd.py",

    # PEMERIKSAAN APD
    "test_ts30_ts35_pemeriksaan_apd.py",

    # SAW
    "test_ts36_ts43_saw.py",

    # LAPORAN
    "test_ts44_ts47_laporan.py",

    # NOTIFIKASI
    "test_ts48_ts49_notifikasi_apd.py",

    # SERAH TERIMA BARANG
    "test_ts50_ts54_serah_terima_barang.py",

    # MANAJEMEN USER
    "test_ts55_ts58_user_management.py",

    # PROFIL
    "test_ts59_ts64_profile.py",
]


# Jeda antar script agar Laravel/ChromeDriver tidak terlalu berat saat full run.
# Ini membantu mengurangi error intermittent seperti login kembali ke /login.
SCRIPT_PAUSE_SECONDS = 5
MAX_RETRY_PER_SCRIPT = 1


def has_failed_test(records):
    return any(record.get("status") == "GAGAL" for record in records)


def extract_ts_start(line: str):
    match = re.match(r"^(TS\d{2})\s+-\s+(.+?)\s*$", line.strip())
    if match:
        return match.group(1), match.group(2)
    return None, None


def parse_test_output(output: str, script_name: str):
    records = []
    current_ts = None
    current_title = None
    last_record = None

    for raw_line in output.splitlines():
        line = raw_line.strip()

        ts, title = extract_ts_start(line)
        if ts:
            current_ts = ts
            current_title = title
            continue

        result_match = re.search(r"TEST\s+(TS\d{2})\s+(BERHASIL|GAGAL)", line)
        if result_match:
            ts_id = result_match.group(1)
            status = result_match.group(2)

            record = {
                "test_id": ts_id,
                "skenario": current_title if current_ts == ts_id else "-",
                "status": status,
                "durasi_detik": "",
                "script": script_name,
            }
            records.append(record)
            last_record = record
            continue

        durasi_match = re.search(r"Durasi\s*:\s*([0-9]+(?:\.[0-9]+)?)\s*detik", line)
        if durasi_match and last_record is not None:
            last_record["durasi_detik"] = durasi_match.group(1)

    return records


def run_script(script_name: str):
    script_path = BASE_DIR / script_name

    if not script_path.exists():
        return [{
            "test_id": "-",
            "skenario": f"File tidak ditemukan: {script_name}",
            "status": "SKIPPED",
            "durasi_detik": "",
            "script": script_name,
        }], f"SKIPPED: {script_name} tidak ditemukan.\n"

    print("=" * 90)
    print(f"MENJALANKAN: {script_name}")
    print("=" * 90)

    start = datetime.now()

    process = subprocess.run(
        [sys.executable, script_name],
        cwd=BASE_DIR,
        capture_output=True,
        text=True,
        encoding="utf-8",
        errors="replace",
    )

    end = datetime.now()
    elapsed = round((end - start).total_seconds(), 2)

    output = process.stdout + "\n" + process.stderr

    log_file = LOG_DIR / f"{Path(script_name).stem}.log"
    log_file.write_text(output, encoding="utf-8")

    print(output)

    records = parse_test_output(output, script_name)

    if not records:
        records.append({
            "test_id": "-",
            "skenario": f"Script selesai tanpa format hasil TEST TSxx: {script_name}",
            "status": "GAGAL" if process.returncode != 0 else "BERHASIL",
            "durasi_detik": str(elapsed),
            "script": script_name,
        })

    return records, output


def write_csv(records, path: Path):
    with open(path, "w", newline="", encoding="utf-8-sig") as f:
        writer = csv.DictWriter(
            f,
            fieldnames=["test_id", "skenario", "status", "durasi_detik", "script"],
        )
        writer.writeheader()
        writer.writerows(records)


def write_markdown(records, path: Path):
    total = len([r for r in records if r["status"] != "SKIPPED"])
    berhasil = len([r for r in records if r["status"] == "BERHASIL"])
    gagal = len([r for r in records if r["status"] == "GAGAL"])
    skipped = len([r for r in records if r["status"] == "SKIPPED"])
    persen = round((berhasil / total) * 100, 2) if total else 0

    lines = []
    lines.append("# Laporan Hasil Pengujian Selenium WebDriver")
    lines.append("")
    lines.append(f"Tanggal eksekusi: {datetime.now().strftime('%d-%m-%Y %H:%M:%S')}")
    lines.append("")
    lines.append("## Ringkasan")
    lines.append("")
    lines.append(f"- Total test dijalankan: {total}")
    lines.append(f"- Berhasil: {berhasil}")
    lines.append(f"- Gagal: {gagal}")
    lines.append(f"- File tidak ditemukan / skipped: {skipped}")
    lines.append(f"- Persentase keberhasilan: {persen}%")
    lines.append("")
    lines.append("## Detail Hasil Pengujian")
    lines.append("")
    lines.append("| Test ID | Skenario | Status | Durasi (detik) | Script |")
    lines.append("|---|---|---|---:|---|")

    for r in records:
        lines.append(
            f"| {r['test_id']} | {r['skenario']} | {r['status']} | {r['durasi_detik']} | {r['script']} |"
        )

    path.write_text("\n".join(lines), encoding="utf-8")


def write_html(records, path: Path):
    total = len([r for r in records if r["status"] != "SKIPPED"])
    berhasil = len([r for r in records if r["status"] == "BERHASIL"])
    gagal = len([r for r in records if r["status"] == "GAGAL"])
    skipped = len([r for r in records if r["status"] == "SKIPPED"])
    persen = round((berhasil / total) * 100, 2) if total else 0

    rows_html = []
    for r in records:
        status = r["status"]
        cls = "ok" if status == "BERHASIL" else "fail" if status == "GAGAL" else "skip"
        rows_html.append(
            "<tr>"
            f"<td>{html.escape(r['test_id'])}</td>"
            f"<td>{html.escape(r['skenario'])}</td>"
            f"<td class='{cls}'>{html.escape(status)}</td>"
            f"<td>{html.escape(r['durasi_detik'])}</td>"
            f"<td>{html.escape(r['script'])}</td>"
            "</tr>"
        )

    doc = f"""
<!doctype html>
<html lang="id">
<head>
<meta charset="utf-8">
<title>Laporan Selenium WebDriver</title>
<style>
body {{ font-family: Arial, sans-serif; margin: 24px; color: #111827; }}
h1 {{ margin-bottom: 4px; }}
.summary {{ display: grid; grid-template-columns: repeat(5, 1fr); gap: 12px; margin: 20px 0; }}
.card {{ border: 1px solid #e5e7eb; border-radius: 10px; padding: 12px; background: #f9fafb; }}
.card b {{ display: block; font-size: 22px; margin-top: 6px; }}
table {{ border-collapse: collapse; width: 100%; font-size: 13px; }}
th, td {{ border: 1px solid #d1d5db; padding: 8px; text-align: left; }}
th {{ background: #0f766e; color: white; }}
.ok {{ color: #047857; font-weight: bold; }}
.fail {{ color: #dc2626; font-weight: bold; }}
.skip {{ color: #b45309; font-weight: bold; }}
@media print {{ body {{ margin: 12px; }} .summary {{ grid-template-columns: repeat(5, 1fr); }} }}
</style>
</head>
<body>
<h1>Laporan Hasil Pengujian Selenium WebDriver</h1>
<p>Tanggal eksekusi: {datetime.now().strftime('%d-%m-%Y %H:%M:%S')}</p>
<div class="summary">
  <div class="card">Total Test<b>{total}</b></div>
  <div class="card">Berhasil<b>{berhasil}</b></div>
  <div class="card">Gagal<b>{gagal}</b></div>
  <div class="card">Skipped<b>{skipped}</b></div>
  <div class="card">Keberhasilan<b>{persen}%</b></div>
</div>
<table>
<thead><tr><th>Test ID</th><th>Skenario</th><th>Status</th><th>Durasi (detik)</th><th>Script</th></tr></thead>
<tbody>
{''.join(rows_html)}
</tbody>
</table>
</body>
</html>
"""
    path.write_text(doc, encoding="utf-8")


def main():
    all_records = []

    for script_name in TEST_FILES:
        final_records = None

        for attempt in range(1, MAX_RETRY_PER_SCRIPT + 2):
            if attempt > 1:
                print("\n" + "!" * 90)
                print(f"RETRY {attempt - 1}: menjalankan ulang {script_name} karena masih ada test gagal")
                print("!" * 90)
                time.sleep(SCRIPT_PAUSE_SECONDS)

            records, _ = run_script(script_name)
            final_records = records

            # Jika file tidak ada, tidak perlu retry.
            if all(record.get("status") == "SKIPPED" for record in records):
                break

            if not has_failed_test(records):
                break

        all_records.extend(final_records or [])
        time.sleep(SCRIPT_PAUSE_SECONDS)

    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    csv_path = REPORT_DIR / f"laporan_selenium_{timestamp}.csv"
    md_path = REPORT_DIR / f"laporan_selenium_{timestamp}.md"
    html_path = REPORT_DIR / f"laporan_selenium_{timestamp}.html"

    write_csv(all_records, csv_path)
    write_markdown(all_records, md_path)
    write_html(all_records, html_path)

    print("\n" + "=" * 90)
    print("LAPORAN SELESAI DIBUAT")
    print("=" * 90)
    print(f"CSV      : {csv_path}")
    print(f"Markdown : {md_path}")
    print(f"HTML     : {html_path}")
    print(f"Log      : {LOG_DIR}")


if __name__ == "__main__":
    main()

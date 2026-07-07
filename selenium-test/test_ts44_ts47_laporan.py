import time
from urllib.parse import quote_plus

from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import Select as SeleniumSelect

from config import BASE_URL, ADMIN_LOGIN, ADMIN_PASSWORD
from helpers import (
    run_case,
    login_user,
    get_wait,
    wait_for_text,
    get_body_text_normalized,
)


# ============================================================
# KONFIGURASI URL
# ============================================================

SAW_URL = f"{BASE_URL}/monitoring-apd/saw"
LAPORAN_URL = f"{BASE_URL}/monitoring-apd/laporan"

KONDISI_OPTIONS = ["Perlu Diganti", "Rusak", "Baik"]


# ============================================================
# HELPER UMUM
# ============================================================

def login_admin(driver):
    login_user(
        driver,
        ADMIN_LOGIN,
        ADMIN_PASSWORD,
        expected_url_contains="dashboard"
    )


def get_visible_selects(driver):
    selects = driver.find_elements(By.TAG_NAME, "select")
    return [select for select in selects if select.is_displayed()]


def get_first_data_row(driver):
    rows = driver.find_elements(By.CSS_SELECTOR, "tbody tr")

    for row in rows:
        text = row.text.strip().lower()

        if not text:
            continue

        if "tidak ada data" in text:
            continue

        if "tidak ada data yang ditampilkan" in text:
            continue

        if "tidak ada data untuk dianalisis" in text:
            continue

        return row

    return None


def ensure_first_data_row(driver, page_name):
    row = get_first_data_row(driver)

    if row is None:
        body_text = get_body_text_normalized(driver)
        raise Exception(
            f"Data pada halaman {page_name} tidak ditemukan. "
            f"Pastikan data Monitoring APD tersedia. Teks halaman: {body_text[:700]}"
        )

    return row


def detect_kondisi_from_row(row):
    row_text = row.text.lower()

    for kondisi in KONDISI_OPTIONS:
        if kondisi.lower() in row_text:
            return kondisi

    raise Exception(
        "Kondisi APD tidak bisa dideteksi dari baris data. "
        f"Teks baris: {row.text}"
    )


def click_button_by_text(driver, text):
    wait = get_wait(driver)

    button = wait.until(
        EC.element_to_be_clickable((
            By.XPATH,
            f"//button[contains(., '{text}')]"
        ))
    )

    driver.execute_script(
        "arguments[0].scrollIntoView({block: 'center'});",
        button
    )
    time.sleep(0.3)

    driver.execute_script("arguments[0].click();", button)

    return button


def select_by_visible_text_safe(driver, select_el, visible_text):
    driver.execute_script(
        "arguments[0].scrollIntoView({block: 'center'});",
        select_el
    )
    time.sleep(0.3)

    select_obj = SeleniumSelect(select_el)

    try:
        select_obj.select_by_visible_text(visible_text)
    except Exception:
        select_obj.select_by_value(visible_text)

    driver.execute_script(
        "arguments[0].dispatchEvent(new Event('change', { bubbles: true }));",
        select_el
    )

    time.sleep(0.8)


# ============================================================
# HELPER SAW
# ============================================================

def wait_for_saw_page(driver):
    wait = get_wait(driver)

    wait.until(
        lambda d: d.current_url.split("?")[0].rstrip("/").endswith("/monitoring-apd/saw")
    )

    wait_for_text(driver, [
        "analisis saw",
        "simple additive weighting",
        "total apd",
    ])


def open_saw_page(driver):
    login_admin(driver)
    driver.get(SAW_URL)
    wait_for_saw_page(driver)


def get_saw_kondisi_filter_select(driver):
    # Halaman SAW punya 3 select filter: lokasi, gardu, kondisi.
    selects = get_visible_selects(driver)

    if len(selects) < 3:
        raise Exception(
            f"Dropdown filter kondisi pada halaman SAW tidak ditemukan. Jumlah select terlihat: {len(selects)}"
        )

    return selects[2]


def apply_saw_kondisi_filter(driver, kondisi):
    wait = get_wait(driver)

    kondisi_select = get_saw_kondisi_filter_select(driver)
    select_by_visible_text_safe(driver, kondisi_select, kondisi)

    click_button_by_text(driver, "Terapkan Filter")

    encoded = quote_plus(kondisi)

    try:
        wait.until(
            lambda d:
                f"kondisi={encoded}" in d.current_url
                or f"kondisi={kondisi}" in d.current_url
        )
    except Exception:
        # Inertia kadang preserveState, jadi tetap beri jeda aman.
        pass

    time.sleep(2.5)


# ============================================================
# HELPER LAPORAN
# ============================================================

def wait_for_laporan_page(driver):
    wait = get_wait(driver)

    wait.until(
        lambda d: d.current_url.split("?")[0].rstrip("/").endswith("/monitoring-apd/laporan")
    )

    wait_for_text(driver, [
        "laporan masa pakai apd",
        "filter laporan",
        "total apd",
    ])


def open_laporan_page(driver):
    login_admin(driver)
    driver.get(LAPORAN_URL)
    wait_for_laporan_page(driver)


def get_laporan_kondisi_filter_select(driver):
    # Halaman laporan punya 4 select filter: lokasi, gardu, kondisi, status.
    selects = get_visible_selects(driver)

    if len(selects) < 4:
        raise Exception(
            f"Dropdown filter kondisi pada halaman Laporan tidak ditemukan. Jumlah select terlihat: {len(selects)}"
        )

    return selects[2]


def apply_laporan_kondisi_filter(driver, kondisi):
    wait = get_wait(driver)

    kondisi_select = get_laporan_kondisi_filter_select(driver)
    select_by_visible_text_safe(driver, kondisi_select, kondisi)

    click_button_by_text(driver, "Terapkan Filter")

    encoded = quote_plus(kondisi)

    try:
        wait.until(
            lambda d:
                f"kondisi={encoded}" in d.current_url
                or f"kondisi={kondisi}" in d.current_url
        )
    except Exception:
        # Jika URL tidak langsung berubah, tetap lanjut setelah jeda karena Inertia bisa preserveState.
        pass

    time.sleep(2.5)


# ============================================================
# TS35 - MENAMPILKAN HALAMAN ANALISIS SAW
# ============================================================

def ts35_menampilkan_halaman_analisis_saw(driver):
    open_saw_page(driver)

    body_text = get_body_text_normalized(driver)

    teks_wajib = [
        "analisis saw",
        "simple additive weighting",
        "total apd",
        "layak",
        "perlu pengecekan",
        "tidak layak",
        "konversi nilai",
        "normalisasi",
        "pembobotan",
        "nilai preferensi",
        "perangkingan",
    ]

    for teks in teks_wajib:
        if teks not in body_text:
            raise Exception(f"Teks '{teks}' tidak ditemukan pada halaman Analisis SAW.")

    ensure_first_data_row(driver, "Analisis SAW")


# ============================================================
# TS36 - MENAMPILKAN STEP PERHITUNGAN SAW
# ============================================================

def ts36_menampilkan_step_perhitungan_saw(driver):
    open_saw_page(driver)

    step_checks = [
        ("Konversi Nilai", ["fungsi konversi nilai", "c1", "c2", "c3"]),
        ("Normalisasi", ["rumus normalisasi", "benefit", "cost"]),
        ("Pembobotan", ["pembobotan", "bobot"]),
        ("Nilai Preferensi", ["rumus nilai preferensi", "vᵢ"]),
        ("Perangkingan", ["ranking", "status", "detail"]),
    ]

    for button_text, expected_texts in step_checks:
        click_button_by_text(driver, button_text)
        time.sleep(1)

        body_text = get_body_text_normalized(driver)

        for teks in expected_texts:
            if teks.lower() not in body_text:
                raise Exception(
                    f"Setelah klik step '{button_text}', teks '{teks}' tidak ditemukan."
                )


# ============================================================
# TS37 - FILTER DATA ANALISIS SAW BERDASARKAN KONDISI
# ============================================================

def ts37_filter_data_analisis_saw(driver):
    open_saw_page(driver)

    first_row = ensure_first_data_row(driver, "Analisis SAW")
    kondisi_target = detect_kondisi_from_row(first_row)

    apply_saw_kondisi_filter(driver, kondisi_target)

    row = ensure_first_data_row(driver, "Analisis SAW setelah filter")

    if kondisi_target.lower() not in row.text.lower():
        raise Exception(
            f"Filter SAW kondisi '{kondisi_target}' tidak sesuai. "
            f"Teks baris pertama: {row.text}"
        )

    print(f"Filter SAW berhasil menggunakan kondisi: {kondisi_target}")


# ============================================================
# TS38 - MENAMPILKAN HALAMAN LAPORAN MONITORING APD
# ============================================================

def ts38_menampilkan_laporan_monitoring_apd(driver):
    open_laporan_page(driver)

    body_text = get_body_text_normalized(driver)

    teks_wajib = [
        "laporan masa pakai apd",
        "analisis dan monitoring masa pakai apd",
        "filter laporan",
        "export excel",
        "cetak",
        "total apd",
        "active",
        "warning",
        "expired",
        "kode apd",
        "nama apd",
        "lokasi",
        "gardu induk",
        "stok",
        "distribusi",
        "berakhir",
        "masa pakai",
        "sisa hari",
        "kondisi",
        "status",
    ]

    for teks in teks_wajib:
        if teks not in body_text:
            raise Exception(f"Teks/kolom '{teks}' tidak ditemukan pada halaman Laporan Monitoring APD.")

    ensure_first_data_row(driver, "Laporan Monitoring APD")


# ============================================================
# TS39 - FILTER DAN CETAK LAPORAN MONITORING APD
# ============================================================

def ts39_filter_dan_cetak_laporan_monitoring_apd(driver):
    open_laporan_page(driver)

    first_row = ensure_first_data_row(driver, "Laporan Monitoring APD")
    kondisi_target = detect_kondisi_from_row(first_row)

    apply_laporan_kondisi_filter(driver, kondisi_target)

    row = ensure_first_data_row(driver, "Laporan Monitoring APD setelah filter")

    if kondisi_target.lower() not in row.text.lower():
        raise Exception(
            f"Filter laporan kondisi '{kondisi_target}' tidak sesuai. "
            f"Teks baris pertama: {row.text}"
        )

    # Pastikan tombol Export Excel tersedia, tetapi tidak diklik agar browser tidak masuk mode download.
    wait = get_wait(driver)
    export_button = wait.until(
        EC.visibility_of_element_located((
            By.XPATH,
            "//button[contains(., 'Export Excel')]"
        ))
    )

    if not export_button.is_displayed():
        raise Exception("Tombol Export Excel tidak tampil pada halaman Laporan.")

    # Uji tombol Cetak tanpa memunculkan dialog print OS.
    driver.execute_script(
        """
        window.__printCalled = false;
        window.print = function() {
            window.__printCalled = true;
        };
        """
    )

    click_button_by_text(driver, "Cetak")

    wait.until(lambda d: d.execute_script("return window.__printCalled === true;"))

    print(f"Filter laporan berhasil menggunakan kondisi: {kondisi_target}")
    print("Tombol Cetak berhasil diuji tanpa membuka dialog print.")

# ============================================================
# HELPER DOWNLOAD LAPORAN
# ============================================================

from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
DOWNLOAD_DIR = BASE_DIR / "downloads"
DOWNLOAD_DIR.mkdir(exist_ok=True)


def configure_download_dir(driver):
    DOWNLOAD_DIR.mkdir(exist_ok=True)

    try:
        driver.execute_cdp_cmd(
            "Page.setDownloadBehavior",
            {
                "behavior": "allow",
                "downloadPath": str(DOWNLOAD_DIR.resolve()),
            }
        )
    except Exception:
        pass


def wait_for_download_complete(before_files, timeout=40):
    end_time = time.time() + timeout

    while time.time() < end_time:
        current_files = set(DOWNLOAD_DIR.glob("*"))
        new_files = list(current_files - before_files)

        complete_files = [
            f for f in new_files
            if f.is_file() and not f.name.endswith(".crdownload")
        ]

        temporary_files = [
            f for f in current_files
            if f.name.endswith(".crdownload")
        ]

        if complete_files and not temporary_files:
            return complete_files[0]

        time.sleep(1)

    raise Exception("File export laporan tidak berhasil terunduh ke folder downloads dalam batas waktu.")


# ============================================================
# TS44 - MENAMPILKAN LAPORAN MONITORING APD
# ============================================================

def ts44_menampilkan_laporan_monitoring_apd(driver):
    ts38_menampilkan_laporan_monitoring_apd(driver)


# ============================================================
# TS45 - FILTER LAPORAN MONITORING APD
# ============================================================

def ts45_filter_laporan_monitoring_apd(driver):
    open_laporan_page(driver)

    first_row = ensure_first_data_row(driver, "Laporan Monitoring APD")
    kondisi_target = detect_kondisi_from_row(first_row)

    apply_laporan_kondisi_filter(driver, kondisi_target)

    row = ensure_first_data_row(driver, "Laporan Monitoring APD setelah filter")

    if kondisi_target.lower() not in row.text.lower():
        raise Exception(
            f"Filter laporan kondisi '{kondisi_target}' tidak sesuai. "
            f"Teks baris pertama: {row.text}"
        )

    print(f"Filter laporan berhasil menggunakan kondisi: {kondisi_target}")


# ============================================================
# TS46 - CETAK LAPORAN MONITORING APD
# ============================================================

def ts46_cetak_laporan_monitoring_apd(driver):
    open_laporan_page(driver)

    ensure_first_data_row(driver, "Laporan Monitoring APD")

    # Ganti window.print agar tidak membuka dialog print Windows.
    driver.execute_script(
        """
        window.__printCalled = false;
        window.print = function() {
            window.__printCalled = true;
        };
        """
    )

    click_button_by_text(driver, "Cetak")

    wait = get_wait(driver)
    wait.until(lambda d: d.execute_script("return window.__printCalled === true;"))

    print("Fungsi Cetak Laporan berhasil dipanggil tanpa membuka dialog print.")


# ============================================================
# TS47 - EXPORT LAPORAN MONITORING APD
# ============================================================

def ts47_export_laporan_monitoring_apd(driver):
    configure_download_dir(driver)

    open_laporan_page(driver)

    ensure_first_data_row(driver, "Laporan Monitoring APD")

    before_files = set(DOWNLOAD_DIR.glob("*"))

    click_button_by_text(driver, "Export Excel")

    downloaded_file = wait_for_download_complete(before_files, timeout=50)

    if downloaded_file.suffix.lower() not in [".xlsx", ".xls", ".csv"]:
        raise Exception(
            f"File export laporan terunduh, tetapi formatnya tidak sesuai: {downloaded_file.name}"
        )

    print(f"Export laporan berhasil diunduh: {downloaded_file}")


# ============================================================
# MAIN RUNNER SESUAI TABEL TS44-TS47
# ============================================================

if __name__ == "__main__":
    results = []

    results.append(run_case("TS44", "Menampilkan Laporan Monitoring APD", ts44_menampilkan_laporan_monitoring_apd))
    results.append(run_case("TS45", "Filter Laporan Monitoring APD", ts45_filter_laporan_monitoring_apd))
    results.append(run_case("TS46", "Cetak Laporan Monitoring APD", ts46_cetak_laporan_monitoring_apd))
    results.append(run_case("TS47", "Export Laporan Monitoring APD", ts47_export_laporan_monitoring_apd))

    print("\n" + "=" * 80)
    print("RINGKASAN PENGUJIAN LAPORAN TS44-TS47")
    print("=" * 80)
    print(f"Total Test : {len(results)}")
    print(f"Berhasil   : {results.count(True)}")
    print(f"Gagal      : {results.count(False)}")

    if all(results):
        print("SEMUA TEST LAPORAN TS44-TS47 BERHASIL")
    else:
        print("ADA TEST LAPORAN TS44-TS47 YANG GAGAL")

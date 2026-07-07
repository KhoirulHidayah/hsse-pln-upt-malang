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


def click_apply_filter_button(driver):
    """Tombol filter di halaman SAW bertuliskan 'Terapkan', bukan 'Terapkan Filter'."""
    wait = get_wait(driver)

    button = wait.until(
        EC.element_to_be_clickable((
            By.XPATH,
            "//button[contains(., 'Terapkan Filter') or contains(., 'Terapkan')]"
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

    click_apply_filter_button(driver)

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
# HELPER STEP SAW
# ============================================================

def click_step_saw(driver, step_text):
    click_button_by_text(driver, step_text)
    time.sleep(1)


def assert_texts_exist(driver, texts, context):
    body_text = get_body_text_normalized(driver)

    for teks in texts:
        if teks.lower() not in body_text:
            raise Exception(f"Teks '{teks}' tidak ditemukan pada {context}.")


# ============================================================
# TS36 - MENAMPILKAN ANALISIS KELAYAKAN APD
# ============================================================

def ts36_menampilkan_analisis_kelayakan_apd(driver):
    open_saw_page(driver)

    assert_texts_exist(driver, [
        "analisis saw",
        "simple additive weighting",
        "total apd",
        "layak",
        "perlu pengecekan",
        "tidak layak",
    ], "halaman Analisis Kelayakan APD")

    ensure_first_data_row(driver, "Analisis Kelayakan APD")


# ============================================================
# TS37 - MENAMPILKAN KONVERSI NILAI KRITERIA SAW
# ============================================================

def ts37_menampilkan_konversi_nilai_kriteria_saw(driver):
    open_saw_page(driver)

    click_step_saw(driver, "Konversi Nilai")

    assert_texts_exist(driver, [
        "fungsi konversi nilai",
        "c1",
        "c2",
        "c3",
        "masa berlaku",
        "masa pakai",
        "kondisi",
    ], "step Konversi Nilai SAW")

    ensure_first_data_row(driver, "Konversi Nilai SAW")


# ============================================================
# TS38 - MENAMPILKAN NORMALISASI SAW
# ============================================================

def ts38_menampilkan_normalisasi_saw(driver):
    open_saw_page(driver)

    click_step_saw(driver, "Normalisasi")

    assert_texts_exist(driver, [
        "rumus normalisasi",
        "benefit",
        "cost",
        "r₁",
        "r₂",
        "r₃",
    ], "step Normalisasi SAW")

    ensure_first_data_row(driver, "Normalisasi SAW")


# ============================================================
# TS39 - MENAMPILKAN PEMBOBOTAN SAW
# ============================================================

def ts39_menampilkan_pembobotan_saw(driver):
    open_saw_page(driver)

    click_step_saw(driver, "Pembobotan")

    assert_texts_exist(driver, [
        "pembobotan",
        "bobot",
        "w₁",
        "w₂",
        "w₃",
    ], "step Pembobotan SAW")

    ensure_first_data_row(driver, "Pembobotan SAW")


# ============================================================
# TS40 - MENAMPILKAN NILAI PREFERENSI SAW
# ============================================================

def ts40_menampilkan_nilai_preferensi_saw(driver):
    open_saw_page(driver)

    click_step_saw(driver, "Nilai Preferensi")

    assert_texts_exist(driver, [
        "rumus nilai preferensi",
        "nilai preferensi",
        "vᵢ",
        "preferensi",
    ], "step Nilai Preferensi SAW")

    ensure_first_data_row(driver, "Nilai Preferensi SAW")


# ============================================================
# TS41 - MENAMPILKAN RANKING KELAYAKAN APD
# ============================================================

def ts41_menampilkan_ranking_kelayakan_apd(driver):
    open_saw_page(driver)

    click_step_saw(driver, "Perangkingan")

    assert_texts_exist(driver, [
        "ranking",
        "status",
        "layak",
    ], "step Perangkingan SAW")

    ensure_first_data_row(driver, "Ranking Kelayakan APD")


# ============================================================
# TS42 - MENAMPILKAN DETAIL PERHITUNGAN SAW
# ============================================================

def ts42_menampilkan_detail_perhitungan_saw(driver):
    open_saw_page(driver)

    click_step_saw(driver, "Perangkingan")

    wait = get_wait(driver)

    detail_button = wait.until(
        EC.element_to_be_clickable((
            By.XPATH,
            "//button[contains(., 'Detail') or contains(., 'Lihat')]"
        ))
    )

    driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", detail_button)
    time.sleep(0.3)
    driver.execute_script("arguments[0].click();", detail_button)

    wait_for_text(driver, [
        "detail perhitungan saw",
        "step 1",
        "konversi nilai kriteria",
        "normalisasi",
        "pembobotan",
        "nilai preferensi",
    ])


# ============================================================
# TS43 - FILTER DATA ANALISIS SAW
# ============================================================

def ts43_filter_data_analisis_saw(driver):
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
# MAIN RUNNER SESUAI TABEL TS36-TS43
# ============================================================

if __name__ == "__main__":
    results = []

    results.append(run_case("TS36", "Menampilkan Analisis Kelayakan APD", ts36_menampilkan_analisis_kelayakan_apd))
    results.append(run_case("TS37", "Menampilkan Konversi Nilai Kriteria SAW", ts37_menampilkan_konversi_nilai_kriteria_saw))
    results.append(run_case("TS38", "Menampilkan Normalisasi SAW", ts38_menampilkan_normalisasi_saw))
    results.append(run_case("TS39", "Menampilkan Pembobotan SAW", ts39_menampilkan_pembobotan_saw))
    results.append(run_case("TS40", "Menampilkan Nilai Preferensi SAW", ts40_menampilkan_nilai_preferensi_saw))
    results.append(run_case("TS41", "Menampilkan Ranking Kelayakan APD", ts41_menampilkan_ranking_kelayakan_apd))
    results.append(run_case("TS42", "Menampilkan Detail Perhitungan SAW", ts42_menampilkan_detail_perhitungan_saw))
    results.append(run_case("TS43", "Filter Data Analisis SAW", ts43_filter_data_analisis_saw))

    print("\n" + "=" * 80)
    print("RINGKASAN PENGUJIAN SAW TS36-TS43")
    print("=" * 80)
    print(f"Total Test : {len(results)}")
    print(f"Berhasil   : {results.count(True)}")
    print(f"Gagal      : {results.count(False)}")

    if all(results):
        print("SEMUA TEST SAW TS36-TS43 BERHASIL")
    else:
        print("ADA TEST SAW TS36-TS43 YANG GAGAL")

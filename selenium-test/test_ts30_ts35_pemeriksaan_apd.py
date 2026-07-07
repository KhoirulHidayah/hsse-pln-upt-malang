import re
import time
from urllib.parse import quote_plus

from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import Select as SeleniumSelect

from config import (
    BASE_URL,
    ADMIN_LOGIN,
    ADMIN_PASSWORD,
    PEMERIKSA_LOGIN,
    PEMERIKSA_PASSWORD,
)
from helpers import (
    run_case,
    login_user,
    get_wait,
    wait_for_text,
    get_body_text_normalized,
)


# ============================================================
# DATA TEST / STATE
# ============================================================

KONDISI_OPTIONS = ["Baik", "Perlu Diganti", "Rusak"]

# Disimpan setelah TS33 agar TS34 bisa memfilter kondisi yang baru di-update
STATE = {
    "updated_kondisi": None,
}


# ============================================================
# HELPER KHUSUS PEMERIKSAAN APD
# ============================================================

def wait_for_pemeriksaan_index(driver):
    wait = get_wait(driver)

    wait.until(
        lambda d: d.current_url.split("?")[0].rstrip("/").endswith("/pemeriksaan-apd")
    )

    wait_for_text(driver, [
        "pemeriksaan apd",
        "pemeriksaan kondisi apd",
    ])


def wait_for_pemeriksaan_show(driver):
    wait = get_wait(driver)

    wait.until(
        lambda d:
            "/pemeriksaan-apd/" in d.current_url
            and not d.current_url.split("?")[0].rstrip("/").endswith("/pemeriksaan-apd")
    )

    wait_for_text(driver, [
        "pemeriksaan kondisi fisik apd",
        "detail pemeriksaan",
        "update kondisi",
    ])


def open_pemeriksaan_index_admin(driver):
    login_user(
        driver,
        ADMIN_LOGIN,
        ADMIN_PASSWORD,
        expected_url_contains="dashboard"
    )

    driver.get(f"{BASE_URL}/pemeriksaan-apd")
    wait_for_pemeriksaan_index(driver)


def open_pemeriksaan_show_pemeriksa(driver):
    login_user(
        driver,
        PEMERIKSA_LOGIN,
        PEMERIKSA_PASSWORD,
        expected_url_contains="pemeriksaan-apd"
    )

    wait_for_pemeriksaan_show(driver)


def get_gardu_links(driver):
    return driver.find_elements(By.CSS_SELECTOR, "a[href*='/pemeriksaan-apd/']")


def choose_gardu_link_with_apd(driver):
    """
    Pilih kartu gardu yang memiliki total APD > 0.
    Jika tidak bisa membaca jumlah APD, pilih link pertama yang tersedia.
    """
    links = get_gardu_links(driver)

    if not links:
        raise Exception("Link/kartu Gardu Induk pada halaman Pemeriksaan APD tidak ditemukan.")

    fallback = links[0]

    for link in links:
        text = link.text.strip()
        match = re.search(r"(\d+)\s+APD", text, re.IGNORECASE)

        if match:
            total_apd = int(match.group(1))
            if total_apd > 0:
                return link

    return fallback


def open_first_gardu_detail_admin(driver):
    open_pemeriksaan_index_admin(driver)

    link = choose_gardu_link_with_apd(driver)

    driver.execute_script(
        "arguments[0].scrollIntoView({block: 'center'});",
        link
    )
    time.sleep(0.3)

    driver.execute_script("arguments[0].click();", link)

    wait_for_pemeriksaan_show(driver)


def get_first_data_row(driver):
    rows = driver.find_elements(By.CSS_SELECTOR, "tbody tr")

    for row in rows:
        text = row.text.lower().strip()

        if text and "belum ada apd" not in text and "tidak ada data" not in text:
            return row

    return None


def ensure_has_apd_row(driver):
    row = get_first_data_row(driver)

    if row is None:
        body_text = get_body_text_normalized(driver)
        raise Exception(
            "Data APD pada halaman Pemeriksaan APD tidak ditemukan. "
            "Pastikan ada data Monitoring APD pada gardu induk milik pemeriksa. "
            f"Teks halaman: {body_text[:600]}"
        )

    return row


def get_update_select_from_row(row):
    selects = row.find_elements(By.TAG_NAME, "select")

    if not selects:
        raise Exception("Dropdown Update Kondisi pada baris APD tidak ditemukan.")

    # Pada baris tabel Pemeriksaan APD hanya ada satu dropdown update kondisi.
    return selects[-1]


def get_save_button_from_row(row):
    buttons = row.find_elements(By.XPATH, ".//button[contains(., 'Simpan')]")

    if not buttons:
        raise Exception("Tombol Simpan pada baris APD tidak ditemukan.")

    return buttons[-1]


def pilih_kondisi_baru(current_kondisi):
    # Diusahakan update ke Rusak agar TS34 bisa filter Rusak.
    if current_kondisi != "Rusak":
        return "Rusak"

    # Jika data sudah Rusak, ubah ke Baik agar tombol Simpan aktif.
    return "Baik"


def update_first_row_condition(driver):
    wait = get_wait(driver)

    row = ensure_has_apd_row(driver)

    update_select = get_update_select_from_row(row)
    select_obj = SeleniumSelect(update_select)

    current_kondisi = select_obj.first_selected_option.text.strip()
    target_kondisi = pilih_kondisi_baru(current_kondisi)

    driver.execute_script(
        "arguments[0].scrollIntoView({block: 'center'});",
        update_select
    )
    time.sleep(0.3)

    select_obj.select_by_visible_text(target_kondisi)

    driver.execute_script(
        "arguments[0].dispatchEvent(new Event('change', { bubbles: true }));",
        update_select
    )

    time.sleep(1)

    # Ambil ulang row dan button setelah state React berubah
    row = ensure_has_apd_row(driver)
    save_button = get_save_button_from_row(row)

    wait.until(lambda d: save_button.is_enabled())

    driver.execute_script(
        "arguments[0].scrollIntoView({block: 'center'});",
        save_button
    )
    time.sleep(0.3)

    driver.execute_script("arguments[0].click();", save_button)

    wait_for_text(driver, [
        "kondisi apd berhasil diperbarui",
        "berhasil diperbarui",
    ])

    STATE["updated_kondisi"] = target_kondisi

    return target_kondisi


def get_filter_kondisi_select(driver):
    wait = get_wait(driver)

    # Select filter kondisi adalah select pertama setelah input pencarian filter.
    return wait.until(
        EC.visibility_of_element_located((
            By.XPATH,
            "//input[contains(@placeholder, 'Cari nama') or contains(@placeholder, 'Cari')]/following::select[1]"
        ))
    )


def filter_kondisi(driver, kondisi):
    wait = get_wait(driver)

    kondisi_select_el = get_filter_kondisi_select(driver)

    driver.execute_script(
        "arguments[0].scrollIntoView({block: 'center'});",
        kondisi_select_el
    )
    time.sleep(0.3)

    kondisi_select = SeleniumSelect(kondisi_select_el)

    try:
        kondisi_select.select_by_visible_text(kondisi)
    except Exception:
        kondisi_select.select_by_value(kondisi)

    driver.execute_script(
        "arguments[0].dispatchEvent(new Event('change', { bubbles: true }));",
        kondisi_select_el
    )

    # Tunggu query filter Inertia masuk ke URL atau hasil reload selesai.
    encoded = quote_plus(kondisi)
    try:
        wait.until(lambda d: f"kondisi={encoded}" in d.current_url or f"kondisi={kondisi}" in d.current_url)
    except Exception:
        # Tetap beri jeda karena kadang preserveState tidak langsung terlihat di URL.
        pass

    time.sleep(2.5)


def search_pemeriksaan(driver, keyword):
    wait = get_wait(driver)

    search_input = wait.until(
        EC.visibility_of_element_located((
            By.CSS_SELECTOR,
            "input[placeholder='Cari nama / kode APD...'], input[placeholder*='Cari nama'], input[placeholder*='Cari']"
        ))
    )

    search_input.click()
    search_input.send_keys(Keys.CONTROL, "a")
    search_input.send_keys(Keys.BACKSPACE)
    search_input.send_keys(keyword)

    time.sleep(2.5)


# ============================================================
# TS30 - MENAMPILKAN DATA PEMERIKSAAN APD ADMIN
# ============================================================

def ts30_menampilkan_data_pemeriksaan_apd_admin(driver):
    open_pemeriksaan_index_admin(driver)

    body_text = get_body_text_normalized(driver)

    teks_wajib = [
        "pemeriksaan kondisi apd",
        "pilih gardu induk",
        "apd",
        "pemeriksa",
    ]

    for teks in teks_wajib:
        if teks not in body_text:
            raise Exception(f"Teks '{teks}' tidak ditemukan pada halaman daftar Pemeriksaan APD.")

    links = get_gardu_links(driver)

    if not links:
        raise Exception("Daftar Gardu Induk pada halaman Pemeriksaan APD tidak ditemukan.")


# ============================================================
# TS31 - MENAMPILKAN DETAIL PEMERIKSAAN APD ADMIN
# ============================================================

def ts31_menampilkan_detail_pemeriksaan_apd_admin(driver):
    open_first_gardu_detail_admin(driver)

    body_text = get_body_text_normalized(driver)

    teks_wajib = [
        "pemeriksaan kondisi fisik apd",
        "baik",
        "perlu diganti",
        "rusak",
        "update kondisi",
    ]

    for teks in teks_wajib:
        if teks not in body_text:
            raise Exception(f"Teks '{teks}' tidak ditemukan pada halaman detail Pemeriksaan APD.")

    ensure_has_apd_row(driver)


# ============================================================
# TS32 - MENAMPILKAN DATA PEMERIKSAAN APD PEMERIKSA
# ============================================================

def ts32_menampilkan_data_pemeriksaan_apd_pemeriksa(driver):
    open_pemeriksaan_show_pemeriksa(driver)

    body_text = get_body_text_normalized(driver)

    teks_wajib = [
        "pemeriksaan kondisi fisik apd",
        "stok",
        "tanggal distribusi",
        "masa berlaku",
        "kondisi saat ini",
        "update kondisi",
        "simpan",
    ]

    for teks in teks_wajib:
        if teks not in body_text:
            raise Exception(f"Teks/kolom '{teks}' tidak ditemukan pada halaman Pemeriksaan APD Pemeriksa.")

    ensure_has_apd_row(driver)


# ============================================================
# TS33 - UPDATE KONDISI PEMERIKSAAN APD
# ============================================================

def ts33_update_kondisi_pemeriksaan_apd(driver):
    open_pemeriksaan_show_pemeriksa(driver)

    target_kondisi = update_first_row_condition(driver)

    body_text = get_body_text_normalized(driver)

    if target_kondisi.lower() not in body_text:
        raise Exception(
            f"Kondisi baru '{target_kondisi}' tidak terdeteksi setelah update kondisi APD."
        )

    print(f"Kondisi APD berhasil diubah menjadi: {target_kondisi}")


# ============================================================
# TS34 - FILTER KONDISI PEMERIKSAAN APD
# ============================================================

def ts34_filter_kondisi_pemeriksaan_apd(driver):
    open_pemeriksaan_show_pemeriksa(driver)

    kondisi_target = STATE.get("updated_kondisi") or "Rusak"

    filter_kondisi(driver, kondisi_target)

    row = get_first_data_row(driver)

    if row is None:
        raise Exception(
            f"Data Pemeriksaan APD tidak ditemukan saat filter kondisi '{kondisi_target}' diterapkan."
        )

    if kondisi_target.lower() not in row.text.lower():
        raise Exception(
            f"Filter kondisi tidak sesuai. Baris pertama tidak mengandung kondisi '{kondisi_target}'. "
            f"Teks baris: {row.text}"
        )

# ============================================================
# HELPER TAMBAHAN SESUAI TABEL
# ============================================================

def detect_kondisi_from_row(row):
    """
    Deteksi kondisi aktual dari dropdown update kondisi.
    Jangan membaca row.text langsung, karena row.text juga berisi semua opsi
    dropdown: Baik, Perlu Diganti, Rusak. Itu bisa membuat script salah
    memilih kondisi yang sebenarnya tidak ada pada data.
    """
    try:
        select_el = get_update_select_from_row(row)
        selected = SeleniumSelect(select_el).first_selected_option.text.strip()

        if selected in ["Baik", "Perlu Diganti", "Rusak"]:
            return selected
    except Exception:
        pass

    raise Exception(
        "Kondisi APD aktual tidak bisa dideteksi dari dropdown baris Pemeriksaan APD. "
        f"Teks baris: {row.text}"
    )


# ============================================================
# TS33 - FILTER DATA PEMERIKSAAN APD
# Sesuai tabel skenario TS33
# ============================================================

def ts33_filter_data_pemeriksaan_apd(driver):
    open_pemeriksaan_show_pemeriksa(driver)

    row_awal = ensure_has_apd_row(driver)
    kondisi_target = detect_kondisi_from_row(row_awal)

    filter_kondisi(driver, kondisi_target)

    row_filter = get_first_data_row(driver)

    if row_filter is None:
        raise Exception(
            f"Data Pemeriksaan APD tidak ditemukan setelah filter kondisi '{kondisi_target}'."
        )

    if kondisi_target.lower() not in row_filter.text.lower():
        raise Exception(
            f"Filter kondisi Pemeriksaan APD tidak sesuai. "
            f"Kondisi target: {kondisi_target}. Teks baris: {row_filter.text}"
        )

    print(f"Filter Pemeriksaan APD berhasil menggunakan kondisi: {kondisi_target}")


# ============================================================
# TS35 - UPDATE KONDISI APD OLEH ADMIN HSSE
# Sesuai tabel skenario TS35
# ============================================================

def ts35_update_kondisi_apd_oleh_admin(driver):
    open_first_gardu_detail_admin(driver)

    target_kondisi = update_first_row_condition(driver)

    body_text = get_body_text_normalized(driver)

    if target_kondisi.lower() not in body_text:
        raise Exception(
            f"Kondisi baru '{target_kondisi}' tidak terdeteksi setelah Admin update kondisi APD."
        )

    print(f"Admin berhasil mengubah kondisi APD menjadi: {target_kondisi}")


# ============================================================
# MAIN RUNNER SESUAI TABEL TS30-TS35
# ============================================================

if __name__ == "__main__":
    results = []

    results.append(run_case("TS30", "Menampilkan Halaman Pemeriksaan APD oleh Admin", ts30_menampilkan_data_pemeriksaan_apd_admin))
    results.append(run_case("TS31", "Menampilkan Detail Pemeriksaan APD", ts31_menampilkan_detail_pemeriksaan_apd_admin))
    results.append(run_case("TS32", "Menampilkan Pemeriksaan APD oleh Pemeriksa GI", ts32_menampilkan_data_pemeriksaan_apd_pemeriksa))

    # Sesuai tabel: TS33 adalah Filter Data Pemeriksaan APD
    results.append(run_case("TS33", "Filter Data Pemeriksaan APD", ts33_filter_data_pemeriksaan_apd))

    # Sesuai tabel: TS34 adalah Update Kondisi oleh Pemeriksa GI
    results.append(run_case("TS34", "Update Kondisi APD oleh Pemeriksa GI", ts33_update_kondisi_pemeriksaan_apd))

    # Sesuai tabel: TS35 adalah Update Kondisi oleh Admin HSSE
    results.append(run_case("TS35", "Update Kondisi APD oleh Admin HSSE", ts35_update_kondisi_apd_oleh_admin))

    print("\n" + "=" * 80)
    print("RINGKASAN PENGUJIAN PEMERIKSAAN APD TS30-TS35")
    print("=" * 80)
    print(f"Total Test : {len(results)}")
    print(f"Berhasil   : {results.count(True)}")
    print(f"Gagal      : {results.count(False)}")

    if all(results):
        print("SEMUA TEST PEMERIKSAAN APD TS30-TS35 BERHASIL")
    else:
        print("ADA TEST PEMERIKSAAN APD TS30-TS35 YANG GAGAL")

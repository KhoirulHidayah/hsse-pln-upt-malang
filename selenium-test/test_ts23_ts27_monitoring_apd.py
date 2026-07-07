import time
from datetime import datetime
from urllib.parse import quote_plus

from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import Select as SeleniumSelect

from config import BASE_URL, ADMIN_LOGIN, ADMIN_PASSWORD
from helpers import (
    run_case,
    login_user,
    get_wait,
    wait_for_text,
    get_body_text,
    get_body_text_normalized,
)


# ============================================================
# DATA TEST DUMMY
# ============================================================

TIMESTAMP = datetime.now().strftime("%Y%m%d%H%M%S")

CATATAN = f"SELENIUM MONITORING APD {TIMESTAMP}"
UPDATED_CATATAN = f"SELENIUM MONITORING APD EDIT {TIMESTAMP}"

STOK = "8"
UPDATED_STOK = "3"

# Format tanggal wajib ISO untuk input type=date: YYYY-MM-DD
TANGGAL_DISTRIBUSI = "2026-01-15"
TANGGAL_PEMERIKSAAN = "2026-02-01"
TANGGAL_BERAKHIR = "2027-01-15"

UPDATED_TANGGAL_DISTRIBUSI = "2026-03-10"
UPDATED_TANGGAL_PEMERIKSAAN = "2026-03-20"
UPDATED_TANGGAL_BERAKHIR = "2026-12-15"

KONDISI = "Baik"
UPDATED_KONDISI = "Rusak"


# ============================================================
# HELPER KHUSUS MONITORING APD
# ============================================================

def wait_for_monitoring_index(driver):
    wait = get_wait(driver)

    wait.until(
        lambda d: d.current_url.split("?")[0].rstrip("/").endswith("/monitoring-apd")
    )

    wait_for_text(driver, ["monitoring apd"])


def open_monitoring_index(driver):
    login_user(
        driver,
        ADMIN_LOGIN,
        ADMIN_PASSWORD,
        expected_url_contains="dashboard"
    )

    driver.get(f"{BASE_URL}/monitoring-apd")

    wait_for_monitoring_index(driver)


def set_react_value(driver, element, value):
    """
    Mengisi input/textarea React/Inertia dengan JS native setter.
    Ini lebih stabil daripada send_keys, terutama untuk input type=date.
    """
    driver.execute_script(
        """
        const element = arguments[0];
        const value = arguments[1];
        const tagName = element.tagName.toLowerCase();

        let prototype = window.HTMLInputElement.prototype;
        if (tagName === 'textarea') {
            prototype = window.HTMLTextAreaElement.prototype;
        }

        const valueSetter = Object.getOwnPropertyDescriptor(prototype, 'value')?.set;

        if (valueSetter) {
            valueSetter.call(element, value);
        } else {
            element.value = value;
        }

        element.dispatchEvent(new Event('input', { bubbles: true }));
        element.dispatchEvent(new Event('change', { bubbles: true }));
        element.dispatchEvent(new Event('blur', { bubbles: true }));
        """,
        element,
        value
    )


def set_field_value(driver, selector, value):
    wait = get_wait(driver)

    element = wait.until(
        EC.presence_of_element_located((By.CSS_SELECTOR, selector))
    )

    driver.execute_script(
        "arguments[0].scrollIntoView({block: 'center'});",
        element
    )
    time.sleep(0.2)

    wait.until(EC.visibility_of(element))

    set_react_value(driver, element, value)

    time.sleep(0.5)


def set_date_input(driver, selector, value):
    """
    Isi input tanggal dengan format ISO YYYY-MM-DD.
    Jangan pakai send_keys untuk tanggal karena Chrome bisa mengubahnya
    menjadi format lokal yang salah, misalnya 02/02/6015.
    """
    wait = get_wait(driver)

    element = wait.until(
        EC.presence_of_element_located((By.CSS_SELECTOR, selector))
    )

    driver.execute_script(
        "arguments[0].scrollIntoView({block: 'center'});",
        element
    )
    time.sleep(0.2)

    # Pastikan field bisa diisi kalau ada readonly/disabled dari date picker.
    driver.execute_script(
        """
        arguments[0].removeAttribute('readonly');
        arguments[0].disabled = false;
        """,
        element
    )

    set_react_value(driver, element, value)

    time.sleep(0.5)

    actual_value = element.get_attribute("value") or ""

    if actual_value != value:
        raise Exception(
            f"Input tanggal gagal diset. Selector: {selector}, "
            f"target: {value}, nilai aktual: {actual_value}"
        )


def search_monitoring(driver, keyword):
    wait = get_wait(driver)

    search_input = wait.until(
        EC.visibility_of_element_located((
            By.CSS_SELECTOR,
            "input[name='search'], input#search, input[placeholder='Cari APD...'], "
            "input[placeholder*='Cari APD']"
        ))
    )

    driver.execute_script(
        "arguments[0].scrollIntoView({block: 'center'});",
        search_input
    )

    # Untuk search, send_keys lebih aman karena biasanya ada debounce keyup/input.
    search_input.click()
    search_input.send_keys(Keys.CONTROL, "a")
    search_input.send_keys(Keys.BACKSPACE)
    search_input.send_keys(keyword)

    # debounce search di Index.jsx adalah 300ms, beri jeda aman untuk Inertia reload
    time.sleep(2.5)


def get_first_data_row(driver):
    rows = driver.find_elements(By.CSS_SELECTOR, "tbody tr")

    for row in rows:
        text = row.text.lower()

        if "tidak ada data" not in text and text.strip():
            return row

    return None


def find_row_by_search_keyword(driver, keyword):
    search_monitoring(driver, keyword)
    return get_first_data_row(driver)


def select_first_option(driver, selector, error_message):
    wait = get_wait(driver)

    select_el = wait.until(
        EC.visibility_of_element_located((By.CSS_SELECTOR, selector))
    )

    driver.execute_script(
        "arguments[0].scrollIntoView({block: 'center'});",
        select_el
    )
    time.sleep(0.2)

    select_obj = SeleniumSelect(select_el)

    for index, option in enumerate(select_obj.options):
        value = option.get_attribute("value")

        if value:
            select_obj.select_by_index(index)

            driver.execute_script(
                "arguments[0].dispatchEvent(new Event('change', { bubbles: true }));",
                select_el
            )

            time.sleep(1)
            return value, option.text

    raise Exception(error_message)


def select_apd_pertama(driver):
    return select_first_option(
        driver,
        "select[name='apd_id'], select#apd_id",
        "Data APD belum tersedia. Tambahkan Master APD terlebih dahulu."
    )


def select_lokasi_dan_gardu(driver):
    wait = get_wait(driver)

    lokasi_select_el = wait.until(
        EC.visibility_of_element_located((
            By.CSS_SELECTOR,
            "select[name='lokasi_id'], select#lokasi_id"
        ))
    )

    driver.execute_script(
        "arguments[0].scrollIntoView({block: 'center'});",
        lokasi_select_el
    )
    time.sleep(0.2)

    lokasi_select = SeleniumSelect(lokasi_select_el)

    lokasi_options = []

    for index, option in enumerate(lokasi_select.options):
        value = option.get_attribute("value")

        if value:
            lokasi_options.append((index, value, option.text))

    if not lokasi_options:
        raise Exception("Data Lokasi belum tersedia. Tambahkan Lokasi terlebih dahulu.")

    # Coba setiap lokasi sampai menemukan lokasi yang punya gardu induk
    for index, lokasi_value, lokasi_text in lokasi_options:
        lokasi_select.select_by_index(index)

        driver.execute_script(
            "arguments[0].dispatchEvent(new Event('change', { bubbles: true }));",
            lokasi_select_el
        )

        # Tunggu React memfilter daftar gardu
        time.sleep(1.5)

        gardu_select_el = wait.until(
            EC.presence_of_element_located((
                By.CSS_SELECTOR,
                "select[name='gardu_induk_id'], select#gardu_induk_id"
            ))
        )

        try:
            gardu_select = SeleniumSelect(gardu_select_el)
        except Exception:
            continue

        for gardu_index, gardu_option in enumerate(gardu_select.options):
            gardu_value = gardu_option.get_attribute("value")

            if gardu_value:
                gardu_select.select_by_index(gardu_index)

                driver.execute_script(
                    "arguments[0].dispatchEvent(new Event('change', { bubbles: true }));",
                    gardu_select_el
                )

                time.sleep(1)
                return {
                    "lokasi_id": lokasi_value,
                    "lokasi_nama": lokasi_text,
                    "gardu_id": gardu_value,
                    "gardu_nama": gardu_option.text,
                }

    raise Exception("Tidak ada Lokasi yang memiliki Gardu Induk. Tambahkan Gardu Induk terlebih dahulu.")


def select_kondisi(driver, kondisi):
    wait = get_wait(driver)

    select_el = wait.until(
        EC.visibility_of_element_located((
            By.CSS_SELECTOR,
            "select[name='kondisi'], select#kondisi"
        ))
    )

    driver.execute_script(
        "arguments[0].scrollIntoView({block: 'center'});",
        select_el
    )
    time.sleep(0.2)

    select_obj = SeleniumSelect(select_el)

    try:
        select_obj.select_by_visible_text(kondisi)
    except Exception:
        select_obj.select_by_value(kondisi)

    driver.execute_script(
        "arguments[0].dispatchEvent(new Event('change', { bubbles: true }));",
        select_el
    )

    time.sleep(0.7)


def ubah_tanggal_berakhir_ke_manual(driver):
    # Di Create.jsx tombol ini biasanya bertuliskan "Otomatis" saat auto aktif.
    # Jika sudah bertuliskan "Manual", berarti mode manual sudah aktif dan tidak perlu diklik.
    buttons = driver.find_elements(By.XPATH, "//button[contains(., 'Otomatis') or contains(., 'Manual')]")

    for button in buttons:
        try:
            text = button.text.lower()

            if "otomatis" in text:
                driver.execute_script(
                    "arguments[0].scrollIntoView({block: 'center'});",
                    button
                )
                time.sleep(0.2)
                driver.execute_script("arguments[0].click();", button)
                time.sleep(0.8)
                return
        except Exception:
            continue


def fill_monitoring_form(
    driver,
    stok,
    tanggal_distribusi,
    tanggal_pemeriksaan,
    tanggal_berakhir,
    kondisi,
    catatan
):
    # Pilih APD
    select_apd_pertama(driver)

    # Pilih Lokasi dan Gardu Induk yang saling sesuai
    select_lokasi_dan_gardu(driver)

    # Isi stok
    set_field_value(driver, "input[name='stok'], input#stok", stok)

    # Isi tanggal dengan helper khusus date input
    set_date_input(driver, "input[name='tanggal_distribusi'], input#tanggal_distribusi", tanggal_distribusi)
    set_date_input(driver, "input[name='tanggal_pemeriksaan'], input#tanggal_pemeriksaan", tanggal_pemeriksaan)

    # Matikan auto calculate supaya tanggal berakhir bisa diisi manual
    ubah_tanggal_berakhir_ke_manual(driver)
    set_date_input(driver, "input[name='tanggal_berakhir'], input#tanggal_berakhir", tanggal_berakhir)

    # Pilih kondisi
    select_kondisi(driver, kondisi)

    # Isi catatan unik untuk pencarian data dummy
    set_field_value(driver, "textarea[name='catatan'], textarea#catatan", catatan)


def click_submit_and_wait_index(driver, button_text):
    wait = get_wait(driver)

    submit_button = wait.until(
        EC.element_to_be_clickable((
            By.XPATH,
            f"//button[contains(., '{button_text}')]"
        ))
    )

    driver.execute_script(
        "arguments[0].scrollIntoView({block: 'center'});",
        submit_button
    )
    time.sleep(0.3)

    driver.execute_script("arguments[0].click();", submit_button)

    try:
        wait_for_monitoring_index(driver)
    except Exception:
        body_text = get_body_text_normalized(driver)
        raise Exception(
            f"Form Monitoring APD gagal disimpan saat klik '{button_text}'. "
            f"Kemungkinan masih ada validasi form. Teks halaman: {body_text[:1200]}"
        )


def wait_until_row_not_found_by_search(driver, keyword, timeout=15):
    end_time = time.time() + timeout

    while time.time() < end_time:
        try:
            search_monitoring(driver, keyword)
            row = get_first_data_row(driver)

            if row is None:
                return True

        except Exception:
            pass

        time.sleep(1)

    return False


def click_first_delete_button(driver):
    wait = get_wait(driver)

    def click_delete(d):
        try:
            row = get_first_data_row(d)

            if row is None:
                return False

            delete_button = row.find_element(
                By.CSS_SELECTOR,
                "button[title='Hapus Data Monitoring']"
            )

            d.execute_script(
                "arguments[0].scrollIntoView({block: 'center'});",
                delete_button
            )

            time.sleep(0.5)

            d.execute_script("arguments[0].click();", delete_button)

            return True

        except Exception:
            return False

    return wait.until(click_delete)


# ============================================================
# TS23 - MENAMPILKAN DATA MONITORING APD
# ============================================================

def ts23_menampilkan_data_monitoring_apd(driver):
    open_monitoring_index(driver)

    body_text = get_body_text_normalized(driver)

    if "monitoring apd" not in body_text:
        raise Exception("Judul Monitoring APD tidak ditemukan.")

    teks_wajib = [
        "tambah",
        "import excel",
        "laporan",
        "analisis saw",
        "apd",
        "lokasi",
        "gardu",
        "stok",
        "kondisi",
    ]

    for teks in teks_wajib:
        if teks not in body_text:
            raise Exception(f"Teks/kolom '{teks}' tidak ditemukan pada halaman Monitoring APD.")


# ============================================================
# TS24 - TAMBAH MONITORING APD
# ============================================================

def ts24_tambah_monitoring_apd(driver):
    open_monitoring_index(driver)

    wait = get_wait(driver)

    tambah_button = wait.until(
        EC.element_to_be_clickable((
            By.CSS_SELECTOR,
            "a[href*='/monitoring-apd/create']"
        ))
    )
    tambah_button.click()

    wait_for_text(driver, ["tambah monitoring apd"])

    fill_monitoring_form(
        driver,
        STOK,
        TANGGAL_DISTRIBUSI,
        TANGGAL_PEMERIKSAAN,
        TANGGAL_BERAKHIR,
        KONDISI,
        CATATAN
    )

    click_submit_and_wait_index(driver, "Simpan")

    row = find_row_by_search_keyword(driver, CATATAN)

    if row is None:
        raise Exception("Data Monitoring APD yang baru ditambahkan tidak ditemukan di tabel.")


# ============================================================
# TS25 - UBAH MONITORING APD
# ============================================================

def ts25_ubah_monitoring_apd(driver):
    open_monitoring_index(driver)

    row = find_row_by_search_keyword(driver, CATATAN)

    if row is None:
        raise Exception("Data Monitoring APD yang akan diubah tidak ditemukan.")

    edit_button = row.find_element(By.CSS_SELECTOR, "a[title='Edit Data Monitoring']")
    edit_button.click()

    wait_for_text(driver, ["edit monitoring apd"])

    fill_monitoring_form(
        driver,
        UPDATED_STOK,
        UPDATED_TANGGAL_DISTRIBUSI,
        UPDATED_TANGGAL_PEMERIKSAAN,
        UPDATED_TANGGAL_BERAKHIR,
        UPDATED_KONDISI,
        UPDATED_CATATAN
    )

    click_submit_and_wait_index(driver, "Perbarui")

    updated_row = find_row_by_search_keyword(driver, UPDATED_CATATAN)

    if updated_row is None:
        raise Exception("Data Monitoring APD yang diperbarui tidak ditemukan di tabel.")


# ============================================================
# TS26 - MENAMPILKAN DETAIL MONITORING APD
# ============================================================

def ts26_menampilkan_detail_monitoring_apd(driver):
    open_monitoring_index(driver)

    row = find_row_by_search_keyword(driver, UPDATED_CATATAN)

    if row is None:
        raise Exception("Data Monitoring APD yang akan dilihat detailnya tidak ditemukan.")

    detail_link = None

    links = row.find_elements(By.TAG_NAME, "a")

    for link in links:
        href = link.get_attribute("href") or ""

        if "/monitoring-apd/" in href and "/edit" not in href:
            detail_link = link
            break

    if detail_link is None:
        raise Exception("Link detail Monitoring APD tidak ditemukan.")

    detail_link.click()

    wait = get_wait(driver)

    wait.until(
        lambda d:
            "/monitoring-apd/" in d.current_url
            and "/edit" not in d.current_url
            and not d.current_url.split("?")[0].rstrip("/").endswith("/monitoring-apd")
    )

    wait_for_text(driver, [
        "detail monitoring apd",
        "id monitoring",
        "kode apd",
        "nama apd",
        "lokasi",
        "gardu induk",
        "stok",
        "kondisi",
        "tanggal distribusi",
        "tanggal pemeriksaan",
        "tanggal berakhir",
        "catatan",
    ])

    body_text = get_body_text_normalized(driver)

    data_wajib = [
        UPDATED_STOK.lower(),
        UPDATED_KONDISI.lower(),
        UPDATED_CATATAN.lower(),
    ]

    for teks in data_wajib:
        if teks not in body_text:
            raise Exception(f"Data detail '{teks}' tidak ditemukan pada halaman detail Monitoring APD.")


# ============================================================
# TS28 - PENCARIAN DATA MONITORING APD
# ============================================================

def ts28_pencarian_data_monitoring_apd(driver):
    open_monitoring_index(driver)

    row = find_row_by_search_keyword(driver, UPDATED_CATATAN)

    if row is None:
        raise Exception("Data Monitoring APD tidak ditemukan saat dilakukan pencarian.")

    body_text = get_body_text_normalized(driver)

    if "tidak ada data" in body_text:
        raise Exception("Hasil pencarian Monitoring APD kosong, padahal data dummy seharusnya ada.")


# ============================================================
# TS29 - FILTER KONDISI MONITORING APD
# ============================================================

def ts29_filter_kondisi_monitoring_apd(driver):
    login_user(
        driver,
        ADMIN_LOGIN,
        ADMIN_PASSWORD,
        expected_url_contains="dashboard"
    )

    url = (
        f"{BASE_URL}/monitoring-apd"
        f"?search={quote_plus(UPDATED_CATATAN)}"
        f"&kondisi={quote_plus(UPDATED_KONDISI)}"
    )

    driver.get(url)

    wait_for_monitoring_index(driver)

    time.sleep(2.5)

    row = get_first_data_row(driver)

    if row is None:
        raise Exception("Data Monitoring APD tidak ditemukan saat filter kondisi diterapkan.")

    if UPDATED_KONDISI.lower() not in row.text.lower():
        raise Exception("Filter kondisi Monitoring APD tidak sesuai dengan data yang ditampilkan.")


# ============================================================
# TS27 - HAPUS MONITORING APD
# Dijalankan terakhir supaya data dummy bisa dipakai TS26, TS28, TS29.
# ============================================================

def ts27_hapus_monitoring_apd(driver):
    open_monitoring_index(driver)

    row = find_row_by_search_keyword(driver, UPDATED_CATATAN)

    if row is None:
        raise Exception("Data Monitoring APD yang akan dihapus tidak ditemukan.")

    berhasil_klik = click_first_delete_button(driver)

    if not berhasil_klik:
        raise Exception("Tombol Hapus Data Monitoring tidak berhasil diklik.")

    wait = get_wait(driver)

    alert = wait.until(EC.alert_is_present())
    alert.accept()

    time.sleep(3)

    driver.get(f"{BASE_URL}/monitoring-apd")
    wait_for_monitoring_index(driver)

    deleted = wait_until_row_not_found_by_search(driver, UPDATED_CATATAN, timeout=15)

    if not deleted:
        raise Exception("Data Monitoring APD masih muncul setelah dihapus.")

# ============================================================
# TS27 - FILTER DATA MONITORING APD
# Sesuai tabel skenario: filter monitoring setelah hapus data dummy.
# ============================================================

def detect_kondisi_from_row(row):
    row_text = row.text.lower()

    for kondisi in ["Perlu Diganti", "Rusak", "Baik"]:
        if kondisi.lower() in row_text:
            return kondisi

    raise Exception(
        "Kondisi tidak bisa dideteksi dari baris data Monitoring APD. "
        f"Teks baris: {row.text}"
    )


def ts27_filter_data_monitoring_apd(driver):
    open_monitoring_index(driver)

    row_awal = get_first_data_row(driver)

    if row_awal is None:
        raise Exception("Data Monitoring APD tidak tersedia untuk dilakukan filter.")

    kondisi_target = detect_kondisi_from_row(row_awal)

    url = f"{BASE_URL}/monitoring-apd?kondisi={quote_plus(kondisi_target)}"
    driver.get(url)

    wait_for_monitoring_index(driver)
    time.sleep(2.5)

    row_filter = get_first_data_row(driver)

    if row_filter is None:
        raise Exception(f"Data Monitoring APD tidak ditemukan setelah filter kondisi '{kondisi_target}'.")

    if kondisi_target.lower() not in row_filter.text.lower():
        raise Exception(
            f"Filter kondisi Monitoring APD tidak sesuai. "
            f"Kondisi target: {kondisi_target}. Teks baris: {row_filter.text}"
        )

    print(f"Filter Monitoring APD berhasil menggunakan kondisi: {kondisi_target}")


# ============================================================
# MAIN RUNNER SESUAI TABEL TS23-TS27
# ============================================================

if __name__ == "__main__":
    results = []

    results.append(run_case("TS23", "Menampilkan Data Monitoring APD", ts23_menampilkan_data_monitoring_apd))
    results.append(run_case("TS24", "Tambah Monitoring APD", ts24_tambah_monitoring_apd))
    results.append(run_case("TS25", "Ubah Monitoring APD", ts25_ubah_monitoring_apd))

    # Sesuai tabel: TS26 adalah Hapus Monitoring APD
    results.append(run_case("TS26", "Hapus Monitoring APD", ts27_hapus_monitoring_apd))

    # Sesuai tabel: TS27 adalah Filter Data Monitoring APD
    results.append(run_case("TS27", "Filter Data Monitoring APD", ts27_filter_data_monitoring_apd))

    print("\n" + "=" * 80)
    print("RINGKASAN PENGUJIAN MONITORING APD TS23-TS27")
    print("=" * 80)
    print(f"Total Test : {len(results)}")
    print(f"Berhasil   : {results.count(True)}")
    print(f"Gagal      : {results.count(False)}")

    if all(results):
        print("SEMUA TEST MONITORING APD TS23-TS27 BERHASIL")
    else:
        print("ADA TEST MONITORING APD TS23-TS27 YANG GAGAL")

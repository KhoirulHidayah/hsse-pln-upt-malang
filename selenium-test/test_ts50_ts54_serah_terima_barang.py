import time
from datetime import datetime
from pathlib import Path
from urllib.request import Request, urlopen
import re

from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support import expected_conditions as EC

from config import BASE_URL, ADMIN_LOGIN, ADMIN_PASSWORD
from helpers import (
    run_case,
    login_user,
    get_wait,
    wait_for_text,
    get_body_text_normalized,
)


# ============================================================
# DATA TEST DUMMY
# ============================================================

TIMESTAMP = datetime.now().strftime("%Y%m%d%H%M%S")

NO_SERI = f"SEL-STB-{TIMESTAMP}"
UPDATED_NO_SERI = NO_SERI
NO_DOKUMEN = f"DOC-STB-{TIMESTAMP}"
UPDATED_NO_DOKUMEN = f"DOC-STB-EDIT-{TIMESTAMP}"

NAMA_PENERIMA = f"Penerima Selenium {TIMESTAMP}"
UPDATED_NAMA_PENERIMA = f"Penerima Selenium Edit {TIMESTAMP}"

NAMA_PENGIRIM = f"Pengirim Selenium {TIMESTAMP}"
UPDATED_NAMA_PENGIRIM = f"Pengirim Selenium Edit {TIMESTAMP}"

JABATAN_PENGIRIM = "Admin HSSE"
UPDATED_JABATAN_PENGIRIM = "Supervisor HSSE"

ITEM_NAMA = f"APD Selenium {TIMESTAMP}"
UPDATED_ITEM_NAMA = f"APD Selenium Edit {TIMESTAMP}"
ITEM_MERK = "Selenium Brand"
UPDATED_ITEM_MERK = "Selenium Brand Edit"
JUMLAH = "2"
UPDATED_JUMLAH = "3"
KEADAAN = "Baik"
UPDATED_KEADAAN = "Layak digunakan"

TANGGAL = "2026-06-21"
TANGGAL_EFEKTIF = "2026-06-21"

# Data cadangan khusus TS54 jika data sebelumnya sudah terhapus
PDF_NO_SERI = f"SEL-STB-PDF-{TIMESTAMP}"
PDF_NO_DOKUMEN = f"DOC-STB-PDF-{TIMESTAMP}"

DOWNLOAD_DIR = Path(__file__).resolve().parent / "downloads"
DOWNLOAD_DIR.mkdir(exist_ok=True)


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


def wait_for_serah_terima_index(driver):
    wait = get_wait(driver)

    wait.until(
        lambda d: d.current_url.split("?")[0].rstrip("/").endswith("/serah-terima")
    )

    wait_for_text(driver, [
        "transaksi serah terima",
        "daftar transaksi serah terima barang apd",
    ])


def open_serah_terima_index(driver):
    login_admin(driver)
    driver.get(f"{BASE_URL}/serah-terima")
    wait_for_serah_terima_index(driver)


def set_react_value(driver, element, value):
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


def set_field_by_css(driver, selector, value):
    wait = get_wait(driver)

    element = wait.until(
        EC.presence_of_element_located((By.CSS_SELECTOR, selector))
    )

    driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", element)
    time.sleep(0.2)

    # Aman untuk input date/readonly.
    driver.execute_script(
        """
        arguments[0].removeAttribute('readonly');
        arguments[0].disabled = false;
        """,
        element
    )

    set_react_value(driver, element, value)
    time.sleep(0.2)


def set_field_by_label(driver, label_text, value):
    wait = get_wait(driver)

    element = wait.until(
        EC.presence_of_element_located((
            By.XPATH,
            f"//label[contains(normalize-space(.), '{label_text}')]/following::input[1]"
        ))
    )

    driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", element)
    time.sleep(0.2)
    set_react_value(driver, element, value)
    time.sleep(0.2)


def set_checkbox(driver, selector, checked=True):
    wait = get_wait(driver)

    element = wait.until(
        EC.presence_of_element_located((By.CSS_SELECTOR, selector))
    )

    driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", element)
    time.sleep(0.2)

    is_checked = element.is_selected()

    if is_checked != checked:
        driver.execute_script("arguments[0].click();", element)
        time.sleep(0.3)


def click_button_by_text(driver, text):
    wait = get_wait(driver)

    button = wait.until(
        EC.element_to_be_clickable((
            By.XPATH,
            f"//button[contains(., '{text}')]"
        ))
    )

    driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", button)
    time.sleep(0.3)
    driver.execute_script("arguments[0].click();", button)


def search_serah_terima(driver, keyword):
    wait = get_wait(driver)

    search_input = wait.until(
        EC.visibility_of_element_located((
            By.CSS_SELECTOR,
            "input[placeholder*='Cari no seri'], input[placeholder*='Cari']"
        ))
    )

    search_input.click()
    search_input.send_keys(Keys.CONTROL, "a")
    search_input.send_keys(Keys.BACKSPACE)
    search_input.send_keys(keyword)

    time.sleep(2.5)


def get_first_data_row(driver):
    rows = driver.find_elements(By.CSS_SELECTOR, "tbody tr")

    for row in rows:
        text = row.text.strip().lower()

        if not text:
            continue

        if "tidak ada data" in text or "tidak ada data ditemukan" in text:
            continue

        return row

    return None


def find_row_by_text(driver, keyword):
    keyword = keyword.lower()

    rows = driver.find_elements(By.CSS_SELECTOR, "tbody tr")

    for row in rows:
        if keyword in row.text.lower():
            return row

    return None


def find_serah_terima_row(driver, keyword):
    open_serah_terima_index(driver)
    search_serah_terima(driver, keyword)
    return find_row_by_text(driver, keyword)


def fill_serah_terima_form(
    driver,
    no_seri,
    no_dokumen,
    nama_penerima,
    jabatan_pengirim,
    nama_pengirim,
    item_nama,
    item_merk,
    jumlah,
    keadaan
):
    # Informasi dokumen
    set_field_by_css(driver, "input#no_seri", no_seri)
    set_field_by_css(driver, "input#no_dokumen", no_dokumen)
    set_field_by_css(driver, "input#tanggal", TANGGAL)
    set_checkbox(driver, "input#status_master", True)
    set_checkbox(driver, "input#status_copy", False)
    set_field_by_css(driver, "input#copy_no", "")
    set_field_by_css(driver, "input#nomor_revisi", "0")
    set_field_by_css(driver, "input#nomor_edisi", "1")
    set_field_by_css(driver, "input#tanggal_efektif", TANGGAL_EFEKTIF)
    set_field_by_css(driver, "input#lokasi", "Malang")

    # Pihak yang bersangkutan
    set_field_by_css(driver, "input#nama_penerima", nama_penerima)
    set_field_by_css(driver, "input#jabatan_pengirim", jabatan_pengirim)
    set_field_by_css(driver, "input#nama_pengirim", nama_pengirim)

    # Daftar barang. Field item tidak memiliki id/name, jadi diambil dari label.
    set_field_by_label(driver, "Nama Barang", item_nama)
    set_field_by_label(driver, "Merk", item_merk)
    set_field_by_label(driver, "Jumlah", jumlah)
    set_field_by_label(driver, "Keadaan", keadaan)
    set_checkbox(driver, "input#cek-0", True)


def create_serah_terima_data(
    driver,
    no_seri,
    no_dokumen,
    nama_penerima,
    nama_pengirim,
    item_nama
):
    open_serah_terima_index(driver)

    wait = get_wait(driver)

    tambah_link = wait.until(
        EC.element_to_be_clickable((
            By.CSS_SELECTOR,
            "a[href*='/serah-terima/create']"
        ))
    )

    driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", tambah_link)
    time.sleep(0.3)
    driver.execute_script("arguments[0].click();", tambah_link)

    wait_for_text(driver, ["tambah serah terima barang"])

    fill_serah_terima_form(
        driver,
        no_seri,
        no_dokumen,
        nama_penerima,
        JABATAN_PENGIRIM,
        nama_pengirim,
        item_nama,
        ITEM_MERK,
        JUMLAH,
        KEADAAN
    )

    click_button_by_text(driver, "Simpan")

    try:
        wait_for_serah_terima_index(driver)
    except Exception:
        body_text = get_body_text_normalized(driver)
        raise Exception(
            "Form Tambah Serah Terima gagal disimpan. "
            f"Teks halaman: {body_text[:1000]}"
        )

    search_serah_terima(driver, no_seri)

    row = find_row_by_text(driver, no_seri)

    if row is None:
        raise Exception("Data Serah Terima yang baru ditambahkan tidak ditemukan di tabel.")

    return row


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



def download_url_with_browser_session(driver, url, default_filename):
    """Download PDF memakai cookie session Selenium agar tidak bergantung pada Chrome download UI."""
    cookies = "; ".join(
        f"{cookie['name']}={cookie['value']}"
        for cookie in driver.get_cookies()
    )

    request = Request(
        url,
        headers={
            "Cookie": cookies,
            "User-Agent": "Mozilla/5.0",
            "Accept": "application/pdf,*/*",
        },
    )

    with urlopen(request, timeout=90) as response:
        data = response.read()
        content_type = response.headers.get("Content-Type", "")
        content_disposition = response.headers.get("Content-Disposition", "")

    first_bytes = data[:300].lower()
    if b"<html" in first_bytes or b"<!doctype html" in first_bytes:
        raise Exception(
            "Route PDF mengembalikan HTML, bukan PDF. "
            "Kemungkinan terjadi error pada controller PDF atau session tidak terbaca."
        )

    filename = default_filename
    match = re.search(r'filename="?([^";]+)"?', content_disposition)
    if match:
        filename = match.group(1)

    path = DOWNLOAD_DIR / filename
    path.write_bytes(data)

    return path, content_type


def wait_for_download_complete(before_files, timeout=50):
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

    raise Exception("Dokumen PDF Serah Terima tidak berhasil terunduh dalam batas waktu.")


def open_detail_from_row(driver, row):
    detail_link = None

    links = row.find_elements(By.TAG_NAME, "a")

    for link in links:
        href = link.get_attribute("href") or ""

        if "/serah-terima/" in href and "/edit" not in href:
            detail_link = link
            break

    if detail_link is None:
        raise Exception("Link detail Serah Terima tidak ditemukan pada baris data.")

    driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", detail_link)
    time.sleep(0.3)
    driver.execute_script("arguments[0].click();", detail_link)

    wait_for_text(driver, ["detail serah terima", "informasi lengkap dokumen serah terima"])


# ============================================================
# TS50 - MENAMPILKAN DATA SERAH TERIMA BARANG
# ============================================================

def ts50_menampilkan_data_serah_terima_barang(driver):
    open_serah_terima_index(driver)

    body_text = get_body_text_normalized(driver)

    teks_wajib = [
        "transaksi serah terima",
        "daftar transaksi serah terima barang apd",
        "tambah transaksi",
        "no seri",
        "no dokumen",
        "tanggal",
        "penerima",
        "pengirim",
        "total item",
        "aksi",
    ]

    for teks in teks_wajib:
        if teks not in body_text:
            raise Exception(f"Teks/kolom '{teks}' tidak ditemukan pada halaman Serah Terima Barang.")


# ============================================================
# TS51 - TAMBAH SERAH TERIMA BARANG
# ============================================================

def ts51_tambah_serah_terima_barang(driver):
    create_serah_terima_data(
        driver,
        NO_SERI,
        NO_DOKUMEN,
        NAMA_PENERIMA,
        NAMA_PENGIRIM,
        ITEM_NAMA
    )


# ============================================================
# TS52 - UBAH SERAH TERIMA BARANG
# ============================================================

def ts52_ubah_serah_terima_barang(driver):
    row = find_serah_terima_row(driver, NO_SERI)

    if row is None:
        raise Exception("Data Serah Terima yang akan diubah tidak ditemukan.")

    edit_button = row.find_element(By.CSS_SELECTOR, "a[title='Edit Transaksi']")

    driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", edit_button)
    time.sleep(0.3)
    driver.execute_script("arguments[0].click();", edit_button)

    wait_for_text(driver, ["edit serah terima barang"])

    fill_serah_terima_form(
        driver,
        UPDATED_NO_SERI,
        UPDATED_NO_DOKUMEN,
        UPDATED_NAMA_PENERIMA,
        UPDATED_JABATAN_PENGIRIM,
        UPDATED_NAMA_PENGIRIM,
        UPDATED_ITEM_NAMA,
        UPDATED_ITEM_MERK,
        UPDATED_JUMLAH,
        UPDATED_KEADAAN
    )

    click_button_by_text(driver, "Perbarui")

    try:
        wait_for_serah_terima_index(driver)
    except Exception:
        body_text = get_body_text_normalized(driver)
        raise Exception(
            "Form Edit Serah Terima gagal diperbarui. "
            f"Teks halaman: {body_text[:1000]}"
        )

    search_serah_terima(driver, UPDATED_NO_SERI)

    updated_row = find_row_by_text(driver, UPDATED_NO_SERI)

    if updated_row is None:
        raise Exception("Data Serah Terima yang diperbarui tidak ditemukan di tabel.")

    if UPDATED_NAMA_PENERIMA.lower() not in updated_row.text.lower():
        raise Exception("Data penerima hasil edit tidak tampil sesuai perubahan.")


# ============================================================
# TS53 - HAPUS SERAH TERIMA BARANG
# ============================================================

def ts53_hapus_serah_terima_barang(driver):
    row = find_serah_terima_row(driver, UPDATED_NO_SERI)

    if row is None:
        raise Exception("Data Serah Terima yang akan dihapus tidak ditemukan.")

    delete_button = row.find_element(By.CSS_SELECTOR, "button[title='Hapus Transaksi']")

    driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", delete_button)
    time.sleep(0.3)
    driver.execute_script("arguments[0].click();", delete_button)

    wait = get_wait(driver)
    alert = wait.until(EC.alert_is_present())
    alert.accept()

    time.sleep(3)

    driver.get(f"{BASE_URL}/serah-terima")
    wait_for_serah_terima_index(driver)
    search_serah_terima(driver, UPDATED_NO_SERI)

    deleted_row = find_row_by_text(driver, UPDATED_NO_SERI)

    if deleted_row is not None:
        raise Exception("Data Serah Terima masih muncul setelah dihapus.")


# ============================================================
# TS54 - CETAK DOKUMEN SERAH TERIMA BARANG
# ============================================================

def ts54_cetak_dokumen_serah_terima_barang(driver):
    configure_download_dir(driver)

    open_serah_terima_index(driver)

    # Jika belum ada data yang bisa dicetak, buat data cadangan khusus PDF.
    row = get_first_data_row(driver)

    if row is None:
        row = create_serah_terima_data(
            driver,
            PDF_NO_SERI,
            PDF_NO_DOKUMEN,
            f"Penerima PDF {TIMESTAMP}",
            f"Pengirim PDF {TIMESTAMP}",
            f"Barang PDF {TIMESTAMP}"
        )

    open_detail_from_row(driver, row)

    wait = get_wait(driver)

    download_link = wait.until(
        EC.presence_of_element_located((
            By.CSS_SELECTOR,
            "a[href*='/serah-terima/'][href$='/pdf'], a[href*='/pdf']"
        ))
    )

    pdf_url = download_link.get_attribute("href")

    if not pdf_url:
        raise Exception("URL Download PDF Serah Terima tidak ditemukan.")

    downloaded_file, content_type = download_url_with_browser_session(
        driver,
        pdf_url,
        f"serah_terima_{TIMESTAMP}.pdf"
    )

    if downloaded_file.suffix.lower() != ".pdf":
        raise Exception(
            f"Dokumen berhasil diunduh, tetapi bukan PDF: {downloaded_file.name}. "
            f"Content-Type: {content_type}"
        )

    print(f"Dokumen Serah Terima berhasil diunduh: {downloaded_file}")


# ============================================================
# MAIN RUNNER
# ============================================================

if __name__ == "__main__":
    results = []

    results.append(run_case("TS50", "Menampilkan Data Serah Terima Barang", ts50_menampilkan_data_serah_terima_barang))
    results.append(run_case("TS51", "Tambah Serah Terima Barang", ts51_tambah_serah_terima_barang))
    results.append(run_case("TS52", "Ubah Serah Terima Barang", ts52_ubah_serah_terima_barang))
    results.append(run_case("TS53", "Hapus Serah Terima Barang", ts53_hapus_serah_terima_barang))
    results.append(run_case("TS54", "Cetak Dokumen Serah Terima Barang", ts54_cetak_dokumen_serah_terima_barang))

    print("\n" + "=" * 80)
    print("RINGKASAN PENGUJIAN SERAH TERIMA BARANG TS50-TS54")
    print("=" * 80)
    print(f"Total Test : {len(results)}")
    print(f"Berhasil   : {results.count(True)}")
    print(f"Gagal      : {results.count(False)}")

    if all(results):
        print("SEMUA TEST SERAH TERIMA BARANG TS50-TS54 BERHASIL")
    else:
        print("ADA TEST SERAH TERIMA BARANG TS50-TS54 YANG GAGAL")

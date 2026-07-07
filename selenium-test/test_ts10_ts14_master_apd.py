import time
import base64
from pathlib import Path
from datetime import datetime

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
    get_body_text_normalized,
)


# ============================================================
# DATA TEST DUMMY
# ============================================================

TIMESTAMP = datetime.now().strftime("%Y%m%d%H%M%S")

APD_NAME = f"SELENIUM APD {TIMESTAMP}"
APD_CODE = f"SLN-{TIMESTAMP[-6:]}"
APD_DESC = f"Data dummy testing Selenium Master APD {TIMESTAMP}"

UPDATED_APD_NAME = f"SELENIUM APD EDIT {TIMESTAMP}"
UPDATED_APD_CODE = f"SLN-ED-{TIMESTAMP[-6:]}"
UPDATED_APD_DESC = f"Data dummy testing Selenium Master APD setelah diperbarui {TIMESTAMP}"


# ============================================================
# DUMMY IMAGE
# Dibuat untuk berjaga-jaga jika field gambar wajib diisi.
# ============================================================

def prepare_dummy_image():
    img_path = Path("dummy_apd.png").resolve()

    if not img_path.exists():
        img_base64 = (
            "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+/p9sAAAAASUVORK5CYII="
        )
        img_path.write_bytes(base64.b64decode(img_base64))

    return str(img_path)


# ============================================================
# HELPER KHUSUS MASTER APD
# ============================================================

def wait_for_apd_index(driver):
    wait = get_wait(driver)

    wait.until(
        lambda d: d.current_url.split("?")[0].rstrip("/").endswith("/apd")
    )

    wait_for_text(driver, ["data apd"])


def open_master_apd_index(driver):
    login_user(
        driver,
        ADMIN_LOGIN,
        ADMIN_PASSWORD,
        expected_url_contains="dashboard"
    )

    driver.get(f"{BASE_URL}/apd")

    wait_for_apd_index(driver)


def search_apd(driver, keyword):
    wait = get_wait(driver)

    search_input = wait.until(
        EC.visibility_of_element_located((
            By.CSS_SELECTOR,
            "input[placeholder='Cari nama, kode, bahan, atau warna APD...'], input[placeholder*='Cari nama']"
        ))
    )

    search_input.send_keys(Keys.CONTROL, "a")
    search_input.send_keys(Keys.BACKSPACE)
    search_input.send_keys(keyword)

    # debounce search di halaman Index.jsx adalah 300ms
    time.sleep(1.5)


def find_row_by_text(driver, keyword):
    keyword = keyword.lower()

    # Retry karena tabel React/Inertia bisa render ulang setelah search,
    # sehingga row kadang menjadi stale.
    for _ in range(10):
        try:
            rows = driver.find_elements(By.CSS_SELECTOR, "tbody tr")

            for row in rows:
                try:
                    if keyword in row.text.lower():
                        return row
                except Exception:
                    break
        except Exception:
            pass

        time.sleep(0.5)

    return None


def set_value(driver, selector, value):
    wait = get_wait(driver)

    element = wait.until(
        EC.visibility_of_element_located((By.CSS_SELECTOR, selector))
    )

    element.send_keys(Keys.CONTROL, "a")
    element.send_keys(Keys.BACKSPACE)
    element.send_keys(value)


def select_first_jenis_apd(driver):
    wait = get_wait(driver)

    select_el = wait.until(
        EC.visibility_of_element_located((
            By.CSS_SELECTOR,
            "select[name='jenis_id'], select#jenis_id"
        ))
    )

    select_obj = SeleniumSelect(select_el)

    for index, option in enumerate(select_obj.options):
        value = option.get_attribute("value")

        if value:
            select_obj.select_by_index(index)
            return option.text

    raise Exception("Data Jenis APD belum tersedia. Tambahkan Jenis APD terlebih dahulu.")


def upload_dummy_image_if_available(driver):
    dummy_image = prepare_dummy_image()

    inputs = driver.find_elements(By.CSS_SELECTOR, "input[type='file']")

    if inputs:
        try:
            inputs[0].send_keys(dummy_image)
            time.sleep(1)
        except:
            pass


def fill_apd_form(driver, nama_apd, kode_apd, deskripsi):
    # Pilih Jenis APD pertama yang tersedia
    select_first_jenis_apd(driver)

    # Upload gambar dummy jika input gambar tersedia
    upload_dummy_image_if_available(driver)

    # Informasi dasar
    set_value(driver, "input#nama_apd", nama_apd)
    set_value(driver, "input#kode_apd", kode_apd)
    set_value(driver, "textarea#deskripsi", deskripsi)

    # Spesifikasi APD
    set_value(driver, "input#bahan", "Fiber")
    set_value(driver, "input#warna", "Kuning")
    set_value(driver, "input#ukuran", "Standar")
    set_value(driver, "input#kemampuan", "Melindungi pengguna dari risiko kerja")
    set_value(driver, "textarea#fungsi", "Digunakan sebagai alat pelindung diri pada area kerja.")

    # Standar dan penggunaan
    set_value(driver, "input#standar", "SPLN U2.006:2023")
    set_value(driver, "input#masa_penggunaan", "2 Tahun")


def wait_until_row_not_found(driver, keyword, timeout=15):
    keyword = keyword.lower()
    end_time = time.time() + timeout

    while time.time() < end_time:
        try:
            rows = driver.find_elements(By.CSS_SELECTOR, "tbody tr")

            found = False

            for row in rows:
                if keyword in row.text.lower():
                    found = True
                    break

            if not found:
                return True

        except:
            pass

        time.sleep(1)

    return False



def wait_until_row_found(driver, keyword, timeout=20):
    end_time = time.time() + timeout

    while time.time() < end_time:
        row = find_row_by_text(driver, keyword)
        if row is not None:
            return True
        time.sleep(0.5)

    return False


def get_edit_href_by_row_keyword(driver, keyword, timeout=20):
    """
    Ambil URL edit dari baris tabel berdasarkan keyword.
    Dibuat retry supaya tidak terkena stale element saat tabel refresh.
    """
    keyword = keyword.lower()
    end_time = time.time() + timeout

    while time.time() < end_time:
        try:
            rows = driver.find_elements(By.CSS_SELECTOR, "tbody tr")

            for row in rows:
                try:
                    if keyword not in row.text.lower():
                        continue

                    links = row.find_elements(By.TAG_NAME, "a")
                    for link in links:
                        href = link.get_attribute("href") or ""
                        if "/apd/" in href and "/edit" in href:
                            return href

                except Exception:
                    break

        except Exception:
            pass

        time.sleep(0.5)

    return None


# ============================================================
# TS10 - MENAMPILKAN DATA MASTER APD
# ============================================================

def ts10_menampilkan_data_master_apd(driver):
    open_master_apd_index(driver)

    body_text = get_body_text_normalized(driver)

    if "data apd" not in body_text:
        raise Exception("Judul Data APD tidak ditemukan.")

    if "tambah apd" not in body_text:
        raise Exception("Tombol Tambah APD tidak ditemukan.")

    kolom_wajib = [
        "nama apd",
        "kode apd",
        "jenis",
        "bahan",
        "warna",
        "ukuran",
        "standar",
        "masa pakai",
        "aksi",
    ]

    for kolom in kolom_wajib:
        if kolom not in body_text:
            raise Exception(f"Kolom '{kolom}' tidak ditemukan pada halaman Master APD.")


# ============================================================
# TS11 - TAMBAH MASTER APD
# ============================================================

def ts11_tambah_master_apd(driver):
    open_master_apd_index(driver)

    wait = get_wait(driver)

    tambah_button = wait.until(
        EC.element_to_be_clickable((
            By.XPATH,
            "//*[contains(text(), 'Tambah APD')]"
        ))
    )
    tambah_button.click()

    wait_for_text(driver, ["tambah data apd"])

    fill_apd_form(driver, APD_NAME, APD_CODE, APD_DESC)

    simpan_button = wait.until(
        EC.element_to_be_clickable((
            By.XPATH,
            "//button[contains(., 'Simpan')]"
        ))
    )
    simpan_button.click()

    wait_for_apd_index(driver)

    search_apd(driver, APD_CODE)

    row = find_row_by_text(driver, APD_CODE)

    if row is None:
        raise Exception("Data Master APD yang baru ditambahkan tidak ditemukan di tabel.")


# ============================================================
# TS12 - UBAH MASTER APD
# ============================================================

def ts12_ubah_master_apd(driver):
    open_master_apd_index(driver)

    search_apd(driver, APD_CODE)

    edit_href = get_edit_href_by_row_keyword(driver, APD_CODE, timeout=20)

    if not edit_href:
        raise Exception("Link edit Master APD tidak ditemukan pada baris data yang akan diubah.")

    # Gunakan URL edit langsung agar tidak terkena stale element.
    driver.get(edit_href)

    wait_for_text(driver, ["edit data apd"])

    fill_apd_form(driver, UPDATED_APD_NAME, UPDATED_APD_CODE, UPDATED_APD_DESC)

    wait = get_wait(driver)

    perbarui_button = wait.until(
        EC.element_to_be_clickable((
            By.XPATH,
            "//button[contains(., 'Perbarui')]"
        ))
    )
    perbarui_button.click()

    wait_for_apd_index(driver)

    search_apd(driver, UPDATED_APD_CODE)

    if not wait_until_row_found(driver, UPDATED_APD_CODE, timeout=20):
        raise Exception("Data Master APD yang diperbarui tidak ditemukan di tabel.")


# ============================================================
# HELPER DETAIL MASTER APD
# ============================================================

def get_detail_href_by_row_keyword(driver, keyword, timeout=20):
    """
    Ambil URL detail dari baris tabel berdasarkan keyword.
    Dibuat retry karena halaman APD memakai Inertia/debounce search,
    sehingga elemen tabel bisa menjadi stale saat DOM di-render ulang.
    """
    keyword = keyword.lower()
    end_time = time.time() + timeout

    while time.time() < end_time:
        try:
            rows = driver.find_elements(By.CSS_SELECTOR, "tbody tr")

            for row in rows:
                try:
                    row_text = row.text.lower()

                    if keyword not in row_text:
                        continue

                    links = row.find_elements(By.TAG_NAME, "a")

                    for link in links:
                        href = link.get_attribute("href") or ""

                        # Link detail bentuknya /apd/{id}, sedangkan edit /apd/{id}/edit
                        if "/apd/" in href and "/edit" not in href:
                            return href

                except Exception:
                    # Jika row/link stale, ulang dari awal.
                    break

        except Exception:
            pass

        time.sleep(0.5)

    return None


# ============================================================
# TS14 - MENAMPILKAN DETAIL MASTER APD
# Dijalankan sebelum TS13 agar data dummy belum terhapus.
# ============================================================

def ts14_menampilkan_detail_master_apd(driver):
    open_master_apd_index(driver)

    search_apd(driver, UPDATED_APD_CODE)

    detail_href = get_detail_href_by_row_keyword(driver, UPDATED_APD_CODE, timeout=20)

    if not detail_href:
        raise Exception("Link detail Master APD tidak ditemukan pada baris data hasil pencarian.")

    # Gunakan driver.get(href), bukan klik elemen langsung.
    # Ini menghindari stale element karena DOM tabel sering refresh setelah search.
    driver.get(detail_href)

    wait = get_wait(driver)

    # Pastikan masuk ke halaman detail APD, bukan index dan bukan edit
    wait.until(
        lambda d:
            "/apd/" in d.current_url
            and "/edit" not in d.current_url
            and not d.current_url.split("?")[0].rstrip("/").endswith("/apd")
    )

    wait_for_text(driver, [
        "detail apd",
        "informasi dasar",
        "spesifikasi apd",
        "standar dan penggunaan",
        "deskripsi tambahan",
        "informasi log",
    ])

    body_text = get_body_text_normalized(driver)

    data_wajib = [
        UPDATED_APD_NAME.lower(),
        UPDATED_APD_CODE.lower(),
        UPDATED_APD_DESC.lower(),
        "detail apd",
        "informasi dasar",
        "jenis apd",
        "nama apd",
        "kode apd",
        "spesifikasi apd",
        "bahan",
        "warna",
        "ukuran",
        "kemampuan",
        "fungsi",
        "standar dan penggunaan",
        "standar apd",
        "masa penggunaan",
        "deskripsi tambahan",
        "informasi log",
    ]

    for teks in data_wajib:
        if teks not in body_text:
            raise Exception(f"Teks/detail '{teks}' tidak ditemukan pada halaman detail APD.")


# ============================================================
# TS13 - HAPUS MASTER APD
# Dijalankan setelah TS14 supaya data dummy bisa dibersihkan.
# ============================================================

def ts13_hapus_master_apd(driver):
    open_master_apd_index(driver)

    search_apd(driver, UPDATED_APD_CODE)

    row = find_row_by_text(driver, UPDATED_APD_CODE)

    if row is None:
        raise Exception("Data Master APD yang akan dihapus tidak ditemukan.")

    delete_button = row.find_element(By.CSS_SELECTOR, "button[title='Hapus APD']")
    delete_button.click()

    wait = get_wait(driver)

    alert = wait.until(EC.alert_is_present())
    alert.accept()

    time.sleep(3)

    row_gone = wait_until_row_not_found(driver, UPDATED_APD_CODE, timeout=15)

    if not row_gone:
        driver.get(f"{BASE_URL}/apd")
        wait_for_apd_index(driver)

        search_apd(driver, UPDATED_APD_CODE)

        time.sleep(2)

        deleted_row = find_row_by_text(driver, UPDATED_APD_CODE)

        if deleted_row is not None:
            raise Exception("Data Master APD masih muncul setelah dihapus.")


# ============================================================
# MAIN RUNNER
# ============================================================

if __name__ == "__main__":
    results = []

    results.append(run_case("TS10", "Menampilkan Data Master APD", ts10_menampilkan_data_master_apd))
    results.append(run_case("TS11", "Tambah Master APD", ts11_tambah_master_apd))
    results.append(run_case("TS12", "Ubah Master APD", ts12_ubah_master_apd))

    # Detail dijalankan sebelum hapus agar data dummy masih tersedia
    results.append(run_case("TS14", "Menampilkan Detail Master APD", ts14_menampilkan_detail_master_apd))

    # Hapus dijalankan terakhir untuk membersihkan data dummy
    results.append(run_case("TS13", "Hapus Master APD", ts13_hapus_master_apd))

    print("\n" + "=" * 80)
    print("RINGKASAN PENGUJIAN MASTER APD")
    print("=" * 80)
    print(f"Total Test : {len(results)}")
    print(f"Berhasil   : {results.count(True)}")
    print(f"Gagal      : {results.count(False)}")

    if all(results):
        print("SEMUA TEST MASTER APD BERHASIL")
    else:
        print("ADA TEST MASTER APD YANG GAGAL")
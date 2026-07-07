import time
from datetime import datetime

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

LOKASI_NAME = f"SELENIUM LOKASI {TIMESTAMP}"
UPDATED_LOKASI_NAME = f"SELENIUM LOKASI EDIT {TIMESTAMP}"


# ============================================================
# HELPER KHUSUS LOKASI
# ============================================================

def wait_for_lokasi_index(driver):
    wait = get_wait(driver)

    wait.until(
        lambda d: d.current_url.split("?")[0].rstrip("/").endswith("/lokasi")
    )

    wait_for_text(driver, ["data lokasi"])


def open_lokasi_index(driver):
    login_user(
        driver,
        ADMIN_LOGIN,
        ADMIN_PASSWORD,
        expected_url_contains="dashboard"
    )

    driver.get(f"{BASE_URL}/lokasi")

    wait_for_lokasi_index(driver)


def search_lokasi(driver, keyword):
    wait = get_wait(driver)

    search_input = wait.until(
        EC.visibility_of_element_located((
            By.CSS_SELECTOR,
            "input[placeholder='Cari nama lokasi...'], input[placeholder*='Cari nama lokasi']"
        ))
    )

    search_input.send_keys(Keys.CONTROL, "a")
    search_input.send_keys(Keys.BACKSPACE)
    search_input.send_keys(keyword)

    # debounce search di Index.jsx adalah 300ms
    time.sleep(1.5)


def find_row_by_text(driver, keyword):
    keyword = keyword.lower()

    rows = driver.find_elements(By.CSS_SELECTOR, "tbody tr")

    for row in rows:
        if keyword in row.text.lower():
            return row

    return None


def fill_lokasi_form(driver, nama_lokasi):
    wait = get_wait(driver)

    lokasi_input = wait.until(
        EC.visibility_of_element_located((
            By.CSS_SELECTOR,
            "input[name='nama_lokasi'], input#nama_lokasi"
        ))
    )

    lokasi_input.send_keys(Keys.CONTROL, "a")
    lokasi_input.send_keys(Keys.BACKSPACE)
    lokasi_input.send_keys(nama_lokasi)


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


# ============================================================
# TS15 - MENAMPILKAN DATA LOKASI
# ============================================================

def ts15_menampilkan_data_lokasi(driver):
    open_lokasi_index(driver)

    body_text = get_body_text_normalized(driver)

    if "data lokasi" not in body_text:
        raise Exception("Judul Data Lokasi tidak ditemukan.")

    if "tambah lokasi" not in body_text:
        raise Exception("Tombol Tambah Lokasi tidak ditemukan.")

    kolom_wajib = [
        "nama lokasi",
        "jumlah gardu",
        "jumlah monitoring apd",
        "aksi",
    ]

    for kolom in kolom_wajib:
        if kolom not in body_text:
            raise Exception(f"Kolom '{kolom}' tidak ditemukan pada halaman Lokasi.")


# ============================================================
# TS16 - TAMBAH LOKASI
# ============================================================

def ts16_tambah_lokasi(driver):
    open_lokasi_index(driver)

    wait = get_wait(driver)

    tambah_button = wait.until(
        EC.element_to_be_clickable((
            By.XPATH,
            "//*[contains(text(), 'Tambah Lokasi')]"
        ))
    )
    tambah_button.click()

    wait_for_text(driver, ["tambah lokasi"])

    fill_lokasi_form(driver, LOKASI_NAME)

    simpan_button = wait.until(
        EC.element_to_be_clickable((
            By.XPATH,
            "//button[contains(., 'Simpan')]"
        ))
    )
    simpan_button.click()

    wait_for_lokasi_index(driver)

    search_lokasi(driver, LOKASI_NAME)

    row = find_row_by_text(driver, LOKASI_NAME)

    if row is None:
        raise Exception("Data Lokasi yang baru ditambahkan tidak ditemukan di tabel.")


# ============================================================
# TS17 - UBAH LOKASI
# ============================================================

def ts17_ubah_lokasi(driver):
    open_lokasi_index(driver)

    search_lokasi(driver, LOKASI_NAME)

    row = find_row_by_text(driver, LOKASI_NAME)

    if row is None:
        raise Exception("Data Lokasi yang akan diubah tidak ditemukan.")

    edit_button = row.find_element(By.CSS_SELECTOR, "a[title='Edit Lokasi']")
    edit_button.click()

    wait_for_text(driver, ["edit lokasi"])

    fill_lokasi_form(driver, UPDATED_LOKASI_NAME)

    wait = get_wait(driver)

    perbarui_button = wait.until(
        EC.element_to_be_clickable((
            By.XPATH,
            "//button[contains(., 'Perbarui')]"
        ))
    )
    perbarui_button.click()

    wait_for_lokasi_index(driver)

    search_lokasi(driver, UPDATED_LOKASI_NAME)

    updated_row = find_row_by_text(driver, UPDATED_LOKASI_NAME)

    if updated_row is None:
        raise Exception("Data Lokasi yang diperbarui tidak ditemukan di tabel.")


# ============================================================
# TS18 - HAPUS LOKASI
# ============================================================

def ts18_hapus_lokasi(driver):
    open_lokasi_index(driver)

    search_lokasi(driver, UPDATED_LOKASI_NAME)

    row = find_row_by_text(driver, UPDATED_LOKASI_NAME)

    if row is None:
        raise Exception("Data Lokasi yang akan dihapus tidak ditemukan.")

    delete_button = row.find_element(By.CSS_SELECTOR, "button[title='Hapus Lokasi']")
    delete_button.click()

    wait = get_wait(driver)

    # Terima konfirmasi hapus dari window.confirm()
    alert = wait.until(EC.alert_is_present())
    alert.accept()

    # Tunggu proses delete dan refresh Inertia selesai
    time.sleep(3)

    row_gone = wait_until_row_not_found(driver, UPDATED_LOKASI_NAME, timeout=15)

    if not row_gone:
        # Refresh ulang untuk memastikan bukan tampilan lama/cache Inertia
        driver.get(f"{BASE_URL}/lokasi")
        wait_for_lokasi_index(driver)

        search_lokasi(driver, UPDATED_LOKASI_NAME)

        time.sleep(2)

        deleted_row = find_row_by_text(driver, UPDATED_LOKASI_NAME)

        if deleted_row is not None:
            raise Exception("Data Lokasi masih muncul setelah dihapus.")


# ============================================================
# MAIN RUNNER
# ============================================================

if __name__ == "__main__":
    results = []

    results.append(run_case("TS15", "Menampilkan Data Lokasi", ts15_menampilkan_data_lokasi))
    results.append(run_case("TS16", "Tambah Lokasi", ts16_tambah_lokasi))
    results.append(run_case("TS17", "Ubah Lokasi", ts17_ubah_lokasi))
    results.append(run_case("TS18", "Hapus Lokasi", ts18_hapus_lokasi))

    print("\n" + "=" * 80)
    print("RINGKASAN PENGUJIAN LOKASI")
    print("=" * 80)
    print(f"Total Test : {len(results)}")
    print(f"Berhasil   : {results.count(True)}")
    print(f"Gagal      : {results.count(False)}")

    if all(results):
        print("SEMUA TEST LOKASI BERHASIL")
    else:
        print("ADA TEST LOKASI YANG GAGAL")
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

JENIS_NAME = f"SELENIUM JENIS APD {TIMESTAMP}"
JENIS_DESC = f"Data dummy testing Selenium untuk tambah Jenis APD {TIMESTAMP}"

UPDATED_NAME = f"SELENIUM JENIS APD EDIT {TIMESTAMP}"
UPDATED_DESC = f"Data dummy testing Selenium setelah diperbarui {TIMESTAMP}"


# ============================================================
# HELPER KHUSUS JENIS APD
# ============================================================

def open_jenis_apd_index(driver):
    login_user(
        driver,
        ADMIN_LOGIN,
        ADMIN_PASSWORD,
        expected_url_contains="dashboard"
    )

    driver.get(f"{BASE_URL}/jenis-apd")

    wait_for_text(driver, ["data jenis apd", "kelola kategori"])


def search_jenis_apd(driver, keyword):
    wait = get_wait(driver)

    search_input = wait.until(
        EC.visibility_of_element_located((
            By.CSS_SELECTOR,
            "input[placeholder='Cari nama jenis APD...'], input[placeholder*='Cari nama jenis APD']"
        ))
    )

    search_input.send_keys(Keys.CONTROL, "a")
    search_input.send_keys(Keys.BACKSPACE)
    search_input.send_keys(keyword)

    # debounce search di Index.jsx adalah 300ms, jadi beri jeda aman
    time.sleep(1.5)


def find_row_by_text(driver, keyword):
    keyword = keyword.lower()

    rows = driver.find_elements(By.CSS_SELECTOR, "tbody tr")

    for row in rows:
        if keyword in row.text.lower():
            return row

    return None


def fill_jenis_form(driver, nama_jenis, deskripsi):
    wait = get_wait(driver)

    nama_input = wait.until(
        EC.visibility_of_element_located((
            By.CSS_SELECTOR,
            "input[name='nama_jenis'], input#nama_jenis"
        ))
    )

    nama_input.send_keys(Keys.CONTROL, "a")
    nama_input.send_keys(Keys.BACKSPACE)
    nama_input.send_keys(nama_jenis)

    deskripsi_input = wait.until(
        EC.visibility_of_element_located((
            By.CSS_SELECTOR,
            "textarea[name='deskripsi'], textarea#deskripsi"
        ))
    )

    deskripsi_input.send_keys(Keys.CONTROL, "a")
    deskripsi_input.send_keys(Keys.BACKSPACE)
    deskripsi_input.send_keys(deskripsi)

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
# TS06 - MENAMPILKAN DATA JENIS APD
# ============================================================

def ts06_menampilkan_data_jenis_apd(driver):
    open_jenis_apd_index(driver)

    body_text = get_body_text_normalized(driver)

    if "data jenis apd" not in body_text:
        raise Exception("Judul Data Jenis APD tidak ditemukan.")

    if "tambah jenis" not in body_text:
        raise Exception("Tombol Tambah Jenis tidak ditemukan.")

    if "nama jenis apd" not in body_text:
        raise Exception("Kolom Nama Jenis APD tidak ditemukan.")

    if "deskripsi" not in body_text:
        raise Exception("Kolom Deskripsi tidak ditemukan.")

    if "jumlah apd" not in body_text:
        raise Exception("Kolom Jumlah APD tidak ditemukan.")


# ============================================================
# TS07 - TAMBAH JENIS APD
# ============================================================

def ts07_tambah_jenis_apd(driver):
    open_jenis_apd_index(driver)

    wait = get_wait(driver)

    tambah_button = wait.until(
        EC.element_to_be_clickable((
            By.XPATH,
            "//*[contains(text(), 'Tambah Jenis')]"
        ))
    )
    tambah_button.click()

    wait_for_text(driver, ["tambah jenis apd"])

    fill_jenis_form(driver, JENIS_NAME, JENIS_DESC)

    simpan_button = wait.until(
        EC.element_to_be_clickable((
            By.XPATH,
            "//button[contains(., 'Simpan')]"
        ))
    )
    simpan_button.click()

    wait_for_text(driver, ["data jenis apd"])

    search_jenis_apd(driver, JENIS_NAME)

    row = find_row_by_text(driver, JENIS_NAME)

    if row is None:
        raise Exception("Data Jenis APD yang baru ditambahkan tidak ditemukan di tabel.")


# ============================================================
# TS08 - UBAH JENIS APD
# ============================================================

def ts08_ubah_jenis_apd(driver):
    open_jenis_apd_index(driver)

    search_jenis_apd(driver, JENIS_NAME)

    row = find_row_by_text(driver, JENIS_NAME)

    if row is None:
        raise Exception("Data Jenis APD yang akan diubah tidak ditemukan.")

    edit_button = row.find_element(By.CSS_SELECTOR, "a[title='Edit Jenis APD']")
    edit_button.click()

    wait_for_text(driver, ["edit jenis apd"])

    fill_jenis_form(driver, UPDATED_NAME, UPDATED_DESC)

    wait = get_wait(driver)

    perbarui_button = wait.until(
        EC.element_to_be_clickable((
            By.XPATH,
            "//button[contains(., 'Perbarui')]"
        ))
    )
    perbarui_button.click()

    wait_for_text(driver, ["data jenis apd"])

    search_jenis_apd(driver, UPDATED_NAME)

    updated_row = find_row_by_text(driver, UPDATED_NAME)

    if updated_row is None:
        raise Exception("Data Jenis APD yang diperbarui tidak ditemukan di tabel.")


# ============================================================
# TS09 - HAPUS JENIS APD
# ============================================================

def ts09_hapus_jenis_apd(driver):
    open_jenis_apd_index(driver)

    search_jenis_apd(driver, UPDATED_NAME)

    row = find_row_by_text(driver, UPDATED_NAME)

    if row is None:
        raise Exception("Data Jenis APD yang akan dihapus tidak ditemukan.")

    delete_button = row.find_element(By.CSS_SELECTOR, "button[title='Hapus Jenis APD']")
    delete_button.click()

    wait = get_wait(driver)

    # Terima konfirmasi hapus dari window.confirm()
    alert = wait.until(EC.alert_is_present())
    alert.accept()

    # Tunggu proses delete dan refresh Inertia selesai
    time.sleep(3)

    # Tunggu sampai row hilang dari tabel
    row_gone = wait_until_row_not_found(driver, UPDATED_NAME, timeout=15)

    if not row_gone:
        # Refresh ulang untuk memastikan bukan tampilan lama/cache Inertia
        driver.get(f"{BASE_URL}/jenis-apd")
        wait_for_text(driver, ["data jenis apd"])

        search_jenis_apd(driver, UPDATED_NAME)

        time.sleep(2)

        deleted_row = find_row_by_text(driver, UPDATED_NAME)

        if deleted_row is not None:
            raise Exception("Data Jenis APD masih muncul setelah dihapus.")


# ============================================================
# MAIN RUNNER
# ============================================================

if __name__ == "__main__":
    results = []

    results.append(run_case("TS06", "Menampilkan Data Jenis APD", ts06_menampilkan_data_jenis_apd))
    results.append(run_case("TS07", "Tambah Jenis APD", ts07_tambah_jenis_apd))
    results.append(run_case("TS08", "Ubah Jenis APD", ts08_ubah_jenis_apd))
    results.append(run_case("TS09", "Hapus Jenis APD", ts09_hapus_jenis_apd))

    print("\n" + "=" * 80)
    print("RINGKASAN PENGUJIAN JENIS APD")
    print("=" * 80)
    print(f"Total Test : {len(results)}")
    print(f"Berhasil   : {results.count(True)}")
    print(f"Gagal      : {results.count(False)}")

    if all(results):
        print("SEMUA TEST JENIS APD BERHASIL")
    else:
        print("ADA TEST JENIS APD YANG GAGAL")
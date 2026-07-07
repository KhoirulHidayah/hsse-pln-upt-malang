import time
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

GARDU_NAME = f"SELENIUM GARDU INDUK {TIMESTAMP}"
UPDATED_GARDU_NAME = f"SELENIUM GARDU INDUK EDIT {TIMESTAMP}"


# ============================================================
# HELPER KHUSUS GARDU INDUK
# ============================================================

def wait_for_gardu_induk_index(driver):
    wait = get_wait(driver)

    wait.until(
        lambda d: d.current_url.split("?")[0].rstrip("/").endswith("/gardu-induk")
    )

    wait_for_text(driver, ["data gardu induk"])


def open_gardu_induk_index(driver):
    login_user(
        driver,
        ADMIN_LOGIN,
        ADMIN_PASSWORD,
        expected_url_contains="dashboard"
    )

    driver.get(f"{BASE_URL}/gardu-induk")

    wait_for_gardu_induk_index(driver)


def search_gardu_induk(driver, keyword):
    wait = get_wait(driver)

    search_input = wait.until(
        EC.visibility_of_element_located((
            By.CSS_SELECTOR,
            "input[placeholder='Cari nama gardu induk...'], input[placeholder*='Cari nama gardu induk']"
        ))
    )

    search_input.send_keys(Keys.CONTROL, "a")
    search_input.send_keys(Keys.BACKSPACE)
    search_input.send_keys(keyword)

    # debounce search di Index.jsx adalah 300ms
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


def select_first_lokasi(driver):
    wait = get_wait(driver)

    select_el = wait.until(
        EC.visibility_of_element_located((
            By.CSS_SELECTOR,
            "select[name='lokasi_id'], select#lokasi_id"
        ))
    )

    select_obj = SeleniumSelect(select_el)

    for index, option in enumerate(select_obj.options):
        value = option.get_attribute("value")

        if value:
            select_obj.select_by_index(index)
            return option.text

    raise Exception("Data Lokasi belum tersedia. Tambahkan Lokasi terlebih dahulu.")


def fill_gardu_induk_form(driver, nama_gardu_induk):
    wait = get_wait(driver)

    # Pilih lokasi pertama yang tersedia
    select_first_lokasi(driver)

    nama_input = wait.until(
        EC.visibility_of_element_located((
            By.CSS_SELECTOR,
            "input[name='nama_gardu_induk'], input#nama_gardu_induk"
        ))
    )

    nama_input.send_keys(Keys.CONTROL, "a")
    nama_input.send_keys(Keys.BACKSPACE)
    nama_input.send_keys(nama_gardu_induk)


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
    Lebih stabil daripada klik elemen row langsung karena tabel Inertia sering refresh.
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
                        if "/gardu-induk/" in href and "/edit" in href:
                            return href

                except Exception:
                    break

        except Exception:
            pass

        time.sleep(0.5)

    return None


def click_delete_button_by_row_keyword(driver, keyword, timeout=20):
    keyword = keyword.lower()
    end_time = time.time() + timeout

    while time.time() < end_time:
        try:
            rows = driver.find_elements(By.CSS_SELECTOR, "tbody tr")

            for row in rows:
                try:
                    if keyword not in row.text.lower():
                        continue

                    delete_button = row.find_element(
                        By.CSS_SELECTOR,
                        "button[title='Hapus Gardu Induk']"
                    )

                    driver.execute_script(
                        "arguments[0].scrollIntoView({block: 'center'});",
                        delete_button
                    )
                    time.sleep(0.3)
                    driver.execute_script("arguments[0].click();", delete_button)
                    return True

                except Exception:
                    break

        except Exception:
            pass

        time.sleep(0.5)

    return False


# ============================================================
# TS19 - MENAMPILKAN DATA GARDU INDUK
# ============================================================

def ts19_menampilkan_data_gardu_induk(driver):
    open_gardu_induk_index(driver)

    body_text = get_body_text_normalized(driver)

    if "data gardu induk" not in body_text:
        raise Exception("Judul Data Gardu Induk tidak ditemukan.")

    if "tambah gardu induk" not in body_text:
        raise Exception("Tombol Tambah Gardu Induk tidak ditemukan.")

    kolom_wajib = [
        "nama gardu induk",
        "lokasi",
        "jumlah monitoring apd",
        "aksi",
    ]

    for kolom in kolom_wajib:
        if kolom not in body_text:
            raise Exception(f"Kolom '{kolom}' tidak ditemukan pada halaman Gardu Induk.")


# ============================================================
# TS20 - TAMBAH GARDU INDUK
# ============================================================

def ts20_tambah_gardu_induk(driver):
    open_gardu_induk_index(driver)

    wait = get_wait(driver)

    tambah_button = wait.until(
        EC.element_to_be_clickable((
            By.XPATH,
            "//*[contains(text(), 'Tambah Gardu Induk')]"
        ))
    )
    tambah_button.click()

    wait_for_text(driver, ["tambah gardu induk"])

    fill_gardu_induk_form(driver, GARDU_NAME)

    simpan_button = wait.until(
        EC.element_to_be_clickable((
            By.XPATH,
            "//button[contains(., 'Simpan')]"
        ))
    )
    simpan_button.click()

    wait_for_gardu_induk_index(driver)

    search_gardu_induk(driver, GARDU_NAME)

    if not wait_until_row_found(driver, GARDU_NAME, timeout=20):
        raise Exception("Data Gardu Induk yang baru ditambahkan tidak ditemukan di tabel.")


# ============================================================
# TS21 - UBAH GARDU INDUK
# ============================================================

def ts21_ubah_gardu_induk(driver):
    open_gardu_induk_index(driver)

    search_gardu_induk(driver, GARDU_NAME)

    edit_href = get_edit_href_by_row_keyword(driver, GARDU_NAME, timeout=20)

    if not edit_href:
        raise Exception("Link edit Gardu Induk tidak ditemukan pada baris data yang akan diubah.")

    # Gunakan URL edit langsung agar tidak terkena stale element.
    driver.get(edit_href)

    wait_for_text(driver, ["edit gardu induk"])

    fill_gardu_induk_form(driver, UPDATED_GARDU_NAME)

    wait = get_wait(driver)

    perbarui_button = wait.until(
        EC.element_to_be_clickable((
            By.XPATH,
            "//button[contains(., 'Perbarui')]"
        ))
    )
    perbarui_button.click()

    wait_for_gardu_induk_index(driver)

    search_gardu_induk(driver, UPDATED_GARDU_NAME)

    if not wait_until_row_found(driver, UPDATED_GARDU_NAME, timeout=20):
        raise Exception("Data Gardu Induk yang diperbarui tidak ditemukan di tabel.")


# ============================================================
# TS22 - HAPUS GARDU INDUK
# ============================================================

def ts22_hapus_gardu_induk(driver):
    open_gardu_induk_index(driver)

    search_gardu_induk(driver, UPDATED_GARDU_NAME)

    wait = get_wait(driver)

    berhasil_klik = click_delete_button_by_row_keyword(driver, UPDATED_GARDU_NAME, timeout=20)

    if not berhasil_klik:
        raise Exception("Tombol Hapus Gardu Induk tidak berhasil ditemukan/diklik.")

    # Terima konfirmasi hapus dari window.confirm()
    alert = wait.until(EC.alert_is_present())
    alert.accept()

    time.sleep(3)

    driver.get(f"{BASE_URL}/gardu-induk")
    wait_for_gardu_induk_index(driver)

    search_gardu_induk(driver, UPDATED_GARDU_NAME)

    row_gone = wait_until_row_not_found(driver, UPDATED_GARDU_NAME, timeout=20)

    if not row_gone:
        raise Exception("Data Gardu Induk masih muncul setelah dihapus.")


# ============================================================
# MAIN RUNNER
# ============================================================

if __name__ == "__main__":
    results = []

    results.append(run_case("TS19", "Menampilkan Data Gardu Induk", ts19_menampilkan_data_gardu_induk))
    results.append(run_case("TS20", "Tambah Gardu Induk", ts20_tambah_gardu_induk))
    results.append(run_case("TS21", "Ubah Gardu Induk", ts21_ubah_gardu_induk))
    results.append(run_case("TS22", "Hapus Gardu Induk", ts22_hapus_gardu_induk))

    print("\n" + "=" * 80)
    print("RINGKASAN PENGUJIAN GARDU INDUK")
    print("=" * 80)
    print(f"Total Test : {len(results)}")
    print(f"Berhasil   : {results.count(True)}")
    print(f"Gagal      : {results.count(False)}")

    if all(results):
        print("SEMUA TEST GARDU INDUK BERHASIL")
    else:
        print("ADA TEST GARDU INDUK YANG GAGAL")
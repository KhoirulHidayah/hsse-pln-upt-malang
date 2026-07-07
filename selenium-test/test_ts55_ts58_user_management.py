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

USER_NAME = f"Selenium User {TIMESTAMP}"
USER_USERNAME = f"selenium_user_{TIMESTAMP}"
USER_EMAIL = f"selenium_user_{TIMESTAMP}@example.com"
USER_PASSWORD = "password123"

UPDATED_USER_NAME = f"Selenium User Edit {TIMESTAMP}"
UPDATED_USER_USERNAME = f"selenium_user_edit_{TIMESTAMP}"
UPDATED_USER_EMAIL = f"selenium_user_edit_{TIMESTAMP}@example.com"

ROLE = "pemeriksa"


# ============================================================
# HELPER USER MANAGEMENT
# ============================================================

def open_user_index(driver):
    login_user(
        driver,
        ADMIN_LOGIN,
        ADMIN_PASSWORD,
        expected_url_contains="dashboard"
    )

    driver.get(f"{BASE_URL}/user")
    wait_for_user_index(driver)


def wait_for_user_index(driver):
    wait = get_wait(driver)

    wait.until(
        lambda d: d.current_url.split("?")[0].rstrip("/").endswith("/user")
    )

    wait_for_text(driver, [
        "data user",
        "kelola akun admin dan pemeriksa",
    ])


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

    set_react_value(driver, element, value)
    time.sleep(0.2)


def select_value(driver, selector, value):
    wait = get_wait(driver)

    select_el = wait.until(
        EC.visibility_of_element_located((By.CSS_SELECTOR, selector))
    )

    driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", select_el)
    time.sleep(0.2)

    select_obj = SeleniumSelect(select_el)
    select_obj.select_by_value(value)

    driver.execute_script(
        "arguments[0].dispatchEvent(new Event('change', { bubbles: true }));",
        select_el
    )

    time.sleep(0.8)


def select_first_gardu(driver):
    wait = get_wait(driver)

    select_el = wait.until(
        EC.visibility_of_element_located((By.CSS_SELECTOR, "select#gardu_induk_id"))
    )

    select_obj = SeleniumSelect(select_el)

    for index, option in enumerate(select_obj.options):
        value = option.get_attribute("value")

        if value:
            select_obj.select_by_index(index)
            driver.execute_script(
                "arguments[0].dispatchEvent(new Event('change', { bubbles: true }));",
                select_el
            )
            time.sleep(0.5)
            return option.text.strip()

    raise Exception("Data Gardu Induk belum tersedia untuk user pemeriksa.")


def fill_user_form(driver, name, username, email, password=None, password_confirmation=None):
    set_field_by_css(driver, "input#name", name)
    set_field_by_css(driver, "input#username", username)
    set_field_by_css(driver, "input#email", email)

    select_value(driver, "select#role", ROLE)
    select_first_gardu(driver)

    if password is not None:
        set_field_by_css(driver, "input#password", password)

    if password_confirmation is not None:
        set_field_by_css(driver, "input#password_confirmation", password_confirmation)


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


def search_user(driver, keyword):
    wait = get_wait(driver)

    search_input = wait.until(
        EC.visibility_of_element_located((
            By.CSS_SELECTOR,
            "input[placeholder*='Cari nama'], input[placeholder*='username'], input[placeholder*='email'], input[type='text']"
        ))
    )

    search_input.click()
    search_input.send_keys(Keys.CONTROL, "a")
    search_input.send_keys(Keys.BACKSPACE)
    search_input.send_keys(keyword)

    time.sleep(2.5)


def find_row_by_text(driver, keyword):
    keyword = keyword.lower()

    rows = driver.find_elements(By.CSS_SELECTOR, "tbody tr")

    for row in rows:
        if keyword in row.text.lower():
            return row

    return None


def find_user_row(driver, keyword):
    open_user_index(driver)
    search_user(driver, keyword)
    return find_row_by_text(driver, keyword)


def create_user_data(driver):
    open_user_index(driver)

    wait = get_wait(driver)

    tambah_link = wait.until(
        EC.element_to_be_clickable((
            By.CSS_SELECTOR,
            "a[href*='/user/create']"
        ))
    )

    driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", tambah_link)
    time.sleep(0.3)
    driver.execute_script("arguments[0].click();", tambah_link)

    wait_for_text(driver, ["tambah user"])

    fill_user_form(
        driver,
        USER_NAME,
        USER_USERNAME,
        USER_EMAIL,
        USER_PASSWORD,
        USER_PASSWORD
    )

    click_button_by_text(driver, "Simpan")

    try:
        wait_for_user_index(driver)
    except Exception:
        body_text = get_body_text_normalized(driver)
        raise Exception(
            "Form Tambah User gagal disimpan. "
            f"Teks halaman: {body_text[:1000]}"
        )

    search_user(driver, USER_USERNAME)

    row = find_row_by_text(driver, USER_USERNAME)

    if row is None:
        raise Exception("User yang baru ditambahkan tidak ditemukan di tabel.")

    return row


# ============================================================
# TS55 - MENAMPILKAN DATA USER
# ============================================================

def ts55_menampilkan_data_user(driver):
    open_user_index(driver)

    body_text = get_body_text_normalized(driver)

    teks_wajib = [
        "data user",
        "kelola akun admin dan pemeriksa",
        "tambah user",
        "nama",
        "username",
        "email",
        "role",
        "gardu induk",
        "dibuat",
        "aksi",
    ]

    for teks in teks_wajib:
        if teks not in body_text:
            raise Exception(f"Teks/kolom '{teks}' tidak ditemukan pada halaman Data User.")


# ============================================================
# TS56 - TAMBAH USER
# ============================================================

def ts56_tambah_user(driver):
    create_user_data(driver)


# ============================================================
# TS57 - UBAH USER
# ============================================================

def ts57_ubah_user(driver):
    row = find_user_row(driver, USER_USERNAME)

    if row is None:
        raise Exception("User yang akan diubah tidak ditemukan.")

    edit_link = row.find_element(By.CSS_SELECTOR, "a[title='Edit User']")

    driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", edit_link)
    time.sleep(0.3)
    driver.execute_script("arguments[0].click();", edit_link)

    wait_for_text(driver, ["edit user"])

    fill_user_form(
        driver,
        UPDATED_USER_NAME,
        UPDATED_USER_USERNAME,
        UPDATED_USER_EMAIL,
        None,
        None
    )

    click_button_by_text(driver, "Perbarui")

    try:
        wait_for_user_index(driver)
    except Exception:
        body_text = get_body_text_normalized(driver)
        raise Exception(
            "Form Edit User gagal diperbarui. "
            f"Teks halaman: {body_text[:1000]}"
        )

    search_user(driver, UPDATED_USER_USERNAME)

    updated_row = find_row_by_text(driver, UPDATED_USER_USERNAME)

    if updated_row is None:
        raise Exception("User yang diperbarui tidak ditemukan di tabel.")

    if UPDATED_USER_NAME.lower() not in updated_row.text.lower():
        raise Exception("Nama user hasil edit tidak tampil sesuai perubahan.")


# ============================================================
# TS58 - HAPUS USER
# ============================================================

def ts58_hapus_user(driver):
    row = find_user_row(driver, UPDATED_USER_USERNAME)

    if row is None:
        raise Exception("User yang akan dihapus tidak ditemukan.")

    delete_button = row.find_element(By.CSS_SELECTOR, "button[title='Hapus User']")

    driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", delete_button)
    time.sleep(0.3)
    driver.execute_script("arguments[0].click();", delete_button)

    wait = get_wait(driver)
    alert = wait.until(EC.alert_is_present())
    alert.accept()

    time.sleep(3)

    driver.get(f"{BASE_URL}/user")
    wait_for_user_index(driver)
    search_user(driver, UPDATED_USER_USERNAME)

    deleted_row = find_row_by_text(driver, UPDATED_USER_USERNAME)

    if deleted_row is not None:
        raise Exception("User masih muncul setelah dihapus.")


# ============================================================
# MAIN RUNNER
# ============================================================

if __name__ == "__main__":
    results = []

    results.append(run_case("TS55", "Menampilkan Data User", ts55_menampilkan_data_user))
    results.append(run_case("TS56", "Tambah User", ts56_tambah_user))
    results.append(run_case("TS57", "Ubah User", ts57_ubah_user))
    results.append(run_case("TS58", "Hapus User", ts58_hapus_user))

    print("\n" + "=" * 80)
    print("RINGKASAN PENGUJIAN MANAJEMEN USER TS55-TS58")
    print("=" * 80)
    print(f"Total Test : {len(results)}")
    print(f"Berhasil   : {results.count(True)}")
    print(f"Gagal      : {results.count(False)}")

    if all(results):
        print("SEMUA TEST MANAJEMEN USER TS55-TS58 BERHASIL")
    else:
        print("ADA TEST MANAJEMEN USER TS55-TS58 YANG GAGAL")

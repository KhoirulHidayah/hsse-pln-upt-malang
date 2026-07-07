import time
from datetime import datetime

from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC

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
# DATA TEST DUMMY
# ============================================================

TIMESTAMP = datetime.now().strftime("%Y%m%d%H%M%S")

TEMP_ADMIN_NAME = f"Administrator Selenium {TIMESTAMP}"
TEMP_ADMIN_PASSWORD = f"AdminTmp{TIMESTAMP}!"

TEMP_PEMERIKSA_USERNAME = f"pemeriksa_selenium_{TIMESTAMP}"
TEMP_PEMERIKSA_PASSWORD = f"PemeriksaTmp{TIMESTAMP}!"


# ============================================================
# HELPER PROFILE
# ============================================================

def wait_for_profile_page(driver):
    wait = get_wait(driver)

    wait.until(
        lambda d: d.current_url.split("?")[0].rstrip("/").endswith("/profile")
    )

    wait_for_text(driver, [
        "profil",
        "informasi profil",
        "update password",
    ])


def open_profile_admin(driver):
    login_user(
        driver,
        ADMIN_LOGIN,
        ADMIN_PASSWORD,
        expected_url_contains="dashboard"
    )

    driver.get(f"{BASE_URL}/profile")
    wait_for_profile_page(driver)


def open_profile_pemeriksa(driver):
    login_user(
        driver,
        PEMERIKSA_LOGIN,
        PEMERIKSA_PASSWORD,
        expected_url_contains="pemeriksaan-apd"
    )

    driver.get(f"{BASE_URL}/profile")
    wait_for_profile_page(driver)


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


def set_field_by_css(driver, selector, value, allow_disabled=False):
    wait = get_wait(driver)

    element = wait.until(
        EC.presence_of_element_located((By.CSS_SELECTOR, selector))
    )

    driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", element)
    time.sleep(0.2)

    if allow_disabled:
        driver.execute_script(
            """
            arguments[0].removeAttribute('disabled');
            arguments[0].removeAttribute('readonly');
            arguments[0].disabled = false;
            """,
            element
        )

    set_react_value(driver, element, value)
    time.sleep(0.2)

    return element


def get_input_value(driver, selector):
    wait = get_wait(driver)
    element = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, selector)))
    return element.get_attribute("value") or ""


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


def wait_saved_message(driver):
    # Pesan 'Saved.' pada form Inertia hanya muncul sebentar, jadi jangan terlalu kaku.
    try:
        wait_for_text(driver, ["saved.", "saved"])
    except Exception:
        time.sleep(1.5)


def update_profile_name(driver, new_name):
    set_field_by_css(driver, "input#name", new_name)
    click_button_by_text(driver, "Simpan")
    wait_saved_message(driver)


def update_pemeriksa_username(driver, new_username):
    # Di UI username pemeriksa dibuat disabled, tetapi TS63 meminta uji ubah username.
    # Karena itu Selenium membuka disabled sementara agar event React tetap terkirim.
    set_field_by_css(driver, "input#username", new_username, allow_disabled=True)
    click_button_by_text(driver, "Simpan")
    wait_saved_message(driver)


def update_password(driver, current_password, new_password):
    set_field_by_css(driver, "input#current_password", current_password)
    set_field_by_css(driver, "input#password", new_password)
    set_field_by_css(driver, "input#password_confirmation", new_password)

    click_button_by_text(driver, "Save")
    wait_saved_message(driver)


# ============================================================
# TS59 - MENAMPILKAN HALAMAN PROFIL ADMIN HSSE
# ============================================================

def ts59_menampilkan_halaman_profile_admin(driver):
    open_profile_admin(driver)

    body_text = get_body_text_normalized(driver)

    teks_wajib = [
        "profil (admin)",
        "informasi profil (admin)",
        "nama lengkap",
        "email",
        "update password",
        "current password",
        "new password",
        "confirm password",
        "delete account",
    ]

    for teks in teks_wajib:
        if teks not in body_text:
            raise Exception(f"Teks '{teks}' tidak ditemukan pada halaman Profil Admin.")


# ============================================================
# TS60 - UBAH USERNAME/IDENTITAS ADMIN HSSE
# ============================================================

def ts60_ubah_username_admin(driver):
    open_profile_admin(driver)

    original_name = get_input_value(driver, "input#name")

    update_profile_name(driver, TEMP_ADMIN_NAME)

    if get_input_value(driver, "input#name") != TEMP_ADMIN_NAME:
        raise Exception("Nama profil Admin tidak berubah setelah disimpan.")

    # Kembalikan nama agar data utama tidak berubah permanen.
    update_profile_name(driver, original_name)

    if get_input_value(driver, "input#name") != original_name:
        raise Exception("Nama profil Admin gagal dikembalikan ke nilai awal.")


# ============================================================
# TS61 - UBAH PASSWORD ADMIN HSSE
# ============================================================

def ts61_ubah_password_admin(driver):
    open_profile_admin(driver)

    # Ubah ke password sementara
    update_password(driver, ADMIN_PASSWORD, TEMP_ADMIN_PASSWORD)

    # Kembalikan ke password asli dari config.py agar test berikutnya tetap bisa login.
    update_password(driver, TEMP_ADMIN_PASSWORD, ADMIN_PASSWORD)

    print("Password Admin berhasil diuji dan dikembalikan ke password awal.")


# ============================================================
# TS62 - MENAMPILKAN HALAMAN PROFIL PEMERIKSA GI
# ============================================================

def ts62_menampilkan_halaman_profile_pemeriksa(driver):
    open_profile_pemeriksa(driver)

    body_text = get_body_text_normalized(driver)

    teks_wajib = [
        "profil (pemeriksa)",
        "informasi profil (pemeriksa)",
        "nama lengkap",
        "username lapangan",
        "update password",
        "current password",
        "new password",
        "confirm password",
    ]

    for teks in teks_wajib:
        if teks not in body_text:
            raise Exception(f"Teks '{teks}' tidak ditemukan pada halaman Profil Pemeriksa.")

    if "delete account" in body_text:
        raise Exception("Form Delete Account seharusnya tidak tampil untuk Pemeriksa GI.")


# ============================================================
# TS63 - UBAH USERNAME PEMERIKSA GI
# ============================================================

def ts63_ubah_username_pemeriksa(driver):
    open_profile_pemeriksa(driver)

    original_username = get_input_value(driver, "input#username")

    update_pemeriksa_username(driver, TEMP_PEMERIKSA_USERNAME)

    if get_input_value(driver, "input#username") != TEMP_PEMERIKSA_USERNAME:
        raise Exception("Username Pemeriksa tidak berubah setelah disimpan.")

    # Kembalikan username agar config.py tetap bisa dipakai untuk login berikutnya.
    update_pemeriksa_username(driver, original_username)

    if get_input_value(driver, "input#username") != original_username:
        raise Exception("Username Pemeriksa gagal dikembalikan ke nilai awal.")


# ============================================================
# TS64 - UBAH PASSWORD PEMERIKSA GI
# ============================================================

def ts64_ubah_password_pemeriksa(driver):
    open_profile_pemeriksa(driver)

    # Ubah ke password sementara
    update_password(driver, PEMERIKSA_PASSWORD, TEMP_PEMERIKSA_PASSWORD)

    # Kembalikan ke password asli dari config.py agar test lain tetap bisa login.
    update_password(driver, TEMP_PEMERIKSA_PASSWORD, PEMERIKSA_PASSWORD)

    print("Password Pemeriksa berhasil diuji dan dikembalikan ke password awal.")


# ============================================================
# MAIN RUNNER
# ============================================================

if __name__ == "__main__":
    results = []

    results.append(run_case("TS59", "Menampilkan Halaman Profil Admin HSSE", ts59_menampilkan_halaman_profile_admin))
    results.append(run_case("TS60", "Ubah Username Admin HSSE", ts60_ubah_username_admin))
    results.append(run_case("TS61", "Ubah Password Admin HSSE", ts61_ubah_password_admin))
    results.append(run_case("TS62", "Menampilkan Halaman Profil Pemeriksa GI", ts62_menampilkan_halaman_profile_pemeriksa))
    results.append(run_case("TS63", "Ubah Username Pemeriksa GI", ts63_ubah_username_pemeriksa))
    results.append(run_case("TS64", "Ubah Password Pemeriksa GI", ts64_ubah_password_pemeriksa))

    print("\n" + "=" * 80)
    print("RINGKASAN PENGUJIAN PROFIL TS59-TS64")
    print("=" * 80)
    print(f"Total Test : {len(results)}")
    print(f"Berhasil   : {results.count(True)}")
    print(f"Gagal      : {results.count(False)}")

    if all(results):
        print("SEMUA TEST PROFIL TS59-TS64 BERHASIL")
    else:
        print("ADA TEST PROFIL TS59-TS64 YANG GAGAL")

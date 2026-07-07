import time

from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys

from config import (
    BASE_URL,
    ADMIN_LOGIN,
    ADMIN_PASSWORD,
    PEMERIKSA_LOGIN,
    PEMERIKSA_PASSWORD,
)

from helpers import (
    run_case,
    get_wait,
    fill_login_form,
    login_user,
    logout_user,
    get_body_text_normalized,
)


# ============================================================
# TS01 - LOGIN ADMIN HSSE
# ============================================================

def ts01_login_admin(driver):
    login_user(
        driver,
        ADMIN_LOGIN,
        ADMIN_PASSWORD,
        expected_url_contains="dashboard"
    )

    body_text = get_body_text_normalized(driver)

    if "dashboard" not in body_text:
        raise Exception("Dashboard Admin HSSE tidak terdeteksi setelah login.")


# ============================================================
# TS02 - LOGIN PEMERIKSA GARDU INDUK
# ============================================================

def ts02_login_pemeriksa(driver):
    login_user(
        driver,
        PEMERIKSA_LOGIN,
        PEMERIKSA_PASSWORD,
        expected_url_contains="pemeriksaan-apd"
    )

    body_text = get_body_text_normalized(driver)

    if "pemeriksaan" not in body_text and "apd" not in body_text:
        raise Exception("Halaman Pemeriksaan APD tidak terdeteksi setelah login pemeriksa.")


# ============================================================
# TS03 - LOGIN DENGAN PASSWORD SALAH
# ============================================================

def ts03_login_password_salah(driver):
    driver.get(f"{BASE_URL}/login")

    fill_login_form(
        driver,
        ADMIN_LOGIN,
        "password_salah_123"
    )

    wait = get_wait(driver)

    # Pastikan tetap di halaman login
    wait.until(lambda d: "/login" in d.current_url)

    # Pesan dari Laravel biasanya:
    # "These credentials do not match our records."
    # atau jika sudah diterjemahkan bisa mengandung kata "kredensial", "salah", dll.
    error_keywords = [
        "credentials",
        "these credentials do not match",
        "kredensial",
        "tidak cocok",
        "tidak sesuai",
        "salah",
        "gagal",
        "failed",
        "incorrect",
    ]

    try:
        wait.until(
            lambda d: any(
                keyword in get_body_text_normalized(d)
                for keyword in error_keywords
            )
        )
    except Exception:
        body_text = get_body_text_normalized(driver)
        raise Exception(
            "Pesan kesalahan login tidak muncul saat password salah. "
            f"Teks halaman saat ini: {body_text[:500]}"
        )

    print("Pesan kesalahan login terdeteksi.")


# ============================================================
# TS04 - LOGIN DENGAN FIELD KOSONG
# ============================================================

def ts04_login_field_kosong(driver):
    driver.get(f"{BASE_URL}/login")

    wait = get_wait(driver)

    password_input = wait.until(
        lambda d: d.find_element(
            By.CSS_SELECTOR,
            "input[name='password'], input#password, input[type='password']"
        )
    )

    # Tekan ENTER tanpa mengisi username/email dan password
    password_input.send_keys(Keys.ENTER)

    # Pastikan tetap di halaman login
    wait.until(lambda d: "/login" in d.current_url)

    # Pesan validasi Laravel biasanya:
    # "The login field is required."
    # "The password field is required."
    # atau versi Indonesia: "wajib diisi"
    error_keywords = [
        "required",
        "wajib",
        "harus diisi",
        "wajib diisi",
        "login field is required",
        "password field is required",
        "kolom login",
        "kolom password",
    ]

    try:
        wait.until(
            lambda d: any(
                keyword in get_body_text_normalized(d)
                for keyword in error_keywords
            )
        )
    except Exception:
        body_text = get_body_text_normalized(driver)
        raise Exception(
            "Pesan validasi field kosong tidak muncul. "
            f"Teks halaman saat ini: {body_text[:500]}"
        )

    print("Pesan validasi field kosong terdeteksi.")

# ============================================================
# TS05 - LOGOUT PENGGUNA
# ============================================================

def ts05_logout_pengguna(driver):
    login_user(
        driver,
        ADMIN_LOGIN,
        ADMIN_PASSWORD,
        expected_url_contains="dashboard"
    )

    logout_user(driver)

    # AuthenticatedSessionController logout mengarah ke /
    current_url = driver.current_url.rstrip("/")
    base_url = BASE_URL.rstrip("/")

    if current_url != base_url and "/login" not in driver.current_url:
        raise Exception("Setelah logout, sistem seharusnya kembali ke halaman awal atau halaman login.")


# ============================================================
# MAIN RUNNER
# ============================================================

if __name__ == "__main__":
    results = []

    results.append(run_case("TS01", "Login Admin HSSE", ts01_login_admin))
    results.append(run_case("TS02", "Login Pemeriksa Gardu Induk", ts02_login_pemeriksa))
    results.append(run_case("TS03", "Login dengan password salah", ts03_login_password_salah))
    results.append(run_case("TS04", "Login dengan field kosong", ts04_login_field_kosong))
    results.append(run_case("TS05", "Logout Pengguna", ts05_logout_pengguna))

    print("\n" + "=" * 80)
    print("RINGKASAN PENGUJIAN AUTH")
    print("=" * 80)
    print(f"Total Test : {len(results)}")
    print(f"Berhasil   : {results.count(True)}")
    print(f"Gagal      : {results.count(False)}")

    if all(results):
        print("SEMUA TEST AUTH BERHASIL")
    else:
        print("ADA TEST AUTH YANG GAGAL")
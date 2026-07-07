import os
import time
import tempfile
from pathlib import Path

# Matikan stats Selenium Manager agar tidak mencoba kirim data ke Plausible
os.environ["SE_AVOID_STATS"] = "true"

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

from config import BASE_URL, WAIT_TIME, SCREENSHOT_DIR, LOG_DIR


# ============================================================
# SETUP FOLDER
# ============================================================

Path(SCREENSHOT_DIR).mkdir(exist_ok=True)
Path(LOG_DIR).mkdir(exist_ok=True)


# ============================================================
# DRIVER
# ============================================================

def create_driver():
    options = webdriver.ChromeOptions()

    # Stabil untuk Laravel + React + Inertia
    options.page_load_strategy = "eager"

    # Pakai profile Chrome sementara yang bersih
    # agar tidak masuk ke chrome://settings/triggeredResetProfileSettings
    chrome_profile = tempfile.mkdtemp(prefix="selenium_chrome_")
    options.add_argument(f"--user-data-dir={chrome_profile}")

    # Hindari halaman awal / reset / default browser check
    options.add_argument("--no-first-run")
    options.add_argument("--no-default-browser-check")
    options.add_argument("--disable-search-engine-choice-screen")
    options.add_argument("--disable-popup-blocking")
    options.add_argument("--disable-notifications")
    options.add_argument("--disable-extensions")

    # Jangan pakai driver.maximize_window()
    options.add_argument("--window-size=1366,768")

    # Mengurangi log Chrome yang tidak penting
    options.add_experimental_option("excludeSwitches", ["enable-logging"])

    driver = webdriver.Chrome(options=options)

    return driver


def get_wait(driver):
    return WebDriverWait(driver, WAIT_TIME)


# ============================================================
# SCREENSHOT ERROR
# ============================================================

def save_error_screenshot(driver, test_id):
    filename = f"{SCREENSHOT_DIR}/debug_{test_id.lower()}_gagal.png"

    try:
        driver.save_screenshot(filename)
        print(f"Screenshot error disimpan sebagai {filename}")
    except Exception as e:
        print(f"Gagal menyimpan screenshot: {e}")

    return filename


# ============================================================
# NORMALISASI TEKS
# ============================================================

def normalize_text(text):
    return " ".join(text.lower().split())


def get_body_text(driver):
    return driver.find_element(By.TAG_NAME, "body").text


def get_body_text_normalized(driver):
    return normalize_text(get_body_text(driver))


def wait_for_text(driver, keywords):
    wait = get_wait(driver)

    if isinstance(keywords, str):
        keywords = [keywords]

    keywords = [keyword.lower() for keyword in keywords]

    wait.until(
        lambda d: any(keyword in get_body_text_normalized(d) for keyword in keywords)
    )


# ============================================================
# INPUT LOGIN
# Disesuaikan dengan Login.jsx:
# name="login", id="login"
# name="password", id="password"
# ============================================================

def fill_login_form(driver, username, password):
    wait = get_wait(driver)

    login_input = wait.until(
        EC.visibility_of_element_located((
            By.CSS_SELECTOR,
            "input[name='login'], input#login, input[placeholder='Username atau Email'], input[type='text']"
        ))
    )

    login_input.clear()
    login_input.send_keys(username)

    password_input = wait.until(
        EC.visibility_of_element_located((
            By.CSS_SELECTOR,
            "input[name='password'], input#password, input[type='password']"
        ))
    )

    password_input.clear()
    password_input.send_keys(password)

    password_input.send_keys(Keys.ENTER)


# ============================================================
# LOGIN USER
# ============================================================

def login_user(driver, username, password, expected_url_contains=None):
    wait = get_wait(driver)

    driver.get(f"{BASE_URL}/login")

    fill_login_form(driver, username, password)

    # Tunggu sampai berhasil keluar dari halaman login
    wait.until(lambda d: "/login" not in d.current_url)

    if expected_url_contains:
        if expected_url_contains not in driver.current_url:
            raise Exception(
                f"URL setelah login tidak sesuai. "
                f"URL sekarang: {driver.current_url}, "
                f"seharusnya mengandung: {expected_url_contains}"
            )


# ============================================================
# LOGOUT USER
# Disesuaikan dengan AuthenticatedLayout.jsx:
# Dropdown user -> Log Out
# ============================================================

def logout_user(driver):
    wait = get_wait(driver)

    # Tunggu tombol di navbar muncul
    wait.until(
        EC.presence_of_element_located((By.CSS_SELECTOR, "nav button"))
    )

    # Cari tombol dropdown user di navbar
    nav_buttons = driver.find_elements(By.CSS_SELECTOR, "nav button")

    clicked_dropdown = False

    for btn in reversed(nav_buttons):
        try:
            text = btn.text.strip()

            # Tombol user biasanya punya teks nama user.
            # Tombol hamburger/notifikasi biasanya kosong.
            if btn.is_displayed() and btn.is_enabled() and text:
                btn.click()
                clicked_dropdown = True
                time.sleep(1)
                break
        except:
            continue

    if not clicked_dropdown:
        raise Exception("Tombol dropdown user tidak ditemukan.")

    # Klik tombol Log Out di dropdown
    logout_button = wait.until(
        EC.element_to_be_clickable((
            By.XPATH,
            "//*[contains(text(), 'Log Out') or contains(text(), 'Logout') or contains(text(), 'Keluar')]"
        ))
    )

    logout_button.click()

    # Controller logout mengarah ke /
    wait.until(
        lambda d:
            "/login" in d.current_url
            or d.current_url.rstrip("/") == BASE_URL.rstrip("/")
    )


# ============================================================
# RUN TEST CASE
# ============================================================

def run_case(test_id, title, test_function):
    print("=" * 80)
    print(f"{test_id} - {title}")
    print("=" * 80)

    driver = None
    start = time.time()

    try:
        driver = create_driver()

        test_function(driver)

        duration = round(time.time() - start, 2)

        print(f"TEST {test_id} BERHASIL")
        print(f"Keterangan : {title}")
        print(f"Durasi     : {duration} detik")

        return True

    except Exception as e:
        duration = round(time.time() - start, 2)

        print(f"TEST {test_id} GAGAL")
        print(f"Keterangan : {title}")
        print(f"Durasi     : {duration} detik")

        if driver is not None:
            try:
                print(f"URL        : {driver.current_url}")
                print(f"Judul      : {driver.title}")
                save_error_screenshot(driver, test_id)
            except Exception as screenshot_error:
                print(f"Tidak bisa membaca URL/Judul atau screenshot: {screenshot_error}")

        print(f"Error      : {e}")

        return False

    finally:
        if driver is not None:
            try:
                driver.quit()
            except:
                pass

        # Jeda pendek agar ChromeDriver benar-benar tertutup
        time.sleep(1)
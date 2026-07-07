import time
from urllib.parse import quote_plus

from selenium.webdriver.common.by import By
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
# KONFIGURASI URL
# ============================================================

NOTIFIKASI_URL = f"{BASE_URL}/notifikasi"

STATUS_FILTER_MAP = {
    "Expired": "Merah",
    "Warning": "Kuning",
    "Active": "Hijau",
}


# ============================================================
# HELPER NOTIFIKASI APD
# ============================================================

def open_notifikasi_page(driver):
    login_user(
        driver,
        ADMIN_LOGIN,
        ADMIN_PASSWORD,
        expected_url_contains="dashboard"
    )

    driver.get(NOTIFIKASI_URL)

    wait_for_notifikasi_page(driver)


def wait_for_notifikasi_page(driver):
    wait = get_wait(driver)

    wait.until(
        lambda d: "/notifikasi" in d.current_url
    )

    wait_for_text(driver, [
        "notifikasi monitoring apd",
        "daftar notifikasi",
    ])


def get_notification_cards_statuses(driver):
    """
    Ambil status yang muncul pada kartu notifikasi.
    Di UI status tampil sebagai teks bullet: • Expired / • Warning / • Active.
    """
    statuses = []

    status_elements = driver.find_elements(
        By.XPATH,
        "//*[contains(normalize-space(.), '• Expired') or contains(normalize-space(.), '• Warning') or contains(normalize-space(.), '• Active')]"
    )

    for element in status_elements:
        text = " ".join(element.text.split()).strip()

        if "• Expired" in text and "Expired" not in statuses:
            statuses.append("Expired")
        if "• Warning" in text and "Warning" not in statuses:
            statuses.append("Warning")
        if "• Active" in text and "Active" not in statuses:
            statuses.append("Active")

    return statuses


def detect_available_notification_status(driver):
    statuses = get_notification_cards_statuses(driver)

    if statuses:
        # Prioritaskan status yang paling kritis jika ada.
        for status in ["Expired", "Warning", "Active"]:
            if status in statuses:
                return status

    body_text = get_body_text_normalized(driver)

    raise Exception(
        "Status notifikasi pada kartu APD tidak ditemukan. "
        "Pastikan terdapat data Monitoring APD dengan tanggal berakhir. "
        f"Teks halaman: {body_text[:700]}"
    )


def click_status_filter(driver, status):
    wait = get_wait(driver)

    filter_label = STATUS_FILTER_MAP[status]

    button = wait.until(
        EC.element_to_be_clickable((
            By.XPATH,
            f"//button[contains(., '{filter_label}')]"
        ))
    )

    driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", button)
    time.sleep(0.3)
    driver.execute_script("arguments[0].click();", button)

    encoded = quote_plus(filter_label)

    try:
        wait.until(
            lambda d:
                f"status={encoded}" in d.current_url
                or f"status={filter_label}" in d.current_url
        )
    except Exception:
        # Inertia terkadang preserveState, jadi URL tidak selalu langsung berubah.
        pass

    time.sleep(2.5)


def ensure_status_displayed_after_filter(driver, expected_status):
    statuses = get_notification_cards_statuses(driver)

    if expected_status not in statuses:
        body_text = get_body_text_normalized(driver)
        raise Exception(
            f"Status notifikasi '{expected_status}' tidak ditemukan setelah filter diterapkan. "
            f"Status yang terdeteksi: {statuses}. Teks halaman: {body_text[:700]}"
        )


# ============================================================
# TS48 - MENAMPILKAN NOTIFIKASI APD
# ============================================================

def ts48_menampilkan_notifikasi_apd(driver):
    open_notifikasi_page(driver)

    body_text = get_body_text_normalized(driver)

    teks_wajib = [
        "notifikasi monitoring apd",
        "monitoring masa expired apd",
        "belum dibaca",
        "expired",
        "masa menipis",
        "kondisi aman",
        "semua notifikasi",
        "semua status",
        "merah",
        "kuning",
        "hijau",
        "daftar notifikasi",
    ]

    for teks in teks_wajib:
        if teks not in body_text:
            raise Exception(f"Teks '{teks}' tidak ditemukan pada halaman Notifikasi APD.")

    # Minimal halaman tampil. Jika tidak ada kartu, masih bisa lolos TS48 karena halaman notifikasi valid.
    print("Halaman Notifikasi APD berhasil ditampilkan.")


# ============================================================
# TS49 - VALIDASI STATUS NOTIFIKASI APD
# ============================================================

def ts49_validasi_status_notifikasi_apd(driver):
    open_notifikasi_page(driver)

    status_target = detect_available_notification_status(driver)

    click_status_filter(driver, status_target)

    ensure_status_displayed_after_filter(driver, status_target)

    print(f"Validasi status notifikasi berhasil untuk status: {status_target}")


# ============================================================
# MAIN RUNNER
# ============================================================

if __name__ == "__main__":
    results = []

    results.append(run_case("TS48", "Menampilkan Notifikasi APD", ts48_menampilkan_notifikasi_apd))
    results.append(run_case("TS49", "Validasi Status Notifikasi APD", ts49_validasi_status_notifikasi_apd))

    print("\n" + "=" * 80)
    print("RINGKASAN PENGUJIAN NOTIFIKASI APD TS48-TS49")
    print("=" * 80)
    print(f"Total Test : {len(results)}")
    print(f"Berhasil   : {results.count(True)}")
    print(f"Gagal      : {results.count(False)}")

    if all(results):
        print("SEMUA TEST NOTIFIKASI APD TS48-TS49 BERHASIL")
    else:
        print("ADA TEST NOTIFIKASI APD TS48-TS49 YANG GAGAL")

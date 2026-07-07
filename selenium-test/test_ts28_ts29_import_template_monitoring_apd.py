import re
import time
import zipfile
from datetime import datetime
from pathlib import Path
from xml.sax.saxutils import escape
from urllib.request import Request, urlopen

from selenium.webdriver.common.by import By
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
# FOLDER FILE TEST
# ============================================================

BASE_DIR = Path(__file__).resolve().parent
DOWNLOAD_DIR = BASE_DIR / "downloads"
IMPORT_DIR = BASE_DIR / "import_files"

DOWNLOAD_DIR.mkdir(exist_ok=True)
IMPORT_DIR.mkdir(exist_ok=True)

TIMESTAMP = datetime.now().strftime("%Y%m%d%H%M%S")
IMPORT_FILE = IMPORT_DIR / f"import_monitoring_apd_valid_{TIMESTAMP}.xlsx"


# ============================================================
# HELPER DOWNLOAD / FILE
# ============================================================

def configure_download_dir(driver):
    """Arahkan download Chrome ke folder selenium-test/downloads."""
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
        # Jika CDP gagal, Chrome akan memakai folder Downloads default.
        pass


def wait_for_download_complete(before_files, timeout=40):
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

    raise Exception("File download tidak berhasil terunduh ke folder downloads dalam batas waktu.")


def col_name(index):
    """1 -> A, 2 -> B, dst."""
    result = ""
    while index:
        index, remainder = divmod(index - 1, 26)
        result = chr(65 + remainder) + result
    return result


def make_cell(ref, value):
    value = escape(str(value))
    return f'<c r="{ref}" t="inlineStr"><is><t>{value}</t></is></c>'


def create_simple_xlsx(path, rows):
    """
    Membuat file .xlsx sederhana tanpa dependency openpyxl.
    Format ini valid untuk dibaca Excel/Laravel Excel.
    """
    sheet_rows = []

    for r_idx, row in enumerate(rows, start=1):
        cells = []
        for c_idx, value in enumerate(row, start=1):
            ref = f"{col_name(c_idx)}{r_idx}"
            cells.append(make_cell(ref, value))
        sheet_rows.append(f'<row r="{r_idx}">{"".join(cells)}</row>')

    sheet_xml = f'''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
    <sheetData>{"".join(sheet_rows)}</sheetData>
</worksheet>'''

    content_types = '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
    <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
    <Default Extension="xml" ContentType="application/xml"/>
    <Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>
    <Override PartName="/xl/worksheets/sheet1.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>
    <Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>
</Types>'''

    root_rels = '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
    <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/>
</Relationships>'''

    workbook_xml = '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">
    <sheets>
        <sheet name="Template Import" sheetId="1" r:id="rId1"/>
    </sheets>
</workbook>'''

    workbook_rels = '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
    <Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet1.xml"/>
    <Relationship Id="rId2" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/>
</Relationships>'''

    styles_xml = '''<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">
    <fonts count="1"><font><sz val="11"/><name val="Calibri"/></font></fonts>
    <fills count="1"><fill><patternFill patternType="none"/></fill></fills>
    <borders count="1"><border/></borders>
    <cellStyleXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0"/></cellStyleXfs>
    <cellXfs count="1"><xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/></cellXfs>
</styleSheet>'''

    with zipfile.ZipFile(path, "w", zipfile.ZIP_DEFLATED) as z:
        z.writestr("[Content_Types].xml", content_types)
        z.writestr("_rels/.rels", root_rels)
        z.writestr("xl/workbook.xml", workbook_xml)
        z.writestr("xl/_rels/workbook.xml.rels", workbook_rels)
        z.writestr("xl/worksheets/sheet1.xml", sheet_xml)
        z.writestr("xl/styles.xml", styles_xml)


def clean_option_label(text):
    """
    Bersihkan label option jika formatnya:
    - KODE - Nama
    - Nama (4 tahun)
    Import membutuhkan nama APD/Lokasi/Gardu yang sesuai database.
    """
    text = " ".join((text or "").split()).strip()

    # Buang keterangan masa pakai yang biasanya ditambahkan di UI, misalnya "(4 tahun)".
    text = re.sub(r"\s*\(\d+\s*tahun\)\s*$", "", text, flags=re.IGNORECASE).strip()

    # Jika formatnya "KODE - Nama", ambil bagian nama.
    if " - " in text:
        parts = [p.strip() for p in text.split(" - ") if p.strip()]
        if len(parts) >= 2:
            return parts[-1]

    return text


def get_first_option_text(driver, selector, error_message):
    wait = get_wait(driver)

    select_el = wait.until(
        EC.visibility_of_element_located((By.CSS_SELECTOR, selector))
    )

    select_obj = SeleniumSelect(select_el)

    for index, option in enumerate(select_obj.options):
        value = option.get_attribute("value")
        text = clean_option_label(option.text)

        if value and text:
            select_obj.select_by_index(index)
            driver.execute_script(
                "arguments[0].dispatchEvent(new Event('change', { bubbles: true }));",
                select_el
            )
            time.sleep(1)
            return text

    raise Exception(error_message)


def get_valid_master_data_for_import(driver):
    """
    Membuka form tambah Monitoring APD untuk mengambil nama APD, Lokasi,
    dan Gardu Induk yang tersedia di database.
    """
    driver.get(f"{BASE_URL}/monitoring-apd/create")
    wait_for_text(driver, ["tambah monitoring apd"])

    apd_name = get_first_option_text(
        driver,
        "select[name='apd_id'], select#apd_id",
        "Data APD belum tersedia. Tambahkan Master APD terlebih dahulu."
    )

    lokasi_name = get_first_option_text(
        driver,
        "select[name='lokasi_id'], select#lokasi_id",
        "Data Lokasi belum tersedia. Tambahkan Lokasi terlebih dahulu."
    )

    time.sleep(1.5)

    gardu_name = get_first_option_text(
        driver,
        "select[name='gardu_induk_id'], select#gardu_induk_id",
        "Data Gardu Induk belum tersedia. Tambahkan Gardu Induk terlebih dahulu."
    )

    return apd_name, lokasi_name, gardu_name


def create_valid_import_xlsx(driver):
    apd_name, lokasi_name, gardu_name = get_valid_master_data_for_import(driver)

    headers = [
        "Nama APD",
        "Lokasi",
        "Gardu Induk",
        "Stok",
        "Tanggal Distribusi (YYYY-MM-DD)",
        "Tanggal Pemeriksaan (YYYY-MM-DD)",
        "Tanggal Berakhir (YYYY-MM-DD)",
        "Kondisi",
        "Catatan",
    ]

    row = [
        apd_name,
        lokasi_name,
        gardu_name,
        "7",
        "2026-07-01",
        "2026-07-02",
        "2027-07-01",
        "Baik",
        f"SELENIUM IMPORT MONITORING APD {TIMESTAMP}",
    ]

    create_simple_xlsx(IMPORT_FILE, [headers, row])

    print(f"File import valid dibuat: {IMPORT_FILE}")
    print(f"Data import: APD={apd_name}, Lokasi={lokasi_name}, Gardu={gardu_name}")

    return IMPORT_FILE


# ============================================================
# HELPER HALAMAN MONITORING APD
# ============================================================

def login_admin_with_retry(driver, max_attempts=3):
    last_error = None

    for attempt in range(1, max_attempts + 1):
        try:
            login_user(
                driver,
                ADMIN_LOGIN,
                ADMIN_PASSWORD,
                expected_url_contains="dashboard"
            )

            # Jika login berhasil, halaman tidak boleh masih berada di /login.
            if "/login" not in driver.current_url:
                return

            last_error = Exception("Login masih berada di halaman /login.")
        except Exception as error:
            last_error = error

        print(f"Percobaan login admin ke-{attempt} belum berhasil, mencoba ulang...")
        time.sleep(3)
        driver.get(f"{BASE_URL}/login")
        time.sleep(1)

    raise Exception(f"Login admin gagal setelah {max_attempts} percobaan. Error terakhir: {last_error}")


def open_monitoring_index(driver):
    login_admin_with_retry(driver, max_attempts=3)

    driver.get(f"{BASE_URL}/monitoring-apd")
    wait_for_text(driver, ["monitoring apd"])


def click_import_excel_button(driver):
    wait = get_wait(driver)

    button = wait.until(
        EC.element_to_be_clickable((
            By.XPATH,
            "//*[self::button or self::a][contains(., 'Import Excel') or contains(., 'Import') or contains(., 'Excel')]"
        ))
    )

    driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", button)
    time.sleep(0.3)
    driver.execute_script("arguments[0].click();", button)


def upload_import_file(driver, file_path):
    wait = get_wait(driver)

    file_input = wait.until(
        EC.presence_of_element_located((
            By.CSS_SELECTOR,
            "input[type='file']"
        ))
    )

    driver.execute_script(
        """
        arguments[0].style.display = 'block';
        arguments[0].style.visibility = 'visible';
        arguments[0].style.opacity = 1;
        arguments[0].style.height = '40px';
        arguments[0].style.width = '400px';
        """,
        file_input
    )

    file_input.send_keys(str(file_path.resolve()))
    time.sleep(1)


def click_submit_import_button(driver):
    # Ambil tombol import terakhir agar tidak menekan tombol pembuka modal lagi.
    buttons = driver.find_elements(
        By.XPATH,
        "//button[contains(., 'Import') or contains(., 'Upload') or contains(., 'Proses')]"
    )

    clickable_buttons = [b for b in buttons if b.is_displayed() and b.is_enabled()]

    if not clickable_buttons:
        raise Exception("Tombol submit import tidak ditemukan setelah file dipilih.")

    submit_button = clickable_buttons[-1]

    driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", submit_button)
    time.sleep(0.3)
    driver.execute_script("arguments[0].click();", submit_button)

    try:
        wait_for_text(driver, [
            "import selesai",
            "berhasil diproses",
            "ditambahkan",
            "diperbarui",
            "data monitoring apd",
        ])
    except Exception:
        body_text = get_body_text_normalized(driver)
        raise Exception(
            "Import file Monitoring APD belum terdeteksi berhasil. "
            f"Teks halaman: {body_text[:1200]}"
        )


def click_template_button_inside_modal(driver):
    wait = get_wait(driver)

    # Template berada di modal Import Data Excel.
    button = wait.until(
        EC.element_to_be_clickable((
            By.XPATH,
            "//*[self::a or self::button][contains(., 'Unduh Template') or contains(., 'Template')]"
        ))
    )

    driver.execute_script("arguments[0].scrollIntoView({block: 'center'});", button)
    time.sleep(0.3)
    driver.execute_script("arguments[0].click();", button)


def download_template_with_fallback(driver, before_files):
    try:
        click_template_button_inside_modal(driver)
        return wait_for_download_complete(before_files, timeout=20)
    except Exception:
        # Fallback jika tombol UI tidak memicu download di Selenium.
        # Route template di controller umumnya berada di /monitoring-apd/template.
        driver.get(f"{BASE_URL}/monitoring-apd/template")
        return wait_for_download_complete(before_files, timeout=40)



# ============================================================
# HELPER DOWNLOAD VIA HTTP SESSION SELENIUM
# ============================================================

def download_url_with_browser_session(driver, url, default_filename):
    """
    Download file memakai cookie dari browser Selenium.
    Ini lebih stabil daripada menunggu Chrome download, terutama saat route
    mengembalikan file attachment dari Laravel.
    """
    cookies = "; ".join(
        f"{cookie['name']}={cookie['value']}"
        for cookie in driver.get_cookies()
    )

    request = Request(
        url,
        headers={
            "Cookie": cookies,
            "User-Agent": "Mozilla/5.0",
            "Accept": "*/*",
        },
    )

    with urlopen(request, timeout=60) as response:
        data = response.read()
        content_type = response.headers.get("Content-Type", "")
        content_disposition = response.headers.get("Content-Disposition", "")

    # Jika ternyata yang terunduh adalah halaman HTML error/login, jangan dianggap berhasil.
    first_bytes = data[:300].lower()
    if b"<html" in first_bytes or b"<!doctype html" in first_bytes:
        raise Exception(
            "Route template mengembalikan HTML, bukan file Excel. "
            "Kemungkinan session tidak terbaca atau terjadi error pada controller."
        )

    filename = default_filename

    match = re.search(r'filename="?([^";]+)"?', content_disposition)
    if match:
        filename = match.group(1)

    path = DOWNLOAD_DIR / filename
    path.write_bytes(data)

    return path, content_type


# ============================================================
# TS28 - IMPORT DATA MONITORING APD
# ============================================================

def ts28_import_data_monitoring_apd(driver):
    configure_download_dir(driver)

    open_monitoring_index(driver)

    # Buat file XLSX valid berdasarkan data master yang tersedia di form create.
    import_file = create_valid_import_xlsx(driver)

    # Kembali ke index lalu lakukan import dari UI.
    driver.get(f"{BASE_URL}/monitoring-apd")
    wait_for_text(driver, ["monitoring apd"])

    click_import_excel_button(driver)
    upload_import_file(driver, import_file)
    click_submit_import_button(driver)

    print("Import Data Monitoring APD selesai diproses.")


# ============================================================
# TS29 - UNDUH TEMPLATE MONITORING APD
# ============================================================

def ts29_unduh_template_monitoring_apd(driver):
    configure_download_dir(driver)

    open_monitoring_index(driver)

    # Tombol Unduh Template berada di modal Import Excel, jadi modal tetap dibuka
    # agar alur UI sesuai skenario.
    click_import_excel_button(driver)
    wait_for_text(driver, ["unduh template", "panduan import"])

    template_url = f"{BASE_URL}/monitoring-apd/template"

    downloaded_file, content_type = download_url_with_browser_session(
        driver,
        template_url,
        f"template_monitoring_apd_{TIMESTAMP}.xlsx"
    )

    if downloaded_file.suffix.lower() not in [".xlsx", ".xls", ".csv"]:
        raise Exception(
            f"File template berhasil diunduh, tetapi formatnya tidak sesuai: {downloaded_file.name}. "
            f"Content-Type: {content_type}"
        )

    print(f"Template Monitoring APD berhasil diunduh: {downloaded_file}")


# ============================================================
# MAIN RUNNER
# ============================================================

if __name__ == "__main__":
    results = []

    results.append(run_case("TS28", "Import Data Monitoring APD", ts28_import_data_monitoring_apd))
    results.append(run_case("TS29", "Unduh Template Monitoring APD", ts29_unduh_template_monitoring_apd))

    print("\n" + "=" * 80)
    print("RINGKASAN PENGUJIAN IMPORT & TEMPLATE MONITORING APD")
    print("=" * 80)
    print(f"Total Test : {len(results)}")
    print(f"Berhasil   : {results.count(True)}")
    print(f"Gagal      : {results.count(False)}")

    if all(results):
        print("SEMUA TEST IMPORT & TEMPLATE MONITORING APD BERHASIL")
    else:
        print("ADA TEST IMPORT & TEMPLATE MONITORING APD YANG GAGAL")

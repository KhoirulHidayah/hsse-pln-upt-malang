<?php 
\Carbon\Carbon::setLocale('id'); 
?>
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Form Serah Terima Barang</title>
    <style>
        @page {
            margin: 25mm 20mm;
            size: A4 portrait;
        }

        body {
            font-family: Arial, sans-serif;
            font-weight: bold;
            font-size: 11pt;
            color: #000;
        }

        /* ==== FIX PRINT GARIS TIDAK PUTUS ==== */
        @media print {
            table {
                width: 100%;
                border-collapse: collapse !important;
            }
            thead {
                display: table-header-group;
            }
            tr, td, th {
                border: 1px solid #000 !important;
            }
            tr {
                page-break-inside: avoid;
            }
        }

        .header-logo { width: 70px; }

        .header-text {
            font-size: 12pt;
            font-weight: bold;
            line-height: 1.3;
            margin-left: 5px;
        }

        .header-row {
            display: table;
            width: 100%;
            margin-bottom: 40px;
        }

        .header-cell {
            display: table-cell;
            vertical-align: top;
        }

        .judul-sistem {
            text-align: center;
            font-size: 16pt;
            font-weight: bold;
            margin-top: 190px;
            line-height: 1.4;
        }

        .judul-sistem2 {
            text-align: center;
            font-size: 13pt;
            font-weight: bold;
            margin-bottom: 190px;
            line-height: 1.4;
        }

        .judul-formulir {
            text-align: center;
            font-size: 18pt;
            font-weight: bold;
            margin-bottom: 15px;
        }

        .judul-barang {
            text-align: center;
            font-size: 18pt;
            font-weight: bold;
            margin-bottom: 50px;
        }

        .doc-table {
            width: 90%;
            border-collapse: collapse;
            font-size: 12pt;
            margin-left: 30px;
            margin-right: 20px;
        }

        .doc-table td {
            border: 1px solid #000;
            padding: 4px 8px;
            font-weight: bold;
        }

        .label {
            width: 35%;
            font-weight: bold;
            font-size: 12pt;
        }

        .separator-col {
            width: 1%; /* Atur lebar kolom pemisah */
            text-align: center;
            font-weight: bold; /* Agar titik dua terlihat tebal */
        }

        .page-break {
            page-break-after: always;
        }

        .info {
            margin-top: 10px;
            font-size: 11pt;
            line-height: 1.5;
        }

        .info table { width: 100%; }

        .spec-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 10px;
            font-size: 11pt;
        }

        .spec-table th,
        .spec-table td {
            border: 1px solid #000;
            padding: 6px 5px;
            text-align: center;
        }

        .left {
            text-align: left;
            padding-left: 10px;
        }

        .signature-wrapper {
            width: 100%;
            margin-top: 40px;
            display: table;
        }

        .signature-box {
            display: table-cell;
            width: 50%;
            text-align: center;
            font-size: 11pt;
            font-weight: normal;
        }

        .signature-space { height: 90px; }

        .signature-image {
            max-width: 120px;
            max-height: 70px;
        }

        .ttd-name {
            display: inline-block;
            font-weight: normal;
            padding-top: 3px;
            width: 180px;
        }

        .location-date {
            text-align: right;
            margin-top: 20px;
            font-size: 11pt;
        }

        .checkbox-square {
            display: inline-block;
            width: 12px;  /* Lebar kotak */
            height: 12px; /* Tinggi kotak */
            border: 1px solid #000;
            margin-left: 5px;
            margin-right: 5px;
            vertical-align: middle; /* Agar sejajar dengan teks */
        }
    </style>
</head>
<body>

<!-- ========== HALAMAN 1 ========== -->

<div class="header-row">
    <div class="header-cell" style="width: 70px;">
        @if(file_exists(public_path('img/logo_pln.png')))
            <img src="{{ public_path('img/logo_pln.png') }}" class="header-logo">
        @endif
    </div>
    <div class="header-cell header-text">
        UNIT INDUK TRANSMISI<br>
        JAWA BAGIAN TIMUR DAN BALI<br>
        UPT MALANG
    </div>
</div>

<div class="judul-sistem">
    SISTEM MANAJEMEN PENGAMANAN NON SERTIFIKASI<br>
    (SMP-&nbsp;&nbsp;&nbsp;NON OBVITNAS)<br>
</div>

<div class="judul-sistem2">
    UNIT INDUK TRANSMISI JAWA BAGIAN TIMUR DAN BALI<br>
    UNIT PELAKSANA TRANSMISI MALANG
</div>

<div class="judul-formulir">FORMULIR</div>
<div class="judul-barang">TANDA BUKTI SERAH TERIMA BARANG</div>

<table class="doc-table">
    <tr>
        <td class="label">NO. DOKUMEN</td>
        <td class="separator-col">:</td> <td>{{ $data->no_dokumen }}</td>
    </tr>
    <tr>
        <td class="label">STATUS DOKUMEN</td>
        <td class="separator-col">:</td>
        <td>
            MASTER
            <div class="checkbox-square">
                {!! strtoupper($data->status_dokumen)=='MASTER' ? 'V' : '&nbsp;' !!}
            </div>
            &nbsp;&nbsp;&nbsp; COPY
            <div class="checkbox-square">
                {!! strtoupper($data->status_dokumen)=='COPY' ? 'V' : '&nbsp;' !!}
            </div>
            &nbsp;&nbsp;&nbsp; NO: {{ $data->copy_no ?? '' }}
        </td>
    </tr>
    <tr>
        <td class="label">NOMOR REVISI</td>
        <td class="separator-col">:</td> <td>{{ str_pad($data->nomor_revisi,2,'0',STR_PAD_LEFT) }}</td>
    </tr>
    <tr>
        <td class="label">NOMOR EDISI</td>
        <td class="separator-col">:</td> <td>{{ str_pad($data->nomor_edisi,2,'0',STR_PAD_LEFT) }}</td>
    </tr>
    <tr>
        <td class="label">TANGGAL EFEKTIF</td>
        <td class="separator-col">:</td> <td>{{ \Carbon\Carbon::parse($data->tanggal_efektif)->translatedFormat('d F Y') }}</td>
    </tr>
</table>

<div class="page-break"></div>

<!-- ========== HALAMAN 2 - HEADER RAPI ========== -->

<table style="width:100%; border:1px solid #000; border-collapse:collapse; font-size:11pt;">
    <thead>
        <!-- Baris Logo -->
        <tr>
            <td colspan="2" style="padding:6px;">
                <table style="width:100%; border-collapse:collapse;">
                    <tr>
                        <td style="width:70px; vertical-align:middle;">
                            @if(file_exists(public_path('img/logo_pln.png')))
                                <img src="{{ public_path('img/logo_pln.png') }}" width="50">
                            @endif
                        </td>
                        <td style="font-weight:bold; line-height:1.2;">
                            UNIT INDUK TRANSMISI<br>
                            JAWA BAGIAN TIMUR DAN BALI<br>
                            UPT MALANG
                        </td>
                    </tr>
                </table>
            </td>
        </tr>

        <!-- Baris Judul & Info Dokumen -->
        <tr>
            <td style="width:55%; border-top:1px solid #000; border-right:1px solid #000; padding:12px 10px; text-align:center;">
                <div style="font-weight:bold;">FORMULIR</div>
                <div style="margin-top:4px; font-weight:bold;">
                    TANDA BUKTI SERAH TERIMA BARANG DARI PIHAK LUAR (JASA PENGIRIMAN)
                </div>
            </td>

            <td style="width:45%; border-top:1px solid #000; padding:0; vertical-align:top;">
                <table style="width:100%; border-collapse:collapse; font-size:10.5pt;">
                    <tr>
                        <td style="padding:4px 8px; border-bottom:1px solid #000;"><b>No. Dok</b></td>
                        <td style="padding:4px 0; border-bottom:1px solid #000; width:5px;">:</td>
                        <td style="padding:4px 8px; border-bottom:1px solid #000;"><b>{{ $data->no_dokumen }}</b></td> </tr>
                    <tr>
                        <td style="padding:4px 8px; border-bottom:1px solid #000;"><b>Revisi</b></td>
                        <td style="padding:4px 0; border-bottom:1px solid #000;">:</td>
                        <td style="padding:4px 8px; border-bottom:1px solid #000;"><b>{{ str_pad($data->nomor_revisi,2,'0',STR_PAD_LEFT) }}</b></td> </tr>
                    <tr>
                        <td style="padding:4px 8px; border-bottom:1px solid #000;"><b>Edisi</b></td>
                        <td style="padding:4px 0; border-bottom:1px solid #000;">:</td>
                        <td style="padding:4px 8px; border-bottom:1px solid #000;"><b>{{ str_pad($data->nomor_edisi,2,'0',STR_PAD_LEFT) }}</b></td> </tr>
                    <tr>
                        <td style="padding:4px 8px;"><b>Halaman</b></td>
                        <td style="padding:4px 0;">:</td>
                        <td style="padding:4px 8px;"><b>1 dari 1</b></td> </tr>
                </table>
            </td>
        </tr>
    </thead>
</table>

<div class="info">
    <table>
        <tr>
            <td style="width:150px;"><b>Hari/Tanggal</b></td> <td>:</td>
            <td><b>{{ \Carbon\Carbon::parse($data->tanggal)->translatedFormat('l, d F Y') }}</b></td>
        </tr>
            <td><b>Nama</b></td> <td>:</td>
            <td><b>{{ $data->nama_pengirim }}</b></td> </tr>
        <tr>
            <td><b>Jabatan/Bidang</b></td> <td>:</td>
            <td><b>{{ $data->jabatan_pengirim }}</b></td> </tr>
    </table>
</div>

<table class="spec-table">
    <thead>
        <tr><th colspan="5" style="font-size:12pt;">SPESIFIKASI BARANG</th></tr>
        <tr>
            <th style="width:8%;">Cek</th>
            <th style="width:35%;">Nama ITEM</th>
            <th style="width:20%;">Merk/Type</th>
            <th style="width:20%;">Jumlah</th>
            <th style="width:17%;">Keadaan</th>
        </tr>
    </thead>
    <tbody>
        @foreach($data->details as $item)
        <tr>
            <td>{!! $item->cek ? 'V' : '&nbsp;' !!}</td>
            <td class="left">{{ $item->item_nama }}</td>
            <td>{{ $item->item_merk }}</td>
            <td>{{ $item->jumlah }}</td>
            <td>{{ $item->keadaan }}</td>
        </tr>
        @endforeach

        @for($i = count($data->details); $i < 5; $i++)
        <tr>
            <td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td><td>&nbsp;</td>
        </tr>
        @endfor
    </tbody>
</table>

<div class="location-date">
    {{ $data->lokasi }}, {{ \Carbon\Carbon::parse($data->tanggal)->translatedFormat('d F Y') }}
</div>

<div class="signature-wrapper">
    <div class="signature-box">
        Yang Menerima,
        <div class="signature-space">
            @if(isset($data->tanda_tangan_penerima) && file_exists(public_path($data->tanda_tangan_penerima)))
                <img src="{{ public_path($data->tanda_tangan_penerima) }}" class="signature-image">
            @endif
        </div>
        <div class="ttd-name">{{ $data->nama_penerima }}</div>
    </div>

    <div class="signature-box">
        Yang Menyerahkan,
        <div class="signature-space">
            @if(isset($data->tanda_tangan_pengirim) && file_exists(public_path($data->tanda_tangan_pengirim)))
                <img src="{{ public_path($data->tanda_tangan_pengirim) }}" class="signature-image">
            @endif
        </div>
        <div class="ttd-name">{{ $data->nama_pengirim }}</div>
    </div>
</div>

</body>
</html>

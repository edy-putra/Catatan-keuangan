let data =
JSON.parse(
localStorage.getItem("pengeluaran")
) || [];

/* ===========================
   NAVIGASI HALAMAN
=========================== */

function showPage(pageId){

document
.querySelectorAll(".page")
.forEach(page => {

page.classList.remove("active");

});

document
.getElementById(pageId)
.classList.add("active");

}

/* ===========================
   SIMPAN DATA
=========================== */

function simpanData(){

localStorage.setItem(
"pengeluaran",
JSON.stringify(data)
);

}

/* ===========================
   TAMBAH PENGELUARAN
=========================== */

function tambahPengeluaran(){

const tanggal =
document.getElementById("tanggal").value;

const kategori =
document.getElementById("kategori").value;

const nominal =
Number(
document.getElementById("nominal").value
);

const catatan =
document.getElementById("catatan").value;

if(!tanggal || !nominal){

alert("Lengkapi data terlebih dahulu");

return;

}

data.push({

id:Date.now(),

tanggal,

kategori,

nominal,

catatan

});

simpanData();

document.getElementById("nominal").value="";
document.getElementById("catatan").value="";

renderDashboard();

alert("Data berhasil disimpan");

}

/* ===========================
   DASHBOARD
=========================== */

function renderDashboard(){

const hariIni =
new Date()
.toISOString()
.split("T")[0];

const bulanIni =
hariIni.substring(0,7);

let totalHari = 0;
let totalBulan = 0;
let jumlahTransaksi = 0;

let kategoriBulanan = {};

data.forEach(item=>{

if(item.tanggal === hariIni){

totalHari += item.nominal;

jumlahTransaksi++;

}

if(item.tanggal.startsWith(bulanIni)){

totalBulan += item.nominal;

if(!kategoriBulanan[item.kategori]){

kategoriBulanan[item.kategori]=0;

}

kategoriBulanan[item.kategori]+=item.nominal;

}

});

let kategoriTerbesar = "-";
let nilaiTerbesar = 0;

for(let kategori in kategoriBulanan){

if(
kategoriBulanan[kategori]
>
nilaiTerbesar
){

nilaiTerbesar =
kategoriBulanan[kategori];

kategoriTerbesar =
kategori;

}

}

document
.getElementById("totalHariIni")
.innerHTML =
"Rp " +
totalHari.toLocaleString("id-ID");

document
.getElementById("totalBulanIni")
.innerHTML =
"Rp " +
totalBulan.toLocaleString("id-ID");

document
.getElementById("jumlahTransaksi")
.innerHTML =
jumlahTransaksi;

document
.getElementById("kategoriTerbesar")
.innerHTML =
kategoriTerbesar;

}

/* ===========================
   FILTER RIWAYAT
=========================== */

function filterRiwayat(){

const tanggal =
document
.getElementById("filterTanggal")
.value;

const hasilDiv =
document
.getElementById("hasilRiwayat");

let hasil =
data.filter(item =>
item.tanggal === tanggal
);

hasil.reverse();

if(hasil.length===0){

hasilDiv.innerHTML =

`
<div class="empty">

Tidak ada transaksi

</div>
`;

return;

}

let html="";

hasil.forEach(item=>{

html +=

`
<div class="item">

<b>${item.kategori}</b>

<div class="badge">
${item.tanggal}
</div>

<br><br>

${item.catatan || "-"}

<br><br>

<b>
Rp ${item.nominal
.toLocaleString("id-ID")}
</b>

<br><br>

<button
class="hapus-btn"
onclick="hapusData(${item.id})">

Hapus

</button>

</div>
`;

});

hasilDiv.innerHTML = html;

}

/* ===========================
   HAPUS DATA
=========================== */

function hapusData(id){

const konfirmasi =
confirm(
"Yakin ingin menghapus data ini?"
);

if(!konfirmasi){

return;

}

data =
data.filter(item =>
item.id !== id
);

simpanData();

renderDashboard();

filterRiwayat();

}

/* ===========================
   HAPUS SEMUA DATA
=========================== */

function hapusSemuaData(){

const konfirmasi =
confirm(
"SEMUA DATA AKAN DIHAPUS!"
);

if(!konfirmasi){

return;

}

data = [];

simpanData();

renderDashboard();

document
.getElementById("hasilRiwayat")
.innerHTML = "";

alert("Semua data berhasil dihapus");

}

/* ===========================
   TANGGAL OTOMATIS
=========================== */

document
.getElementById("tanggal")
.value =
new Date()
.toISOString()
.split("T")[0];

/* ===========================
   LOAD AWAL
=========================== */

renderDashboard();

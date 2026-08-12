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

const jenis =
document.getElementById("jenis").value;

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

jenis,

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

const sekarang = new Date();

const hariIni =
`${sekarang.getFullYear()}-${
String(sekarang.getMonth()+1).padStart(2,'0')
}-${
String(sekarang.getDate()).padStart(2,'0')
}`;

const bulanIni =
hariIni.substring(0,7);

let pemasukanBulan = 0;
let pengeluaranHari = 0;
let pengeluaranBulan = 0;

let totalPemasukan = 0;
let totalPengeluaran = 0;

let riwayatHariIni = [];

data.forEach(item=>{

const jenis =
item.jenis || "pengeluaran";

if(jenis === "pemasukan"){

totalPemasukan += item.nominal;

if(item.tanggal.startsWith(bulanIni)){

pemasukanBulan += item.nominal;

}

}else{

totalPengeluaran += item.nominal;

if(item.tanggal === hariIni){

pengeluaranHari += item.nominal;

riwayatHariIni.push(item);

}

if(item.tanggal.startsWith(bulanIni)){

pengeluaranBulan += item.nominal;

}

}

});

const saldoSaatIni =
totalPemasukan - totalPengeluaran;

document
.getElementById("saldoSaatIni")
.innerHTML =
"Rp " +
saldoSaatIni.toLocaleString("id-ID");

document
.getElementById("pemasukanBulan")
.innerHTML =
"Rp " +
pemasukanBulan.toLocaleString("id-ID");

document
.getElementById("pengeluaranHari")
.innerHTML =
"Rp " +
pengeluaranHari.toLocaleString("id-ID");

document
.getElementById("pengeluaranBulan")
.innerHTML =
"Rp " +
pengeluaranBulan.toLocaleString("id-ID");

let html = "";

riwayatHariIni.forEach(item=>{

html += `

<div style="margin-bottom:10px">

<b>${item.kategori}</b>

<br>

Rp ${item.nominal.toLocaleString("id-ID")}

</div>

`;

});

document
.getElementById("riwayatHariIni")
.innerHTML =

html || "Belum ada transaksi";

}

/* ===========================
   FILTER RIWAYAT
=========================== */


function filterRiwayat(){

const awal =
document
.getElementById("tanggalAwal")
.value;

const akhir =
document
.getElementById("tanggalAkhir")
.value;

if(!awal || !akhir){

alert(
"Pilih tanggal awal dan akhir"
);

return;

}

const hasilDiv =
document
.getElementById("hasilRiwayat");

let hasil =
data.filter(item=>{

return item.tanggal >= awal
&&
item.tanggal <= akhir;

});

hasil.sort((a,b)=>
new Date(b.tanggal)
-
new Date(a.tanggal)
);

let total = 0;

let kategori = {};

hasil.forEach(item=>{

total += item.nominal;

if(!kategori[item.kategori]){

kategori[item.kategori]=0;

}

kategori[item.kategori]+=item.nominal;

});

let kategoriTerbesar = "-";
let nilaiTerbesar = 0;

for(let k in kategori){

if(kategori[k] > nilaiTerbesar){

nilaiTerbesar =
kategori[k];

kategoriTerbesar =
k;

}

}

document
.getElementById(
"ringkasanPeriode"
)
.innerHTML =

`
<div class="ringkasan-periode">

<h3>Ringkasan Periode</h3>

<p>
${awal}
s/d
${akhir}
</p>

<br>

<p>
<b>Jumlah Transaksi:</b>
${hasil.length}
</p>

<p>
<b>Total Pengeluaran:</b>
Rp ${total.toLocaleString("id-ID")}
</p>

<p>
<b>Kategori Terbesar:</b>
${kategoriTerbesar}
</p>

</div>
`;

if(hasil.length===0){

hasilDiv.innerHTML=

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

<b>

${item.jenis === "pemasukan"
? "💰 PEMASUKAN"
: "💸 PENGELUARAN"}

<br>

${item.kategori}

</b>

<div class="badge">

${item.tanggal}

</div>

<br><br>

${item.catatan || "-"}

<br><br>

<b>

Rp
${item.nominal
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

const today = new Date();

document.getElementById("tanggal").value =
`${today.getFullYear()}-${
String(today.getMonth()+1).padStart(2,'0')
}-${
String(today.getDate()).padStart(2,'0')
}`;
/* ===========================
   LOAD AWAL
=========================== */

renderDashboard();

/* ===========================
   EXPORT EXCEL
=========================== */

function exportExcel(){

if(data.length === 0){

alert("Belum ada data untuk diexport");

return;

}

const transaksi = data.map(item => ({

Jenis:
item.jenis || "pengeluaran",

Tanggal:
item.tanggal,

Kategori:
item.kategori,

Nominal:
item.nominal,

Catatan:
item.catatan || ""

}));

let ringkasan = {};

data.forEach(item=>{

if(!ringkasan[item.kategori]){

ringkasan[item.kategori] = 0;

}

ringkasan[item.kategori] += item.nominal;

});

const sheetRingkasan = [];

for(let kategori in ringkasan){

sheetRingkasan.push({

Kategori: kategori,

Total: ringkasan[kategori]

});

}

const workbook =
XLSX.utils.book_new();

const ws1 =
XLSX.utils.json_to_sheet(
transaksi
);

const ws2 =
XLSX.utils.json_to_sheet(
sheetRingkasan
);

XLSX.utils.book_append_sheet(
workbook,
ws1,
"Transaksi"
);

XLSX.utils.book_append_sheet(
workbook,
ws2,
"Ringkasan"
);

const today =
new Date();

const namaFile =

`Pengeluaran_${today.getFullYear()}-${String(today.getMonth()+1).padStart(2,'0')}-${String(today.getDate()).padStart(2,'0')}.xlsx`;

XLSX.writeFile(
workbook,
namaFile
);

}

/* ===========================
   FILTER RENTANG TANGGAL
=========================== */

function filterRiwayatPeriode(){

const awal =
document
.getElementById("tanggalAwal")
.value;

const akhir =
document
.getElementById("tanggalAkhir")
.value;

if(!awal || !akhir){

alert(
"Pilih tanggal awal dan akhir"
);

return;

}

let hasil =
data.filter(item =>

item.tanggal >= awal &&
item.tanggal <= akhir

);

hasil.sort((a,b)=>

new Date(b.tanggal)
-
new Date(a.tanggal)

);

let total = 0;

let kategori = {};

hasil.forEach(item=>{

total += item.nominal;

if(!kategori[item.kategori]){

kategori[item.kategori] = 0;

}

kategori[item.kategori] += item.nominal;

});

let kategoriTerbesar = "-";
let nominalTerbesar = 0;

for(let k in kategori){

if(kategori[k] > nominalTerbesar){

nominalTerbesar =
kategori[k];

kategoriTerbesar =
k;

}

}

document
.getElementById(
"ringkasanPeriode"
)
.innerHTML =

`
<div class="ringkasan-periode">

<h3>📊 Ringkasan Periode</h3>

<p>
<b>Periode:</b>
${awal}
s/d
${akhir}
</p>

<p>
<b>Jumlah Transaksi:</b>
${hasil.length}
</p>

<p>
<b>Total Pengeluaran:</b>
Rp ${total.toLocaleString("id-ID")}
</p>

<p>
<b>Kategori Terbesar:</b>
${kategoriTerbesar}
</p>

<p>
<b>Total Kategori:</b>
Rp ${nominalTerbesar.toLocaleString("id-ID")}
</p>

</div>
`;

const hasilDiv =
document
.getElementById("hasilRiwayat");

if(hasil.length===0){

hasilDiv.innerHTML =

`
<div class="empty">

Tidak ada transaksi
pada periode ini

</div>
`;

return;

}

let html = "";

hasil.forEach(item=>{

html +=

`
<div class="item">

<b>

${item.jenis === "pemasukan"
? "💰 PEMASUKAN"
: "💸 PENGELUARAN"}

<br>

${item.kategori}

</b>
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

const sekarang =
new Date();

const awalBulan =

`${sekarang.getFullYear()}-${
String(sekarang.getMonth()+1)
.padStart(2,'0')
}-01`;

const hariIni =

`${sekarang.getFullYear()}-${
String(sekarang.getMonth()+1)
.padStart(2,'0')
}-${
String(sekarang.getDate())
.padStart(2,'0')
}`;

document
.getElementById("tanggalAwal")
.value = awalBulan;

document
.getElementById("tanggalAkhir")
.value = hariIni;


if("serviceWorker" in navigator){

window.addEventListener("load", () => {

navigator.serviceWorker
.register("./service-worker.js")

.then(() => {

console.log(
"Service Worker aktif"
);

})

.catch(err => {

console.log(err);

});

});

}

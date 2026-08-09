let data =
JSON.parse(
localStorage.getItem("pengeluaran")
) || [];

function simpanData(){

localStorage.setItem(
"pengeluaran",
JSON.stringify(data)
);

}

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

alert("Lengkapi data");

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

renderTotal();

alert("Data tersimpan");

}

function renderTotal(){

const hariIni =
new Date().toISOString().split("T")[0];

const bulanIni =
hariIni.substring(0,7);

let totalHari = 0;
let totalBulan = 0;

data.forEach(item=>{

if(item.tanggal === hariIni){

totalHari += item.nominal;

}

if(item.tanggal.startsWith(bulanIni)){

totalBulan += item.nominal;

}

});

document.getElementById(
"totalHariIni"
).innerHTML =
"Rp " +
totalHari.toLocaleString("id-ID");

document.getElementById(
"totalBulanIni"
).innerHTML =
"Rp " +
totalBulan.toLocaleString("id-ID");

}

function buatRingkasan(){

const tanggal =
document.getElementById(
"tanggalRingkasan"
).value;

const hasil =
data.filter(
item =>
item.tanggal === tanggal
);

let kategori = {};

hasil.forEach(item=>{

if(!kategori[item.kategori]){

kategori[item.kategori]=0;

}

kategori[item.kategori]+=item.nominal;

});

let html =
`<h3>Ringkasan ${tanggal}</h3>`;

let totalHari = 0;

for(let k in kategori){

totalHari += kategori[k];

html += `
<div class="ringkasan-item">

<span>${k}</span>

<span>
Rp ${kategori[k]
.toLocaleString("id-ID")}
</span>

</div>
`;

}

html += `
<br>

<b>
Total :
Rp ${totalHari
.toLocaleString("id-ID")}
</b>
`;

document.getElementById(
"hasilRingkasan"
).innerHTML = html;

}

function filterRiwayat(){

const tanggal =
document.getElementById(
"filterTanggal"
).value;

const hasil =
data.filter(
item =>
item.tanggal === tanggal
);

let html = "";

if(hasil.length===0){

html = "Tidak ada data";

}

hasil.forEach(item=>{

html += `

<div class="item">

<b>${item.kategori}</b>

<br>

${item.catatan || "-"}

<br>

Rp ${item.nominal
.toLocaleString("id-ID")}

<br>

📅 ${item.tanggal}

<br><br>

<button
class="hapus"
onclick="hapusData(${item.id})">

Hapus

</button>

</div>

`;

});

document.getElementById(
"hasilRiwayat"
).innerHTML = html;

}

function hapusData(id){

if(!confirm("Hapus data?")){

return;

}

data =
data.filter(
item =>
item.id !== id
);

simpanData();

renderTotal();

filterRiwayat();

}

renderTotal();

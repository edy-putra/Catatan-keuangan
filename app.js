let data = JSON.parse(
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
parseInt(
document.getElementById("nominal").value
);

const catatan =
document.getElementById("catatan").value;

if(!tanggal || !nominal){
alert("Lengkapi data");
return;
}

data.push({
tanggal,
kategori,
nominal,
catatan
});

simpanData();

render();

document.getElementById("nominal").value="";
document.getElementById("catatan").value="";
}

function render(){

let total = 0;

let riwayatHTML = "";

let kategoriTotal = {};

data.forEach(item=>{

total += item.nominal;

riwayatHTML += `
<div class="item">
<b>${item.kategori}</b><br>
${item.catatan}<br>
Rp ${item.nominal.toLocaleString('id-ID')}
<br>
<small>${item.tanggal}</small>
</div>
`;

if(!kategoriTotal[item.kategori]){
kategoriTotal[item.kategori]=0;
}

kategoriTotal[item.kategori]+=item.nominal;

});

document.getElementById("total")
.innerText =
"Rp " +
total.toLocaleString("id-ID");

document.getElementById("riwayat")
.innerHTML =
riwayatHTML;

let ringkasanHTML="";

for(let k in kategoriTotal){

ringkasanHTML += `
<div class="item">
${k}
: Rp ${kategoriTotal[k]
.toLocaleString("id-ID")}
</div>
`;

}

document.getElementById("ringkasan")
.innerHTML =
ringkasanHTML;

}

render();

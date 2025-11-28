<template>
  <MyNavbar />
  <div class="container">
    <h2>Informasi Stok Bahan Ajar</h2>

    <div class="filter-container">
      <div class="select-filter">
        <h4>Filter</h4>

        <!-- Filter UPBJJ -->
        <select v-model="selectedUpbjj">
          <option value="">Pilih UPBJJ</option>
          <option v-for="(u, i) in upbjjList" :key="i">{{ u }}</option>
        </select>

        <!-- Filter Kategori -->
        <select v-model="selectedKategori" :disabled="!selectedUpbjj" :style="{
          backgroundColor: !selectedUpbjj ? '#f0f0f0' : '#d9d8d4',
          cursor: !selectedUpbjj ? 'not-allowed' : 'pointer'
        }">
          <option value="">Semua Kategori</option>
          <option v-for="(k, i) in kategoriListFiltered" :key="i">{{ k }}</option>
        </select>

        <!-- Sorting -->
        <select v-model="sortBy">
          <option value="">Urutkan berdasarkan</option>
          <option value="judul">Judul</option>
          <option value="qty">Jumlah</option>
          <option value="harga">Harga</option>
        </select>

        <button @click="resetFilter" class="reset-filter-btn">
          <i class="fa fa-refresh"></i>
        </button>
      </div>

      <div class="checkbox-filter">
        <input type="checkbox" v-model="isSafety" />
        Tampilkan stok menipis / kosong
      </div>
    </div>

    <button style="width: 20% !important;" class="find-button" @click="openAddModal">
      <i class="fa fa-plus"></i> Tambah Bahan Ajar
    </button>

    <table>
      <thead>
        <tr>
          <th>Kode</th>
          <th>Judul</th>
          <th>Kategori</th>
          <th>UPBJJ</th>
          <th>Lokasi Rak</th>
          <th>Harga</th>
          <th>Jumlah</th>
          <th>Status</th>
          <!-- <th>Catatan</th> -->
          <th>Aksi</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="item in filteredData" :key="item.kode">
          <td>{{ item.kode }}</td>
          <td>{{ item.judul }}</td>
          <td>{{ item.kategori }}</td>
          <td>{{ item.upbjj }}</td>
          <td>{{ item.lokasiRak }}</td>
          <td>{{ item.harga }}</td>
          <td>{{ item.qty }}</td>

          <td :class="statusKelas(item)" class="status-tooltip-wrapper">
            <span class="status-text">
              {{ statusText(item) }}
            </span>

            <div class="tooltip-box" v-html="item.catatanHTML"></div>
          </td>

          <!-- <td v-html="item.catatanHTML"></td> -->

          <td style="display:flex; gap:4px; justify-content: center;">
            <button @click="editItem(item)" class="edit">
              <i class="fa fa-pencil"></i>
            </button>
            <button @click="deleteItem(item)" class="delete">
              <i class="fa fa-trash-o"></i>
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import Swal from "sweetalert2";
import MyNavbar from '../components/MyNavbar.vue';
import stockData from "../json/dataBahanAjar.json";

// Data bahan ajar
const upbjjList = ref(stockData.upbjjList);
const kategoriList = ref(stockData.kategoriList);
const stok = ref([...stockData.stok]); // reactive array

/// Filter states
const selectedUpbjj = ref("");
const selectedKategori = ref("");
const isSafety = ref(false);
const sortBy = ref("");

/// Computed properties
const kategoriListFiltered = computed(() => {
  if (!selectedUpbjj.value) return [];
  const filtered = stok.value
    .filter((i) => i.upbjj === selectedUpbjj.value)
    .map((i) => i.kategori);
  return [...new Set(filtered)];
});

const filteredData = computed(() => {
  let data = [...stok.value];

  if (selectedUpbjj.value)
    data = data.filter((i) => i.upbjj === selectedUpbjj.value);

  if (selectedKategori.value)
    data = data.filter((i) => i.kategori === selectedKategori.value);

  if (isSafety.value)
    data = data.filter((i) => i.qty <= i.safety || i.qty === 0);

  if (sortBy.value === "judul") data.sort((a, b) => a.judul.localeCompare(b.judul));
  else if (sortBy.value === "qty") data.sort((a, b) => a.qty - b.qty);
  else if (sortBy.value === "harga") data.sort((a, b) => a.harga - b.harga);

  return data;
});

// fungsi reset filter
const resetFilter = () => {
  selectedUpbjj.value = "";
  selectedKategori.value = "";
  isSafety.value = false;
  sortBy.value = "";
};

const statusText = (item) => {
  if (item.qty === 0) return "Kosong";
  if (item.qty < item.safety) return "Menipis";
  return "Aman";
};

const statusKelas = (item) => {
  if (item.qty === 0) return "danger";
  if (item.qty < item.safety) return "warning";
  return "success";
};

// Tambah item
const openAddModal = async () => {
  const upbjjOptions = upbjjList.value
    .map((u) => `<option value="${u}">${u}</option>`)
    .join("");

  const kategoriOptions = kategoriList.value
    .map((k) => `<option value="${k}">${k}</option>`)
    .join("");

  const { value: formValues } = await Swal.fire({
    title: "Tambah Bahan Ajar",
    width: 600,
    html: `
      <input id="kode" class="swal2-input" placeholder="Kode">
      <input id="judul" class="swal2-input" placeholder="Judul">
      <select id="kategori" class="swal2-select">
            <option value="">Pilih Kategori</option>${kategoriOptions}
      </select>
      <select id="upbjj" class="swal2-select">
            <option value="">Pilih UPBJJ</option>${upbjjOptions}
      </select>
      <input id="lokasiRak" class="swal2-input" placeholder="Lokasi Rak">
      <input id="harga" class="swal2-input" type="number" placeholder="Harga">
      <input id="qty" class="swal2-input" type="number" placeholder="Jumlah">
      <textarea id="catatanHTML" class="swal2-textarea" placeholder="Catatan"></textarea>
    `,
    showCancelButton: true,
    confirmButtonText: "Simpan",
    cancelButtonText: "Batal",
    preConfirm: () => {
      return {
        kode: document.getElementById("kode").value.trim(),
        judul: document.getElementById("judul").value.trim(),
        kategori: document.getElementById("kategori").value,
        upbjj: document.getElementById("upbjj").value,
        lokasiRak: document.getElementById("lokasiRak").value.trim(),
        harga: Number(document.getElementById("harga").value),
        qty: Number(document.getElementById("qty").value),
        catatanHTML: document.getElementById("catatanHTML").value.trim(),
        safety: 10,
      };
    },
  });

  if (formValues) {
    if (!formValues.kode || !formValues.judul) {
      Swal.fire("Gagal", "Semua field wajib diisi!", "error");
      return;
    }

    if (stok.value.some((i) => i.kode === formValues.kode)) {
      Swal.fire("Gagal", "Kode sudah terdaftar!", "error");
      return;
    }

    stok.value.push(formValues);
    Swal.fire("Berhasil", "Data bahan ajar ditambahkan!", "success");
  }
};

// edit item
const editItem = async (item) => {
  const upbjjOptions = upbjjList.value
    .map(
      (u) =>
        `<option value="${u}" ${u === item.upbjj ? "selected" : ""}>${u}</option>`
    )
    .join("");

  const kategoriOptions = kategoriList.value
    .map(
      (k) =>
        `<option value="${k}" ${k === item.kategori ? "selected" : ""}>${k}</option>`
    )
    .join("");

  const { value: formValues } = await Swal.fire({
    title: "Edit Data Bahan Ajar",
    width: 600,
    html: `
      <input id="judul" class="swal2-input" value="${item.judul}">
      <select id="kategori" class="swal2-select">${kategoriOptions}</select>
      <select id="upbjj" class="swal2-select">${upbjjOptions}</select>
      <input id="lokasiRak" class="swal2-input" value="${item.lokasiRak}">
      <input id="harga" class="swal2-input" type="number" value="${item.harga}">
      <input id="qty" class="swal2-input" type="number" value="${item.qty}">
      <textarea id="catatanHTML" class="swal2-textarea">${item.catatanHTML}</textarea>
    `,
    showCancelButton: true,
    confirmButtonText: "Simpan Perubahan",
    preConfirm: () => ({
      judul: document.getElementById("judul").value.trim(),
      kategori: document.getElementById("kategori").value,
      upbjj: document.getElementById("upbjj").value,
      lokasiRak: document.getElementById("lokasiRak").value.trim(),
      harga: Number(document.getElementById("harga").value),
      qty: Number(document.getElementById("qty").value),
      catatanHTML: document.getElementById("catatanHTML").value.trim(),
    })
  });

  if (formValues) {
    Object.assign(item, formValues);
    Swal.fire("Berhasil", "Data diperbarui!", "success");
    console.log(formValues);
  }
};

// delete item
const deleteItem = (item) => {
  Swal.fire({
    title: "Hapus?",
    text: `Data ${item.judul} akan dihapus!`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Ya, hapus!",
    cancelButtonText: "Batal",
  }).then((result) => {
    if (result.isConfirmed) {
      stok.value = stok.value.filter((i) => i.kode !== item.kode);
      Swal.fire("Terhapus!", "Data telah dihapus.", "success");
    }
  });
};
</script>

<style scoped>
table {
  overflow: visible !important;
}

tbody {
  overflow: visible !important;
}

tr,
td {
  overflow: visible !important;
}

.status-tooltip-wrapper {
  position: relative;
  cursor: help;
}

.tooltip-box {
  display: none;
  position: absolute;
  top: 120%;
  left: 50%;
  transform: translateX(-50%);
  background: #29303B;
  color: #fff;
  padding: 8px 12px;
  font-size: 12px;
  border-radius: 6px;
  white-space: nowrap;
  z-index: 10;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15);
}

/* style untuk hover tooltip */
.status-tooltip-wrapper:hover .tooltip-box {
  display: block;
}

/* bentuk panah untuk tooltip */
.tooltip-box::after {
  content: "";
  position: absolute;
  top: -6px;
  left: 50%;
  transform: translateX(-50%);
  border-left: 6px solid transparent;
  border-right: 6px solid transparent;
  border-bottom: 6px solid #29303B;
}
</style>

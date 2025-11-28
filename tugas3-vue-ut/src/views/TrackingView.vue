<template>
  <div class="tracking-container-page">

    <MyNavbar />

    <div class="tracking-container">
      <h2>Tracking DO</h2>

      <form @submit.prevent="submitDO" class="form-do">

        <label>Nomor DO:</label>
        <input type="text" v-model="newDO.nomorDO" disabled />

        <label>NIM:</label>
        <input type="text" v-model="newDO.nim" />

        <label>Nama:</label>
        <input type="text" v-model="newDO.nama" />

        <div class="filter-container" style="justify-content: start !important;">
          <div>
            <label style="margin-right: 12px;">Ekspedisi:</label>
            <select v-model="newDO.ekspedisi">
              <option disabled value="">Pilih Ekspedisi</option>
              <option v-for="(exp, i) in pengirimanList" :key="i" :value="exp.nama">
                {{ exp.nama }}
              </option>
            </select>
          </div>

          <div>
            <label style="margin-right: 12px;">Paket Bahan Ajar:</label>
            <select v-model="newDO.paket">
              <option disabled value="">Pilih Paket</option>
              <option v-for="(p, i) in paketList" :key="i" :value="p.kode">
                {{ p.kode }} - {{ p.nama }}
              </option>
            </select>
          </div>

          <div class="date-do">
            <label style="margin-right: 12px;">Tanggal Kirim:</label>
            <input type="date" v-model="newDO.tanggalKirim" style="font-size: 12px;" />
          </div>
        </div>

        <div v-if="selectedPaket" class="paket-detail">
          <h4>Detail Isi Paket:</h4>
          <ol>
            <li v-for="(item, i) in selectedPaket.isi" :key="i">
              {{ item }}
            </li>
          </ol>

          <p>
            <b>Total Harga:</b>
            Rp {{ selectedPaket.harga.toLocaleString("id-ID") }}
          </p>
        </div>

        <button type="submit" class="find-button">Tambah DO baru</button>
      </form>
    </div>

    <!-- TABLE -->
    <div class="tracking-table">
      <h3>Daftar Tracking DO</h3>

      <table>
        <thead>
          <tr>
            <th>Nomor DO</th>
            <th>NIM</th>
            <th>Nama</th>
            <th>Ekspedisi</th>
            <th>Paket</th>
            <th>Tanggal Kirim</th>
            <th>Total</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="(item, key) in trackingList" :key="key">
            <td>{{ key }}</td>
            <td>{{ item.nim }}</td>
            <td>{{ item.nama }}</td>
            <td>{{ item.ekspedisi }}</td>
            <td>{{ item.paket }}</td>
            <td>{{ item.tanggalKirim }}</td>
            <td>Rp {{ item.total.toLocaleString('id-ID') }}</td>
          </tr>
        </tbody>
      </table>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import Swal from "sweetalert2";
import dataRaw from "../json/dataBahanAjar.json";
import MyNavbar from "../components/MyNavbar.vue";

const pengirimanList = ref(dataRaw.pengirimanList);
const paketList = ref(dataRaw.paket);

/* trackingList is an OBJECT, so keep it as an object */
const trackingList = ref({});

// Convert tracking array → object
// because original JSON is an array of objects w/ DO key
dataRaw.tracking.forEach((entry) => {
  const key = Object.keys(entry)[0];
  trackingList.value[key] = entry[key];
});

/* NEW DO state */
const newDO = ref({
  nomorDO: "",
  nim: "",
  nama: "",
  ekspedisi: "",
  paket: "",
  tanggalKirim: "",
  total: 0,
});

/* COMPUTED — selected Paket */
const selectedPaket = computed(() => {
  return paketList.value.find((p) => p.kode === newDO.value.paket);
});

/* COMPUTED — auto-generate next DO */
const nextNomorDO = computed(() => {
  const year = new Date().getFullYear();
  const existingKeys = Object.keys(trackingList.value);
  const nextSeq = existingKeys.length + 1;
  const nomor = String(nextSeq).padStart(4, "0");
  return `DO${year}-${nomor}`;
});

/* WATCH — update total price */
watch(selectedPaket, (newVal) => {
  if (newVal) newDO.value.total = newVal.harga;
  else newDO.value.total = 0;
});

/* METHODS */
const submitDO = () => {
  if (
    !newDO.value.nim ||
    !newDO.value.nama ||
    !newDO.value.ekspedisi ||
    !newDO.value.paket
  ) {
    Swal.fire({
      icon: "warning",
      title: "Data Belum Lengkap",
      text: "Lengkapi semua kolom sebelum menyimpan.",
    });
    return;
  }

  const nomor = nextNomorDO.value;
  newDO.value.nomorDO = nomor;

  const newData = {
    nim: newDO.value.nim,
    nama: newDO.value.nama,
    status: "Dalam Proses",
    ekspedisi: newDO.value.ekspedisi,
    tanggalKirim:
      newDO.value.tanggalKirim || new Date().toISOString().split("T")[0],
    paket: newDO.value.paket,
    total: newDO.value.total,
    perjalanan: [
      {
        waktu: new Date().toLocaleString("id-ID"),
        keterangan: "Data DO dibuat dan menunggu pengiriman",
      },
    ],
  };

  trackingList.value[nomor] = newData;

  Swal.fire({
    icon: "success",
    title: "Data Berhasil Disimpan",
    html: `
        <p>Nomor DO: <b>${nomor}</b></p>
        <p>Nama: <b>${newDO.value.nama}</b></p>
        <p>Paket: <b>${newDO.value.paket}</b></p>
      `,
    confirmButtonText: "Oke",
  });

  // Reset form
  newDO.value = {
    nomorDO: nextNomorDO.value,
    nim: "",
    nama: "",
    ekspedisi: "",
    paket: "",
    tanggalKirim: "",
    total: 0,
  };
};

onMounted(() => {
  newDO.value.nomorDO = nextNomorDO.value;
});
</script>

<style scoped></style>

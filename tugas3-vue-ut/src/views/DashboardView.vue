<script setup>
import { ref, onMounted } from 'vue';
import MyNavbar from '../components/MyNavbar.vue';

const greeting = ref("");
const roleUser = ref("");
const lokasiUser = ref("");

onMounted(() => {
  const namaUser = localStorage.getItem("namaUser");
  roleUser.value = localStorage.getItem("roleUser") || "N/A";
  lokasiUser.value = localStorage.getItem("lokasiUser") || "N/A";

  const hours = new Date().getHours();

  let message =
    hours < 11
      ? "Selamat pagi"
      : hours < 15
        ? "Selamat siang"
        : hours < 19
          ? "Selamat sore"
          : "Selamat malam";

  greeting.value = `${message}, ${namaUser || "Tamu"}`;
});
</script>

<template>
  <MyNavbar />
  <div class="dashboard-content">
    <h1 class="greeting">
      {{ greeting }} <span class="wave-emoji">👋</span>
    </h1>

    <p class="subtitle-sitta">
      Selamat Datang di dashboard SITTA (Pemesanan Bahan Ajar Universitas Terbuka)
    </p>

    <div class="user-info">
      <p>
        <span class="role-title">Role:</span> <b>{{ roleUser }}</b>
      </p>
      <p>
        <span class="lokasi-title">📌 Lokasi:</span> <b>{{ lokasiUser }}</b>
      </p>
    </div>
  </div>
</template>

<style scoped>
.dashboard-content {
  max-width: 90%;
  margin: 20px auto;
  padding: 20px;
  background-color: #fff;
  border: 1px solid #ffde59;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.greeting {
  font-size: 28px;
  font-weight: 700;
  color: #1b6dc1;
  text-align: left;
  margin-bottom: 5px;
  display: flex;
  align-items: center;
}

.wave-emoji {
  margin-left: 8px;
  font-size: 24px;
}

.subtitle-sitta {
  font-size: 14px;
  color: #555;
  margin-bottom: 20px;
  text-align: left;
}

.user-info p {
  font-size: 16px;
  margin-bottom: 10px;
  text-align: left;
}

.role-title, .lokasi-title {
  font-weight: normal;
  color: #1b1b1b;
  margin-right: 5px;
}

</style>

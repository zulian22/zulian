<template>
  <nav class="menu">
    <div class="menu-left">
      <router-link to="/dashboard" class="logo-link">
        <img src="../assets/img/ut.png" alt="Logo UT" class="navbar-logo" />
        <span class="navbar-title">Dashboard SITTA</span>
      </router-link>
    </div>

    <ul class="menu-center">
      <li>
        <router-link to="/stock">Informasi Bahan Ajar</router-link>
      </li>

      <li>
        <router-link to="/tracking">Tracking Pengiriman</router-link>
      </li>

      <li class="dropdown">
        <div class="dropdown-trigger">
          <a href="#" style="padding-right: 5px !important">Laporan</a>
          <i class="fa fa-caret-down" style="color: #fff !important"></i>
        </div>
        <div class="dropdown-content">
          <a href="#">Monitoring Bahan Ajar</a>
          <a href="#">Rekap Bahan Ajar</a>
        </div>
      </li>

      <li>
        <a href="#">Histori Transaksi Bahan Ajar</a>
      </li>
    </ul>

    <button id="logoutBtn" class="logout-button" @click="logout">Keluar</button>
  </nav>
</template>

<script setup>
import Swal from "sweetalert2";
import { useRouter } from "vue-router";

const router = useRouter();

const logout = () => {
  Swal.fire({
    title: "Yakin ingin keluar?",
    text: "Anda akan keluar dari sistem.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Keluar",
    cancelButtonText: "Batal",
  }).then((result) => {
    if (result.isConfirmed) {
      localStorage.removeItem("namaUser");
      localStorage.removeItem("roleUser"); // Tambahkan ini agar data role terhapus
      localStorage.removeItem("lokasiUser"); // Tambahkan ini agar data lokasi terhapus

      Swal.fire({
        title: "Logout Berhasil",
        text: "Anda telah keluar dari sistem.",
        icon: "info",
        confirmButtonText: "OK",
      }).then(() => router.push("/login"));
    }
  });
};
</script>

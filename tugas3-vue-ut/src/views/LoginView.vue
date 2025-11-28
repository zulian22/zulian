<template>
  <div class="login-container">
    <div class="header-login">
      <img src="../assets/img/ut.png" alt="Logo Universitas Terbuka" class="logo-ut" />
      <h2>SITTA</h2>
      <p>Pemesanan Bahan Ajar Universitas Terbuka</p>
    </div>

    <div class="form-container">
      <form @submit.prevent="handleLogin" id="loginForm">
        <label for="email">Email</label>
        <input type="email" id="email" v-model="email" required placeholder="ut.ac.id" />

        <label for="password">Password</label>
        <input type="password" id="password" v-model="password" required placeholder="******" />

        <button type="submit">Masuk</button>
      </form>
    </div>

    <div class="links">
      <a href="#" @click.prevent="showForgotPassword">Lupa password?</a>
      <a href="#" @click.prevent="showRegister">Belum punya akun?</a>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import usersData from "../json/users.json";
import Swal from "sweetalert2";
import { useRouter } from "vue-router";

const router = useRouter();

// reactive form state
const email = ref("");
const password = ref("");

// login
const handleLogin = () => {
  const user = usersData.users.find(
    (u) => u.email === email.value && u.password === password.value
  );

if (user) {
    localStorage.setItem("namaUser", user.nama);
    localStorage.setItem("roleUser", user.role);
    localStorage.setItem("lokasiUser", user.lokasi);

    Swal.fire({
      title: "Login Berhasil!",
      text: `Selamat datang, ${user.nama}!`,
      icon: "success",
      confirmButtonText: "Lanjutkan",
    }).then(() => {
      router.push("/dashboard");
      console.log("router is ", router);
    });
  } else {
    Swal.fire({
      title: "Login Gagal!",
      text: "Email atau password salah. Silakan coba lagi.",
      icon: "error",
      confirmButtonText: "OK",
    });
  }
};

// popups
const showForgotPassword = () => {
  Swal.fire({
    title: "Lupa Password?",
    text: "Fitur ini saat ini belum tersedia. Untuk permintaan reset password, silakan hubungi Administrator SITTA.",
    icon: "info",
  });
};

const showRegister = () => {
  Swal.fire({
    title: "Buat Akun Baru",
    text: "Fitur ini saat ini belum tersedia. Untuk permintaan daftar, silakan hubungi Administrator SITTA.",
    icon: "question",
  });
};
</script>

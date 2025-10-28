document.addEventListener('DOMContentLoaded', () => {
    const currentPage = window.location.pathname.split('/').pop();
    const userSession = sessionStorage.getItem('loggedInUser');

    // --- 1. OTENTIKASI DAN REDIREKSI ---
    handleAuthAndRedirection(currentPage, userSession);

    // --- 2. LOGIKA LOGIN (index.html) ---
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // --- 3. LOGIKA DASHBOARD (dashboard.html) ---
    if (currentPage === 'dashboard.html' && userSession) {
        renderDashboard(JSON.parse(userSession));
    }

    // --- 4. LOGIKA LOGOUT (Semua halaman ber-auth) ---
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }

    // --- 5. LOGIKA STOK (stok.html) ---
    if (currentPage === 'stok.html') {
        renderStokTable();
        const formTambahBuku = document.getElementById('formTambahBuku');
        if (formTambahBuku) {
            formTambahBuku.addEventListener('submit', handleTambahBuku);
        }
    }

    // --- 6. LOGIKA TRACKING (tracking.html) ---
    if (currentPage === 'tracking.html') {
        const trackingForm = document.getElementById('trackingForm');
        if (trackingForm) {
            trackingForm.addEventListener('submit', handleTrackingSearch);
        }
    }
});

/* Menangani pengecekan sesi dan redirect */
function handleAuthAndRedirection(currentPage, userSession) {
    const requiredAuth = ['dashboard.html', 'stok.html', 'tracking.html'];
    if (requiredAuth.includes(currentPage) && !userSession) {
        window.location.href = 'index.html';
    }
}

/* Menangani proses login */
function handleLogin(e) {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value.trim();
    const loginAlert = document.getElementById('loginAlert');

    const user = dataPengguna.find(u => u.email === email && u.password === password);

    if (user) {
        loginAlert.classList.add('d-none');
        sessionStorage.setItem('loggedInUser', JSON.stringify(user));
        window.location.href = 'dashboard.html';
    } else {
        loginAlert.classList.remove('d-none');
    }
}

/* Menangani proses logout */
function handleLogout(e) {
    e.preventDefault();
    sessionStorage.removeItem('loggedInUser');
    window.location.href = 'index.html';
}

/* Mengisi data ke dashboard.html  */
function renderDashboard(user) {
    const greetingText = document.getElementById('greetingText');
    const userRole = document.getElementById('userRole');
    const userLokasi = document.getElementById('userLokasi');
    
    const hour = new Date().getHours();
    let sapaan;
    if (hour >= 5 && hour < 12) {
        sapaan = 'Selamat pagi';
    } else if (hour >= 12 && hour < 15) {
        sapaan = 'Selamat siang';
    } else if (hour >= 15 && hour < 18) {
        sapaan = 'Selamat sore';
    } else {
        sapaan = 'Selamat malam';
    }

    greetingText.innerHTML = `${sapaan}, ${user.nama} 👋`;
    userRole.textContent = user.role;
    userLokasi.textContent = user.lokasi;
}

/* Fungsi untuk mengisi tabel stok bahan ajar dan menambahkan listener Detail */
function renderStokTable() {
    const tableBody = document.getElementById('stokTableBody');
    if (!tableBody) return;

    tableBody.innerHTML = ''; 

    dataBahanAjar.forEach((item, index) => {
        const row = tableBody.insertRow();

        row.insertCell().textContent = index + 1;
        row.insertCell().textContent = item.kodeLokasi;
        row.insertCell().textContent = item.kodeBarang;
        row.insertCell().textContent = item.namaBarang;
        row.insertCell().textContent = item.jenisBarang;
        row.insertCell().textContent = item.edisi;
        
        // Sel Stok
        const stokCell = row.insertCell();
        // Mengembalikan badge stok
        stokCell.innerHTML = `<span class="badge ${item.stok > 300 ? 'bg-success' : item.stok > 150 ? 'bg-warning' : 'bg-danger'}">${item.stok.toLocaleString('id-ID')}</span>`;
        
        // Sel Action (Tombol Detail)
        const actionCell = row.insertCell();
        actionCell.innerHTML = `
            <button class="btn btn-primary btn-sm btn-detail" data-kode="${item.kodeBarang}">
                Detail
            </button>`;
    });

    document.querySelectorAll('.btn-detail').forEach(button => {
        button.addEventListener('click', (e) => {
            const kodeBarang = e.currentTarget.getAttribute('data-kode');
            showBookDetail(kodeBarang);
        });
    });
}

/* Fungsi untuk menampilkan detail buku */
function showBookDetail(kodeBarang) {
    const book = dataBahanAjar.find(b => b.kodeBarang === kodeBarang);
    if (!book) {
        alert("Detail buku tidak ditemukan!");
        return;
    }

    document.getElementById('detailNama').textContent = book.namaBarang;
    document.getElementById('detailKodeBarang').textContent = book.kodeBarang;
    document.getElementById('detailKodeLokasi').textContent = book.kodeLokasi;
    document.getElementById('detailJenis').textContent = book.jenisBarang;
    document.getElementById('detailEdisi').textContent = book.edisi;
    document.getElementById('detailStok').textContent = book.stok.toLocaleString('id-ID');
    
    document.getElementById('detailCover').src = book.cover.replace('img/', 'js/img/');
    
    const detailModal = new bootstrap.Modal(document.getElementById('detailBukuModal'));
    detailModal.show();
}

/* Fungsi untuk menangani submit form Tambah Buku Baru */
function handleTambahBuku(e) {
    e.preventDefault();
    
    const newBook = {
        kodeLokasi: document.getElementById('inputKodeLokasi').value.trim(),
        kodeBarang: document.getElementById('inputKodeBarang').value.trim(),
        namaBarang: document.getElementById('inputNamaBarang').value.trim(),
        jenisBarang: document.getElementById('inputJenisBarang').value,
        edisi: document.getElementById('inputEdisi').value,
        stok: parseInt(document.getElementById('inputStok').value),
        cover: document.getElementById('inputCover').value.trim()
    };
    
    const isDuplicate = dataBahanAjar.some(b => b.kodeBarang === newBook.kodeBarang);
    
    if (isDuplicate) {
        alert(`Gagal: Kode Barang ${newBook.kodeBarang} sudah ada.`);
        return;
    }

    dataBahanAjar.push(newBook);
    
    const modalInstance = bootstrap.Modal.getInstance(document.getElementById('tambahBukuModal'));
    modalInstance.hide();
    
    e.target.reset();
    
    renderStokTable();
    
    alert(`Buku "${newBook.namaBarang}" berhasil ditambahkan!`);
}

/* Fungsi untuk mencari dan menampilkan status tracking DO */
function handleTrackingSearch(e) {
    e.preventDefault();
    const nomorDo = document.getElementById('nomorDO').value.trim();
    const trackingResultDiv = document.getElementById('trackingResult');
    trackingResultDiv.innerHTML = '';
    
    const dataDO = dataTracking[nomorDo]; 

    if (dataDO) {
        
        // --- 1. Ringkasan Pengiriman ---
        const summaryHTML = `
            <div class="row mb-5 summary-box p-4"> 
                
                <div class="col-md-6">
                    <div class="mb-3">
                        <small class="text-muted d-block">Nomor DO</small>
                        <strong class="fs-6">${dataDO.nomorDO}</strong>
                    </div>
                    <div class="mb-3">
                        <small class="text-muted d-block">Status</small>
                        <strong class="fs-6 text-success">${dataDO.status}</strong>
                    </div>
                    <div class="mb-3">
                        <small class="text-muted d-block">Tanggal Kirim</small>
                        <strong class="fs-6">${dataDO.tanggalKirim}</strong>
                    </div>
                    <div class="mb-3">
                        <small class="text-muted d-block">Total</small>
                        <strong class="fs-6">${dataDO.total}</strong>
                    </div>
                </div>

                <div class="col-md-6">
                    <div class="mb-3">
                        <small class="text-muted d-block">Nama</small>
                        <strong class="fs-6">${dataDO.nama}</strong>
                    </div>
                    <div class="mb-3">
                        <small class="text-muted d-block">Ekspedisi</small>
                        <strong class="fs-6">${dataDO.ekspedisi}</strong>
                    </div>
                    <div class="mb-3">
                        <small class="text-muted d-block">Paket</small>
                        <strong class="fs-6">${dataDO.paket}</strong>
                    </div>
                    <div class="mb-3 invisible">.</div> 
                </div>
            </div>
        `;
        
        // --- 2. Riwayat Perjalanan (Timeline) ---
        let journeyHTML = '<h4 class="mb-3">Status Shipping</h4><ul class="timeline-sitta">';
        
        // Urutkan perjalanan dari yang terbaru ke terlama
        const sortedJourney = dataDO.perjalanan.slice().sort((a, b) => new Date(b.waktu) - new Date(a.waktu));
        
        sortedJourney.forEach((step, index) => {
            
            const dateObj = new Date(step.waktu);
            const options = { weekday: 'short', month: 'short', day: 'numeric' };
            const formattedDate = dateObj.toLocaleDateString('id-ID', options);
            const formattedTime = dateObj.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', hour12: false });
            
            const isActive = index === 0 ? 'active' : '';

            journeyHTML += `
                <li class="${isActive}">
                    <span class="timeline-badge"></span>
                    <div class="row g-0">
                        <div class="col-8">
                            <i class="${isActive ? 'fas fa-check-circle text-success' : 'far fa-circle text-muted'} me-2"></i>
                            <span class="fw-bold">${formattedDate}</span>
                            <p class="mb-1">${step.keterangan}</p>
                            <p class="text-muted small">Kurir: ${dataDO.ekspedisi}</p>
                        </div>
                        <div class="col-4 text-end">
                            <span class="timeline-time">${formattedTime} WIB</span>
                        </div>
                    </div>
                </li>
            `;
        });
        
        journeyHTML += '</ul>';

        // Tampilkan semua hasil
        trackingResultDiv.innerHTML = summaryHTML + journeyHTML;

    } else {
        trackingResultDiv.innerHTML = `
            <div class="alert alert-warning text-center" role="alert">
                Nomor DO <strong>${nomorDo}</strong> tidak ditemukan dalam sistem.
            </div>
        `;
    }
}
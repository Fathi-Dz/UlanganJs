// ==== LOADING SCREEN HANDLER ====
function showLoading() {
  const loader = document.getElementById("loading-screen");
  if (loader) loader.style.display = "flex";
}

function hideLoading() {
  const loader = document.getElementById("loading-screen");
  if (loader) loader.style.display = "none";
}

// otomatis loading sebentar pas buka halaman
window.addEventListener("load", () => {
  showLoading();
  setTimeout(hideLoading, 1000); // 1 detik biar smooth
});

// ==== DATA HANDLER ====
function getData() {
  return JSON.parse(localStorage.getItem("data")) || [];
}

function saveData(data) {
  localStorage.setItem("data", JSON.stringify(data));
}

// ==== RENDER DATA KE TABEL (index.html) ====
function renderData() {
  const tbody = document.getElementById("data-list");
  if (!tbody) return;

  tbody.innerHTML = "";
  const data = getData();

  data.forEach((item, index) => {
    const row = `
      <tr>
        <td>${item.nama}</td>
        <td>${item.umur}</td>
        <td>${item.alamat}</td>
        <td>
          <button class="btn-edit" onclick="editData(${index})">Edit</button>
          <button class="btn-delete" onclick="deleteData(${index})">Hapus</button>
        </td>
      </tr>
    `;
    tbody.innerHTML += row;
  });
}

// ==== HAPUS DATA ====
function deleteData(index) {
  Swal.fire({
    title: "Yakin hapus?",
    text: "Data ini tidak bisa dikembalikan!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#9333ea",
    cancelButtonColor: "#6b21a8",
    confirmButtonText: "Ya, hapus",
  }).then((result) => {
    if (result.isConfirmed) {
      showLoading();
      setTimeout(() => {
        const data = getData();
        data.splice(index, 1);
        saveData(data);
        renderData();
        hideLoading();
        Swal.fire("Terhapus!", "Data berhasil dihapus.", "success");
      }, 800);
    }
  });
}

// ==== EDIT DATA ====
function editData(index) {
  showLoading();
  localStorage.setItem("editIndex", index);
  setTimeout(() => {
    window.location.href = "tambah.html";
  }, 800);
}

// ==== FORM SIMPAN (tambah.html) ====
const form = document.getElementById("dataForm");
if (form) {
  const editIndex = localStorage.getItem("editIndex");
  if (editIndex !== null) {
    const data = getData()[editIndex];
    document.getElementById("nama").value = data.nama;
    document.getElementById("umur").value = data.umur;
    document.getElementById("alamat").value = data.alamat;
  }

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    showLoading();

    const nama = document.getElementById("nama").value;
    const umur = document.getElementById("umur").value;
    const alamat = document.getElementById("alamat").value;

    let data = getData();

    if (editIndex !== null) {
      data[editIndex] = { nama, umur, alamat };
      localStorage.removeItem("editIndex");
    } else {
      data.push({ nama, umur, alamat });
    }

    saveData(data);

    setTimeout(() => {
      hideLoading();
      Swal.fire({
        toast: true,
        position: "top-end",
        icon: "success",
        title: "Data berhasil disimpan!",
        showConfirmButton: false,
        timer: 2000,
        background: "#1e1e2f",
        color: "#fff",
      });
      setTimeout(() => (window.location.href = "index.html"), 2200);
    }, 1200);
  });
}

// ==== RENDER OTOMATIS SAAT DI INDEX ====
document.addEventListener("DOMContentLoaded", renderData);

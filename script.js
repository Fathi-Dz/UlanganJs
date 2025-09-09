// Ambil data dari localStorage
function getData() {
  return JSON.parse(localStorage.getItem('dataDiri')) || [];
}

function saveData(data) {
  localStorage.setItem('dataDiri', JSON.stringify(data));
}

function renderData() {
  const dataList = document.getElementById('data-list');
  if (!dataList) return;
  
  const data = getData();
  dataList.innerHTML = '';

  data.forEach((item, index) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${item.nama}</td>
      <td>${item.umur}</td>
      <td>${item.alamat}</td>
      <td>
        <button class="btn-edit" onclick="editData(${index})">Edit</button>
        <button class="btn-delete" onclick="deleteData(${index})">Hapus</button>
      </td>
    `;
    dataList.appendChild(row);
  });
}

// Hapus data
function deleteData(index) {
  const blurOverlay = document.getElementById('blur-overlay');
  blurOverlay.style.display = 'block';

  Swal.fire({
    title: 'Yakin hapus?',
    text: "Data ini tidak bisa dikembalikan!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#9333ea',
    cancelButtonColor: '#6b21a8',
    confirmButtonText: 'Ya, hapus',
    willClose: () => blurOverlay.style.display = 'none'
  }).then((result) => {
    if (result.isConfirmed) {
      const data = getData();
      data.splice(index, 1);
      saveData(data);
      renderData();

      Swal.fire({
        title: 'Terhapus!',
        text: 'Data berhasil dihapus.',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false,
        background: '#1e1e2f',
        color: '#fff'
      });
    }
  });
}



// Edit data
function editData(index) {
  localStorage.setItem('editIndex', index);
  window.location.href = 'tambah.html';
}

// Tambah / edit data (di tambah.html)
const form = document.getElementById('dataForm');
if (form) {
  const editIndex = localStorage.getItem('editIndex');
  if (editIndex !== null) {
    const data = getData()[editIndex];
    document.getElementById('nama').value = data.nama;
    document.getElementById('umur').value = data.umur;
    document.getElementById('alamat').value = data.alamat;
  }

  form.addEventListener('submit', function(e) {
    e.preventDefault();
    const nama = document.getElementById('nama').value;
    const umur = document.getElementById('umur').value;
    const alamat = document.getElementById('alamat').value;

    let data = getData();

    if (editIndex !== null) {
      data[editIndex] = { nama, umur, alamat };
      localStorage.removeItem('editIndex');
    } else {
      data.push({ nama, umur, alamat });
    }

    saveData(data);

    Swal.fire({
      toast: true,
      position: 'top-end',
      icon: 'success',
      title: 'Data berhasil disimpan!',
      showConfirmButton: false,
      timer: 2000,
      background: '#1e1e2f',
      color: '#fff'
    });

    setTimeout(() => window.location.href = 'index.html', 2000);
  });
}

renderData();



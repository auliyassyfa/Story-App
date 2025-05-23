import AddStoryPresenter from '../../presenters/AddStoryPresenter.js';
import StoryModel from '../../models/StoryModel.js';
import CameraController from '../../utils/cameraController.js';
import { initMap, getSelectedLocation } from '../../utils/map.js';

const AddStoryPage = {
  async render() {
    return `
      <section class="addStoryPageSection page-enter">
        <h2>Tambah Cerita Baru</h2>
        <form id="storyForm">
          <label for="description">Deskripsi:</label>
          <textarea id="description" required></textarea>

          <label>Ambil Gambar:</label>
          <video id="cameraPreview" autoplay muted style="display:none;"></video>
          <canvas id="canvas" style="display:none;"></canvas>
          <img id="photoPreview" alt="Pratinjau Foto" style="display:none; max-width: 100%;">

          <button type="button" id="startCamera">Buka Kamera</button>
          <button type="button" id="takePhoto" style="display:none;">Ambil Foto</button>
          <button type="button" id="stopCamera" style="display:none;">Matikan Kamera</button>

          <label for="image">Atau Pilih Gambar:</label>
          <input id="image" type="file" accept="image/*">

          <div id="map" style="height: 300px;"></div>
          <label for="latInput">Latitude:</label>
          <input id="latInput" type="text" readonly>

          <label for="lngInput">Longitude:</label>
          <input id="lngInput" type="text" readonly>

          <button type="submit">Kirim</button>
        </form>
      </section>
    `;
  },

  async afterRender() {
    const video = document.getElementById('cameraPreview');
    const canvas = document.getElementById('canvas');
    const photoPreview = document.getElementById('photoPreview');
    const imageInput = document.getElementById('image');

    const model = new StoryModel('https://story-api.dicoding.dev/v1');
    const camera = new CameraController(video, canvas, photoPreview, imageInput);

    this.presenter = new AddStoryPresenter(this, model, camera);
    await this.presenter.init();

    window.currentAddStoryPresenter = this.presenter; 
    
    imageInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      this.presenter.handleImageFileChange(file);
    });

    initMap();

    // Animasi masuk halaman
    const section = document.querySelector('.addStoryPageSection');
    if (section) {
      requestAnimationFrame(() => {
        section.classList.add('page-enter-active');
      });
      setTimeout(() => {
        section.classList.remove('page-enter');
        section.classList.remove('page-enter-active');
      }, 600);
    }
  },

  bindStartCamera(handler) {
    const btn = document.getElementById('startCamera');
    btn.addEventListener('click', () => {
      handler();
      btn.style.display = 'none';
      document.getElementById('takePhoto').style.display = 'inline-block';
      document.getElementById('stopCamera').style.display = 'inline-block';
    });
  },

  bindTakePhoto(handler) {
    const btn = document.getElementById('takePhoto');
    btn.addEventListener('click', async () => {
      await handler();
      btn.style.display = 'none';
    });
  },

  bindStopCamera(handler) {
    const btn = document.getElementById('stopCamera');
    btn.addEventListener('click', () => {
      handler();
      btn.style.display = 'none';
      document.getElementById('startCamera').style.display = 'inline-block';
      document.getElementById('takePhoto').style.display = 'none';
    });
  },

  bindFormSubmit(handler) {
    const form = document.getElementById('storyForm');
    form.addEventListener('submit', async (event) => {
      event.preventDefault();

      const location = getSelectedLocation();
      if (!location || !location.lat || !location.lng) {
        alert('Silakan pilih lokasi di peta terlebih dahulu.');
        return;
      }

      const image = this.presenter.camera.getImage();
      if (!image) {
        alert('Silakan ambil atau pilih gambar terlebih dahulu.');
        return;
      }

      const formData = new FormData();
      formData.append('description', document.getElementById('description').value);
      formData.append('photo', image, 'photo.png');
      formData.append('lat', location.lat);
      formData.append('lon', location.lng);

      const success = await handler(formData);
      this.presenter.destroy();
      if (success) {
        console.log('[add.js] handler() selesai, success =', success);
        window.location.hash = '#/';
      }
    });
  },

  showAddStorySuccess() {
        alert('Cerita berhasil ditambahkan!');
    },

    showAddStoryError(message) {
        alert(`Gagal menambahkan cerita: ${message}`);
    },

    showCapturedPhoto(blob) {
        console.log('Foto berhasil diambil', blob);
    },

    showCameraError(message) {
        alert(`Kamera error: ${message}`);
    },

    showCaptureError(message) {
        alert(`Gagal ambil gambar: ${message}`);
    }
};
export default AddStoryPage;

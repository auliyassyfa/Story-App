import StoryModel from '../../models/StoryModel.js';
import StoryView from '../StoryView.js';
import StoryPresenter from '../../presenters/StoryPresenter.js';
import StoryDB from '../../data/story-db.js';

const HomePage = {
  async render() {
    return `
    <section id="home" class="page-enter">
      <h2 class="home-title">Daftar Cerita</h2>
      
      <div class="story-header">
        <button id="addStoryButton" class="add-story-button">➕ Add Story</button>
      </div>

      <div id="storyContainer" class="story-grid"></div>

      <div id="map" style="height: 400px;"></div>
    </section>
    `;
  },

  async afterRender() {
    document.getElementById('addStoryButton').addEventListener('click', () => {
      window.location.hash = '#/add-story'; // sesuaikan jika rutenya lain
    });

    const token = localStorage.getItem("token");
  
    const section = document.getElementById('home');
    if (section) {
      requestAnimationFrame(() => {
        section.classList.add('page-enter-active');
      });
  
      setTimeout(() => {
        section.classList.remove('page-enter');
        section.classList.remove('page-enter-active');
      }, 600);
    }
  
    const container = document.getElementById('storyContainer');
    if (!container) {
      console.error('Elemen #storyContainer tidak ditemukan!');
      return;
    }
  
    const model = new StoryModel('https://story-api.dicoding.dev/v1');
    const view = new StoryView(container, 'map');
    const presenter = new StoryPresenter(model, view, token);
  
    await presenter.loadStories();
    // Fungsi global untuk hapus cerita dari IndexedDB
    window.deleteStory = async function(id) {
      const confirmDelete = confirm('Apakah kamu yakin ingin menghapus cerita ini?');
      if (!confirmDelete) return;

      try {
        await StoryDB.deleteStory(id);
        alert('Cerita berhasil dihapus!');
        location.reload(); 
      } catch (error) {
        console.error('Gagal menghapus cerita:', error);
        alert('Terjadi kesalahan saat menghapus cerita.');
      } 
    }
  }
};

export default HomePage;

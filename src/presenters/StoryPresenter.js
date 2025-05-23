import StoryDB from '../data/story-db.js';

class StoryPresenter {
  constructor(model, view, token) {
    this.model = model;
    this.view = view;
    this.token = token;
  }

  async loadStories() {
    try {
      // 1. Coba ambil dari API
      const stories = await this.model.fetchStories(this.token);

      // 3. Filter untuk lokasi valid
      const validStories = stories.filter(story => story.lat !== null && story.lon !== null);
      console.log('Data cerita setelah difilter:', validStories);

      // 4. Tampilkan
      this.view.renderStories(validStories);

    } catch (error) {
      console.error('Gagal memuat cerita dari API, mencoba dari IndexedDB...', error);

      // 5. Ambil dari IndexedDB saat offline
      const cachedStories = await StoryDB.getAllStories();
      const validCached = cachedStories.filter(story => story.lat !== null && story.lon !== null);

      if (validCached.length > 0) {
        this.view.renderStories(validCached);
      } else {
        this.view.renderError('Gagal memuat cerita. Tidak ada data tersedia secara offline.');
      }
    }
  }

}

export default StoryPresenter;

import StoryDB from '../data/story-db.js';

class StoryView {
  constructor(container, mapId) {
    this.container = container;
    this.mapId = mapId;
  }

  renderStories(stories) {
    this.container.innerHTML = '';
    stories.forEach((story) => {
      const formatDate = new Date(story.createdAt).toLocaleString('id-ID', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      });

      const storyElement = document.createElement('div');
      storyElement.classList.add('story-item');
      storyElement.innerHTML = `
        <img src="${story.photoUrl}" alt="Gambar dari ${story.name}" width="200">
        <h3>${story.name}</h3>
        <p>${story.description}</p>
        <p>📅 Diupload pada ${formatDate}</p>
        <p>📍 Lokasi: ${story.lat}, ${story.lon}</p>
        <button class="bookmark-button" data-id="${story.id}">🔖 Bookmark</button>
      `;
      this.container.appendChild(storyElement);
    });

    // Render peta
    this.renderMap(stories);

    // Tambahkan listener tombol bookmark
    const bookmarkButtons = this.container.querySelectorAll('.bookmark-button');
    bookmarkButtons.forEach((btn) => {
      btn.addEventListener('click', async (event) => {
        const storyId = event.target.dataset.id;
        const story = stories.find((s) => s.id === storyId);
        if (story) {
          await StoryDB.saveBookmark(story);
          alert(`Cerita "${story.name}" disimpan ke bookmark!`);
        }
      });
    });
  }

  renderError(errorMessage) {
    this.container.innerHTML = `<p style="color: red;">${errorMessage}</p>`;
  }

  renderMap(stories) {
    const mapContainer = document.getElementById(this.mapId);
    if (!mapContainer) {
      console.error('Elemen peta tidak ditemukan!');
      return;
    }

    const map = L.map(this.mapId).setView([-6.2, 106.8], 5);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
    }).addTo(map);

    stories.forEach((story) => {
      const marker = L.marker([story.lat, story.lon]).addTo(map);
      marker.bindPopup(`<b>${story.name}</b><br>${story.description}`);
    });
  }
}

export default StoryView;

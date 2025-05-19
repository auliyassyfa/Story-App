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
        hour12: false, // kalau ingin format 24 jam
      });
      const storyElement = document.createElement('div');
      storyElement.classList.add('story-item');
      storyElement.innerHTML = `
        <img src="${story.photoUrl}" alt="Gambar dari ${story.name}" width="200">
        <h3>${story.name}</h3>
        <p>${story.description}</p>
        <p>Diupload pada ${formatDate}</p>
        <small>Lat: ${story.lat}, Lng: ${story.lon}</small>
        <button onclick="deleteStory('${story.id}')">Hapus</button>

      `;
      this.container.appendChild(storyElement);
    });

    this.renderMap(stories);
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

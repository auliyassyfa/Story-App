import StoryDB from '../../data/story-db';

const SavedStoriesPage = {
  async render() {
    return `
      <section class="savedStoriesSection">
        <h2>Saved Stories</h2>
        <div id="savedStoriesList"></div>
      </section>
    `;
  },

  async afterRender() {
    const stories = await StoryDB.getAllBookmarks();
    const listElement = document.getElementById('savedStoriesList');

    if (stories.length === 0) {
      listElement.innerHTML = '<p>Belum ada cerita yang disimpan.</p>';
      return;
    }

    listElement.innerHTML = '';

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
        <button class="delete-button">🗑️ Delete</button>
      `;

      storyElement.querySelector('.delete-button').addEventListener('click', async () => {
        await StoryDB.deleteBookmark(story.id);
        this.afterRender(); // Refresh daftar setelah dihapus
      });

      listElement.appendChild(storyElement);
    });
  }
};

export default SavedStoriesPage;

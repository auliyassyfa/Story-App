import { openDB } from 'idb';

const DB_NAME = 'berbagi-cerita-db';
const DB_VERSION = 1;
const STORE_NAME = 'stories';

const dbPromise = openDB(DB_NAME, DB_VERSION, {
  upgrade(db) {
    if (!db.objectStoreNames.contains(STORE_NAME)) {
      db.createObjectStore(STORE_NAME, { keyPath: 'id' });
    }
  },
});

const StoryDB = {
  async saveStory(story) {
    if (!story.id) return;
    const db = await dbPromise;
    await db.put(STORE_NAME, story);
  },

  async putStories(stories) {
    const db = await dbPromise;
    const tx = db.transaction(STORE_NAME, 'readwrite');
    for (const story of stories) {
        if (story.id) {
        tx.store.put(story);
        }
    }
    await tx.done;
    },


  async getAllStories() {
    const db = await dbPromise;
    return db.getAll(STORE_NAME);
  },

  async getStory(id) {
    const db = await dbPromise;
    return db.get(STORE_NAME, id);
  },

  async deleteStory(id) {
    const db = await dbPromise;
    return db.delete(STORE_NAME, id);
  },

  async clearAllStories() {
    const db = await dbPromise;
    return db.clear(STORE_NAME);
  }
};

export default StoryDB;

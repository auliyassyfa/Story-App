import { openDB } from 'idb';

const DB_NAME = 'berbagi-cerita-db';
const DB_VERSION = 1;
const STORY_STORE = 'stories';
const BOOKMARK_STORE = 'bookmarks';

const dbPromise = openDB(DB_NAME, DB_VERSION, {
  upgrade(db) {
    if (!db.objectStoreNames.contains(STORY_STORE)) {
      db.createObjectStore(STORY_STORE, { keyPath: 'id' });
    }
    if (!db.objectStoreNames.contains(BOOKMARK_STORE)) {
      db.createObjectStore(BOOKMARK_STORE, { keyPath: 'id' });
    }
  },
});

const StoryDB = {
  //CACHED STORIES (OFFLINE)
  async putStories(stories) {
    const db = await dbPromise;
    const tx = db.transaction(STORY_STORE, 'readwrite');
    for (const story of stories) {
      if (story.id) {
        tx.store.put(story);
      }
    }
    await tx.done;
  },

  async getAllStories() {
    const db = await dbPromise;
    return db.getAll(STORY_STORE);
  },

  async clearCachedStories() {
    const db = await dbPromise;
    return db.clear(STORY_STORE);
  },

  //BOOKMARKS

  async saveBookmark(story) {
    if (!story.id) return;
    const db = await dbPromise;
    await db.put(BOOKMARK_STORE, story);
  },

  async getAllBookmarks() {
    const db = await dbPromise;
    return db.getAll(BOOKMARK_STORE);
  },

  async getBookmark(id) {
    const db = await dbPromise;
    return db.get(BOOKMARK_STORE, id);
  },

  async deleteBookmark(id) {
    const db = await dbPromise;
    return db.delete(BOOKMARK_STORE, id);
  },

  async clearAllBookmarks() {
    const db = await dbPromise;
    return db.clear(BOOKMARK_STORE);
  }
};

export default StoryDB;

import { OrderStatus, Announcement } from '../types';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, set, push, remove, Database } from 'firebase/database';

// ------------------------------------------------------------------
// FIREBASE CONFIGURATION
// ------------------------------------------------------------------
const firebaseConfig = {
  apiKey: "AIzaSyCbFeJitwzr4fs-JwyqDd1USlMwwpjsi7M",
  authDomain: "logify-app-1b9cc.firebaseapp.com",
  databaseURL: "https://logify-app-1b9cc-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "logify-app-1b9cc",
  storageBucket: "logify-app-1b9cc.firebasestorage.app",
  messagingSenderId: "805174427748",
  appId: "1:805174427748:web:0b890d0a7da55955bedf71"
};

let db: Database | null = null;

try {
  const app = initializeApp(firebaseConfig);
  db = getDatabase(app);
  console.log("✅ Firebase initialized successfully for project:", firebaseConfig.projectId);
} catch (error) {
  console.error("❌ Firebase initialization failed:", error);
  console.warn("⚠️ Falling back to local storage mode.");
}

// ------------------------------------------------------------------
// Implementation
// ------------------------------------------------------------------

export const CloudStore = {
  subscribeToStatus: (callback: (status: OrderStatus) => void) => {
    if (db) {
      const statusRef = ref(db, 'status');
      const unsubscribe = onValue(statusRef, (snapshot) => {
        const val = snapshot.val();
        if (val) callback(val);
      }, (error) => {
        console.error("Error reading status:", error);
      });
      return unsubscribe;
    } else {
      // Fallback: Local Storage
      const stored = localStorage.getItem('orderStatus');
      if (stored) callback(stored as OrderStatus);
      
      // Listen for local changes (cross-tab)
      const handler = () => {
         const s = localStorage.getItem('orderStatus');
         if (s) callback(s as OrderStatus);
      };
      window.addEventListener('storage', handler);
      // Also create a custom event for same-tab updates
      window.addEventListener('local-status-change', handler);
      return () => {
        window.removeEventListener('storage', handler);
        window.removeEventListener('local-status-change', handler);
      };
    }
  },

  setStatus: (status: OrderStatus) => {
    if (db) {
      set(ref(db, 'status'), status).catch(e => console.error("Error setting status:", e));
    } else {
      localStorage.setItem('orderStatus', status);
      window.dispatchEvent(new Event('local-status-change'));
    }
  },

  subscribeToAnnouncements: (callback: (announcements: Announcement[]) => void) => {
    if (db) {
      const annRef = ref(db, 'announcements');
      const unsubscribe = onValue(annRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          // Convert object to array
          const list: Announcement[] = Object.keys(data).map(key => ({
            id: key,
            ...data[key]
          }));
          // Sort by new
          list.sort((a, b) => b.timestamp - a.timestamp);
          callback(list);
        } else {
          callback([]);
        }
      }, (error) => {
        console.error("Error reading announcements:", error);
      });
      return unsubscribe;
    } else {
      // Fallback
      const load = () => {
        const stored = localStorage.getItem('announcements');
        if (stored) {
            callback(JSON.parse(stored));
        } else {
            callback([]);
        }
      };
      load();
      
      const handler = () => load();
      window.addEventListener('storage', handler);
      window.addEventListener('local-announcement-change', handler);
      return () => {
          window.removeEventListener('storage', handler);
          window.removeEventListener('local-announcement-change', handler);
      };
    }
  },

  addAnnouncement: (message: string) => {
    const newAnn = {
      message,
      timestamp: Date.now(),
      author: 'Admin'
    };

    if (db) {
      push(ref(db, 'announcements'), newAnn).catch(e => console.error("Error posting announcement:", e));
    } else {
      const stored = localStorage.getItem('announcements');
      const current = stored ? JSON.parse(stored) : [];
      // Add simplified ID for local
      const withId = { ...newAnn, id: crypto.randomUUID() };
      current.unshift(withId);
      localStorage.setItem('announcements', JSON.stringify(current));
      window.dispatchEvent(new Event('local-announcement-change'));
    }
  },

  clearAnnouncements: () => {
    if (db) {
      set(ref(db, 'announcements'), null).catch(e => console.error("Error clearing announcements:", e));
    } else {
      localStorage.setItem('announcements', '[]');
      window.dispatchEvent(new Event('local-announcement-change'));
    }
  }
};
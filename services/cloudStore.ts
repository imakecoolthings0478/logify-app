import { OrderStatus, Announcement } from '../types';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, set, push, remove, child, Database } from 'firebase/database';

// ------------------------------------------------------------------
// FIREBASE CONFIGURATION
// ------------------------------------------------------------------
const firebaseConfig = {
  apiKey: "AIzaSyAVXNZNepTlSISFkH1xUFhNYZooeGPeujE",
  authDomain: "logify-web-app.firebaseapp.com",
  databaseURL: "https://logify-web-app-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "logify-web-app",
  storageBucket: "logify-web-app.firebasestorage.app",
  messagingSenderId: "140654179240",
  appId: "1:140654179240:web:afdf2a37b6c808f34e239d"
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

  // ----------------------------------------------------------------
  // PROMO CODE LOGIC
  // ----------------------------------------------------------------
  subscribeToPromoCode: (callback: (code: string) => void) => {
    if (db) {
      const promoRef = ref(db, 'promoCode');
      const unsubscribe = onValue(promoRef, (snapshot) => {
        const val = snapshot.val();
        callback(val || '');
      });
      return unsubscribe;
    } else {
      const load = () => {
        const stored = localStorage.getItem('promoCode');
        callback(stored || '');
      };
      load();
      const handler = () => load();
      window.addEventListener('storage', handler);
      window.addEventListener('local-promocode-change', handler);
      return () => {
        window.removeEventListener('storage', handler);
        window.removeEventListener('local-promocode-change', handler);
      };
    }
  },

  setPromoCode: (code: string) => {
    if (db) {
      set(ref(db, 'promoCode'), code).catch(e => console.error("Error setting promo code:", e));
    } else {
      localStorage.setItem('promoCode', code);
      window.dispatchEvent(new Event('local-promocode-change'));
    }
  },

  // ----------------------------------------------------------------
  // ANNOUNCEMENTS (Legacy/Disabled)
  // ----------------------------------------------------------------
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

  deleteAnnouncement: async (id: string) => {
    if (db) {
      try {
        const announcementsRef = ref(db, 'announcements');
        await remove(child(announcementsRef, id));
        console.log("✅ Announcement deleted successfully:", id);
      } catch (e) {
        console.error("❌ Error deleting announcement:", e);
      }
    } else {
      const stored = localStorage.getItem('announcements');
      if (stored) {
        // @ts-ignore
        const current = JSON.parse(stored).filter(a => a.id !== id);
        localStorage.setItem('announcements', JSON.stringify(current));
        window.dispatchEvent(new Event('local-announcement-change'));
      }
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
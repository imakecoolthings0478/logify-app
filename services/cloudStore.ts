
import { OrderStatus, Announcement } from '../types';
import { Client, Databases, ID, Query } from 'appwrite';

// ------------------------------------------------------------------
// CONFIGURATION STORAGE
// ------------------------------------------------------------------
// V9: Bumped version to apply new connection logic
const STORAGE_KEY_CONFIG = 'logify_config_v9';

const DEFAULT_CONFIG = {
  ENDPOINT: "https://cloud.appwrite.io/v1",
  // REPLACE THESE WITH YOUR OWN APPWRITE PROJECT IDs IF YOU WANT CLOUD SYNC
  PROJECT_ID: "692149fe003bf76cb55b", 
  DB: "69214ab3003cd5ab7575",         
  COLL_SETTINGS: "settings",
  DOC_GLOBAL: "global_settings",
  COLL_ANNOUNCE: "announcements"
};

// Load config from LocalStorage or use Defaults
const loadConfig = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY_CONFIG);
    if (stored) {
      return { ...DEFAULT_CONFIG, ...JSON.parse(stored) };
    }
  } catch (e) {
    console.warn("Failed to load config, reverting to defaults", e);
  }
  return DEFAULT_CONFIG;
};

let currentConfig = loadConfig();
let client: Client | null = null;
let databases: Databases | null = null;
let isConnected = false;
let connectionError: string | null = null;

// Initialize Appwrite
const initAppwrite = () => {
  if (currentConfig.PROJECT_ID && currentConfig.DB) {
    try {
      client = new Client()
        .setEndpoint(currentConfig.ENDPOINT)
        .setProject(currentConfig.PROJECT_ID);
      databases = new Databases(client);
      
      // Optimistically set true. We only disable if a NETWORK request fails completely.
      isConnected = true;
      connectionError = null;
    } catch (e: any) {
      console.error("❌ Failed to initialize Appwrite client:", e);
      isConnected = false;
      connectionError = e.message || "Initialization Failed";
    }
  } else {
    isConnected = false;
    connectionError = "Missing Configuration";
  }
};

initAppwrite();

// ------------------------------------------------------------------
// Helper: LocalStorage Fallback (Offline Mode)
// ------------------------------------------------------------------
const LocalFallback = {
    get: (key: string) => localStorage.getItem(key),
    set: (key: string, val: string) => {
        localStorage.setItem(key, val);
        window.dispatchEvent(new Event(`local-${key}-change`));
    },
    subscribe: (key: string, cb: (val: string) => void) => {
        const handler = () => cb(localStorage.getItem(key) || '');
        window.addEventListener('storage', handler);
        window.addEventListener(`local-${key}-change`, handler);
        handler(); // Initial call
        return () => {
            window.removeEventListener('storage', handler);
            window.removeEventListener(`local-${key}-change`, handler);
        };
    }
};

// Improved Error Logger
const logError = (msg: string, e: any) => {
    let details = '';
    try {
        if (e instanceof Error) details = e.message;
        else if (typeof e === 'string') details = e;
        else if (e && typeof e === 'object') {
             if(e.message) details = e.message;
             else if(e.code) details = `Code: ${e.code}`;
             else details = JSON.stringify(e);
        } else {
            details = String(e);
        }
    } catch (err) {
        details = 'Unknown Error';
    }
    
    if (!details.includes('Failed to fetch') && !details.includes('NetworkError')) {
        console.warn(`[CloudStore] ${msg}: ${details}`);
    }
    return details;
};

// ------------------------------------------------------------------
// Implementation
// ------------------------------------------------------------------

export const CloudStore = {
  
  getConfig: () => currentConfig,
  
  getConnectionError: () => connectionError,

  saveConfig: (newConfig: Partial<typeof DEFAULT_CONFIG>) => {
    const merged = { ...currentConfig, ...newConfig };
    localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(merged));
    window.location.reload();
  },

  resetConfig: () => {
    localStorage.removeItem(STORAGE_KEY_CONFIG);
    window.location.reload();
  },

  getMode: () => isConnected ? 'Hybrid (Cloud + Local)' : 'Offline Mode',

  isConfigured: () => isConnected,

  retryConnection: async () => {
      initAppwrite();
      if(databases) {
          try {
              await databases.getDocument(currentConfig.DB, currentConfig.COLL_SETTINGS, currentConfig.DOC_GLOBAL);
              isConnected = true;
              connectionError = null;
              window.location.reload(); // Simplest way to re-hook subscriptions
          } catch (e: any) {
              console.warn("Retry failed:", e);
          }
      }
  },

  // --- STATUS ---
  subscribeToStatus: (callback: (status: OrderStatus) => void) => {
    let appwriteUnsub: () => void | undefined;

    // 1. Always setup local listener (Primary Source of Truth for UI)
    const localUnsub = LocalFallback.subscribe('orderStatus', (val) => {
        callback((val as OrderStatus) || OrderStatus.ACCEPTING);
    });

    // 2. Attempt Cloud Connection
    if (isConnected && databases && client) {
        databases.getDocument(currentConfig.DB, currentConfig.COLL_SETTINGS, currentConfig.DOC_GLOBAL)
            .then(doc => {
                // SUCCESS: Connection verified and data found
                connectionError = null; // Clear any previous errors
                if(doc.status) {
                    callback(doc.status as OrderStatus);
                    LocalFallback.set('orderStatus', doc.status);
                }
                
                // ONLY Initialize Realtime if fetch succeeded
                try {
                    const channel = `databases.${currentConfig.DB}.collections.${currentConfig.COLL_SETTINGS}.documents.${currentConfig.DOC_GLOBAL}`;
                    appwriteUnsub = client!.subscribe(channel, (response: any) => {
                        if (response.payload && response.payload.status) {
                            const newStatus = response.payload.status;
                            callback(newStatus);
                            LocalFallback.set('orderStatus', newStatus);
                        }
                    });
                } catch (rtErr) {
                    // Silent fail for realtime
                }
            })
            .catch(async (e: any) => {
                // ERROR HANDLING REFINED
                
                // 1. Check for 404 (Not Found)
                // This means the backend is reachable, but data is missing. 
                // We should NOT disconnect, but rather try to fix it.
                if (e.code === 404) {
                    console.warn("⚠️ Cloud Connected, but Document Not Found (404). Attempting auto-creation...");
                    connectionError = "Data missing (404).";
                    
                    try {
                        // Attempt creation (Requires 'create' permission for 'role:any' or authenticated user)
                        await databases!.createDocument(currentConfig.DB, currentConfig.COLL_SETTINGS, currentConfig.DOC_GLOBAL, {
                            status: OrderStatus.ACCEPTING,
                            promoCode: ''
                        });
                        console.log("✅ Auto-created global_settings document.");
                        connectionError = null; // Clear error if fixed
                    } catch (createErr: any) {
                        console.error("❌ Auto-create failed.", createErr);
                        connectionError = `Data Missing & Create Failed: ${createErr.message}`;
                    }
                } 
                // 2. Check for Network Errors
                else if (e.code === 0 || e.message?.toLowerCase().includes('network') || e.message?.toLowerCase().includes('fetch') || e.message?.toLowerCase().includes('failed to fetch')) {
                    console.info("ℹ️ Offline Mode Active: Backend unreachable.");
                    isConnected = false; 
                    connectionError = "Network Error. Check Appwrite Platform Settings (CORS).";
                }
                // 3. Other Errors (Auth, etc)
                else {
                    console.warn("⚠️ Cloud Error:", e);
                    connectionError = e.message || "Unknown Cloud Error";
                    // We stay connected technically to allow Admin to see the error
                }
            });
    }

    return () => {
        localUnsub();
        if (appwriteUnsub) appwriteUnsub();
    };
  },

  setStatus: async (status: OrderStatus) => {
    // Optimistic update
    LocalFallback.set('orderStatus', status);

    if (isConnected && databases) {
        try {
            await databases.updateDocument(currentConfig.DB, currentConfig.COLL_SETTINGS, currentConfig.DOC_GLOBAL, {
                status: status
            });
        } catch (e: any) {
            if (isConnected) { 
                if (e.code === 404) {
                     try {
                        await databases.createDocument(currentConfig.DB, currentConfig.COLL_SETTINGS, currentConfig.DOC_GLOBAL, {
                            status: status,
                            promoCode: LocalFallback.get('promoCode') || ''
                        });
                     } catch (createErr) {
                         logError("Failed to auto-create settings", createErr);
                     }
                } else {
                    logError("Set Status Failed", e);
                }
            }
        }
    }
  },

  // --- PROMO CODE ---
  subscribeToPromoCode: (callback: (code: string) => void) => {
    let appwriteUnsub: () => void | undefined;
    
    const localUnsub = LocalFallback.subscribe('promoCode', (val) => {
        callback(val || '');
    });

    if (isConnected && databases && client) {
        databases.getDocument(currentConfig.DB, currentConfig.COLL_SETTINGS, currentConfig.DOC_GLOBAL)
            .then(doc => {
                const code = doc.promoCode || '';
                callback(code);
                LocalFallback.set('promoCode', code);

                try {
                    const channel = `databases.${currentConfig.DB}.collections.${currentConfig.COLL_SETTINGS}.documents.${currentConfig.DOC_GLOBAL}`;
                    appwriteUnsub = client!.subscribe(channel, (response: any) => {
                        if (response.payload) {
                            const newCode = response.payload.promoCode || '';
                            callback(newCode);
                            LocalFallback.set('promoCode', newCode);
                        }
                    });
                } catch (e) {}
            })
            .catch(() => {
                // Already handled in Status subscription
            });
    }

    return () => {
        localUnsub();
        if (appwriteUnsub) appwriteUnsub();
    };
  },

  setPromoCode: async (code: string) => {
    LocalFallback.set('promoCode', code);

    if (isConnected && databases) {
        try {
            await databases.updateDocument(currentConfig.DB, currentConfig.COLL_SETTINGS, currentConfig.DOC_GLOBAL, {
                promoCode: code
            });
        } catch (e: any) {
            if (isConnected && e.code === 404) {
                try {
                    await databases.createDocument(currentConfig.DB, currentConfig.COLL_SETTINGS, currentConfig.DOC_GLOBAL, {
                        status: LocalFallback.get('orderStatus') || OrderStatus.ACCEPTING,
                        promoCode: code
                    });
                } catch (err) {}
            }
        }
    }
  },

  // --- ANNOUNCEMENTS ---
  subscribeToAnnouncements: (callback: (announcements: Announcement[]) => void) => {
    let appwriteUnsub: () => void | undefined;
    
    // Local handler
    const loadLocal = () => {
        const stored = localStorage.getItem('announcements');
        callback(stored ? JSON.parse(stored) : []);
    };
    
    window.addEventListener('local-announcements-change', loadLocal);
    
    if (isConnected && databases && client) {
        const fetchAll = () => {
            databases!.listDocuments(
                currentConfig.DB, 
                currentConfig.COLL_ANNOUNCE,
                [Query.orderDesc('timestamp'), Query.limit(20)]
            ).then(res => {
                const list: Announcement[] = res.documents.map(doc => ({
                    id: doc.$id,
                    message: doc.message,
                    timestamp: doc.timestamp,
                    author: doc.author
                }));
                callback(list);
                localStorage.setItem('announcements', JSON.stringify(list));
            }).catch(e => {
                // If 404 on List, it usually means Collection Not Found
                if (e.code === 404) {
                    console.warn("⚠️ Announcements Collection Not Found (404).");
                }
                loadLocal(); // Fallback
            });
        };

        fetchAll();

        try {
            const channel = `databases.${currentConfig.DB}.collections.${currentConfig.COLL_ANNOUNCE}.documents`;
            appwriteUnsub = client.subscribe(channel, () => fetchAll());
        } catch (e) {}
    } else {
        loadLocal();
    }

    return () => {
        window.removeEventListener('local-announcements-change', loadLocal);
        if (appwriteUnsub) appwriteUnsub();
    };
  },

  addAnnouncement: async (message: string) => {
    const data = {
        message,
        timestamp: Date.now(),
        author: 'Admin'
    };

    // Optimistic Update (Local)
    const stored = localStorage.getItem('announcements');
    const current = stored ? JSON.parse(stored) : [];
    const withId = { ...data, id: crypto.randomUUID() };
    current.unshift(withId);
    localStorage.setItem('announcements', JSON.stringify(current));
    window.dispatchEvent(new Event('local-announcements-change'));

    if (isConnected && databases) {
        try {
            await databases.createDocument(currentConfig.DB, currentConfig.COLL_ANNOUNCE, ID.unique(), data);
        } catch (e) {
             console.error("Failed to create announcement in cloud", e);
        }
    }
  },

  deleteAnnouncement: async (id: string) => {
    // Optimistic
    const stored = localStorage.getItem('announcements');
    if (stored) {
        const current = JSON.parse(stored).filter((a: Announcement) => a.id !== id);
        localStorage.setItem('announcements', JSON.stringify(current));
        window.dispatchEvent(new Event('local-announcements-change'));
    }

    if (isConnected && databases) {
        try {
            await databases.deleteDocument(currentConfig.DB, currentConfig.COLL_ANNOUNCE, id);
        } catch (e) {}
    }
  },

  clearAnnouncements: async () => {
    localStorage.setItem('announcements', '[]');
    window.dispatchEvent(new Event('local-announcements-change'));

    if (isConnected && databases) {
        try {
            const res = await databases.listDocuments(currentConfig.DB, currentConfig.COLL_ANNOUNCE, [Query.limit(100)]);
            const promises = res.documents.map(doc => 
                databases!.deleteDocument(currentConfig.DB, currentConfig.COLL_ANNOUNCE, doc.$id).catch(() => {})
            );
            await Promise.all(promises);
        } catch (e) {}
    }
  }
};

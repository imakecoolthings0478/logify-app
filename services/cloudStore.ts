import { OrderStatus, Announcement } from '../types';

// ------------------------------------------------------------------
// REPLACEMENT: Using Local Mock Store to resolve Firebase dependency issues
// and allow the application to run without configuration.
// ------------------------------------------------------------------

class MockStore {
  private statusListeners: ((status: OrderStatus) => void)[] = [];
  private announcementListeners: ((announcements: Announcement[]) => void)[] = [];
  
  private _status: OrderStatus = OrderStatus.ACCEPTING;
  private _announcements: Announcement[] = [];

  constructor() {
    try {
        const s = localStorage.getItem('orderStatus');
        if(s) this._status = s as OrderStatus;

        const a = localStorage.getItem('announcements');
        if(a) this._announcements = JSON.parse(a);
    } catch (e) {
        console.warn("LocalStorage access failed", e);
    }
  }

  subscribeToStatus(cb: (status: OrderStatus) => void) {
    this.statusListeners.push(cb);
    cb(this._status);
    return () => { this.statusListeners = this.statusListeners.filter(f => f !== cb); };
  }

  setStatus(s: OrderStatus) {
    this._status = s;
    localStorage.setItem('orderStatus', s);
    this.statusListeners.forEach(cb => cb(s));
  }

  subscribeToAnnouncements(cb: (announcements: Announcement[]) => void) {
    this.announcementListeners.push(cb);
    cb(this.getSortedAnnouncements());
    return () => { this.announcementListeners = this.announcementListeners.filter(f => f !== cb); };
  }

  addAnnouncement(message: string) {
    const ann: Announcement = {
      id: crypto.randomUUID(),
      message,
      timestamp: Date.now(),
      author: 'Admin'
    };
    this._announcements.push(ann);
    this.saveAnnouncements();
  }

  clearAnnouncements() {
    this._announcements = [];
    this.saveAnnouncements();
  }

  private getSortedAnnouncements() {
      return [...this._announcements].sort((a,b) => b.timestamp - a.timestamp);
  }

  private saveAnnouncements() {
    localStorage.setItem('announcements', JSON.stringify(this._announcements));
    const sorted = this.getSortedAnnouncements();
    this.announcementListeners.forEach(cb => cb(sorted));
  }
}

const storeInstance = new MockStore();

export const CloudStore = {
  subscribeToStatus: (callback: (status: OrderStatus) => void) => storeInstance.subscribeToStatus(callback),
  setStatus: (status: OrderStatus) => storeInstance.setStatus(status),
  subscribeToAnnouncements: (callback: (announcements: Announcement[]) => void) => storeInstance.subscribeToAnnouncements(callback),
  addAnnouncement: (message: string) => storeInstance.addAnnouncement(message),
  clearAnnouncements: () => storeInstance.clearAnnouncements()
};
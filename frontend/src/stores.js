import { writable } from 'svelte/store';

const storage = {
  getItem: (key) => localStorage.getItem(key),
  setItem: (key, val) => localStorage.setItem(key, val),
  removeItem: (key) => localStorage.removeItem(key),
};

const createTokenStore = () => {
  const localTokenStore = storage.getItem('token');

  const { subscribe, set, update } = writable(localTokenStore);

  return {
    subscribe,
    set: (token) => {
      storage.setItem('token', token);
      set(token);
    },
    unset: () => {
      storage.removeItem('token');
      set(null);
    },
    update: (token) => {
      storage.setItem('token', token);
      update(token);
    },
  };
};

const createUserStore = () => {
  const localUserStore = storage.getItem('user');

  const { subscribe, set, update } = writable(JSON.parse(localUserStore));

  return {
    subscribe,
    set: (user) => {
      storage.setItem('user', JSON.stringify(user));
      set(user);
    },
    unset: () => {
      storage.removeItem('user');
      set(null);
    },
    update: (user) => {
      storage.setItem('user', JSON.stringify(user));
      update(user);
    },
  };
};

export const token = createTokenStore();
export const user = createUserStore();

export type QueueItem = {
  resolve: (token: string) => void;
  reject: (error: Error) => void;
};

let isRefreshing = false;
let failedQueue: QueueItem[] = [];

export const refreshQueue = {
  get isRefreshing() {
    return isRefreshing;
  },

  start() {
    isRefreshing = true;
  },

  stop() {
    isRefreshing = false;
  },

  enqueue(item: QueueItem) {
    failedQueue.push(item);
  },

  resolveAll(token: string) {
    failedQueue.forEach((p) => p.resolve(token));
    failedQueue = [];
  },

  rejectAll(error: Error) {
    failedQueue.forEach((p) => p.reject(error));
    failedQueue = [];
  },
};

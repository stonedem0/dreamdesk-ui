export type NotificationType = "alert" | "notification" | "warning";

export interface NotificationItem {
  id: string;
  message: string;
  type: NotificationType;
  duration: number;
  persistent: boolean;
}

export interface NotifyOptions {
  message: string;
  type?: NotificationType;
  duration?: number;
  persistent?: boolean;
}

type Listener = (items: NotificationItem[]) => void;

let _queue: NotificationItem[] = [];
let _counter = 0;
const _listeners = new Set<Listener>();
const _timers = new Map<string, ReturnType<typeof setTimeout>>();

function emit() {
  _listeners.forEach((fn) => fn([..._queue]));
}

export function notify(options: NotifyOptions): string {
  const { message, type = "notification", duration = 4000, persistent = false } = options;
  const id = `notif-${++_counter}`;
  const item: NotificationItem = { id, message, type, duration, persistent };
  _queue = [..._queue, item];
  emit();

  if (!persistent) {
    const timer = setTimeout(() => dismiss(id), duration);
    _timers.set(id, timer);
  }

  return id;
}

export function dismiss(id: string): void {
  clearTimeout(_timers.get(id));
  _timers.delete(id);
  _queue = _queue.filter((n) => n.id !== id);
  emit();
}

export function dismissAll(): void {
  _timers.forEach((t) => clearTimeout(t));
  _timers.clear();
  _queue = [];
  emit();
}

export function subscribeNotifications(fn: Listener): () => void {
  _listeners.add(fn);
  fn([..._queue]);
  return () => _listeners.delete(fn);
}

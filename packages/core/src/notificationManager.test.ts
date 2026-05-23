import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  notify,
  dismiss,
  dismissAll,
  subscribeNotifications,
} from "./notificationManager";

beforeEach(() => {
  dismissAll();
  vi.useFakeTimers();
});

describe("notify", () => {
  it("adds a notification to the queue", () => {
    let items: ReturnType<typeof notify>[] = [];
    subscribeNotifications((q) => { items = q as any; });
    notify({ message: "hello" });
    expect(items).toHaveLength(1);
    expect(items[0]).toMatchObject({ message: "hello", type: "notification" });
  });

  it("returns a unique id", () => {
    const a = notify({ message: "a" });
    const b = notify({ message: "b" });
    expect(a).not.toBe(b);
  });

  it("defaults type to notification and duration to 4000", () => {
    let items: any[] = [];
    subscribeNotifications((q) => { items = q; });
    notify({ message: "x" });
    expect(items[0].type).toBe("notification");
    expect(items[0].duration).toBe(4000);
  });

  it("auto-dismisses after duration", () => {
    let items: any[] = [];
    subscribeNotifications((q) => { items = q; });
    notify({ message: "gone soon", duration: 1000 });
    expect(items).toHaveLength(1);
    vi.advanceTimersByTime(1000);
    expect(items).toHaveLength(0);
  });

  it("does not auto-dismiss persistent notifications", () => {
    let items: any[] = [];
    subscribeNotifications((q) => { items = q; });
    notify({ message: "sticky", persistent: true });
    vi.advanceTimersByTime(100000);
    expect(items).toHaveLength(1);
  });
});

describe("dismiss", () => {
  it("removes a notification by id", () => {
    let items: any[] = [];
    subscribeNotifications((q) => { items = q; });
    const id = notify({ message: "remove me" });
    dismiss(id);
    expect(items).toHaveLength(0);
  });

  it("is a no-op for unknown id", () => {
    let items: any[] = [];
    subscribeNotifications((q) => { items = q; });
    notify({ message: "stay" });
    dismiss("bogus-id");
    expect(items).toHaveLength(1);
  });
});

describe("dismissAll", () => {
  it("clears all notifications", () => {
    let items: any[] = [];
    subscribeNotifications((q) => { items = q; });
    notify({ message: "a" });
    notify({ message: "b" });
    dismissAll();
    expect(items).toHaveLength(0);
  });
});

describe("subscribeNotifications", () => {
  it("calls listener immediately with current queue", () => {
    notify({ message: "existing" });
    let received: any[] = [];
    subscribeNotifications((q) => { received = q; });
    expect(received).toHaveLength(1);
  });

  it("unsubscribe stops future updates", () => {
    let count = 0;
    const unsub = subscribeNotifications(() => { count++; });
    unsub();
    notify({ message: "ignored" });
    expect(count).toBe(1); // only the initial call
  });
});

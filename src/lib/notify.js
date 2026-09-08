// Notificações do navegador para lembretes diários da quinta.
const LAST_KEY = "hv_last_notify";

export function notifySupported() {
  return typeof window !== "undefined" && "Notification" in window;
}

export function notifyPermission() {
  return notifySupported() ? Notification.permission : "denied";
}

export async function requestNotifyPermission() {
  if (!notifySupported()) return "denied";
  if (Notification.permission === "granted") return "granted";
  return await Notification.requestPermission();
}

export function sendNotify(title, body) {
  if (!notifySupported() || Notification.permission !== "granted") return;
  try {
    new Notification(title, { body, tag: "hv-tarefas" });
  } catch {}
}

// Garante que a notificação automática só dispara uma vez por dia
export function shouldNotifyToday() {
  const today = new Date().toISOString().split("T")[0];
  const last = localStorage.getItem(LAST_KEY);
  if (last === today) return false;
  localStorage.setItem(LAST_KEY, today);
  return true;
}
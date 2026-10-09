// A synchronous identity check also protects async reads before account events arrive.
export function readAccountScope() {
  try {
    const owner = localStorage.getItem('hortaviva_account_owner_v1') || '';
    const user = JSON.parse(localStorage.getItem('hortaviva_current_user') || 'null');
    return JSON.stringify([owner, user?.id || '', user?.email || '']);
  } catch {
    return null;
  }
}

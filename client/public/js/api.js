// api.js - client-side wrapper
const API_BASE = (function() {
  // Allow override by global variable if needed
  if (window.__API_BASE__) return window.__API_BASE__;
  return (location.hostname === 'localhost' || location.hostname === '127.0.0.1')
    ? 'http://localhost:3000/api'
    : `${location.protocol}//${location.host}/api`;
})();

async function apiGet(path, params = {}) {
  const url = new URL(`${API_BASE}${path}`);
  Object.entries(params).forEach(([k,v]) => {
    if (v === undefined || v === null || v === '') return;
    url.searchParams.append(k, v);
  });
  const res = await fetch(url.toString(), { credentials: 'include' });
  if (!res.ok) {
    const errBody = await res.json().catch(()=>({}));
    const message = errBody.error || errBody.message || `API error ${res.status}`;
    throw new Error(message);
  }
  return res.json();
}

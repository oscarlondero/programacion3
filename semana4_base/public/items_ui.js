(() => {
  const API = 'api/items'; // relativo a /public/, funciona aunque el proyecto esté en subcarpeta

  const $ = (id) => document.getElementById(id);
  const frm = $('frm');
  const errBox = $('err');
  const tbody = $('tbody');
  const btn = $('btn');

  function clearErrors() {
    errBox.innerHTML = '';
    errBox.style.display = 'none';
  }

  function showErrors(errors) {
    const entries = Object.entries(errors || {});
    if (!entries.length) {
      errBox.textContent = 'Error inesperado.';
      errBox.style.display = 'block';
      return;
    }
    let html = '<strong>Validación:</strong><ul>';
    for (const [k, v] of entries) {
      html += `<li><code>${k}</code>: ${v}</li>`;
    }
    html += '</ul>';
    errBox.innerHTML = html;
    errBox.style.display = 'block';
  }

  function render(items) {
    tbody.innerHTML = '';
    for (const it of (items || [])) {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${it.id}</td>
        <td>${escapeHtml(it.name || '')}</td>
        <td>${it.qty}</td>
        <td>${it.created_at || ''}</td>
      `;
      tbody.appendChild(tr);
    }
  }

  function escapeHtml(s) {
    return String(s)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  async function loadItems() {
    clearErrors();
    const res = await fetch(API, { headers: { 'Accept': 'application/json' } });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.ok) {
      showErrors(data.errors || { api: 'No se pudo cargar el listado.' });
      return;
    }
    render(data.items);
  }

  async function createItem(name, qty) {
    clearErrors();
    btn.disabled = true;
    try {
      const res = await fetch(API, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ name, qty })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        showErrors(data.errors || { api: 'No se pudo crear el item.' });
        return false;
      }
      return true;
    } finally {
      btn.disabled = false;
    }
  }

  frm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = String($('name').value || '').trim();
    const qty = String($('qty').value || '').trim();

    const ok = await createItem(name, qty);
    if (ok) {
      $('name').value = '';
      $('qty').value = '0';
      await loadItems();
    }
  });

  $('reload').addEventListener('click', loadItems);

  // init
  loadItems();
})();

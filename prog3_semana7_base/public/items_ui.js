(() => {
  const API_ITEMS = 'api/items';
  const API_CATS  = 'api/categories';

  const $ = (id) => document.getElementById(id);
  const frm = $('frm');
  const errBox = $('err');
  const tbody = $('tbody');
  const btn = $('btn');
  const catCreate = $('catCreate');
  const catFilter = $('catFilter');
  const status = $('status');

  function setStatus(t) {
    status.textContent = t || '';
  }

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
      html += `<li><code>${k}</code>: ${escapeHtml(v)}</li>`;
    }
    html += '</ul>';
    errBox.innerHTML = html;
    errBox.style.display = 'block';
  }

  function escapeHtml(s) {
    return String(s)
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  }

  function render(items) {
    tbody.innerHTML = '';
    for (const it of (items || [])) {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${it.id}</td>
        <td>${escapeHtml(it.category_name || '')}</td>
        <td>${escapeHtml(it.name || '')}</td>
        <td>${it.qty}</td>
        <td>${escapeHtml(it.created_at || '')}</td>
      `;
      tbody.appendChild(tr);
    }
  }

  async function loadCategories() {
    clearErrors();
    setStatus('Cargando categorías...');

    const res = await fetch(API_CATS, { headers: { 'Accept': 'application/json' } });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || !data.ok) {
      setStatus('');
      showErrors(data.errors || { api: 'No se pudieron cargar las categorías.' });
      return;
    }

    const cats = data.categories || [];

    // Select de creación
    catCreate.innerHTML = '';
    const ph = document.createElement('option');
    ph.value = '';
    ph.textContent = 'Seleccionar...';
    catCreate.appendChild(ph);

    // Select de filtro
    catFilter.innerHTML = '';
    const all = document.createElement('option');
    all.value = '0';
    all.textContent = 'Todas';
    catFilter.appendChild(all);

    for (const c of cats) {
      const opt1 = document.createElement('option');
      opt1.value = String(c.id);
      opt1.textContent = String(c.name);
      catCreate.appendChild(opt1);

      const opt2 = document.createElement('option');
      opt2.value = String(c.id);
      opt2.textContent = String(c.name);
      catFilter.appendChild(opt2);
    }

    // Default: si hay categorías, seleccionar la primera en creación.
    if (cats.length) {
      catCreate.value = String(cats[0].id);
    }

    setStatus('');
  }

  async function loadItems() {
    clearErrors();
    setStatus('Cargando items...');

    const catId = String(catFilter.value || '0');
    const url = (catId === '0') ? API_ITEMS : `${API_CATS}/${encodeURIComponent(catId)}/items`;

    const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
    const data = await res.json().catch(() => ({}));

    setStatus('');
    if (!res.ok || !data.ok) {
      showErrors(data.errors || { api: 'No se pudo cargar el listado.' });
      return;
    }

    render(data.items || []);
  }

  async function createItem(name, qty, category_id) {
    clearErrors();

    if (!category_id) {
      showErrors({ category_id: 'Seleccioná una categoría.' });
      return false;
    }

    btn.disabled = true;
    setStatus('Guardando...');
    try {
      const res = await fetch(API_ITEMS, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ name, qty, category_id })
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        showErrors(data.errors || { api: 'No se pudo crear el item.' });
        return false;
      }
      return true;
    } finally {
      btn.disabled = false;
      setStatus('');
    }
  }

  frm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = String($('name').value || '').trim();
    const qty = String($('qty').value || '').trim();
    const category_id = String(catCreate.value || '').trim();

    const ok = await createItem(name, qty, category_id);
    if (ok) {
      $('name').value = '';
      $('qty').value = '0';

      // Para que el usuario vea lo recién creado: filtramos por esa categoría.
      catFilter.value = category_id;
      await loadItems();
    }
  });

  $('reload').addEventListener('click', loadItems);
  catFilter.addEventListener('change', loadItems);

  // init
  (async () => {
    await loadCategories();
    await loadItems();
  })();
})();

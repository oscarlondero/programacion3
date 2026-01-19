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
  const showInactive = $('showInactive');
  const status = $('status');

  let CATS = [];
  let CURRENT_ITEMS = [];

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

  function boolLabel(v) {
    return (Number(v) === 1) ? 'Sí' : 'No';
  }

  function render(items) {
    tbody.innerHTML = '';
    for (const it of (items || [])) {
      const tr = document.createElement('tr');
      const inactive = Number(it.is_active) !== 1;
      tr.dataset.id = String(it.id);
      tr.innerHTML = `
        <td>${it.id}</td>
        <td>${escapeHtml(it.category_name || '')}</td>
        <td>${escapeHtml(it.name || '')}</td>
        <td>${it.qty}</td>
        <td>${boolLabel(it.is_active)}</td>
        <td>${escapeHtml(it.created_at || '')}</td>
        <td>
          <button type="button" data-act="edit">Editar</button>
          <button type="button" data-act="del">Eliminar</button>
        </td>
      `;
      if (inactive) {
        tr.style.opacity = '0.55';
      }
      tbody.appendChild(tr);
    }
  }

  function buildCategoryOptions(selectedId) {
    let html = '';
    for (const c of CATS) {
      const id = String(c.id);
      const sel = (String(selectedId) === id) ? 'selected' : '';
      html += `<option value="${escapeHtml(id)}" ${sel}>${escapeHtml(c.name)}</option>`;
    }
    return html;
  }

  function startEditRow(id) {
    clearErrors();
    const it = CURRENT_ITEMS.find(x => Number(x.id) === Number(id));
    if (!it) return;

    const tr = tbody.querySelector(`tr[data-id="${CSS.escape(String(id))}"]`);
    if (!tr) return;

    tr.innerHTML = `
      <td>${it.id}</td>
      <td>
        <select data-fld="category_id" style="padding:7px 10px;border:1px solid #ccc;border-radius:8px;min-width:180px;">
          ${buildCategoryOptions(it.category_id)}
        </select>
      </td>
      <td><input data-fld="name" value="${escapeHtml(it.name || '')}" style="min-width:180px;" /></td>
      <td><input data-fld="qty" value="${escapeHtml(it.qty)}" style="min-width:90px;" /></td>
      <td>${boolLabel(it.is_active)}</td>
      <td>${escapeHtml(it.created_at || '')}</td>
      <td>
        <button type="button" data-act="save">Guardar</button>
        <button type="button" data-act="cancel">Cancelar</button>
      </td>
    `;
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

    CATS = data.categories || [];

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

    for (const c of CATS) {
      const opt1 = document.createElement('option');
      opt1.value = String(c.id);
      opt1.textContent = String(c.name);
      catCreate.appendChild(opt1);

      const opt2 = document.createElement('option');
      opt2.value = String(c.id);
      opt2.textContent = String(c.name);
      catFilter.appendChild(opt2);
    }

    if (CATS.length) {
      catCreate.value = String(CATS[0].id);
    }

    setStatus('');
  }

  function withAllParam(url) {
    return showInactive.checked ? `${url}${url.includes('?') ? '&' : '?'}all=1` : url;
  }

  async function loadItems() {
    clearErrors();
    setStatus('Cargando items...');

    const catId = String(catFilter.value || '0');
    const baseUrl = (catId === '0') ? API_ITEMS : `${API_CATS}/${encodeURIComponent(catId)}/items`;
    const url = withAllParam(baseUrl);

    const res = await fetch(url, { headers: { 'Accept': 'application/json' } });
    const data = await res.json().catch(() => ({}));

    setStatus('');
    if (!res.ok || !data.ok) {
      showErrors(data.errors || { api: 'No se pudo cargar el listado.' });
      return;
    }

    CURRENT_ITEMS = data.items || [];
    render(CURRENT_ITEMS);
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

  async function updateItem(id, payload) {
    clearErrors();
    setStatus('Actualizando...');
    try {
      const res = await fetch(`${API_ITEMS}/${encodeURIComponent(String(id))}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(payload)
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        showErrors(data.errors || { api: data.err || 'No se pudo actualizar.' });
        return false;
      }
      return true;
    } finally {
      setStatus('');
    }
  }

  async function deleteItem(id) {
    clearErrors();
    setStatus('Eliminando...');
    try {
      const res = await fetch(`${API_ITEMS}/${encodeURIComponent(String(id))}`, {
        method: 'DELETE',
        headers: { 'Accept': 'application/json' }
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        showErrors(data.errors || { api: data.err || 'No se pudo eliminar.' });
        return false;
      }
      return true;
    } finally {
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

  tbody.addEventListener('click', async (e) => {
    const target = e.target;
    if (!(target instanceof HTMLElement)) return;
    const act = target.getAttribute('data-act');
    if (!act) return;

    const tr = target.closest('tr');
    if (!tr) return;
    const id = tr.getAttribute('data-id');
    if (!id) return;

    if (act === 'edit') {
      startEditRow(id);
      return;
    }

    if (act === 'cancel') {
      await loadItems();
      return;
    }

    if (act === 'save') {
      const nameEl = tr.querySelector('[data-fld="name"]');
      const qtyEl  = tr.querySelector('[data-fld="qty"]');
      const catEl  = tr.querySelector('[data-fld="category_id"]');
      const payload = {
        name: String(nameEl?.value || '').trim(),
        qty: String(qtyEl?.value || '').trim(),
        category_id: String(catEl?.value || '').trim(),
      };
      const ok = await updateItem(id, payload);
      if (ok) await loadItems();
      return;
    }

    if (act === 'del') {
      if (!confirm('¿Eliminar este item? (soft delete)')) return;
      const ok = await deleteItem(id);
      if (ok) await loadItems();
      return;
    }
  });

  $('reload').addEventListener('click', loadItems);
  catFilter.addEventListener('change', loadItems);
  showInactive.addEventListener('change', loadItems);

  // init
  (async () => {
    await loadCategories();
    await loadItems();
  })();
})();

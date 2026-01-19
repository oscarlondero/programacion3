const $ = (id) => document.getElementById(id);

function setLoading(on){
  $('loading').style.display = on ? 'block' : 'none';
}

function showErrors(errors){
  if (!errors) { $('errs').innerHTML = ''; return; }
  const lines = Object.entries(errors).map(([k,v]) => `<div><strong>${k}:</strong> ${v}</div>`);
  $('errs').innerHTML = lines.join('');
}

function showMsg(text, ok=true){
  $('msg').innerHTML = text ? `<div class="${ok ? 'ok' : 'err'}">${text}</div>` : '';
}

async function loadItems(){
  setLoading(true);
  try {
    const res = await fetch('api/items', { headers: { 'Accept':'application/json' } });
    const data = await res.json();
    if (!res.ok) {
      $('list').innerHTML = `<div class="err">Error al listar</div>`;
      return;
    }
    const items = data.items || [];
    if (!items.length) {
      $('list').innerHTML = `<div class="muted">Sin resultados</div>`;
      return;
    }
    $('list').innerHTML = items.map(it => (
      `<div class="pill">#${it.id} — ${it.name} (qty: ${it.qty})</div>`
    )).join('<div style="height:8px"></div>');
  } finally {
    setLoading(false);
  }
}

async function loadStats(){
  // TODO PARCIAL: traer GET api/items/stats y renderizar count y total_qty en el div #stats
  // Debe mostrar algo como: "Items: X" y "Total qty: Y".
}

$('frm').addEventListener('submit', async (ev) => {
  ev.preventDefault();
  showMsg('');
  showErrors(null);

  const payload = {
    name: String($('name').value || ''),
    qty: String($('qty').value || '')
  };

  const res = await fetch('api/items', {
    method: 'POST',
    headers: { 'Content-Type':'application/json', 'Accept':'application/json' },
    body: JSON.stringify(payload)
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    // Debe mostrar errores de validación, incluyendo el duplicado (TODO PARCIAL en backend)
    showErrors(data.errors || { general: 'Error al guardar' });
    return;
  }

  $('name').value = '';
  $('qty').value = '';
  showMsg('Guardado correctamente', true);

  await loadItems();
  await loadStats();
});

// init
loadItems();
loadStats();

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

async function loadLatest(){
  // TODO RECUP: consumir GET api/items/latest?limit=5 y renderizar el listado
  // Puede reemplazar el listado actual o mostrarlo como "modo últimos".
}

$('btnLatest').addEventListener('click', async () => {
  showMsg('');
  showErrors(null);
  await loadLatest();
});

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
    // Debe mostrar errores de validación, incluyendo name con números (TODO RECUP en backend)
    showErrors(data.errors || { general: 'Error al guardar' });
    return;
  }

  $('name').value = '';
  $('qty').value = '';
  showMsg('Guardado correctamente', true);

  await loadItems();
});

// init
loadItems();

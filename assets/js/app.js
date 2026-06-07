// NexoCreator app · flujo Supabase limpio
const STATUS = {
  DRAFT: 'BORRADOR',
  REVIEW: 'EN_REVISION',
  VALIDATED: 'VALIDADA',
  SENT: 'ENVIADA_A_ACUARIONEXO'
};

const CATEGORY_TREE = {
  pez_marino: {
    icon: '🐟',
    label: 'Pez marino',
    description: 'Ficha de especie marina: portada, foto real, datos de acuario, parámetros, alimentación, compatibilidad y salud.',
    sections: [
      ['summary', 'Resumen rápido', 'Qué es, dificultad, tamaño, litros orientativos y comportamiento general.'],
      ['identity', 'Identificación', 'Nombre común, nombre científico, familia, género, origen, distribución y disponibilidad.'],
      ['habitat', 'Hábitat natural', 'Zona geográfica, profundidad, arrecife, refugios, asociación con otras especies y esperanza de vida.'],
      ['aquarium', 'Acuario recomendado', 'Litros mínimos, litros recomendados, zona de nado, refugios, tapa, flujo, luz y madurez del acuario.'],
      ['parameters', 'Parámetros', 'Temperatura, salinidad, pH, KH, NO3, PO4, oxígeno y observaciones.'],
      ['behavior', 'Comportamiento', 'Temperamento, agresividad, territorialidad, actividad, pareja/grupo y señales de estrés.'],
      ['feeding', 'Alimentación', 'Dieta, alimentos aceptados, frecuencia, plan semanal base y riesgos por mala alimentación.'],
      ['compatibility', 'Compatibilidad', 'Compatible, precaución, incompatible y reglas con misma especie o especies similares.'],
      ['reef_safe', 'Reef Safe', 'Riesgo para corales blandos, LPS, SPS, gambas, caracoles, almejas e invertebrados.'],
      ['health', 'Salud y enfermedades', 'Síntomas de alerta, enfermedades frecuentes, prevención, cuarentena y sensibilidad a tratamientos.'],
      ['purchase', 'Antes de comprar', 'Qué revisar, señales de ejemplar sano/enfermo y riesgos de compra.'],
      ['mistakes', 'Errores frecuentes', 'Errores típicos de mantenimiento, compatibilidad, alimentación o compra.'],
      ['curiosities', 'Curiosidades', 'Reproducción, comportamiento curioso e información interesante.'],
      ['sources', 'Fuentes', 'Fuentes usadas y notas de revisión.']
    ]
  },
  pez_dulce: {
    icon: '🐠',
    label: 'Pez dulce',
    description: 'Ficha de especie dulce: acuario, parámetros, comportamiento, alimentación, compatibilidad y reproducción.',
    sections: [
      ['summary', 'Resumen rápido', 'Qué es, dificultad, tamaño, litros orientativos y comportamiento general.'],
      ['identity', 'Identificación', 'Nombre común, nombre científico, familia, género, origen y variedad.'],
      ['habitat', 'Hábitat natural', 'Río, lago, zona de nado, corriente, plantas, raíces, sustrato y distribución.'],
      ['aquarium', 'Acuario recomendado', 'Litros mínimos, grupo mínimo, decoración, plantas, refugios, sustrato y filtración.'],
      ['parameters', 'Parámetros', 'Temperatura, pH, GH, KH, NO2, NO3 y observaciones.'],
      ['behavior', 'Comportamiento', 'Temperamento, grupo/cardumen/pareja, territorialidad, zona de nado y estrés.'],
      ['feeding', 'Alimentación', 'Dieta, alimento seco, congelado, vivo, vegetal, frecuencia y plan semanal.'],
      ['compatibility', 'Compatibilidad', 'Compatible, precaución, incompatible y reglas por tamaño o carácter.'],
      ['breeding', 'Reproducción', 'Tipo de reproducción, puesta, cuidados, cría y riesgos.'],
      ['health', 'Salud y enfermedades', 'Síntomas, enfermedades frecuentes, prevención y cuarentena.'],
      ['purchase', 'Antes de comprar', 'Qué revisar en tienda y señales de ejemplar sano/enfermo.'],
      ['mistakes', 'Errores frecuentes', 'Errores habituales de parámetros, mezcla de especies o volumen.'],
      ['curiosities', 'Curiosidades', 'Datos interesantes.'],
      ['sources', 'Fuentes', 'Fuentes usadas y notas de revisión.']
    ]
  },
  coral: {
    icon: '🪸',
    label: 'Coral',
    description: 'Ficha de coral: luz, flujo, ubicación, alimentación, agresividad, crecimiento y compatibilidad reef.',
    sections: [
      ['summary', 'Resumen rápido', 'Tipo de coral, dificultad, crecimiento, coloración y uso en reef.'],
      ['identity', 'Identificación', 'Nombre común, nombre científico, familia, tipo y morfología.'],
      ['habitat', 'Hábitat natural', 'Zona de arrecife, profundidad, flujo natural y distribución.'],
      ['aquarium', 'Acuario recomendado', 'Madurez del acuario, ubicación, espacio, estabilidad y requisitos generales.'],
      ['parameters', 'Parámetros', 'Temperatura, salinidad, pH, KH, Ca, Mg, NO3, PO4 y oligoelementos.'],
      ['lighting', 'Iluminación', 'PAR recomendado, intensidad, fotoperiodo y aclimatación a luz.'],
      ['flow', 'Flujo', 'Bajo/medio/alto, tipo de movimiento y señales de flujo incorrecto.'],
      ['placement', 'Ubicación', 'Arena/roca, altura, distancia de otros corales y riesgo de quemaduras.'],
      ['feeding', 'Alimentación', 'Fotosíntesis, alimentación directa, partículas, frecuencia y respuesta.'],
      ['compatibility', 'Compatibilidad', 'Compatibilidad con peces, invertebrados y otros corales.'],
      ['reef_safe', 'Riesgo reef', 'Agresividad, tentáculos, toxinas, guerra química y manipulación.'],
      ['health', 'Salud y problemas', 'Retracción, blanqueo, necrosis, plagas y señales de alerta.'],
      ['purchase', 'Antes de comprar', 'Qué revisar en pólipos, tejido, base y plagas.'],
      ['mistakes', 'Errores frecuentes', 'Errores de luz, flujo, ubicación, parámetros y mezclas.'],
      ['curiosities', 'Curiosidades', 'Crecimiento, reproducción, variedades y datos útiles.'],
      ['sources', 'Fuentes', 'Fuentes usadas y notas de revisión.']
    ]
  },
  invertebrado: {
    icon: '🦐',
    label: 'Invertebrado',
    description: 'Ficha de gamba, caracol, cangrejo, erizo u otros invertebrados.',
    sections: [
      ['summary', 'Resumen rápido', 'Qué es, función en el acuario, dificultad y comportamiento.'],
      ['identity', 'Identificación', 'Nombre común, nombre científico, grupo, origen y tamaño.'],
      ['habitat', 'Hábitat natural', 'Distribución, zona del arrecife/río, refugios y actividad.'],
      ['aquarium', 'Acuario recomendado', 'Litros, refugios, sustrato, roca, tapa, madurez y estabilidad.'],
      ['parameters', 'Parámetros', 'Temperatura, salinidad o dureza, pH, KH, NO3, PO4, cobre y sensibilidad.'],
      ['behavior', 'Comportamiento', 'Actividad, territorialidad, hábitos nocturnos y relación con otros animales.'],
      ['feeding', 'Alimentación', 'Dieta, algas, restos, comida específica, frecuencia y riesgos.'],
      ['compatibility', 'Compatibilidad', 'Compatible, precaución, incompatible y riesgo con peces/corales.'],
      ['reef_safe', 'Reef Safe', 'Riesgo para corales, almejas, caracoles, gambas y otros invertebrados.'],
      ['health', 'Salud y muda', 'Muda, sensibilidad a cobre, aclimatación, estrés y señales de problema.'],
      ['purchase', 'Antes de comprar', 'Qué revisar antes de comprar y señales de ejemplar sano/enfermo.'],
      ['mistakes', 'Errores frecuentes', 'Errores de aclimatación, cobre, hambre, depredadores o mezcla.'],
      ['curiosities', 'Curiosidades', 'Comportamientos y datos interesantes.'],
      ['sources', 'Fuentes', 'Fuentes usadas y notas de revisión.']
    ]
  },
  planta: {
    icon: '🌿',
    label: 'Planta',
    description: 'Ficha de planta acuática: luz, CO2, nutrientes, sustrato, poda y compatibilidad.',
    sections: [
      ['summary', 'Resumen rápido', 'Tipo de planta, dificultad, crecimiento y uso en el acuario.'],
      ['identity', 'Identificación', 'Nombre común, nombre científico, familia, forma y origen.'],
      ['habitat', 'Hábitat natural', 'Zona natural, emergida/sumergida, corriente y distribución.'],
      ['aquarium', 'Acuario recomendado', 'Zona de plantado, sustrato, altura, colocación y requisitos.'],
      ['parameters', 'Parámetros', 'Temperatura, pH, GH, KH, NO3, PO4, Fe y nutrientes.'],
      ['lighting', 'Iluminación', 'Luz baja/media/alta, fotoperiodo y señales de falta/exceso.'],
      ['co2', 'CO2 y nutrientes', 'Necesidad de CO2, abonado, hierro, macros, micros y carencias.'],
      ['maintenance', 'Poda y mantenimiento', 'Poda, propagación, limpieza y control de crecimiento.'],
      ['compatibility', 'Compatibilidad', 'Compatibilidad con peces, gambas, caracoles y herbívoros.'],
      ['health', 'Problemas frecuentes', 'Algas, hojas transparentes, agujeros, amarilleo y derretimiento.'],
      ['purchase', 'Antes de comprar', 'Estado de hojas, raíces, cultivo in vitro/maceta y plagas.'],
      ['mistakes', 'Errores frecuentes', 'Errores de luz, CO2, nutrientes, plantado y mantenimiento.'],
      ['curiosities', 'Curiosidades', 'Datos útiles y crecimiento.'],
      ['sources', 'Fuentes', 'Fuentes usadas y notas de revisión.']
    ]
  },
  microfauna: {
    icon: '🧫',
    label: 'Microfauna',
    description: 'Ficha de artemia, copépodos, rotíferos, fitoplancton u otros cultivos.',
    sections: [
      ['summary', 'Resumen rápido', 'Qué cultivo es, utilidad, dificultad y uso principal.'],
      ['identity', 'Identificación', 'Nombre común, nombre científico/grupo, tipo de cultivo y uso.'],
      ['culture', 'Cultivo', 'Recipiente, litros, aireación, densidad, cosecha y reinicio.'],
      ['parameters', 'Parámetros', 'Temperatura, salinidad, luz, pH y calidad del agua.'],
      ['feeding', 'Alimentación del cultivo', 'Fito, levadura, alimento específico, dosis y frecuencia.'],
      ['maintenance', 'Mantenimiento', 'Limpieza, cambios, separación, cosecha y reposición.'],
      ['use', 'Uso en acuario', 'Dosis, especies beneficiadas, frecuencia y riesgos.'],
      ['problems', 'Problemas frecuentes', 'Contaminación, colapso, olor, baja densidad y soluciones.'],
      ['mistakes', 'Errores frecuentes', 'Errores de luz, comida, higiene, densidad o salinidad.'],
      ['sources', 'Fuentes', 'Fuentes usadas y notas de revisión.']
    ]
  },
  medicamento: {
    icon: '💊',
    label: 'Medicamento',
    description: 'Ficha clínica de producto o tratamiento: uso, dosis, compatibilidad, riesgos y retirada.',
    sections: [
      ['summary', 'Resumen rápido', 'Para qué sirve, uso principal, tipo de acuario y advertencias.'],
      ['identity', 'Identificación', 'Nombre comercial, principio activo, fabricante, formato y concentración.'],
      ['uses', 'Usos indicados', 'Enfermedades/síntomas para los que se usa y contexto.'],
      ['dose', 'Dosis', 'Dosis por litro, unidad, duración, repetición y volumen base.'],
      ['compatibility', 'Compatibilidad', 'Display/hospital/cuarentena, peces, corales, gambas, caracoles, bacterias y plantas.'],
      ['remove', 'Retirar durante tratamiento', 'Carbón, UV, ozono, skimmer, resinas y cambios de agua.'],
      ['risks', 'Riesgos y advertencias', 'Sobredosis, incompatibilidades, sensibilidad y test necesarios.'],
      ['aftercare', 'Después del tratamiento', 'Cambios de agua, carbón, seguimiento y recuperación.'],
      ['inventory_logic', 'Lógica AcuarioNexo', 'Cómo calcular dosis con litros reales y cuándo pedir confirmación.'],
      ['sources', 'Fuentes', 'Ficha oficial, prospecto, fabricante y fecha de revisión.']
    ]
  },
  sal: {
    icon: '🧂',
    label: 'Sal',
    description: 'Ficha de sal o mezcla: parámetros objetivo, dosis, preparación y verificación.',
    sections: [
      ['summary', 'Resumen rápido', 'Tipo de sal, uso principal y acuario recomendado.'],
      ['identity', 'Identificación', 'Marca, producto, formato, lote si procede y fabricante.'],
      ['parameters', 'Parámetros declarados', 'Salinidad de referencia, KH, Ca, Mg, K, trazas y valores oficiales.'],
      ['mixing', 'Preparación', 'Gramos por litro, tiempo de mezcla, temperatura, aireación y reposo.'],
      ['use', 'Uso recomendado', 'Cambios de agua, arranque, reef, peces, SPS/LPS/blandos.'],
      ['risks', 'Riesgos y errores', 'Precipitación, mezcla incorrecta, humedad, variaciones y almacenamiento.'],
      ['sources', 'Fuentes', 'Fuente oficial del fabricante y fecha de revisión.']
    ]
  },
  alimento: {
    icon: '🍽️',
    label: 'Alimento',
    description: 'Ficha de alimento: tipo, especies objetivo, frecuencia, dosis y conservación.',
    sections: [
      ['summary', 'Resumen rápido', 'Tipo de alimento, uso y especies objetivo.'],
      ['identity', 'Identificación', 'Marca, producto, formato, tamaño de grano y composición.'],
      ['nutrition', 'Composición', 'Proteína, grasa, fibra, humedad, vitaminas y aditivos.'],
      ['use', 'Uso recomendado', 'Frecuencia, cantidad, especies y momento del día.'],
      ['compatibility', 'Compatibilidad', 'Peces, corales, invertebrados, alevines o cultivos.'],
      ['risks', 'Riesgos', 'Sobrealimentación, fosfatos, nitratos, caducidad y conservación.'],
      ['acuarionexo_plan', 'Plan AcuarioNexo', 'Cómo usarlo en calendarios semanales según habitantes reales.'],
      ['sources', 'Fuentes', 'Fuente oficial y fecha de revisión.']
    ]
  },
  equipamiento: {
    icon: '⚙️',
    label: 'Equipamiento',
    description: 'Ficha de equipo: uso, especificaciones, instalación, mantenimiento y compatibilidad.',
    sections: [
      ['summary', 'Resumen rápido', 'Qué es, para qué sirve y acuario recomendado.'],
      ['identity', 'Identificación', 'Marca, modelo, categoría, potencia y fabricante.'],
      ['specs', 'Especificaciones', 'Medidas, consumo, caudal, volumen recomendado y datos técnicos.'],
      ['installation', 'Instalación', 'Dónde colocarlo, conexión, seguridad y configuración inicial.'],
      ['maintenance', 'Mantenimiento', 'Limpieza, recambios, frecuencia y señales de fallo.'],
      ['compatibility', 'Compatibilidad', 'Acuarios, sump, agua dulce/marina, controladores y accesorios.'],
      ['risks', 'Riesgos y errores', 'Fallos habituales, sobredimensión, ruido, calor y seguridad.'],
      ['sources', 'Fuentes', 'Manual, ficha oficial y fecha de revisión.']
    ]
  }
};

let current = null;

const supa = window.supabase.createClient(
  window.ACUARIONEXO_CONFIG.SUPABASE_URL,
  window.ACUARIONEXO_CONFIG.SUPABASE_KEY
);

function $(id) {
  return document.getElementById(id);
}

function hideAll() {
  ['home', 'newMenu', 'editor', 'list', 'preview', 'authPanel'].forEach(function(id) {
    const el = $(id);
    if (el) el.classList.add('hidden');
  });
}

function escapeHtml(value) {
  return String(value || '').replace(/[&<>"]/g, function(match) {
    return {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;'
    }[match];
  });
}

function labelStatus(value) {
  return {
    BORRADOR: 'Borrador',
    EN_REVISION: 'En revisión',
    VALIDADA: 'Validada',
    ENVIADA_A_ACUARIONEXO: 'Enviada a AcuarioNexo'
  }[value] || value || 'Borrador';
}

function labelCat(value) {
  return (CATEGORY_TREE[value] && CATEGORY_TREE[value].label) || value || 'Sin categoría';
}

function categoryDef(value) {
  return CATEGORY_TREE[value] || CATEGORY_TREE.pez_marino;
}

function sectionKeys(category) {
  return categoryDef(category).sections.map(function(item) { return item[0]; });
}

function defaultSections(category) {
  const sections = {};
  sectionKeys(category).forEach(function(key) { sections[key] = ''; });
  return sections;
}

function normalizeSections(draft) {
  draft.sections = draft.sections || {};
  defaultSections(draft.category || 'pez_marino');
  sectionKeys(draft.category || 'pez_marino').forEach(function(key) {
    if (typeof draft.sections[key] === 'undefined') draft.sections[key] = '';
  });
  return draft;
}

function normalizeDraft(draft) {
  draft = draft || {};
  draft.id = draft.id || (crypto.randomUUID ? crypto.randomUUID() : String(Date.now()));
  draft.status = draft.status || STATUS.DRAFT;
  draft.category = draft.category || 'pez_marino';
  draft.common_name = draft.common_name || draft.commonName || '';
  draft.scientific_name = draft.scientific_name || draft.scientificName || '';
  draft.cover_image = draft.cover_image || draft.coverImage || '';
  draft.species_photo = draft.species_photo || draft.speciesPhoto || '';
  draft.created_at = draft.created_at || new Date().toISOString();
  draft.updated_at = draft.updated_at || new Date().toISOString();
  draft.sections = draft.sections || defaultSections(draft.category);
  return normalizeSections(draft);
}

function rowToDraft(row) {
  const base = normalizeDraft(row && row.ficha_json ? row.ficha_json : {});
  if (row) {
    base.id = row.id || base.id;
    base.status = row.status || base.status;
    base.category = row.category || base.category;
    base.common_name = row.common_name || base.common_name;
    base.scientific_name = row.scientific_name || base.scientific_name;
    base.cover_image = row.cover_image || base.cover_image || '';
    base.created_at = row.created_at || base.created_at;
    base.updated_at = row.updated_at || base.updated_at;
  }
  return normalizeSections(base);
}

function newDraft(category) {
  return normalizeDraft({
    category: category || 'pez_marino',
    sections: defaultSections(category || 'pez_marino')
  });
}

function goHome() {
  hideAll();
  if ($('home')) $('home').classList.remove('hidden');
  updateAuthStatus();
}

function showNew() {
  hideAll();
  const menu = $('newMenu');
  if (!menu) return;
  let html = '<h2>Nueva ficha</h2>';
  html += '<p class="muted">Elige el tipo de ficha. Cada tipo abre sus propios apartados.</p>';
  html += '<div class="categoryGrid">';
  Object.keys(CATEGORY_TREE).forEach(function(key) {
    const def = CATEGORY_TREE[key];
    html += '' +
      '<button class="templateButton" onclick="openEditor(newDraft(\'' + key + '\'))">' +
        '<span class="templateIcon">' + def.icon + '</span>' +
        '<span class="templateTitle">' + escapeHtml(def.label) + '</span>' +
        '<span class="templateText">' + escapeHtml(def.description) + '</span>' +
      '</button>';
  });
  html += '</div>';
  html += '<button class="small" onclick="goHome()">← Volver</button>';
  menu.innerHTML = html;
  menu.classList.remove('hidden');
}

function readFile(file) {
  return new Promise(function(resolve, reject) {
    const reader = new FileReader();
    reader.onload = function() { resolve(reader.result); };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

async function startFromPhoto(ev) {
  const file = ev.target.files[0];
  if (!file) return;
  const draft = newDraft('pez_marino');
  draft.cover_image = await readFile(file);
  openEditor(draft);
  ev.target.value = '';
}

function renderImageBox(id, value, emptyText, alt) {
  const box = $(id);
  if (!box) return;
  box.innerHTML = value
    ? '<img class="cover" src="' + value + '" alt="' + escapeHtml(alt) + '">'
    : '<div class="placeholder">' + escapeHtml(emptyText) + '</div>';
}

function renderCover() {
  renderImageBox('coverBox', current && current.cover_image, 'Sin foto de portada', 'portada');
}

function renderSpeciesPhoto() {
  renderImageBox('speciesPhotoBox', current && current.species_photo, 'Sin foto real de la especie/producto', 'foto real');
}

function renderSectionFields() {
  const container = $('sectionFields');
  if (!container || !current) return;
  const def = categoryDef(current.category);
  const s = current.sections || {};
  let html = '<div class="sectionIntro"><strong>Apartados de ' + escapeHtml(def.label) + '</strong><p class="muted">Rellena los bloques. En la ficha final se verán como desplegables.</p></div>';
  def.sections.forEach(function(item) {
    const key = item[0];
    const title = item[1];
    const help = item[2] || '';
    html += '' +
      '<details class="editorBlock" open>' +
        '<summary>' + escapeHtml(title) + '</summary>' +
        (help ? '<p class="muted">' + escapeHtml(help) + '</p>' : '') +
        '<textarea id="section_' + key + '" placeholder="' + escapeHtml(title) + '">' + escapeHtml(s[key] || '') + '</textarea>' +
      '</details>';
  });
  container.innerHTML = html;
}

function openEditor(draft) {
  current = normalizeDraft(draft);
  window.current = current;
  hideAll();
  $('editor').classList.remove('hidden');
  $('category').value = current.category || 'pez_marino';
  $('commonName').value = current.common_name || '';
  $('scientificName').value = current.scientific_name || '';
  renderCover();
  renderSpeciesPhoto();
  renderSectionFields();
}

function changeCategory() {
  if (!current) current = newDraft($('category').value);
  current = collect(false);
  current.category = $('category').value;
  current.sections = Object.assign(defaultSections(current.category), current.sections || {});
  window.current = current;
  renderSectionFields();
}

async function replaceCover(ev) {
  const file = ev.target.files[0];
  if (!file || !current) return;
  current.cover_image = await readFile(file);
  window.current = current;
  renderCover();
  ev.target.value = '';
}

async function replaceSpeciesPhoto(ev) {
  const file = ev.target.files[0];
  if (!file || !current) return;
  current.species_photo = await readFile(file);
  window.current = current;
  renderSpeciesPhoto();
  ev.target.value = '';
}

function removeCover() {
  if (!current) return;
  current.cover_image = '';
  window.current = current;
  renderCover();
}

function removeSpeciesPhoto() {
  if (!current) return;
  current.species_photo = '';
  window.current = current;
  renderSpeciesPhoto();
}

function collect(updateTime) {
  if (!current) current = newDraft($('category') ? $('category').value : 'pez_marino');
  current = normalizeDraft(current);
  current.status = current.status || STATUS.DRAFT;
  current.category = $('category').value;
  current.common_name = $('commonName').value.trim();
  current.scientific_name = $('scientificName').value.trim();
  if (updateTime !== false) current.updated_at = new Date().toISOString();
  const sections = Object.assign({}, current.sections || {});
  sectionKeys(current.category).forEach(function(key) {
    const field = $('section_' + key);
    sections[key] = field ? field.value : (sections[key] || '');
  });
  current.sections = sections;
  window.current = current;
  return current;
}

async function all() {
  const result = await supa
    .from('fichas_creator')
    .select('*')
    .neq('status', STATUS.SENT)
    .order('updated_at', { ascending: false });

  if (result.error) {
    console.error('Error leyendo fichas_creator:', result.error);
    alert('No se pudieron cargar las fichas: ' + (result.error.message || JSON.stringify(result.error)));
    return [];
  }

  return (result.data || []).map(rowToDraft).filter(function(draft) {
    return draft.status !== STATUS.SENT;
  });
}

async function saveFicha(draft) {
  draft = normalizeDraft(draft);
  const payload = {
    id: draft.id,
    status: draft.status || STATUS.DRAFT,
    category: draft.category || '',
    common_name: draft.common_name || '',
    scientific_name: draft.scientific_name || '',
    cover_image: draft.cover_image || '',
    ficha_json: draft,
    created_at: draft.created_at || new Date().toISOString(),
    updated_at: new Date().toISOString()
  };

  const result = await supa
    .from('fichas_creator')
    .upsert(payload, { onConflict: 'id' });

  if (result.error) {
    console.error('Error guardando ficha:', result.error);
    alert('No se pudo guardar la ficha: ' + (result.error.message || JSON.stringify(result.error)));
    return null;
  }
  return draft;
}

async function saveDraft() {
  const draft = collect();
  const saved = await saveFicha(draft);
  if (saved) alert('Ficha guardada');
}

async function saveDraftAndShowList() {
  const draft = collect();
  const saved = await saveFicha(draft);
  if (saved) await showList();
}

function finalSpeciesPhoto(draft) {
  return draft.species_photo || draft.speciesPhoto ||
    (draft.media && (draft.media.species_photo || draft.media.speciesPhoto)) ||
    (draft.images && (draft.images.species_photo || draft.images.speciesPhoto)) || '';
}

function finalSection(title, content) {
  if (!content) return '';
  return '<details class="section fichaFinalSection" open><summary>' + escapeHtml(title) + '</summary><p>' + escapeHtml(content).replace(/\n/g, '<br>') + '</p></details>';
}

function renderFichaFinal(draft) {
  draft = normalizeDraft(draft);
  const s = draft.sections || {};
  const def = categoryDef(draft.category);
  const speciesPhoto = finalSpeciesPhoto(draft);
  let html = '<article class="fichaFinal">';
  html += draft.cover_image ? '<img class="cover" src="' + draft.cover_image + '" alt="portada de ficha">' : '<div class="placeholder">Sin foto de portada</div>';
  html += speciesPhoto ? '<img class="cover speciesPhotoFinal" src="' + speciesPhoto + '" alt="foto real de la especie o producto">' : '';
  html += '<h1>' + escapeHtml(draft.common_name || 'Ficha sin nombre') + '</h1>';
  html += '<div class="scientific">' + escapeHtml(draft.scientific_name || '') + '</div>';
  html += '<p class="muted">' + escapeHtml(labelCat(draft.category)) + ' · Estado: ' + escapeHtml(labelStatus(draft.status)) + '</p>';
  def.sections.forEach(function(item, index) {
    const key = item[0];
    const title = item[1];
    if (index === 0) html += finalSection(title, s[key]);
    else html += finalSection(title, s[key]);
  });
  html += '</article>';
  return html;
}

function transitionButtons(draft) {
  if (draft.status === STATUS.SENT) return '<button class="small" disabled>✅ Ya enviada a AcuarioNexo</button>';
  return '<button class="primary" onclick="sendToAcuarioNexo()">📲 Pasar a AcuarioNexo</button>';
}

async function openFinalById(id) {
  const result = await supa
    .from('fichas_creator')
    .select('*')
    .eq('id', id)
    .limit(1);

  const row = (result.data || [])[0];
  if (result.error || !row) {
    alert('No se pudo abrir la ficha: ' + ((result.error && result.error.message) || 'sin datos'));
    return;
  }

  const draft = rowToDraft(row);
  current = draft;
  window.current = draft;
  hideAll();
  $('preview').innerHTML =
    '<button class="small" onclick="showList()">← Mis fichas</button>' +
    renderFichaFinal(draft) +
    '<button class="primary" onclick="openEditor(window.current)">✏️ Editar ficha</button>' +
    transitionButtons(draft) +
    '<button class="small danger" onclick="deleteFicha(\'' + draft.id + '\')">🗑️ Borrar</button>';
  $('preview').classList.remove('hidden');
}

async function showList() {
  hideAll();
  $('list').innerHTML = '<h2>Mis fichas</h2><p class="muted">Cargando...</p>';
  $('list').classList.remove('hidden');

  const arr = await all();
  let html = '<h2>Mis fichas</h2>';
  if (!arr.length) html += '<p class="muted">Aún no hay fichas guardadas.</p>';

  arr.forEach(function(f) {
    const cover = f.cover_image
      ? '<img class="listCover" src="' + f.cover_image + '" alt="portada">'
      : '<div class="listCoverEmpty">Sin portada</div>';

    html += '' +
      '<div class="listItem">' +
        '<div onclick="openFinalById(\'' + f.id + '\')">' +
          cover +
          '<div class="listBody">' +
            '<h3>' + escapeHtml(f.common_name || 'Sin nombre') + '</h3>' +
            '<p class="muted">' + escapeHtml(f.scientific_name || '') + '</p>' +
            '<p class="muted">' + escapeHtml(labelCat(f.category)) + ' · ' + escapeHtml(labelStatus(f.status)) + '</p>' +
            '<button class="primary small" onclick="event.stopPropagation();openFinalById(\'' + f.id + '\')">Ver ficha final</button>' +
            '<button class="small danger" onclick="event.stopPropagation();deleteFicha(\'' + f.id + '\')">🗑️ Borrar</button>' +
          '</div>' +
        '</div>' +
      '</div>';
  });

  html += '<button class="small" onclick="goHome()">← Volver</button>';
  $('list').innerHTML = html;
}

function showPreview() {
  const draft = collect();
  hideAll();
  $('preview').innerHTML =
    '<button class="small" onclick="openEditor(window.current)">← Editar</button>' +
    renderFichaFinal(draft) +
    transitionButtons(draft);
  $('preview').classList.remove('hidden');
}

function exportCurrent() {
  const draft = collect();
  const blob = new Blob([JSON.stringify(draft, null, 2)], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = (draft.common_name || 'ficha').toLowerCase().replace(/[^a-z0-9áéíóúñ]+/gi, '-') + '.json';
  link.click();
  URL.revokeObjectURL(link.href);
}

function libraryCategory(value) {
  return {
    pez_marino: 'fish',
    pez_dulce: 'fish',
    coral: 'coral',
    invertebrado: 'invertebrate',
    planta: 'plant',
    microfauna: 'other',
    sal: 'other',
    medicamento: 'other',
    alimento: 'other',
    equipamiento: 'other'
  }[value] || value || 'other';
}

async function sendToAcuarioNexo() {
  const draft = (window.current && window.current.id) ? normalizeDraft(window.current) : collect();
  const s = draft.sections || {};
  const title = draft.common_name || draft.scientific_name || '';

  if (!title) {
    alert('Pon al menos un nombre antes de pasar la ficha a AcuarioNexo');
    return;
  }

  const userResult = await supa.auth.getUser();
  const user = userResult && userResult.data && userResult.data.user;
  if (!user) {
    alert('Inicia sesión antes de pasar la ficha a AcuarioNexo');
    showLogin();
    return;
  }

  const libraryRow = {
    user_id: user.id,
    title: title,
    scientific_name: draft.scientific_name || null,
    category: libraryCategory(draft.category),
    description: s.summary || null,
    photo_url: finalSpeciesPhoto(draft) || null,
    feeding: s.feeding || null,
    compatibility: s.compatibility || null,
    references_text: s.sources || null,
    parameters: s.parameters ? { text: s.parameters } : {},
    updated_at: new Date().toISOString()
  };

  let existing = null;
  if (draft.scientific_name) {
    const found = await supa.from('library_entries').select('id').eq('user_id', user.id).eq('scientific_name', draft.scientific_name).limit(1);
    if (found.error) {
      alert('No se pudo comprobar si la ficha ya existe en AcuarioNexo: ' + found.error.message);
      return;
    }
    existing = (found.data || [])[0] || null;
  }

  if (!existing) {
    const found = await supa.from('library_entries').select('id').eq('user_id', user.id).eq('title', title).limit(1);
    if (found.error) {
      alert('No se pudo comprobar si la ficha ya existe en AcuarioNexo: ' + found.error.message);
      return;
    }
    existing = (found.data || [])[0] || null;
  }

  const result = existing
    ? await supa.from('library_entries').update(libraryRow).eq('id', existing.id)
    : await supa.from('library_entries').insert(libraryRow);

  if (result.error) {
    alert('No se pudo pasar la ficha a AcuarioNexo: ' + result.error.message);
    return;
  }

  draft.status = STATUS.SENT;
  draft.sent_to_acuarionexo_at = new Date().toISOString();
  await saveFicha(draft);
  current = draft;
  window.current = draft;
  alert('Ficha pasada a AcuarioNexo');
  showList();
}

async function sendToReview() { return sendToAcuarioNexo(); }
async function validateCurrent() { return sendToAcuarioNexo(); }

async function deleteFicha(id) {
  if (!confirm('¿Borrar esta ficha?')) return;
  const result = await supa.from('fichas_creator').delete().eq('id', id);
  if (result.error) {
    alert('No se pudo borrar: ' + (result.error.message || JSON.stringify(result.error)));
    return;
  }
  await showList();
}

function ensureAuthPanel() {
  if ($('authPanel')) return;
  const panel = document.createElement('section');
  panel.id = 'authPanel';
  panel.className = 'hidden card';
  panel.innerHTML = '' +
    '<h2>Login Supabase</h2>' +
    '<p class="muted">Usa el mismo correo y contraseña de AcuarioNexo.</p>' +
    '<input id="authEmail" type="email" placeholder="Correo">' +
    '<input id="authPassword" type="password" placeholder="Contraseña">' +
    '<button class="primary" onclick="loginSupabase()">Entrar</button>' +
    '<button onclick="registerSupabase()">Crear cuenta</button>' +
    '<button class="small" onclick="goHome()">← Volver</button>' +
    '<p id="authMessage" class="muted"></p>';
  (document.querySelector('.app') || document.body).appendChild(panel);
}

function ensureAuthHomeControls() {
  const homeCard = document.querySelector('#home .card');
  if (!homeCard || $('authStatus')) return;
  const status = document.createElement('p');
  status.id = 'authStatus';
  status.className = 'muted';
  status.textContent = 'Comprobando sesión...';
  const loginButton = document.createElement('button');
  loginButton.id = 'authButton';
  loginButton.type = 'button';
  loginButton.textContent = '🔐 Iniciar sesión';
  loginButton.onclick = showLogin;
  const logoutButton = document.createElement('button');
  logoutButton.id = 'logoutButton';
  logoutButton.type = 'button';
  logoutButton.className = 'small hidden';
  logoutButton.textContent = 'Cerrar sesión';
  logoutButton.onclick = logoutSupabase;
  homeCard.insertBefore(logoutButton, homeCard.firstChild);
  homeCard.insertBefore(loginButton, homeCard.firstChild);
  homeCard.insertBefore(status, homeCard.firstChild);
}

function showLogin() {
  ensureAuthPanel();
  hideAll();
  $('authPanel').classList.remove('hidden');
  if ($('authMessage')) $('authMessage').textContent = '';
}

async function updateAuthStatus() {
  ensureAuthHomeControls();
  const status = $('authStatus');
  const loginButton = $('authButton');
  const logoutButton = $('logoutButton');
  if (!status || !loginButton || !logoutButton) return;
  const result = await supa.auth.getUser();
  const user = result && result.data && result.data.user;
  if (user) {
    status.textContent = 'Sesión activa: ' + (user.email || user.id);
    loginButton.classList.add('hidden');
    logoutButton.classList.remove('hidden');
  } else {
    status.textContent = 'Sin sesión activa. Inicia sesión antes de pasar fichas a AcuarioNexo.';
    loginButton.classList.remove('hidden');
    logoutButton.classList.add('hidden');
  }
}

async function loginSupabase() {
  const email = $('authEmail') ? $('authEmail').value.trim() : '';
  const password = $('authPassword') ? $('authPassword').value : '';
  const msg = $('authMessage');
  if (!email || !password) {
    if (msg) msg.textContent = 'Introduce correo y contraseña.';
    return;
  }
  if (msg) msg.textContent = 'Entrando...';
  const result = await supa.auth.signInWithPassword({ email: email, password: password });
  if (result.error) {
    if (msg) msg.textContent = 'No se pudo iniciar sesión: ' + result.error.message;
    return;
  }
  if (msg) msg.textContent = 'Sesión iniciada.';
  await updateAuthStatus();
  goHome();
}

async function registerSupabase() {
  const email = $('authEmail') ? $('authEmail').value.trim() : '';
  const password = $('authPassword') ? $('authPassword').value : '';
  const msg = $('authMessage');
  if (!email || !password) {
    if (msg) msg.textContent = 'Introduce correo y contraseña.';
    return;
  }
  if (msg) msg.textContent = 'Creando cuenta...';
  const result = await supa.auth.signUp({ email: email, password: password });
  if (result.error) {
    if (msg) msg.textContent = 'No se pudo crear la cuenta: ' + result.error.message;
    return;
  }
  if (msg) msg.textContent = 'Cuenta creada. Si Supabase pide confirmación, revisa el correo; si no, la sesión queda activa.';
  await updateAuthStatus();
}

async function logoutSupabase() {
  await supa.auth.signOut();
  await updateAuthStatus();
  goHome();
}

function refreshApp() {
  location.reload();
}

function boot() {
  ensureAuthPanel();
  ensureAuthHomeControls();
  updateAuthStatus();
  goHome();
  if ('serviceWorker' in navigator) navigator.serviceWorker.register('./sw.js');
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}

supa.auth.onAuthStateChange(function() {
  updateAuthStatus();
});

window.STATUS = STATUS;
window.CATEGORY_TREE = CATEGORY_TREE;
window.goHome = goHome;
window.showNew = showNew;
window.hideAll = hideAll;
window.$ = $;
window.newDraft = newDraft;
window.openEditor = openEditor;
window.changeCategory = changeCategory;
window.openById = openFinalById;
window.openFinalById = openFinalById;
window.startFromPhoto = startFromPhoto;
window.removeCover = removeCover;
window.removeSpeciesPhoto = removeSpeciesPhoto;
window.renderCover = renderCover;
window.renderSpeciesPhoto = renderSpeciesPhoto;
window.replaceCover = replaceCover;
window.replaceSpeciesPhoto = replaceSpeciesPhoto;
window.all = all;
window.saveFicha = saveFicha;
window.saveDraft = saveDraft;
window.saveDraftAndShowList = saveDraftAndShowList;
window.showPreview = showPreview;
window.exportCurrent = exportCurrent;
window.showList = showList;
window.renderFichaFinal = renderFichaFinal;
window.sendToAcuarioNexo = sendToAcuarioNexo;
window.sendToReview = sendToReview;
window.validateCurrent = validateCurrent;
window.deleteFicha = deleteFicha;
window.labelCat = labelCat;
window.labelStatus = labelStatus;
window.escapeHtml = escapeHtml;
window.showLogin = showLogin;
window.loginSupabase = loginSupabase;
window.registerSupabase = registerSupabase;
window.logoutSupabase = logoutSupabase;
window.updateAuthStatus = updateAuthStatus;
window.refreshApp = refreshApp;
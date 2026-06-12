(function() {
  const IMPORTER_ID = 'pasteImportBox';

  const KEY_ALIASES = {
    summary: ['resumen', 'resumen rapido', 'resumen breve', 'descripcion', 'descripcion general'],
    identity: ['identificacion', 'datos generales', 'taxonomia', 'clasificacion'],
    habitat: ['habitat', 'habitat natural', 'distribucion', 'origen'],
    aquarium: ['acuario', 'acuario recomendado', 'mantenimiento', 'cuidados en acuario'],
    parameters: ['parametros', 'parametros del agua', 'valores', 'calidad del agua'],
    behavior: ['comportamiento', 'temperamento', 'caracter'],
    feeding: ['alimentacion', 'dieta', 'comida'],
    compatibility: ['compatibilidad', 'compatibles', 'incompatibles'],
    reef_safe: ['reef safe', 'riesgo reef', 'seguro para reef', 'arrecife'],
    health: ['salud', 'enfermedades', 'salud y enfermedades', 'salud y problemas'],
    purchase: ['antes de comprar', 'compra', 'consejos de compra'],
    mistakes: ['errores frecuentes', 'errores comunes'],
    curiosities: ['curiosidades', 'datos curiosos'],
    sources: ['fuentes', 'referencias', 'bibliografia'],
    breeding: ['reproduccion', 'cria'],
    lighting: ['iluminacion', 'luz', 'par'],
    flow: ['flujo', 'corriente'],
    placement: ['ubicacion', 'colocacion'],
    co2: ['co2', 'co2 y nutrientes', 'nutrientes'],
    maintenance: ['mantenimiento', 'poda y mantenimiento', 'poda'],
    culture: ['cultivo'],
    use: ['uso', 'uso recomendado', 'uso en acuario'],
    problems: ['problemas', 'problemas frecuentes'],
    uses: ['usos', 'usos indicados', 'indicaciones'],
    dose: ['dosis', 'dosificacion'],
    remove: ['retirar durante tratamiento', 'retirar', 'durante tratamiento'],
    risks: ['riesgos', 'riesgos y advertencias', 'advertencias', 'riesgos y errores'],
    aftercare: ['despues del tratamiento', 'post tratamiento'],
    inventory_logic: ['logica acuarionexo', 'calculo acuarionexo'],
    mixing: ['preparacion', 'mezcla'],
    nutrition: ['composicion', 'nutricion'],
    acuarionexo_plan: ['plan acuarionexo'],
    specs: ['especificaciones', 'datos tecnicos'],
    installation: ['instalacion']
  };

  function escapeHtml(value) {
    return String(value || '').replace(/[&<>"]/g, function(match) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[match];
    });
  }

  function cleanHeading(value) {
    return String(value || '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase()
      .replace(/^\s*(#{1,6}|[-*•]|\d+[.)])\s*/g, '')
      .replace(/[*_`]/g, '')
      .replace(/\s*[:：-]\s*$/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function currentDef() {
    const category = (window.current && window.current.category) || (document.getElementById('category') && document.getElementById('category').value) || 'pez_marino';
    return (window.CATEGORY_TREE && window.CATEGORY_TREE[category]) || (window.CATEGORY_TREE && window.CATEGORY_TREE.pez_marino);
  }

  function headingMap(def) {
    const map = new Map();
    (def.sections || []).forEach(function(item) {
      const key = item[0];
      const title = item[1];
      [title].concat(KEY_ALIASES[key] || []).forEach(function(alias) {
        map.set(cleanHeading(alias), key);
      });
    });
    return map;
  }

  function headingKey(line, map) {
    const clean = cleanHeading(line);
    if (!clean || clean.length > 72) return '';
    if (map.has(clean)) return map.get(clean);

    let found = '';
    map.forEach(function(key, alias) {
      if (found || alias.length < 4) return;
      if (clean === alias || clean.indexOf(alias + ' ') === 0) found = key;
    });
    return found;
  }

  function parseFichaText(text, def) {
    const map = headingMap(def);
    const sections = {};
    const lines = String(text || '').replace(/\r\n/g, '\n').split('\n');
    let active = '';
    let intro = [];

    lines.forEach(function(rawLine) {
      const line = rawLine.replace(/\s+$/g, '');
      const key = headingKey(line, map);
      if (key) {
        active = key;
        if (!sections[active]) sections[active] = [];
        return;
      }
      if (active) sections[active].push(line);
      else if (line.trim()) intro.push(line);
    });

    const parsed = {};
    Object.keys(sections).forEach(function(key) {
      parsed[key] = sections[key].join('\n').replace(/^\n+|\n+$/g, '').trim();
    });

    if (!parsed.summary && intro.length) {
      parsed.summary = intro.join('\n').trim();
    }

    return parsed;
  }

  function applyImportedSections() {
    const textArea = document.getElementById('pasteImportText');
    const message = document.getElementById('pasteImportMessage');
    const mode = document.getElementById('pasteImportReplace');
    const def = currentDef();
    if (!textArea || !def) return;

    const parsed = parseFichaText(textArea.value, def);
    const keys = Object.keys(parsed).filter(function(key) { return parsed[key]; });
    if (!keys.length) {
      if (message) message.textContent = 'No encontre apartados reconocibles. Usa titulos como Resumen rapido, Parametros, Alimentacion, Compatibilidad o Fuentes.';
      return;
    }

    if (window.collect) window.collect(false);
    window.current = window.current || {};
    window.current.sections = window.current.sections || {};

    let count = 0;
    keys.forEach(function(key) {
      const field = document.getElementById('section_' + key);
      if (!field) return;
      const imported = parsed[key];
      if (mode && mode.checked) {
        field.value = imported;
      } else {
        field.value = field.value.trim() ? field.value.trim() + '\n\n' + imported : imported;
      }
      window.current.sections[key] = field.value;
      count += 1;
    });

    if (message) message.textContent = 'Texto repartido en ' + count + ' apartado' + (count === 1 ? '.' : 's.');
  }

  function togglePasteImporter() {
    const body = document.getElementById('pasteImportBody');
    if (!body) return;
    body.classList.toggle('hidden');
    const textArea = document.getElementById('pasteImportText');
    if (!body.classList.contains('hidden') && textArea) textArea.focus();
  }

  function promptForChatGPT() {
    const def = currentDef();
    if (!def) return '';
    const titles = (def.sections || []).map(function(item) { return '- ' + item[1]; }).join('\n');
    return 'Hazme una ficha tecnica para NexoCreator. Usa exactamente estos apartados, con cada titulo en una linea independiente, y no inventes datos si no estas seguro.\n\n' + titles;
  }

  function copyFichaPrompt() {
    const text = promptForChatGPT();
    const message = document.getElementById('pasteImportMessage');
    if (!text) return;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(text).then(function() {
        if (message) message.textContent = 'Prompt copiado para pedir la ficha a ChatGPT.';
      }).catch(function() {
        if (message) message.textContent = text;
      });
    } else if (message) {
      message.textContent = text;
    }
  }

  function injectPasteImporter() {
    const sectionFields = document.getElementById('sectionFields');
    if (!sectionFields || document.getElementById(IMPORTER_ID)) return;

    const box = document.createElement('div');
    box.id = IMPORTER_ID;
    box.className = 'pasteImportBox editorBlock';
    box.innerHTML = '' +
      '<button type="button" class="small" onclick="togglePasteImporter()">Pegar ficha de ChatGPT</button>' +
      '<div id="pasteImportBody" class="hidden">' +
        '<p class="muted">Pega una ficha completa con titulos de apartados. La app reparte el texto en los campos de abajo.</p>' +
        '<textarea id="pasteImportText" class="pasteImportText" placeholder="Resumen rapido\n...\n\nIdentificacion\n...\n\nParametros\n..."></textarea>' +
        '<label class="pasteImportOption"><input id="pasteImportReplace" type="checkbox"> Sustituir lo que ya haya escrito</label>' +
        '<button type="button" class="primary small" onclick="applyImportedSections()">Repartir en apartados</button>' +
        '<button type="button" class="small" onclick="copyFichaPrompt()">Copiar prompt para ChatGPT</button>' +
        '<p id="pasteImportMessage" class="muted"></p>' +
      '</div>';

    sectionFields.parentNode.insertBefore(box, sectionFields);
  }

  function installStyles() {
    if (document.getElementById('pasteImporterStyles')) return;
    const style = document.createElement('style');
    style.id = 'pasteImporterStyles';
    style.textContent = '' +
      '.pasteImportBox{margin:18px 0;background:rgba(37,208,189,.08)}' +
      '.pasteImportText{min-height:220px}' +
      '.pasteImportOption{display:flex;gap:10px;align-items:center;color:var(--muted);font-weight:700;margin:8px 0 12px}' +
      '.pasteImportOption input{width:auto;margin:0}';
    document.head.appendChild(style);
  }

  function wrapEditorFunction(name) {
    const original = window[name];
    if (typeof original !== 'function') return;
    window[name] = function() {
      const result = original.apply(this, arguments);
      setTimeout(injectPasteImporter, 0);
      return result;
    };
  }

  installStyles();
  wrapEditorFunction('openEditor');
  wrapEditorFunction('changeCategory');
  window.injectPasteImporter = injectPasteImporter;
  window.togglePasteImporter = togglePasteImporter;
  window.applyImportedSections = applyImportedSections;
  window.copyFichaPrompt = copyFichaPrompt;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectPasteImporter);
  } else {
    injectPasteImporter();
  }
})();

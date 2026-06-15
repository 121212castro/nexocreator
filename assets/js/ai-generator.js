(function() {
  const PANEL_ID = 'aiFichaBox';

  function $(id) {
    return document.getElementById(id);
  }

  function escapeHtml(value) {
    return String(value || '').replace(/[&<>"]/g, function(match) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[match];
    });
  }

  function currentDef() {
    const category = (window.current && window.current.category) || ($('category') && $('category').value) || 'pez_marino';
    return (window.CATEGORY_TREE && window.CATEGORY_TREE[category]) || (window.CATEGORY_TREE && window.CATEGORY_TREE.pez_marino);
  }

  function setMessage(text, kind) {
    const el = $('aiFichaMessage');
    if (!el) return;
    el.className = kind ? 'muted aiFichaMessage ' + kind : 'muted aiFichaMessage';
    el.textContent = text || '';
  }

  function setBusy(isBusy) {
    const btn = $('aiGenerateButton');
    if (!btn) return;
    btn.disabled = !!isBusy;
    btn.textContent = isBusy ? 'Creando ficha...' : 'Crear ficha con IA';
  }

  function sectionsPayload(def) {
    return (def && def.sections ? def.sections : []).map(function(item) {
      return { key: item[0], title: item[1], help: item[2] || '' };
    });
  }

  function applyGeneratedDraft(generated, replaceAll) {
    if (!generated || typeof generated !== 'object') throw new Error('La IA no devolvió una ficha válida.');
    if (window.collect) window.collect(false);
    window.current = window.current || {};
    window.current.sections = window.current.sections || {};

    const commonName = String(generated.common_name || generated.commonName || generated.title || '').trim();
    const scientificName = String(generated.scientific_name || generated.scientificName || '').trim();
    if (commonName && $('commonName')) $('commonName').value = commonName;
    if (scientificName && $('scientificName')) $('scientificName').value = scientificName;
    window.current.common_name = $('commonName') ? $('commonName').value.trim() : commonName;
    window.current.scientific_name = $('scientificName') ? $('scientificName').value.trim() : scientificName;

    const sections = generated.sections || {};
    Object.keys(sections).forEach(function(key) {
      const value = String(sections[key] || '').trim();
      if (!value) return;
      const field = $('section_' + key);
      if (!field) return;
      field.value = replaceAll || !field.value.trim() ? value : field.value.trim() + '\n\n' + value;
      window.current.sections[key] = field.value;
    });

    if (window.collect) window.collect(false);
  }

  async function generateFichaWithAI() {
    const topic = ($('aiFichaTopic') && $('aiFichaTopic').value.trim()) || '';
    const replaceAll = !!($('aiFichaReplace') && $('aiFichaReplace').checked);
    const def = currentDef();
    const category = ($('category') && $('category').value) || (window.current && window.current.category) || 'pez_marino';

    if (!topic) {
      setMessage('Escribe qué ficha quieres crear: especie, coral, producto, test o equipo.', 'warn');
      return;
    }
    if (!window.supa && !window.supabase) {
      setMessage('No está disponible Supabase en esta pantalla.', 'error');
      return;
    }

    setBusy(true);
    setMessage('Creando ficha completa con IA...', '');
    try {
      if (window.collect) window.collect(false);
      const auth = await window.supa.auth.getUser();
      if (!auth || !auth.data || !auth.data.user) {
        setMessage('Inicia sesión antes de usar la IA.', 'error');
        if (window.showLogin) window.showLogin();
        return;
      }

      const result = await window.supa.functions.invoke('generate-ficha', {
        body: {
          topic: topic,
          category: category,
          category_label: def ? def.label : category,
          current_common_name: $('commonName') ? $('commonName').value.trim() : '',
          current_scientific_name: $('scientificName') ? $('scientificName').value.trim() : '',
          sections: sectionsPayload(def)
        }
      });

      if (result.error) throw new Error(result.error.message || 'No se pudo llamar a la IA.');
      if (!result.data || !result.data.draft) throw new Error((result.data && result.data.error) || 'La IA no devolvió datos.');

      applyGeneratedDraft(result.data.draft, replaceAll);
      setMessage('Ficha creada. Revisa datos sensibles antes de pasarla a AcuarioNexo.', 'success');
    } catch (error) {
      setMessage(error.message || String(error), 'error');
    } finally {
      setBusy(false);
    }
  }

  function injectAIPanel() {
    const sectionFields = $('sectionFields');
    if (!sectionFields || $(PANEL_ID)) return;
    const def = currentDef();
    const box = document.createElement('div');
    box.id = PANEL_ID;
    box.className = 'aiFichaBox editorBlock';
    box.innerHTML = '' +
      '<strong class="aiFichaTitle">Crear ficha con IA</strong>' +
      '<p class="muted">Escribe el nombre o producto y la IA rellena los apartados de ' + escapeHtml(def ? def.label : 'la ficha') + '.</p>' +
      '<input id="aiFichaTopic" placeholder="Ej. Amphiprion ocellaris, árbol de Kenia, Salifert KH...">' +
      '<label class="aiFichaOption"><input id="aiFichaReplace" type="checkbox" checked> Sustituir campos actuales</label>' +
      '<button id="aiGenerateButton" type="button" class="primary" onclick="generateFichaWithAI()">Crear ficha con IA</button>' +
      '<p id="aiFichaMessage" class="muted aiFichaMessage"></p>';
    sectionFields.parentNode.insertBefore(box, sectionFields);
  }

  function refreshAIPanel() {
    const old = $(PANEL_ID);
    if (old) old.remove();
    injectAIPanel();
  }

  function wrapEditorFunction(name) {
    const original = window[name];
    if (typeof original !== 'function') return;
    window[name] = function() {
      const result = original.apply(this, arguments);
      setTimeout(refreshAIPanel, 0);
      return result;
    };
  }

  wrapEditorFunction('openEditor');
  wrapEditorFunction('changeCategory');
  window.injectAIPanel = injectAIPanel;
  window.generateFichaWithAI = generateFichaWithAI;

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', injectAIPanel);
  } else {
    injectAIPanel();
  }
})();

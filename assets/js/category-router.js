(function() {
  const CATEGORY_TO_LIBRARY = {
    pez_marino: 'fish_marine',
    pez_dulce: 'fish_freshwater',
    coral: 'coral',
    invertebrado: 'invertebrate',
    planta: 'plant',
    microfauna: 'microfauna',
    medicamento: 'medicine',
    sal: 'product',
    alimento: 'product',
    equipamiento: 'equipment'
  };

  function libraryCategory(value) {
    return CATEGORY_TO_LIBRARY[value] || value || 'other';
  }

  function finalSpeciesPhoto(draft) {
    return draft.species_photo || draft.speciesPhoto ||
      (draft.media && (draft.media.species_photo || draft.media.speciesPhoto)) ||
      (draft.images && (draft.images.species_photo || draft.images.speciesPhoto)) || '';
  }

  function getSupabaseClient() {
    if (!window.__nexoCategoryRouterSupa) {
      window.__nexoCategoryRouterSupa = window.supabase.createClient(
        window.ACUARIONEXO_CONFIG.SUPABASE_URL,
        window.ACUARIONEXO_CONFIG.SUPABASE_KEY
      );
    }
    return window.__nexoCategoryRouterSupa;
  }

  async function sendToAcuarioNexo() {
    const supa = getSupabaseClient();
    const draft = (window.current && window.current.id && window.normalizeDraft)
      ? window.normalizeDraft(window.current)
      : (window.collect ? window.collect() : window.current);
    const s = (draft && draft.sections) || {};
    const title = (draft && (draft.common_name || draft.scientific_name)) || '';

    if (!title) {
      alert('Pon al menos un nombre antes de pasar la ficha a AcuarioNexo');
      return;
    }

    const userResult = await supa.auth.getUser();
    const user = userResult && userResult.data && userResult.data.user;
    if (!user) {
      alert('Inicia sesion antes de pasar la ficha a AcuarioNexo');
      if (window.showLogin) window.showLogin();
      return;
    }

    const category = libraryCategory(draft.category);
    const libraryRow = {
      user_id: user.id,
      title: title,
      scientific_name: draft.scientific_name || null,
      category: category,
      source_category: draft.category || null,
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

    draft.status = window.STATUS ? window.STATUS.SENT : 'ENVIADA_A_ACUARIONEXO';
    draft.sent_to_acuarionexo_at = new Date().toISOString();
    if (window.saveFicha) await window.saveFicha(draft);
    window.current = draft;
    alert('Ficha pasada a AcuarioNexo en su modulo correcto');
    if (window.showList) window.showList();
  }

  window.libraryCategory = libraryCategory;
  window.sendToAcuarioNexo = sendToAcuarioNexo;
  window.sendToReview = sendToAcuarioNexo;
  window.validateCurrent = sendToAcuarioNexo;
})();

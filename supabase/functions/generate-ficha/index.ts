type SectionDef = {
  key: string;
  title: string;
  help?: string;
};

type GenerateRequest = {
  topic?: string;
  category?: string;
  category_label?: string;
  current_common_name?: string;
  current_scientific_name?: string;
  sections?: SectionDef[];
};

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

function json(data: unknown, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  });
}

function cleanText(value: unknown, max = 140) {
  return String(value || '').replace(/\s+/g, ' ').trim().slice(0, max);
}

function cleanSections(value: unknown): SectionDef[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => ({
      key: cleanText((item as SectionDef).key, 48).replace(/[^a-zA-Z0-9_]/g, ''),
      title: cleanText((item as SectionDef).title, 80),
      help: cleanText((item as SectionDef).help, 220)
    }))
    .filter((item) => item.key && item.title)
    .slice(0, 18);
}

function responseText(payload: any): string {
  if (typeof payload?.output_text === 'string') return payload.output_text;
  const chunks: string[] = [];
  for (const item of payload?.output || []) {
    for (const content of item?.content || []) {
      if (typeof content?.text === 'string') chunks.push(content.text);
    }
  }
  return chunks.join('\n').trim();
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });
  if (req.method !== 'POST') return json({ error: 'Método no permitido.' }, 405);

  const apiKey = Deno.env.get('OPENAI_API_KEY');
  if (!apiKey) {
    return json({
      error: 'Falta OPENAI_API_KEY en los secretos de Supabase. Configura ese secreto para activar la IA.'
    }, 500);
  }

  let body: GenerateRequest;
  try {
    body = await req.json();
  } catch (_) {
    return json({ error: 'Solicitud inválida.' }, 400);
  }

  const topic = cleanText(body.topic, 160);
  const category = cleanText(body.category, 60) || 'pez_marino';
  const categoryLabel = cleanText(body.category_label, 80) || category;
  const currentCommon = cleanText(body.current_common_name, 120);
  const currentScientific = cleanText(body.current_scientific_name, 120);
  const sections = cleanSections(body.sections);

  if (!topic) return json({ error: 'Indica qué ficha quieres crear.' }, 400);
  if (!sections.length) return json({ error: 'No llegaron apartados para esta categoría.' }, 400);

  const sectionKeys = sections.map((section) => section.key);
  const sectionSchema: Record<string, unknown> = {};
  for (const section of sections) sectionSchema[section.key] = { type: 'string' };

  const prompt = [
    `Crea una ficha técnica completa para NexoCreator.`,
    `Categoría: ${categoryLabel} (${category}).`,
    `Tema solicitado: ${topic}.`,
    currentCommon ? `Nombre común actual: ${currentCommon}.` : '',
    currentScientific ? `Nombre científico/técnico actual: ${currentScientific}.` : '',
    '',
    'Apartados obligatorios:',
    ...sections.map((section) => `- ${section.key}: ${section.title}${section.help ? ` (${section.help})` : ''}`),
    '',
    'Reglas:',
    '- Responde sólo con JSON válido según el esquema.',
    '- Escribe en español claro para acuariofilia.',
    '- No dejes apartados vacíos.',
    '- No inventes datos exactos de fabricante, dosis o rangos si no estás seguro; marca “revisar ficha oficial” cuando sea necesario.',
    '- En sources/fuentes indica fuentes recomendadas para verificar, no enlaces inventados.',
    '- Para medicamentos, sales, tests y productos, prioriza seguridad y revisión del fabricante.',
    '- Para animales, plantas y corales, incluye compatibilidad, parámetros, alimentación o mantenimiento cuando aplique.'
  ].filter(Boolean).join('\n');

  const model = Deno.env.get('OPENAI_MODEL') || 'gpt-4.1-mini';
  const openaiResponse = await fetch('https://api.openai.com/v1/responses', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model,
      input: [
        {
          role: 'system',
          content: 'Eres un experto en acuariofilia y documentación técnica. Generas fichas estructuradas para una app llamada NexoCreator.'
        },
        { role: 'user', content: prompt }
      ],
      text: {
        format: {
          type: 'json_schema',
          name: 'nexocreator_ficha',
          strict: true,
          schema: {
            type: 'object',
            additionalProperties: false,
            required: ['common_name', 'scientific_name', 'sections'],
            properties: {
              common_name: { type: 'string' },
              scientific_name: { type: 'string' },
              sections: {
                type: 'object',
                additionalProperties: false,
                required: sectionKeys,
                properties: sectionSchema
              }
            }
          }
        }
      }
    })
  });

  const payload = await openaiResponse.json().catch(() => ({}));
  if (!openaiResponse.ok) {
    return json({
      error: payload?.error?.message || 'OpenAI no pudo crear la ficha.'
    }, openaiResponse.status);
  }

  try {
    const text = responseText(payload);
    const draft = JSON.parse(text);
    return json({ draft, model });
  } catch (_) {
    return json({ error: 'La IA respondió, pero el formato no se pudo leer.' }, 502);
  }
});

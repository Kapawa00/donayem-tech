export function slugify(text) {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
}

// Extrait les titres H2/H3 d'un HTML d'article et y injecte des `id` uniques,
// pour générer une table des matières et permettre les ancres de scroll.
export function parseHeadings(html) {
  const used = new Map();
  const headings = [];

  const content = html.replace(/<(h2|h3)([^>]*)>([\s\S]*?)<\/\1>/gi, (full, tag, attrs, inner) => {
    const text = inner.replace(/<[^>]+>/g, '').trim();
    if (!text) return full;

    let id = slugify(text);
    const count = used.get(id) ?? 0;
    used.set(id, count + 1);
    if (count > 0) id = `${id}-${count + 1}`;

    headings.push({ level: tag, text, id });
    return `<${tag}${attrs} id="${id}">${inner}</${tag}>`;
  });

  return { content, headings };
}

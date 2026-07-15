'use client';

import { useState } from 'react';
import { X } from 'lucide-react';

export default function TagInput({ id, label, value = [], onChange }) {
  const [draft, setDraft] = useState('');

  function addTag(raw) {
    const tag = raw.trim();
    if (!tag || value.includes(tag)) return;
    onChange([...value, tag]);
  }

  function handleKeyDown(event) {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault();
      addTag(draft);
      setDraft('');
    } else if (event.key === 'Backspace' && !draft && value.length > 0) {
      onChange(value.slice(0, -1));
    }
  }

  function removeTag(tag) {
    onChange(value.filter((item) => item !== tag));
  }

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label htmlFor={id} className="font-inter text-sm font-medium text-dark">
          {label}
        </label>
      )}
      <div
        className="flex flex-wrap items-center gap-2 rounded-md border border-border bg-white px-3 py-2
                   focus-within:border-gold-400 focus-within:ring-2 focus-within:ring-gold-400/50"
      >
        {value.map((tag) => (
          <span
            key={tag}
            className="flex items-center gap-1.5 rounded-pill bg-gold-400/15 px-3 py-1 font-inter text-xs font-medium text-gold-600"
          >
            {tag}
            <button type="button" onClick={() => removeTag(tag)} aria-label={`Retirer ${tag}`}>
              <X size={12} />
            </button>
          </span>
        ))}
        <input
          id={id}
          type="text"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => {
            addTag(draft);
            setDraft('');
          }}
          placeholder={value.length === 0 ? 'Ajouter un tag...' : ''}
          className="min-w-[120px] flex-1 border-none bg-transparent font-inter text-sm text-dark outline-none placeholder:text-muted"
        />
      </div>
    </div>
  );
}

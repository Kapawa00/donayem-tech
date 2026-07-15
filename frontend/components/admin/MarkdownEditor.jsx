'use client';

import dynamic from 'next/dynamic';
import '@uiw/react-md-editor/markdown-editor.css';

// react-md-editor s'appuie sur CodeMirror (accès à `window`) : chargement client-only,
// comme les autres composants dépendant du navigateur (ex. components/sections/ContactMap.jsx).
const MDEditor = dynamic(() => import('@uiw/react-md-editor'), { ssr: false });

export default function MarkdownEditor({ value, onChange }) {
  return (
    <div data-color-mode="light">
      <MDEditor
        value={value}
        onChange={(next) => onChange(next ?? '')}
        height={440}
        preview="live"
      />
    </div>
  );
}

'use client';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export default function PasswordInput({ id, label, name, value, onChange, placeholder }) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label htmlFor={id} className="font-inter text-sm font-medium text-dark">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          id={id}
          name={name}
          type={visible ? 'text' : 'password'}
          value={value ?? ''}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete="off"
          className="w-full rounded-md border border-border bg-white px-4 py-3 pr-11 font-inter text-sm
                     text-dark placeholder:text-muted focus:outline-none focus:ring-2
                     focus:ring-gold-400/50 focus:border-gold-400"
        />
        <button
          type="button"
          onClick={() => setVisible((prev) => !prev)}
          aria-label={visible ? 'Masquer' : 'Afficher'}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted transition-colors hover:text-dark"
        >
          {visible ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </div>
  );
}

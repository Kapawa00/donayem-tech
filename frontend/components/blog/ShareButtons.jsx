'use client';

import { useState } from 'react';
import { Check, Facebook, Link2, MessageCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ShareButtons({ url, title }) {
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success('Lien copié !');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Impossible de copier le lien.');
    }
  }

  return (
    <div className="flex flex-col gap-3">
      <p className="font-inter text-xs font-medium uppercase tracking-widest text-muted">
        Partager
      </p>
      <div className="flex gap-2">
        <a
          href={`https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Partager sur Facebook"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-navy-900/5 text-navy-700
                     transition-colors hover:bg-gold-400/15 hover:text-gold-600"
        >
          <Facebook size={16} />
        </a>
        <a
          href={`https://wa.me/?text=${encodedTitle}%20${encodedUrl}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Partager sur WhatsApp"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-navy-900/5 text-navy-700
                     transition-colors hover:bg-gold-400/15 hover:text-gold-600"
        >
          <MessageCircle size={16} />
        </a>
        <button
          type="button"
          onClick={handleCopy}
          aria-label="Copier le lien"
          className="flex h-9 w-9 items-center justify-center rounded-full bg-navy-900/5 text-navy-700
                     transition-colors hover:bg-gold-400/15 hover:text-gold-600"
        >
          {copied ? <Check size={16} /> : <Link2 size={16} />}
        </button>
      </div>
    </div>
  );
}

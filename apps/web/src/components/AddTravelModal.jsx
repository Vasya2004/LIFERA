'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Plus, Trash2 } from 'lucide-react';
import ModalShell from '@/components/ModalShell';
import RatingPicker from '@/components/RatingPicker';
import { uploadFile } from '@/lib/entries';
import { useTravelMutations } from '@/hooks/useEntries';

const fieldClass =
  'w-full rounded-lg border border-border bg-secondary px-3 py-2.5 font-inter text-sm outline-none transition-colors focus:border-primary';

export default function AddTravelModal({ open, onClose, onSaved, editEntry }) {
  const [form, setForm] = useState({});
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const { save } = useTravelMutations();

  useEffect(() => {
    if (!open) return;
    setError(null);
    if (editEntry) {
      setForm({ ...editEntry });
    } else {
      setForm({ travel_date: format(new Date(), 'yyyy-MM-dd'), photos: [] });
    }
  }, [open, editEntry]);

  function set(key, val) {
    setForm((prev) => ({ ...prev, [key]: val }));
  }

  async function handlePhotoUpload(e) {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const current = form.photos || [];
    if (current.length >= 4) return;

    setUploading(true);
    setError(null);
    try {
      const toUpload = files.slice(0, 4 - current.length);
      const urls = await Promise.all(toUpload.map((f) => uploadFile(f)));
      set('photos', [...current, ...urls]);
    } catch (err) {
      console.error('Photo upload failed:', err);
      setError('Не удалось загрузить фото');
    } finally {
      setUploading(false);
    }
  }

  function removePhoto(idx) {
    const photos = [...(form.photos || [])];
    photos.splice(idx, 1);
    set('photos', photos);
  }

  function handleSave() {
    if (!form.title?.trim()) return;
    const payload = { ...form };
    const id = editEntry?.id;
    setError(null);
    onClose();
    save.mutate(
      { id, data: payload },
      {
        onSuccess: () => onSaved?.(),
        onError: (err) => console.error('Save failed:', err),
      },
    );
  }

  const photos = form.photos || [];
  const title = `${editEntry ? 'Редактировать' : 'Добавить'} путешествие`;

  return (
    <ModalShell open={open} onClose={onClose} title={title}>
      <div>
        <label className="mb-2 block text-xs uppercase tracking-wider text-muted-foreground">Название *</label>
        <input
          type="text"
          value={form.title || ''}
          onChange={(e) => set('title', e.target.value)}
          placeholder="Например: Токио 2024..."
          className={fieldClass}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="mb-2 block text-xs uppercase tracking-wider text-muted-foreground">Страна</label>
          <input
            type="text"
            value={form.country || ''}
            onChange={(e) => set('country', e.target.value)}
            placeholder="Япония"
            className={fieldClass}
          />
        </div>
        <div>
          <label className="mb-2 block text-xs uppercase tracking-wider text-muted-foreground">Город</label>
          <input
            type="text"
            value={form.city || ''}
            onChange={(e) => set('city', e.target.value)}
            placeholder="Токио"
            className={fieldClass}
          />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-xs uppercase tracking-wider text-muted-foreground">
          Фотографии ({photos.length}/4) — коллаж
        </label>
        <div className="mb-2 grid grid-cols-4 gap-1.5">
          {photos.map((url, idx) => (
            <div key={url} className="relative aspect-square overflow-hidden rounded-lg border border-border">
              <img src={url} alt="" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => removePhoto(idx)}
                className="absolute right-0.5 top-0.5 rounded bg-black/70 p-0.5 transition-colors hover:bg-destructive"
              >
                <Trash2 size={10} />
              </button>
            </div>
          ))}
          {photos.length < 4 && (
            <label className="flex aspect-square cursor-pointer items-center justify-center rounded-lg border border-dashed border-border transition-colors hover:border-primary">
              {uploading ? (
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
              ) : (
                <Plus size={18} className="text-muted-foreground" />
              )}
              <input type="file" accept="image/*" multiple onChange={handlePhotoUpload} className="hidden" />
            </label>
          )}
        </div>
      </div>

      <div>
        <label className="mb-2 block text-xs uppercase tracking-wider text-muted-foreground">Оценка</label>
        <RatingPicker value={form.rating} onChange={(v) => set('rating', v)} />
      </div>

      <div>
        <label className="mb-2 block text-xs uppercase tracking-wider text-muted-foreground">Заметка</label>
        <textarea
          value={form.note || ''}
          onChange={(e) => set('note', e.target.value)}
          placeholder="Впечатления..."
          rows={3}
          className={`${fieldClass} resize-none`}
        />
      </div>

      <div>
        <label className="mb-2 block text-xs uppercase tracking-wider text-muted-foreground">Дата</label>
        <input
          type="date"
          value={form.travel_date || ''}
          onChange={(e) => set('travel_date', e.target.value)}
          className={fieldClass}
        />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <button
        type="button"
        onClick={handleSave}
        disabled={save.isPending || uploading || !form.title?.trim()}
        className="w-full rounded-xl bg-primary py-3 font-inter text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {save.isPending ? 'Сохраняем...' : editEntry ? 'Сохранить' : 'Добавить в архив'}
      </button>
    </ModalShell>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Upload } from 'lucide-react';
import ModalShell from '@/components/ModalShell';
import RatingPicker from '@/components/RatingPicker';
import { uploadFile } from '@/lib/entries';
import { useActivityMutations } from '@/hooks/useEntries';

const CATEGORIES = [
  { key: 'extreme', label: 'Экстрим' },
  { key: 'winter', label: 'Зимние' },
  { key: 'air', label: 'Воздушные' },
  { key: 'water', label: 'Водные' },
  { key: 'sport', label: 'Спорт' },
  { key: 'creative', label: 'Творческие' },
  { key: 'other', label: 'Другое' },
];

const fieldClass =
  'w-full rounded-lg border border-border bg-secondary px-3 py-2.5 font-inter text-sm outline-none transition-colors focus:border-primary';

export default function AddActivityModal({ open, onClose, onSaved, editEntry }) {
  const [form, setForm] = useState({});
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const { save } = useActivityMutations();

  useEffect(() => {
    if (!open) return;
    setError(null);
    if (editEntry) {
      setForm({ ...editEntry });
    } else {
      setForm({ activity_date: format(new Date(), 'yyyy-MM-dd'), category: 'extreme' });
    }
  }, [open, editEntry]);

  function set(key, val) {
    setForm((prev) => ({ ...prev, [key]: val }));
  }

  async function handleUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      const fileUrl = await uploadFile(file);
      set('cover_url', fileUrl);
    } catch (err) {
      console.error('Upload failed:', err);
      setError('Не удалось загрузить фото');
    } finally {
      setUploading(false);
    }
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

  const title = `${editEntry ? 'Редактировать' : 'Добавить'} активность`;

  return (
    <ModalShell open={open} onClose={onClose} title={title}>
      <div>
        <label className="mb-2 block text-xs uppercase tracking-wider text-muted-foreground">Название *</label>
        <input
          type="text"
          value={form.title || ''}
          onChange={(e) => set('title', e.target.value)}
          placeholder="Например: Аэротруба в Москве..."
          className={fieldClass}
        />
      </div>

      <div>
        <label className="mb-2 block text-xs uppercase tracking-wider text-muted-foreground">Категория</label>
        <div className="flex flex-wrap gap-1.5">
          {CATEGORIES.map((c) => (
            <button
              key={c.key}
              type="button"
              onClick={() => set('category', c.key)}
              className={`rounded-lg px-3 py-1 font-inter text-sm transition-colors ${
                form.category === c.key
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-secondary text-secondary-foreground hover:bg-muted'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="mb-2 block text-xs uppercase tracking-wider text-muted-foreground">Фото</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={form.cover_url || ''}
            onChange={(e) => set('cover_url', e.target.value)}
            placeholder="URL фотографии..."
            className={`flex-1 ${fieldClass}`}
          />
          <label className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-border bg-secondary px-3 py-2.5 transition-colors hover:border-primary">
            {uploading ? (
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            ) : (
              <Upload size={14} />
            )}
            <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
          </label>
        </div>
        {form.cover_url && (
          <div className="relative mt-2 h-24 w-16 overflow-hidden rounded-lg border border-border">
            <img src={form.cover_url} alt="preview" className="h-full w-full object-cover" />
          </div>
        )}
      </div>

      <div>
        <label className="mb-2 block text-xs uppercase tracking-wider text-muted-foreground">Место</label>
        <input
          type="text"
          value={form.location || ''}
          onChange={(e) => set('location', e.target.value)}
          placeholder="Город или место..."
          className={fieldClass}
        />
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
          value={form.activity_date || ''}
          onChange={(e) => set('activity_date', e.target.value)}
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

'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Upload } from 'lucide-react';
import ModalShell from '@/components/ModalShell';
import RatingPicker from '@/components/RatingPicker';
import { uploadFile } from '@/lib/entries';
import { useMediaMutations } from '@/hooks/useEntries';

const TYPE_CONFIG = {
  movie:        { label: 'Фильм', fields: ['genre'] },
  documentary:  { label: 'Документальный', fields: ['genre'] },
  series:       { label: 'Сериал', fields: ['genre', 'season_count'] },
  game:         { label: 'Игра', fields: ['genre', 'platform', 'hours_played'] },
};

const GENRES = {
  movie:       ['Драма', 'Комедия', 'Триллер', 'Ужасы', 'Боевик', 'Фантастика', 'Мелодрама', 'Анимация', 'Другое'],
  documentary: ['Природа', 'История', 'Наука', 'Биография', 'Криминал', 'Политика', 'Другое'],
  series:      ['Драма', 'Комедия', 'Триллер', 'Ужасы', 'Боевик', 'Фантастика', 'Другое'],
  game:        ['RPG', 'Action', 'Strategy', 'Indie', 'Adventure', 'Sports', 'Horror', 'Другое'],
};

const PLATFORMS = ['PC', 'PS5', 'PS4', 'Xbox', 'Nintendo Switch', 'Mobile'];

const fieldClass =
  'w-full rounded-lg border border-border bg-secondary px-3 py-2.5 font-inter text-sm outline-none transition-colors focus:border-primary';

const chipClass = (active) =>
  `rounded-lg px-2.5 py-1 font-inter text-xs transition-colors ${
    active
      ? 'bg-primary text-primary-foreground'
      : 'bg-secondary text-secondary-foreground hover:bg-muted'
  }`;

export default function AddEntryModal({ open, onClose, onSaved, activeTab, editEntry }) {
  const [form, setForm] = useState({});
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const { save } = useMediaMutations();

  useEffect(() => {
    if (!open) return;
    setError(null);
    if (editEntry) {
      setForm({ ...editEntry });
    } else {
      setForm({
        type: activeTab,
        watched_date: format(new Date(), 'yyyy-MM-dd'),
      });
    }
  }, [open, activeTab, editEntry]);

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
      setError('Не удалось загрузить обложку');
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

  const config = TYPE_CONFIG[form.type] || TYPE_CONFIG.movie;
  const genres = GENRES[form.type] || [];
  const title = `${editEntry ? 'Редактировать' : 'Добавить'} ${config.label}`;

  return (
    <ModalShell open={open} onClose={onClose} title={title}>
      <div>
        <label className="mb-2 block text-xs uppercase tracking-wider text-muted-foreground">Название *</label>
        <input
          type="text"
          value={form.title || ''}
          onChange={(e) => set('title', e.target.value)}
          placeholder="Введи название..."
          className={fieldClass}
        />
      </div>

      <div>
        <label className="mb-2 block text-xs uppercase tracking-wider text-muted-foreground">Обложка</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={form.cover_url || ''}
            onChange={(e) => set('cover_url', e.target.value)}
            placeholder="Вставь URL изображения..."
            className={`flex-1 ${fieldClass}`}
          />
          <label className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-border bg-secondary px-3 py-2.5 text-sm transition-colors hover:border-primary">
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
        <label className="mb-2 block text-xs uppercase tracking-wider text-muted-foreground">Оценка</label>
        <RatingPicker value={form.rating} onChange={(v) => set('rating', v)} />
      </div>

      {config.fields.includes('genre') && (
        <div>
          <label className="mb-2 block text-xs uppercase tracking-wider text-muted-foreground">Жанр</label>
          <div className="flex flex-wrap gap-1.5">
            {genres.map((g) => (
              <button key={g} type="button" onClick={() => set('genre', g)} className={chipClass(form.genre === g)}>
                {g}
              </button>
            ))}
          </div>
        </div>
      )}

      {config.fields.includes('platform') && (
        <div>
          <label className="mb-2 block text-xs uppercase tracking-wider text-muted-foreground">Платформа</label>
          <div className="flex flex-wrap gap-1.5">
            {PLATFORMS.map((p) => (
              <button key={p} type="button" onClick={() => set('platform', p)} className={chipClass(form.platform === p)}>
                {p}
              </button>
            ))}
          </div>
        </div>
      )}

      {config.fields.includes('season_count') && (
        <div>
          <label className="mb-2 block text-xs uppercase tracking-wider text-muted-foreground">Кол-во сезонов</label>
          <input
            type="number"
            min={1}
            value={form.season_count || ''}
            onChange={(e) => set('season_count', parseInt(e.target.value, 10))}
            placeholder="1"
            className={`w-24 ${fieldClass}`}
          />
        </div>
      )}

      {config.fields.includes('hours_played') && (
        <div>
          <label className="mb-2 block text-xs uppercase tracking-wider text-muted-foreground">Часов потрачено</label>
          <input
            type="number"
            min={0}
            step={0.5}
            value={form.hours_played ?? ''}
            onChange={(e) => set('hours_played', e.target.value === '' ? null : parseFloat(e.target.value))}
            placeholder="0"
            className={`w-24 ${fieldClass}`}
          />
        </div>
      )}

      <div>
        <label className="mb-2 block text-xs uppercase tracking-wider text-muted-foreground">Заметка</label>
        <textarea
          value={form.note || ''}
          onChange={(e) => set('note', e.target.value)}
          placeholder="Короткое впечатление..."
          rows={3}
          className={`${fieldClass} resize-none`}
        />
      </div>

      <div className="overflow-hidden">
        <label className="mb-2 block text-xs uppercase tracking-wider text-muted-foreground">Дата просмотра</label>
        <input
          type="date"
          value={form.watched_date || ''}
          onChange={(e) => set('watched_date', e.target.value)}
          className={`${fieldClass} block w-full min-w-0`}
        />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <button
        type="button"
        onClick={handleSave}
        disabled={save.isPending || uploading || !form.title?.trim()}
        className="w-full rounded-xl bg-primary py-3 font-inter text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {save.isPending ? 'Сохраняем...' : editEntry ? 'Сохранить изменения' : 'Добавить в архив'}
      </button>
    </ModalShell>
  );
}

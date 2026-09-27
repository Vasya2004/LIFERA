import { createClient } from '@/lib/supabase/client';

function requireClient() {
  return createClient();
}

function pick(data, fields) {
  const result = {};
  for (const field of fields) {
    if (data[field] === undefined) continue;
    const value = data[field];
    result[field] = value === '' || (typeof value === 'number' && Number.isNaN(value))
      ? null
      : value;
  }
  return result;
}

function mapRow(row) {
  if (!row) return row;
  return {
    ...row,
    rating: row.rating == null ? null : Number(row.rating),
    season_count: row.season_count == null ? null : Number(row.season_count),
    hours_played: row.hours_played == null ? null : Number(row.hours_played),
  };
}

function mapRows(rows) {
  return (rows ?? []).map(mapRow);
}

async function assertNoError(error) {
  if (error) throw error;
}

async function runQuery(build) {
  const client = requireClient();
  const { data, error } = await build(client);
  await assertNoError(error);
  return data;
}

const MEDIA_FIELDS = [
  'title',
  'type',
  'cover_url',
  'rating',
  'note',
  'watched_date',
  'genre',
  'platform',
  'season_count',
  'hours_played',
];

const TRAVEL_FIELDS = [
  'title',
  'country',
  'city',
  'photos',
  'rating',
  'note',
  'travel_date',
];

const ACTIVITY_FIELDS = [
  'title',
  'category',
  'cover_url',
  'rating',
  'note',
  'activity_date',
  'location',
];

const THING_FIELDS = [
  'title',
  'category',
  'brand',
  'cover_url',
  'rating',
  'note',
  'item_date',
];

export const mediaApi = {
  async listByType(type) {
    const data = await runQuery((client) =>
      client
        .from('media_entries')
        .select('*')
        .eq('type', type)
        .order('watched_date', { ascending: false, nullsFirst: true })
        .order('created_at', { ascending: false }),
    );
    return mapRows(data);
  },

  async listCinema() {
    const data = await runQuery((client) =>
      client
        .from('media_entries')
        .select('*')
        .in('type', ['movie', 'documentary', 'series'])
        .order('watched_date', { ascending: false, nullsFirst: true })
        .order('created_at', { ascending: false }),
    );
    return mapRows(data);
  },

  async create(payload) {
    const data = await runQuery((client) =>
      client.from('media_entries').insert(pick(payload, MEDIA_FIELDS)).select().single(),
    );
    return mapRow(data);
  },

  async update(id, payload) {
    const data = await runQuery((client) =>
      client.from('media_entries').update(pick(payload, MEDIA_FIELDS)).eq('id', id).select().single(),
    );
    return mapRow(data);
  },

  async remove(id) {
    await runQuery((client) => client.from('media_entries').delete().eq('id', id));
  },
};

export const travelApi = {
  async list() {
    const data = await runQuery((client) =>
      client
        .from('travel_entries')
        .select('*')
        .order('travel_date', { ascending: false, nullsFirst: true })
        .order('created_at', { ascending: false }),
    );
    return mapRows(data);
  },

  async create(payload) {
    const data = await runQuery((client) =>
      client.from('travel_entries').insert(pick(payload, TRAVEL_FIELDS)).select().single(),
    );
    return mapRow(data);
  },

  async update(id, payload) {
    const data = await runQuery((client) =>
      client.from('travel_entries').update(pick(payload, TRAVEL_FIELDS)).eq('id', id).select().single(),
    );
    return mapRow(data);
  },

  async remove(id) {
    await runQuery((client) => client.from('travel_entries').delete().eq('id', id));
  },
};

export const activityApi = {
  async list() {
    const data = await runQuery((client) =>
      client
        .from('activity_entries')
        .select('*')
        .order('activity_date', { ascending: false, nullsFirst: true })
        .order('created_at', { ascending: false }),
    );
    return mapRows(data);
  },

  async create(payload) {
    const data = await runQuery((client) =>
      client.from('activity_entries').insert(pick(payload, ACTIVITY_FIELDS)).select().single(),
    );
    return mapRow(data);
  },

  async update(id, payload) {
    const data = await runQuery((client) =>
      client
        .from('activity_entries')
        .update(pick(payload, ACTIVITY_FIELDS))
        .eq('id', id)
        .select()
        .single(),
    );
    return mapRow(data);
  },

  async remove(id) {
    await runQuery((client) => client.from('activity_entries').delete().eq('id', id));
  },
};

export const thingApi = {
  async list() {
    const data = await runQuery((client) =>
      client
        .from('thing_entries')
        .select('*')
        .order('item_date', { ascending: false, nullsFirst: true })
        .order('created_at', { ascending: false }),
    );
    return mapRows(data);
  },

  async create(payload) {
    const data = await runQuery((client) =>
      client.from('thing_entries').insert(pick(payload, THING_FIELDS)).select().single(),
    );
    return mapRow(data);
  },

  async update(id, payload) {
    const data = await runQuery((client) =>
      client.from('thing_entries').update(pick(payload, THING_FIELDS)).eq('id', id).select().single(),
    );
    return mapRow(data);
  },

  async remove(id) {
    await runQuery((client) => client.from('thing_entries').delete().eq('id', id));
  },
};

export async function uploadFile(file) {
  const client = requireClient();
  const {
    data: { user },
    error: userError,
  } = await client.auth.getUser();
  await assertNoError(userError);
  if (!user) throw new Error('Нужно войти в аккаунт');

  const ext = file.name?.split('.').pop() || 'bin';
  const path = `${user.id}/${crypto.randomUUID()}.${ext}`;

  const { error: uploadError } = await client.storage.from('media').upload(path, file, {
    cacheControl: '3600',
    upsert: false,
    contentType: file.type || undefined,
  });
  await assertNoError(uploadError);

  const { data } = client.storage.from('media').getPublicUrl(path);
  return data.publicUrl;
}

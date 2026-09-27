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

function mapAccount(row) {
  if (!row) return row;
  return { ...row, balance: Number(row.balance) };
}

function mapMovement(row) {
  if (!row) return row;
  return { ...row, amount: Number(row.amount) };
}

function mapHolding(row) {
  if (!row) return row;
  return {
    ...row,
    quantity: Number(row.quantity),
    purchase_price: Number(row.purchase_price),
    current_price: Number(row.current_price),
  };
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

const ACCOUNT_FIELDS = ['name', 'type', 'currency', 'note', 'sort_order'];
const MOVEMENT_FIELDS = ['account_id', 'type', 'amount', 'note', 'occurred_at'];
const HOLDING_FIELDS = [
  'account_id',
  'asset_type',
  'ticker',
  'name',
  'quantity',
  'purchase_price',
  'current_price',
  'currency',
  'purchase_date',
  'note',
];

export const accountApi = {
  async list() {
    const data = await runQuery((client) =>
      client
        .from('wealthera_accounts')
        .select('*')
        .order('sort_order', { ascending: true })
        .order('created_at', { ascending: true }),
    );
    return (data ?? []).map(mapAccount);
  },

  async create(payload) {
    const data = await runQuery((client) =>
      client.from('wealthera_accounts').insert(pick(payload, ACCOUNT_FIELDS)).select().single(),
    );
    return mapAccount(data);
  },

  async update(id, payload) {
    const data = await runQuery((client) =>
      client
        .from('wealthera_accounts')
        .update(pick(payload, ACCOUNT_FIELDS))
        .eq('id', id)
        .select()
        .single(),
    );
    return mapAccount(data);
  },

  async remove(id) {
    await runQuery((client) => client.from('wealthera_accounts').delete().eq('id', id));
  },
};

export const movementApi = {
  async listByAccount(accountId) {
    const data = await runQuery((client) =>
      client
        .from('wealthera_movements')
        .select('*')
        .eq('account_id', accountId)
        .order('occurred_at', { ascending: false })
        .order('created_at', { ascending: false }),
    );
    return (data ?? []).map(mapMovement);
  },

  async listAll() {
    const data = await runQuery((client) =>
      client
        .from('wealthera_movements')
        .select('*')
        .order('occurred_at', { ascending: true })
        .order('created_at', { ascending: true }),
    );
    return (data ?? []).map(mapMovement);
  },

  async create(payload) {
    const data = await runQuery((client) =>
      client.from('wealthera_movements').insert(pick(payload, MOVEMENT_FIELDS)).select().single(),
    );
    return mapMovement(data);
  },

  async remove(id) {
    await runQuery((client) => client.from('wealthera_movements').delete().eq('id', id));
  },
};

export const holdingApi = {
  async list() {
    const data = await runQuery((client) =>
      client.from('wealthera_holdings').select('*').order('created_at', { ascending: false }),
    );
    return (data ?? []).map(mapHolding);
  },

  async create(payload) {
    const data = await runQuery((client) =>
      client.from('wealthera_holdings').insert(pick(payload, HOLDING_FIELDS)).select().single(),
    );
    return mapHolding(data);
  },

  async update(id, payload) {
    const data = await runQuery((client) =>
      client
        .from('wealthera_holdings')
        .update(pick(payload, HOLDING_FIELDS))
        .eq('id', id)
        .select()
        .single(),
    );
    return mapHolding(data);
  },

  async remove(id) {
    await runQuery((client) => client.from('wealthera_holdings').delete().eq('id', id));
  },
};

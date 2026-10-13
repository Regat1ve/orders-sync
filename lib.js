// Нормализация и дедупликация заявок. Чистая функция: один и тот же вход всегда даёт один и тот же выход.

// К формату +7XXXXXXXXXX. 11 цифр с 7 или 8 в начале, либо 10 цифр (номер без кода страны). Иначе null.
function normalizePhone(raw) {
  const d = String(raw ?? '').replace(/\D/g, '');
  if (d.length === 11 && (d[0] === '7' || d[0] === '8')) return '+7' + d.slice(1);
  if (d.length === 10) return '+7' + d;
  return null;
}

// Дубль по телефону: побеждает больший amount, при равенстве более поздний created_at.
function better(a, b) {
  if (a.amount !== b.amount) return a.amount > b.amount ? a : b;
  return Date.parse(a.created_at) >= Date.parse(b.created_at) ? a : b;
}

function sync(orders) {
  const byPhone = new Map();
  let invalid = 0;
  for (const o of orders) {
    const phone = normalizePhone(o.phone);
    if (!phone) { invalid++; continue; }
    const rec = { ...o, phone, amount: Number(o.amount) || 0 };
    byPhone.set(phone, byPhone.has(phone) ? better(byPhone.get(phone), rec) : rec);
  }
  const clients = [...byPhone.values()]
    .sort((a, b) => a.id - b.id)
    .map(({ name, phone, email, amount }) => ({ name, phone, email, amount }));
  const valid = orders.length - invalid;
  return {
    clients,
    stats: { received: orders.length, unique: clients.length, duplicates_merged: valid - clients.length, invalid_dropped: invalid },
  };
}

module.exports = { normalizePhone, sync };

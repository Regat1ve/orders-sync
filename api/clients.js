const { sync } = require('../lib');

const ORDERS_URL = process.env.ORDERS_URL || 'https://test.ooobs.ru/api/orders';

module.exports = async (req, res) => {
  try {
    const r = await fetch(ORDERS_URL, { cache: 'no-store' });
    if (!r.ok) throw new Error('orders endpoint responded ' + r.status);
    const orders = await r.json();
    if (!Array.isArray(orders)) throw new Error('orders endpoint did not return an array');
    res.setHeader('Cache-Control', 'no-store');
    res.status(200).json(sync(orders));
  } catch (e) {
    res.status(502).json({ error: String(e.message || e) });
  }
};

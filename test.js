// node test.js — проверка на реальном наборе из задания (orders.fixture.json)
const assert = require('assert');
const { normalizePhone, sync } = require('./lib');

assert.strictEqual(normalizePhone('8 (999) 123 45 67'), '+79991234567');
assert.strictEqual(normalizePhone('+7-926-123-45-67'), '+79261234567');
assert.strictEqual(normalizePhone('9005551212'), '+79005551212');
assert.strictEqual(normalizePhone('+7 999'), null);
assert.strictEqual(normalizePhone('не указан'), null);

const out = sync(require('./orders.fixture.json'));
assert.deepStrictEqual(out.stats, { received: 17, unique: 8, duplicates_merged: 5, invalid_dropped: 4 });
const by = Object.fromEntries(out.clients.map(c => [c.phone, c]));
assert.strictEqual(by['+79991234567'].amount, 5000);         // максимальный amount
assert.strictEqual(by['+79160000001'].name, 'Мария С.');     // равные amount: более поздняя запись
assert.strictEqual(by['+79219998877'].amount, 1500);
assert.deepStrictEqual(sync(require('./orders.fixture.json')), out); // повторный прогон даёт то же самое
console.log('ok', JSON.stringify(out.stats));

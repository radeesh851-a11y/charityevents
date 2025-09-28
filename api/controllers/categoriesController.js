const { pool } = require('../event_db');

async function listCategories(req, res, next) {
  try {
    const [rows] = await pool.execute('SELECT category_id, name FROM categories ORDER BY name ASC');
    res.json({ data: rows });
  } catch (err) {
    next(err);
  }
}

module.exports = { listCategories };

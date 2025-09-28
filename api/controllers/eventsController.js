const { pool } = require('../event_db');

async function listEvents(req, res, next) {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 100);
    const offset = (page - 1) * limit;

    // Test database connection first
    try {
      await pool.query('SELECT 1');
    } catch (dbError) {
      console.error('Database connection error:', dbError.message);
      return res.status(500).json({ 
        error: 'Database connection failed', 
        message: 'Please ensure the database is running and accessible' 
      });
    }

    // Full query with all fields using proper parameters
    const [rows] = await pool.query(`
      SELECT e.event_id, e.title, e.short_description, e.start_datetime, e.end_datetime,
             e.location, e.price, e.goal_amount, e.progress_amount,
             o.name AS org_name, c.name AS category_name
      FROM events e
      JOIN organisations o ON e.org_id = o.org_id
      JOIN categories c ON e.category_id = c.category_id
      WHERE e.status = 'active'
      ORDER BY e.start_datetime ASC
      LIMIT ? OFFSET ?
    `, [limit, offset]);

    const data = rows.map(r => {
      const percent = r.goal_amount && r.goal_amount > 0
        ? Math.round((Number(r.progress_amount) / Number(r.goal_amount)) * 100)
        : 0;
      return { ...r, progress_percent: percent };
    });

    // Get total count for proper pagination
    const [countRows] = await pool.query(`
      SELECT COUNT(*) AS total FROM events e 
      WHERE e.status = 'active'
    `);
    const total = countRows[0].total || 0;

    res.json({
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    next(err);
  }
}

async function searchEvents(req, res, next) {
  try {
    const { date, location, category } = req.query;
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 10, 1), 100);
    const offset = (page - 1) * limit;

    // Test database connection first
    try {
      await pool.query('SELECT 1');
    } catch (dbError) {
      console.error('Database connection error:', dbError.message);
      return res.status(500).json({ 
        error: 'Database connection failed', 
        message: 'Please ensure the database is running and accessible' 
      });
    }

    let where = `WHERE e.status = 'active'`;
    const whereParams = [];

    if (date && date.trim()) {
      where += ' AND DATE(e.start_datetime) = ?';
      whereParams.push(date);
    }
    if (location && location.trim()) {
      where += ' AND e.location LIKE ?';
      whereParams.push(`%${location}%`);
    }
    if (category && category.trim()) {
      where += ' AND e.category_id = ?';
      whereParams.push(Number(category));
    }

    // Count query with proper parameters
    const countSql = `SELECT COUNT(*) AS total FROM events e ${where}`;
    const [countRows] = await pool.query(countSql, whereParams);
    const total = countRows[0].total || 0;

    // Main query with proper parameter order
    const sql = `
      SELECT e.event_id, e.title, e.short_description, e.start_datetime, e.end_datetime,
             e.location, e.price, e.goal_amount, e.progress_amount,
             o.name AS org_name, c.name AS category_name
      FROM events e
      JOIN organisations o ON e.org_id = o.org_id
      JOIN categories c ON e.category_id = c.category_id
      ${where}
      ORDER BY e.start_datetime ASC
      LIMIT ? OFFSET ?
    `;
    
    // Ensure we have the correct number of parameters
    const queryParams = [...whereParams, limit, offset];
    const [rows] = await pool.query(sql, queryParams);

    const data = rows.map(r => {
      const percent = r.goal_amount && r.goal_amount > 0
        ? Math.round((Number(r.progress_amount) / Number(r.goal_amount)) * 100)
        : 0;
      return { ...r, progress_percent: percent };
    });

    res.json({
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (err) {
    next(err);
  }
}

async function getEventById(req, res, next) {
  try {
    const eventId = Number(req.params.id);
    if (!Number.isInteger(eventId) || eventId <= 0) {
      return res.status(400).json({ error: 'Invalid event id' });
    }

    // Test database connection first
    try {
      await pool.query('SELECT 1');
    } catch (dbError) {
      console.error('Database connection error:', dbError.message);
      return res.status(500).json({ 
        error: 'Database connection failed', 
        message: 'Please ensure the database is running and accessible' 
      });
    }

    const sql = `
      SELECT e.*, o.name AS org_name, o.contact_email, o.contact_phone,
             c.name AS category_name
      FROM events e
      JOIN organisations o ON e.org_id = o.org_id
      JOIN categories c ON e.category_id = c.category_id
      WHERE e.event_id = ?
      LIMIT 1
    `;
    const [rows] = await pool.query(sql, [eventId]);
    if (!rows.length) return res.status(404).json({ error: 'Event not found' });
    const event = rows[0];

    const [images] = await pool.query(
      'SELECT image_id, url, alt_text, is_featured FROM event_images WHERE event_id = ? ORDER BY is_featured DESC, image_id ASC',
      [eventId]
    );

    const [tags] = await pool.query(
      `SELECT t.tag_id, t.name FROM tags t
       JOIN event_tags et ON et.tag_id = t.tag_id
       WHERE et.event_id = ?`,
      [eventId]
    );

    const [regSummary] = await pool.query(
      `SELECT COALESCE(SUM(num_tickets),0) AS tickets_sold, COALESCE(SUM(amount_paid),0) AS amount_received
       FROM registrations WHERE event_id = ?`,
      [eventId]
    );

    const tickets_sold = regSummary[0].tickets_sold || 0;
    const amount_received = Number(regSummary[0].amount_received || 0);

    const goal = Number(event.goal_amount || 0);
    const progress = Number(event.progress_amount || 0) + amount_received;
    const progress_percent = goal > 0 ? Math.round((progress / goal) * 100) : 0;

    const result = {
      event: {
        event_id: event.event_id,
        title: event.title,
        short_description: event.short_description,
        full_description: event.full_description,
        start_datetime: event.start_datetime,
        end_datetime: event.end_datetime,
        location: event.location,
        price: event.price,
        goal_amount: goal,
        progress_amount: progress,
        progress_percent,
        status: event.status,
        created_at: event.created_at,
        category: {
          category_id: event.category_id,
          name: event.category_name
        },
        organisation: {
          org_id: event.org_id,
          name: event.org_name,
          contact_email: event.contact_email,
          contact_phone: event.contact_phone
        }
      },
      images,
      tags,
      registrations: {
        tickets_sold,
        amount_received
      }
    };

    res.json(result);
  } catch (err) {
    next(err);
  }
}

async function testDatabase(req, res, next) {
  try {
    // Test basic connection
    const [result] = await pool.execute('SELECT 1 as test');
    console.log('Basic connection test:', result);
    
    // Test if tables exist
    const [tables] = await pool.execute('SHOW TABLES');
    console.log('Available tables:', tables);
    
    // Test if events table has data
    const [events] = await pool.execute('SELECT COUNT(*) as count FROM events');
    console.log('Events count:', events);
    
    // Test simple events query without parameters
    const [simpleEvents] = await pool.execute('SELECT event_id, title FROM events LIMIT 3');
    console.log('Simple events query:', simpleEvents);
    
    // Test with parameters using query instead of execute
    const [paramEvents] = await pool.query('SELECT event_id, title FROM events LIMIT ? OFFSET ?', [2, 0]);
    console.log('Parameterized events query:', paramEvents);
    
    res.json({
      connection: 'OK',
      tables: tables.map(t => Object.values(t)[0]),
      eventsCount: events[0].count,
      simpleEvents,
      paramEvents
    });
  } catch (err) {
    console.error('Database test error:', err);
    res.status(500).json({ 
      error: 'Database test failed', 
      message: err.message,
      code: err.code
    });
  }
}

module.exports = {
  listEvents,
  searchEvents,
  getEventById,
  testDatabase
};

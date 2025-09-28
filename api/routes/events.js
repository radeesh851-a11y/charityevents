const express = require('express');
const router = express.Router();
const { query, param } = require('express-validator');
const { listEvents, searchEvents, getEventById, testDatabase } = require('../controllers/eventsController');
const validate = require('../middlewares/validate');

router.get(
  '/',
  [
    query('upcoming').optional().isBoolean().toBoolean(),
    query('page').optional().isInt({ min: 1 }).toInt(),
    query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
    query('sort').optional().isIn(['date_asc', 'date_desc', 'progress'])
  ],
  validate,
  listEvents
);

router.get(
  '/search',
  [
    query('date').optional().isISO8601(),
    query('location').optional().isString(),
    query('category').optional().isInt().toInt(),
    query('page').optional().isInt({ min: 1 }).toInt(),
    query('limit').optional().isInt({ min: 1, max: 100 }).toInt()
  ],
  validate,
  searchEvents
);

router.get(
  '/:id',
  [param('id').isInt().toInt()],
  validate,
  getEventById
);

// router.get('/test/database', testDatabase); // Debug endpoint - commented out

module.exports = router;

const express = require('express');
const router = express.Router();
const supabase = require('../config/supabase');

router.get('/', async (req, res) => {
  let dbStatus = 'disconnected';

  try {
    const { error } = await supabase.from('devices').select('id', { count: 'exact', head: true });
    if (!error) {
      dbStatus = 'connected';
    } else {
      console.warn('Database health check warning:', error.message);
      // Even if table doesn't exist yet, DB client connection succeeded
      if (error.code === '42P01') {
        dbStatus = 'connected (tables missing)';
      }
    }
  } catch (err) {
    dbStatus = 'disconnected';
  }

  return res.status(200).json({
    success: true,
    status: 'healthy',
    database: dbStatus,
    timestamp: new Date().toISOString(),
  });
});

module.exports = router;

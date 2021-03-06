/**
 * Main application routes
 */

'use strict';

import errors from './components/errors';
import path from 'path';

export default function(app) {
  // Insert routes below
  app.use('/api/locals', require('./api/local'));
  app.use('/api/projects', require('./api/project'));
  app.use('/api/reviews', require('./api/review'));
  app.use('/api/things', require('./api/thing'));
  app.use('/api/users', require('./api/user'));
   
  app.use('/auth', require('./auth'));

  // All undefined asset or api routes should return a 404
  app.route('/:url(api|uploads||auth|components|app|bower_components|assets)/*')
   .get(errors[404]);

  // All other routes should redirect to the index.html
  app.route('/*')
    .get((req, res) => {
      res.sendFile(path.resolve(app.get('appPath') + '/index.html'));
    });
}

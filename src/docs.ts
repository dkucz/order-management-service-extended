// This module sets up the swagger UI route.
// Kept separate from app.ts so we can tree-shake it in prod if we ever want to
// (we probably won't but it seemed like a good idea at the time)

import { Router } from 'express';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './config/swagger';

const router = Router();

// serve the raw OpenAPI JSON spec - useful for importing into Postman, Insomnia, etc.
// also used by the CI pipeline to diff the spec and catch breaking changes (see .github/workflows/ci.yml)
router.get('/docs/spec.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// swagger UI - disable in prod via env var if we decide we don't want it public
// currently leaving it on everywhere because the frontend team keeps asking for it
const swaggerUiOptions: swaggerUi.SwaggerUiOptions = {
  customCss: '.swagger-ui .topbar { display: none }', // hide the ugly swagger top bar
  customSiteTitle: 'Order API Docs',
  swaggerOptions: {
    // this makes swagger UI try to preserve auth token between page refreshes
    // uses localStorage internally, not ideal but its a dev tool so whatever
    persistAuthorization: true,
    // collapse all endpoints by default - the expanded view is overwhelming
    docExpansion: 'none',
    filter: true,
  },
};

router.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, swaggerUiOptions));

export default router;

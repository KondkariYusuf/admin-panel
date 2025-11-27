// routes/portfolioRoute.js
const express = require('express');
const router = express.Router();
const controller = require('../controller/portfolioController');

// Portfolio CRUD
router.post('/', controller.createPortfolio);
router.get('/', controller.getPortfolio);
router.get('/:id', controller.getPortfolio);
router.put('/:id', controller.updatePortfolio);
router.delete('/:id', controller.deletePortfolio);

// Projects (subdocuments)
// Add project
router.post('/:id/projects', controller.addProject);
// Get all projects
router.get('/:id/projects', controller.getAllProjects);
// Get single project
router.get('/:portfolioId/projects/:projectId', controller.getProjectById);
// **Update project** <- this is the PUT you need
router.put('/:portfolioId/projects/:projectId', controller.updateProject);
// Delete project
router.delete('/:portfolioId/projects/:projectId', controller.deleteProject);



module.exports = router;

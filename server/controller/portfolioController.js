const mongoose = require('mongoose');
const Portfolio = require('../models/portfolio');

const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

const getPortfolioDoc = async (portfolioId) => {
  if (portfolioId) {
    if (!isValidId(portfolioId)) return null;
    return await Portfolio.findById(portfolioId);
  }
  return await Portfolio.findOne();
};

//portfolio
const createPortfolio = async (req, res) => {
  try {
    const { recentWork, projects } = req.body || {};

    if (!recentWork && !projects) {
      return res.status(400).json({ message: 'Request body is empty. Send recentWork and/or projects.' });
    }

    if (recentWork) {
      const { heading, subheading } = recentWork;
      if (!heading || !subheading) {
        return res.status(400).json({
          message: 'recentWork.heading and recentWork.subheading are required when sending recentWork'
        });
      }
    }

    const newPortfolio = new Portfolio({ recentWork, projects });
    await newPortfolio.save();
    res.status(201).json({ message: 'Portfolio created', portfolio: newPortfolio });
  } catch (error) {
    console.error('createPortfolio error:', error);
    res.status(500).json({ message: 'Error creating portfolio', error: error.message });
  }
};

const getPortfolio = async (req, res) => {
  try {
    const portfolioId = req.params.id;
    const portfolio = await getPortfolioDoc(portfolioId);
    if (!portfolio) return res.status(404).json({ message: 'Portfolio not found' });
    res.status(200).json(portfolio);
  } catch (error) {
    console.error('getPortfolio error:', error);
    res.status(500).json({ message: 'Error fetching portfolio', error: error.message });
  }
};

const updatePortfolio = async (req, res) => {
  try {
    const portfolioId = req.params.id;
    const portfolio = await getPortfolioDoc(portfolioId);
    if (!portfolio) return res.status(404).json({ message: 'Portfolio not found' });

    const { recentWork, projects } = req.body || {};
    if (recentWork) {
      // preserve existing recentWork fields when merging
      portfolio.recentWork = {
        ...((portfolio.recentWork && portfolio.recentWork.toObject) ? portfolio.recentWork.toObject() : portfolio.recentWork),
        ...recentWork
      };
    }
    if (projects) portfolio.projects = projects;

    await portfolio.save();
    res.status(200).json({ message: 'Portfolio updated', portfolio });
  } catch (error) {
    console.error('updatePortfolio error:', error);
    res.status(500).json({ message: 'Error updating portfolio', error: error.message });
  }
};

const deletePortfolio = async (req, res) => {
  try {
    const portfolioId = req.params.id;
    let deleted;
    if (portfolioId) {
      if (!isValidId(portfolioId)) return res.status(400).json({ message: 'Invalid portfolio id' });
      deleted = await Portfolio.findByIdAndDelete(portfolioId);
    } else {
      const first = await Portfolio.findOne();
      if (!first) return res.status(404).json({ message: 'Portfolio not found' });
      deleted = await Portfolio.findByIdAndDelete(first._id);
    }

    if (!deleted) return res.status(404).json({ message: 'Portfolio not found' });
    res.status(200).json({ message: 'Portfolio deleted', portfolio: deleted });
  } catch (error) {
    console.error('deletePortfolio error:', error);
    res.status(500).json({ message: 'Error deleting portfolio', error: error.message });
  }
};

//project

const addProject = async (req, res) => {
  try {
    const portfolioId = req.params.id;
    const portfolio = await getPortfolioDoc(portfolioId);
    if (!portfolio) return res.status(404).json({ message: 'Portfolio not found' });

    const { title, year, category, imageUrl } = req.body || {};
    if (!title || !year || !category || !imageUrl) {
      return res.status(400).json({ message: 'title, year, category and imageUrl are required' });
    }

    portfolio.projects.push({ title, year, category, imageUrl });
    await portfolio.save();

    const added = portfolio.projects[portfolio.projects.length - 1];
    res.status(201).json({ message: 'Project added', project: added });
  } catch (error) {
    console.error('addProject error:', error);
    res.status(500).json({ message: 'Error adding project', error: error.message });
  }
};

const getAllProjects = async (req, res) => {
  try {
    const { page = 1, limit = 50 } = req.query;
    const portfolioId = req.params.id;
    const portfolio = await getPortfolioDoc(portfolioId);
    if (!portfolio) return res.status(404).json({ message: 'Portfolio not found' });

    const start = (Number(page) - 1) * Number(limit);
    const projects = portfolio.projects.slice(start, start + Number(limit));
    res.status(200).json({ total: portfolio.projects.length, projects });
  } catch (error) {
    console.error('getAllProjects error:', error);
    res.status(500).json({ message: 'Error fetching projects', error: error.message });
  }
};

const getProjectById = async (req, res) => {
  try {
    const { portfolioId, projectId } = req.params;
    const portfolio = await getPortfolioDoc(portfolioId);
    if (!portfolio) return res.status(404).json({ message: 'Portfolio not found' });

    const project = portfolio.projects.id(projectId);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    res.status(200).json(project);
  } catch (error) {
    console.error('getProjectById error:', error);
    res.status(500).json({ message: 'Error fetching project', error: error.message });
  }
};

const updateProject = async (req, res) => {
  try {
    const { portfolioId, projectId } = req.params;
    const portfolio = await getPortfolioDoc(portfolioId);
    if (!portfolio) return res.status(404).json({ message: 'Portfolio not found' });

    const project = portfolio.projects.id(projectId);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    const allowed = ['title', 'year', 'category', 'imageUrl'];
    allowed.forEach((field) => {
      if (req.body && req.body[field] !== undefined) project[field] = req.body[field];
    });

    await portfolio.save();
    res.status(200).json({ message: 'Project updated', project });
  } catch (error) {
    console.error('updateProject error:', error);
    res.status(500).json({ message: 'Error updating project', error: error.message });
  }
};

const deleteProject = async (req, res) => {
    try {
      const { portfolioId, projectId } = req.params;
      const portfolio = await getPortfolioDoc(portfolioId);
      if (!portfolio) return res.status(404).json({ message: "Portfolio not found" });
  
      const project = portfolio.projects.id(projectId);
      if (!project) return res.status(404).json({ message: "Project not found" });
  
      portfolio.projects.pull({ _id: projectId });
  
      await portfolio.save();
  
      res.status(200).json({ message: "Project deleted successfully" });
    } catch (error) {
      console.error("deleteProject error:", error);
      res.status(500).json({ message: "Error deleting project", error: error.message });
    }
  };
  



module.exports = {
  createPortfolio,
  getPortfolio,
  updatePortfolio,
  deletePortfolio,
  addProject,
  getAllProjects,
  getProjectById,
  updateProject,
  deleteProject,
  
};

const express = require('express')
const router = express.Router()
const { checkJWT, checkRole } = require('../controllers/auth')
const { getPortfolios, getPortfolioById, createPortfolio, updatePortfolio, deletePortfolio } = require('../controllers/portfolios')

router.get('', getPortfolios)

router.get('/:id', getPortfolioById)

router.post('', checkJWT, checkRole('admin'), createPortfolio)

router.patch('/:id', checkJWT, checkRole('admin'), updatePortfolio)

router.delete('/:id', checkJWT, checkRole('admin'), deletePortfolio)

module.exports = router
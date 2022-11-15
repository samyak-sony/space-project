//using the built in express router
const express = require('express');

const {
    httpGetAllPlanets,
} = require('./planets.controller');

const planetsRouter = express.Router(); // on this planetsRouter we can define all our routes
planetsRouter.get('/',httpGetAllPlanets);
module.exports = planetsRouter;

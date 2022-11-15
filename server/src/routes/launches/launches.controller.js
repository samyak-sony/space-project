const {
    getAllLaunches,
    existsLaunchWithId,
    abortLaunchById,
    scheduleNewLaunch} = require('../../models/launches.models');
const {
    getPagination,
} = require('../../services/query');

async function httpGetAllLaunches(req,res) {

    const {skip,limit} = getPagination(req.query);
    const launches = await getAllLaunches(skip,limit);
    return res.status(200).json(launches);   
}

async function httpAddNewLaunch(req,res) {
    // the launch data will come back through request body
    const launch = req.body;

    if(!launch.mission || !launch.rocket || !launch.launchDate || !launch.target) {
        return res.status(400).json({
            error: 'Missing required properties',
        });
    }
    launch.launchDate = new Date(launch.launchDate);

    //if there is a false value (i.e not a date) then isNaN === true and if is executed
    if(isNaN(launch.launchDate)) {
        return res.status(400).json({
            error: 'Invalid launch date',
        });
    }
    
    await scheduleNewLaunch(launch);
    console.log(launch);
    return res.status(201).json(launch);
}

async function httpAbortLaunch(req,res) {
    //get that launch id which is passed in as parameter to our routes
    const launchId = Number(req.params.id);
    const existsLaunch = await existsLaunchWithId(launchId);
    if(!existsLaunch){
        return res.status(404).json({
            error: 'Launch not found',
        });
    }

    const aborted = await abortLaunchById(launchId);
    if(!aborted) {
        return res.status(400).json({
            error: 'Launch not aborted',
        });
    }
    return res.status(200).json({
        ok:true,
    });
      
}

module.exports = {
    httpGetAllLaunches,
    httpAddNewLaunch,
    httpAbortLaunch,
};
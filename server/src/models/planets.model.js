const path = require('path');
const {parse} = require('csv-parse');
const fs = require('fs');
const { rejects } = require('assert');
const { resolve } = require('path');
const planets = require('./planets.mongo');
//in Node all streams are implemented using the event emitter
//where the events are emitted by node and we just react to the events on that stream using the ON() function
//It is a good idea to stream large data sets and we are going to be using the streaming capabilities of node to read in the data from kepler
//const habitablePlanets = [];
// open a file as a readable stream and returns a readable stream which is a kind of event emitter

function isHabitablePlanet(planet) {
    return planet['koi_disposition'] === 'CONFIRMED'
     && planet['koi_insol'] > 0.36 && planet['koi_insol'] < 1.11
     && planet['koi_prad'] < 1.6;
}

// the pipe() connects the two streams together. It is meant to connect a readable stream source to a writable stream destination




function loadPlanetsData()  {
    return new Promise((resolve,reject)=>{
        fs.createReadStream(path.join(__dirname,'..','..','data','kepler_data.csv'))
            .pipe(parse({ 
                comment: '#',
                columns: true,
            })) // the data we get back from the parse() is the parsed
            .on('data',async (data)=>{
                if(isHabitablePlanet(data)) {
                    //TODO: replace below create with insert + update = upsert
                   await savePlanet(data);
                }
            })
            .on('error',(err)=>{
                console.log(err);
                reject(err);
            })
            .on('end',async()=>{
                const countPlanetsFound = (await getAllPlanets()).length;
                console.log(`${countPlanetsFound} habitable planets found!!!! \n`);
                resolve();
            }); 
    });
        

}

// WE GET THIS ARRAY OF BUFFERS THESE BUFFERS ARE OBJECTS THAT NODE USES TO REPRESENT A COLLECTION OF BITES
// BECAUSE OUR READ STREAM IS READING THE RAW DATA IN OUR FILE AS BITS AND BYTES SO WERE READING IN OUR FILE AND
// OUR POTENTIAL PLANETS BUT WE STILL NEED TO PARSE THE RESULTS


async function getAllPlanets() {
    return await planets.find({});
}

async function savePlanet(planet) {
    try {
        await planets.updateOne({
            keplerName: planet.kepler_name,
        },{
            keplerName: planet.kepler_name,
        },{
            upsert: true,
        });
    }catch(err) {
        console.error(`could not save planet ${err}`);
    }
}

module.exports = {
    loadPlanetsData,
    getAllPlanets,
};
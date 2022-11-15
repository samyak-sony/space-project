const request = require('supertest');
const app = require('../../app');
const { 
    mongoConnect,
    mongoDisconnect,
 } = require('../../services/mongo');

describe('Launches API',()=>{
    //setup set to our launchesAPI test
    beforeAll(async()=>{
        //whatver is in this callback will run once to setup all the tests that come after
        await mongoConnect();
    });

    afterAll(async()=>{
        await mongoDisconnect();
    });
    
    describe('Test GET /launches',()=>{
        //name of our test
        test('It should respond with 200 success',async ()=>{
            const response = await request(app)
            .get('/v1/launches')
            .expect('Content-Type',/json/)
            .expect(200);
            //assertions (down below)
            //expect(response.statusCode).toBe(200);
        });
    });

    describe('Test POST /launch',()=>{
        const completeLaunchData = {
            mission: 'DRAIN GANG',
            rocket: 'Bladee rocket',
            target: 'Kepler-62 f',
            launchDate: 'April 9,2028',
        };

        const launchDataWithoutDate = {
            mission: 'DRAIN GANG',
            rocket: 'Bladee rocket',
            target: 'Kepler-62 f',
        };

        const invalidDate = {
            mission: 'DRAIN GANG',
            rocket: 'Bladee rocket',
            target: 'Kepler-62 f',
            launchDate: 'drain',
        };


        test('It should respond with 201 created',async ()=>{
            const response = await request(app)
                .post('/v1/launches')
                .send(completeLaunchData)
                .expect('Content-Type', /json/)
                .expect(201);

            // whenever we check the body we use the jest assertions 
            const requestDate = new Date(completeLaunchData.launchDate).valueOf();
            const responseDate = new Date(response.body.launchDate).valueOf();
            expect(responseDate).toBe(requestDate);
            expect(response.body).toMatchObject(launchDataWithoutDate);
        });


        test('It should catch missing required properties',async()=>{
            const response = await request(app)
                .post('/v1/launches')
                .send(launchDataWithoutDate)
                .expect('Content-Type', /json/)
                .expect(400);
            expect(response.body).toStrictEqual({
                error:'Missing required properties',
            });

        });

        test('It should catchh invalid dates',async()=>{
            const response = await request(app)
                .post('/v1/launches')
                .send(invalidDate)
                .expect('Content-Type', /json/)
                .expect(400);
            expect(response.body).toStrictEqual({
                error:'Invalid launch date',
            });

        });
    });
});

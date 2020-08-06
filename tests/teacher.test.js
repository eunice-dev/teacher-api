const request = require('supertest');
const app = require('../app');

describe('/POST register', () => {
    it('should return 204 to register students to a specified teacher', async () => {
        const res = await request(app)
            .post('/register')
            .send({
                teacher: "teacherken@gmail.com",
                students: [
                    "studentbob@gmail.com"
                ]
            });
        expect(res.statusCode).toEqual(204);
    });

    it('should return 400 as students parameter is missing', async () => {
        const res = await request(app)
            .post('/register')
            .send({
                teacher: "teacherken@gmail.com"
            });
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('message');
    });

    it('should return 400 as students parameter is not an array', async () => {
        const res = await request(app)
            .post('/register')
            .send({
                teacher: "teacherken@gmail.com",
                students: "studentjon@gmail.com"
            });
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('message');
    });

    it('should return 500 as teacher parameter is not a string', async () => {
        const res = await request(app)
            .post('/register')
            .send({
                teacher: 1,
                students: [
                    "studentbob@gmail.com"
                ]
            });
        expect(res.statusCode).toEqual(500);
        expect(res.body).toHaveProperty('message');
    });
});

describe('/GET commonstudents', () => {
    it('should return 200 to retrieve a list of students', async () => {
        const res = await request(app)
            .get('/commonstudents')
            .query({ teacher: 'teacherken@gmail.com' });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('students');
    });

    it('should return 400 as teacher query string is not provided', async () => {
        const res = await request(app)
            .get('/commonstudents');
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('message');
    });
});

describe('/POST suspend', () => {
    it('should return 204 to suspend a specified student', async () => {
        const res = await request(app)
            .post('/suspend')
            .send({
                student: "studentmary@gmail.com"
            });
        expect(res.statusCode).toEqual(204);
    });

    it('should return 400 as student parameter is missing', async () => {
        const res = await request(app)
            .post('/suspend');
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('message');
    });

    it('should return 200 with student not exist message', async () => {
        const res = await request(app)
            .post('/suspend')
            .send({
                student: "notexiststudent@gmail.com"
            });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('message');
    });

    it('should return 500 as student is not a string', async () => {
        const res = await request(app)
            .post('/suspend')
            .send({
                student: 1
            });
        expect(res.statusCode).toEqual(500);
        expect(res.body).toHaveProperty('message');
    });
});

describe('/POST retrievefornotifications', () => {
    it('should return 200 to retrieve students who can receive notification', async () => {
        const res = await request(app)
            .post('/retrievefornotifications')
            .send({
                teacher: "teacherken@gmail.com",
                notification: "Hello students! @studentagnes@gmail.com @studentmiche@gmail.com"
            });
        expect(res.statusCode).toEqual(200);
        expect(res.body).toHaveProperty('recipients');
    });

    it('should return 400 as notification parameter is missing', async () => {
        const res = await request(app)
            .post('/retrievefornotifications')
            .send({
                teacher: "teacherken@gmail.com"
            });
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('message');
    });

    it('should return 500 as notification parameter is not a string', async () => {
        const res = await request(app)
            .post('/retrievefornotifications')
            .send({
                teacher: "teacherken@gmail.com",
                notification: 1
            });
        expect(res.statusCode).toEqual(500);
        expect(res.body).toHaveProperty('message');
    });
});
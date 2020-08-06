const pool = require('../data/config');

const router = app => {

    // Register students to a specified teacher
    app.post('/register', async (req, res) => {

        let bodyData = req.body;
        if (bodyData.teacher === undefined || bodyData.students === undefined) {
            return res.status(400).send({
                message: 'Teacher or students parameter is not provided.'
            });
        }

        if (!Array.isArray(bodyData.students)) {
            return res.status(400).send({
                message: 'Students parameter is not an array.'
            });
        }

        try {

            let teacherExist = await pool.query(`SELECT t.id, t.email FROM teachers t` +
                                                ` WHERE email = '${bodyData.teacher.toLowerCase()}';`);
            let teacherId;
            if (teacherExist.length) {
                teacherId = teacherExist[0].id;
            } else {
                let newTeacher = await pool.query(`INSERT INTO teachers (email) VALUES ('${bodyData.teacher.toLowerCase()}');`);
                teacherId = newTeacher.insertId;
            }
    
            for (i = 0; i < bodyData.students.length; i++) {
    
                let studentExist = await pool.query(`SELECT s.id, s.email FROM students s` +
                                                    ` WHERE email = '${bodyData.students[i].toLowerCase()}';`);
                let studentId;
                if (studentExist.length) {
                    studentId = studentExist[0].id;
                } else {
                    let newStudent = await pool.query(`INSERT INTO students (email) VALUES ('${bodyData.students[i].toLowerCase()}');`);
                    studentId = newStudent.insertId;
                }
                await pool.query(`INSERT INTO teachers_students (id_teacher, id_student)` +
                                ` SELECT ${teacherId}, ${studentId} FROM DUAL WHERE NOT EXISTS` +
                                ` (SELECT * FROM teachers_students WHERE id_teacher = ${teacherId} AND id_student = ${studentId});`);
    
            }
    
            res.status(204).send();

        } catch(err) {
            res.status(500).send({
                message: err.message
            });
        }
        
    });

    // Retrieve a list of students
    app.get('/commonstudents', async (req, res) => {

        if (typeof req.query.teacher === 'undefined') {
            return res.status(400).send({
                message: 'Teacher parameter is not provided.'
            });
        }

        try {

            let students = await pool.query(`SELECT s.email FROM students s JOIN teachers_students ts ON s.id = ts.id_student JOIN teachers t ON ts.id_teacher = t.id` +
                                            ` WHERE t.email = '${req.query.teacher.toLowerCase()}';`);
            
            students = students.map(function(a) {
                return a.email;
            });

            res.status(200).send({
                students: students
            });

        } catch(err) {
            res.status(500).send({
                message: err.message
            });
        }

    });

    // Suspend a specified student
    app.post('/suspend', async (req, res) => {

        let bodyData = req.body;
        if (bodyData.student === undefined) {
            return res.status(400).send({
                message: 'Student parameter is not provided.'
            });
        }

        try {

            let suspendStudent = await pool.query(`UPDATE students SET is_suspended = 1` +
                                                ` WHERE email = '${bodyData.student.toLowerCase()}';`);
    
            if (suspendStudent.affectedRows) {
                res.status(204).send();
            } else {
                res.status(200).send({
                    message: 'Student is not exist.'
                });
            }

        } catch(err) {
            res.status(500).send({
                message: err.message
            });
        }
        
    });

    // Retrieve students who can receive notification
    app.post('/retrievefornotifications', async (req, res) => {

        let bodyData = req.body;
        if (bodyData.teacher === undefined || bodyData.notification === undefined) {
            return res.status(400).send({
                message: 'Teacher or notification parameter is not provided.'
            });
        }

        try {

            let studentEmailsNotification = bodyData.notification.match(/([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi);
            let studentEmailsRegistered = await pool.query(`SELECT s.email FROM students s JOIN teachers_students ts ON s.id = ts.id_student JOIN teachers t ON ts.id_teacher = t.id` +
                                                            ` WHERE t.email = '${bodyData.teacher.toLowerCase()}' AND s.is_suspended = 0;`);
            
            studentEmailsRegistered = studentEmailsRegistered.map(function(a) {
                return a.email;
            });

            var studentEmailAll = new Set(studentEmailsRegistered.concat(studentEmailsNotification))
            var studentEmailFilter = Array.from(studentEmailAll)

            res.status(200).send({
                recipients: studentEmailFilter
            });

        } catch(err) {
            res.status(500).send({
                message: err.message
            });
        }
        
    });

}

module.exports = router;
const Pool = require('pg')

const pool = new Pool.Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'postgres',
    password: 'Warcraft',
    port: 5432,
})


const checkUserExist = async (request, response) => {
    const { email } = request.body;
    pool.query(`SELECT * FROM accounts WHERE email = $1`, [email], (error, results) => {
        if (error) {
            console.log(error)
            return response.status(400).json({ status: 'FAILED', message: 'Error' })
        }
        if (!results.rows.length) {
            return response.status(404).json({ status: 404, message: 'NOT FOUND' })
        }
        return response.status(200).json({ status: 200, message: 'SUCCESS', data: results.rows[0] })
    })
}

const getUsers = async (request, response) => {
    pool.query(`SELECT * FROM accounts `, (error, results) => {
        if (error) {
            console.log(error)
            return response.status(400).json({ status: 'FAILED', message: 'Error' })
        }
        if (!results.rows.length) {
            return response.status(404).json({ status: 404, message: 'NOT FOUND' })
        }
        return response.status(200).json({ status: 200, message: 'SUCCESS', data: results.rows })
    })
}

const getFavorites = async (request, response) => {
    const { email } = request.body

    response.setHeader('Content-Type', 'application/json');
    pool.query(`SELECT emailto FROM friends WHERE emailfrom = $1`,[email], (error, results) => {
        if (error) {
            console.log(error)
            return response.status(400).json({ status: 'FAILED', message: 'Error' })
        }
        return response.status(200).json({ status: 200, message: 'SUCCESS', data: results.rows })
    })
}

const getTests = async (request, response) => {

    response.setHeader('Content-Type', 'application/json');
    pool.query(`SELECT * FROM test`, (error, results) => {
        if (error) {
            console.log(error)
            return response.status(400).json({ status: 'FAILED', message: 'Error' })
        }
        return response.status(200).json({ status: 200, message: 'SUCCESS', data: results.rows })
    })
}

const deleteTest = async (request, response) => {
    const { testid } = request.body;

    response.setHeader('Content-Type', 'application/json');

    pool.query(`Delete FROM test where id = $1`, [testid], (error, results) => {
        if (error) {
            console.log(error);
            return response.status(400).json({ status: 'FAILED', message: 'Test delete error' })
        }
        return response.status(200).json({ status: 'SUCCESS', message: 'Test deleted added' })
    })
}

const getNotes = async (request, response) => {

    response.setHeader('Content-Type', 'application/json');
    pool.query(`SELECT * FROM notes`, (error, results) => {
        if (error) {
            console.log(error)
            return response.status(400).json({ status: 'FAILED', message: 'Error' })
        }
        return response.status(200).json({ status: 200, message: 'SUCCESS', data: results.rows })
    })
}

const setNote = async (request, response) => {
    const { emailfrom, emailto, notes } = request.body;

    response.setHeader('Content-Type', 'application/json');

    pool.query(`delete from notes where emailFrom = $1 and emailTo = $2`, [emailfrom, emailto], (error, results) => {
        if (error) {
            console.log(error);
            return response.status(400).json({ status: 'FAILED', message: 'Note add error' })
        }
    })

    pool.query(`insert into notes (emailFrom, emailTo, Note) values ($1, $2, $3)`, [emailfrom, emailto, notes], (error, results) => {
        if (error) {
            console.log(error);
            return response.status(400).json({ status: 'FAILED', message: 'Note add error' })
        }
        return response.status(200).json({ status: 'SUCCESS', message: 'Note added' })
    })
}

const getMessages = async (request, response) => {

    response.setHeader('Content-Type', 'application/json');
    pool.query(`SELECT * FROM chat`, (error, results) => {
        if (error) {
            console.log(error)
            return response.status(400).json({ status: 'FAILED', message: 'Error' })
        }
        return response.status(200).json({ status: 200, message: 'SUCCESS', data: results.rows })
    })
}

const setMessage = async (request, response) => {
    const { emailfrom, emailto, message } = request.body;

    response.setHeader('Content-Type', 'application/json');

    pool.query(`insert into chat (emailFrom, emailTo, message) values ($1, $2, $3)`, [emailfrom, emailto, message], (error, results) => {
        if (error) {
            console.log(error);
            return response.status(400).json({ status: 'FAILED', message: 'Note add error' })
        }
        return response.status(200).json({ status: 'SUCCESS', message: 'Note added' })
    })
}

const getTestsStatistic = async (request, response) => {

    response.setHeader('Content-Type', 'application/json');
    pool.query(`SELECT * FROM testStatistic`, (error, results) => {
        if (error) {
            console.log(error)
            return response.status(400).json({ status: 'FAILED', message: 'Error' })
        }
        return response.status(200).json({ status: 200, message: 'SUCCESS', data: results.rows })
    })
}


const saveTest = async (request, response) => {
    const { name, createemail, testdata, answers } = request.body;

    response.setHeader('Content-Type', 'application/json');

    pool.query(`insert into test (createEmail, testdata, answers, name) values ($1, $2, $3, $4)`, [createemail, testdata, answers, name], (error, results) => {
        if (error) {
            console.log(error);
            return response.status(400).json({ status: 'FAILED', message: 'Test add error' })
        }
        return response.status(200).json({ status: 'SUCCESS', message: 'Test added' })
    })
}

const editTest = async (request, response) => {
    const { id, testdata, answers } = request.body;

    response.setHeader('Content-Type', 'application/json');

    pool.query(`update test set testdata = $1, answers = $2 where id = $3`, [testdata, answers, id], (error, results) => {
        if (error) {
            console.log(error);
            return response.status(400).json({ status: 'FAILED', message: 'Test add error' })
        }
        return response.status(200).json({ status: 'SUCCESS', message: 'Test added' })
    })
}

const addFavorites = async (request, response) => {
    const { emailfrom, emailto } = request.body;

    response.setHeader('Content-Type', 'application/json');

    pool.query(`insert into friends (emailfrom, emailto) values ($1, $2)`, [emailfrom, emailto], (error, results) => {
        if (error) {
            console.log(error);
            return response.status(400).json({ status: 'FAILED', message: 'Friend add error' })
        }
        return response.status(200).json({ status: 'SUCCESS', message: 'Friend added' })
    })
}

const addTestStatistic = async (request, response) => {
    const { testid, useremail, score, rating } = request.body;
    response.setHeader('Content-Type', 'application/json');

    pool.query(`insert into testStatistic (testid, useremail, score, date, rating) values ($1, $2, $3, LOCALTIMESTAMP, $4)`, [testid, useremail,score, rating], (error, results) => {
        if (error) {
            console.log(error);
            return response.status(400).json({ status: 'FAILED', message: 'Statistic add error' })
        }
        return response.status(200).json({ status: 'SUCCESS', message: 'Statistic added' })
    })
}

const removeFavorites = async (request, response) => {
    const { emailfrom, emailto } = request.body;

    response.setHeader('Content-Type', 'application/json');

    pool.query(`delete from friends where emailfrom = $1 and emailto = $2`, [emailfrom, emailto], (error, results) => {
        if (error) {
            console.log(error);
            return response.status(400).json({ status: 'FAILED', message: 'Friend remove error' })
        }
        return response.status(200).json({ status: 'SUCCESS', message: 'Friend removed' })
    })

}

const getUserByEmail = async (email) => {
    return await pool.query('SELECT * FROM accounts WHERE email = $1', [email]);
}

const setNewUser = async (request, response) => {
    const { email, fullname, password, usertype } = request.body
    const checkIsUserExist = await getUserByEmail(email);

    response.setHeader('Content-Type', 'application/json');

    if (checkIsUserExist && !!checkIsUserExist.rows.length) {
        return response.status(400).json({ status: '400', message: 'User with such credentials already exist' })
    } else {
        pool.query(`insert into accounts (email, fullname, password, usertype) values ($1, $2, $3, $4)`, [email, fullname, password, usertype], (error, results) => {
            if (error) {
                console.log(error);
                return response.status(400).json({ status: 'FAILED', message: 'User already exist' })
            }
            return response.status(200).json({ status: 'SUCCESS', message: 'User created' })
        })
    }
}


module.exports = {

}
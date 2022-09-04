const pool = require('../db/pool.js');

async function create_question(question) {
    const client = await pool.connect();

    const { rows } = await client.query(
        `INSERT INTO questions(question, correct_answer, incorrect_answer1, incorrect_answer2, incorrect_answer3, incorrect_answer4)
    VALUES($1, $2, $3, $4, $5, $6) RETURNING *`,
        [question.question, question.correctAnswer, question.incorrectAnswer1, question.incorrectAnswer2, question.incorrectAnswer3, question.incorrectAnswer4]);

    client.release();
    return rows[0];
}

async function get_questions(quantity) {
    let questions = [];
    let answers;
    const client = await pool.connect();
    const { rows } = await client.query(`SELECT * FROM questions ORDER BY random() LIMIT $1`, [quantity]);
    for (const question of rows) {
        if (question.incorrect_answer3 == '' && question.incorrect_answer4 == '') {
            answers = [
                question.correct_answer,
                question.incorrect_answer1,
                question.incorrect_answer2
            ];
        } else if (question.incorrect_answer3 == '') {
            answers = [
                question.correct_answer,
                question.incorrect_answer1,
                question.incorrect_answer2,
                question.incorrect_answer4
            ];
        } else if (question.incorrect_answer4 == '') {
            answers = [
                question.correct_answer,
                question.incorrect_answer1,
                question.incorrect_answer2,
                question.incorrect_answer3
            ];
        } else {
            answers = [
                question.correct_answer,
                question.incorrect_answer1,
                question.incorrect_answer2,
                question.incorrect_answer3,
                question.incorrect_answer4
            ];
        }
        answers = shuffle(answers);
        questions.push({ question: question.question, answers: answers });
    }
    client.release();
    return questions;
}

async function compare_answer(answer) {
    const client = await pool.connect();
    let respCorrect;
    const resp = await client.query(`SELECT * FROM questions WHERE correct_answer = $1`, [answer]);
    (resp.rowCount != 0) ? respCorrect = true : respCorrect = false;
    client.release();
    return respCorrect;
}

function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;
    while (0 !== currentIndex) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
    return array;
}

module.exports = { get_questions, compare_answer, create_question };
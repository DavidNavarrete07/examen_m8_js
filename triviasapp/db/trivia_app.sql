DROP TABLE IF EXISTS questions;
CREATE TABLE questions(
    id SERIAL PRIMARY KEY,
    question TEXT NOT NULL,
    correct_answer TEXT NOT NULL,
    incorrect_answer1 TEXT NOT NULL,
    incorrect_answer2 TEXT NOT NULL,
    incorrect_answer3 TEXT,
    incorrect_answer4 TEXT
);

DROP TABLE IF EXISTS users;
CREATE TABLE users(
    id SERIAL PRIMARY KEY, 
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    is_admin BOOLEAN NOT NULL
);

DROP TABLE IF EXISTS games;
CREATE TABLE games(
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    score VARCHAR(10) NOT NULL,
    percentage DOUBLE PRECISION NOT NULL,
    date_game TIMESTAMP DEFAULT NOW() NOT NULL, 
    FOREIGN KEY (user_id) REFERENCES users(id)
);
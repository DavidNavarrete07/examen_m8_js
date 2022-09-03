const pool = require('../db/pool.js');

async function create_table() {
    const client = await pool.connect();

    await client.query(`CREATE TABLE IF NOT EXISTS games(
        id SERIAL PRIMARY KEY, 
        user_id INT NOT NULL, 
        score VARCHAR(5) NOT NULL, 
        percentage FLOAT NOT NULL, 
        date_game TIMESTAMP NOT NULL DEFAULT NOW(),
        FOREIGN KEY (user_id) REFERENCES users(id)
    );`);
}

create_table();

async function create_game(game) {
    const client = await pool.connect();

    const {rows} = await client.query(`INSERT INTO games(score, percentage, user_id) VALUES($1, $2, $3) RETURNING *`,
        [game.score, game.percentage, game.userId]);
    client.release();
    return rows[0];
}

async function get_games() {
    const client = await pool.connect();

    const { rows } = await client.query(`SELECT u.name, g.score, g.percentage FROM games g INNER JOIN users u ON u.id = g.user_id ORDER BY g.percentage DESC`);
    client.release();
    return rows;
}

module.exports = { get_games, create_game }


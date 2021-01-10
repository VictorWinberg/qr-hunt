module.exports = client => ({
    create({ name, email, photo }, done) {
        const query = 'INSERT INTO users (name, email, photo) VALUES ($1, $2, $3) RETURNING *';
        client
            .query(query, [name, email, photo])
            .then(({ rows }) => done(null, rows[0] || null))
            .catch(err => done(err));
    },

    getById(userId, done) {
        client
            .query('SELECT * FROM users WHERE id = $1', [userId])
            .then(({ rows }) => done(null, rows[0] || null))
            .catch(err => done(err));
    },

    getByEmail(email, done) {
        client
            .query('SELECT * FROM users WHERE email = $1', [email])
            .then(({ rows }) => done(null, rows[0] || null))
            .catch(err => done(err));
    },
});
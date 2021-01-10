module.exports = client => ({
    create({ uuid }, done) {
        const query = 'INSERT INTO qrcodes (uuid) VALUES ($1) RETURNING *';

        client
            .query(query, [uuid])
            .then(({ rows }) => done(null, rows[0] || null))
            .catch(err => done(err));
    },

    getAll(done) {
        client
            .query('SELECT * FROM qrcodes')
            .then(({ rows }) => done(null, rows || []))
            .catch(err => done(err));
    }
});
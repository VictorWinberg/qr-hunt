module.exports = client => ({
    create({ uuid }, done) {
        const query = 'INSERT INTO qrcodes (uuid) VALUES ($1) RETURNING *';

        client
            .query(query, [uuid])
            .then(({ rows }) => done(null, rows[0] || null))
            .catch(({ severity, message }) => done({ query, severity, message }));
    },

    getAll(done) {
        client
            .query('SELECT * FROM qrcodes')
            .then(({ rows }) => done(null, rows || []))
            .catch(({ severity, message }) => done({ query, severity, message }));
    }
});
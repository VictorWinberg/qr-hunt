module.exports = client => ({
    create({ qrcode }, done) {
        const query = 'INSERT INTO geocaches (qrcode) VALUES ($1) RETURNING *';

        client
            .query(query, [qrcode])
            .then(({ rows }) => done(null, rows[0] || null))
            .catch(err => done(err));
    },
});
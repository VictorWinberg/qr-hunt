const valid = key => ['title', 'lat', 'lng', 'note', 'hint', 'qrcode', 'assignerId'].includes(key);

const entries = geocache => {
    const keys = Object.keys(geocache).filter(valid);
    const values = keys.map(key => geocache[key]);
    const indices = keys.map((_, i) => `$${i + 1}`);
    return { keys, values, indices };
};

module.exports = client => ({
    create(geocache, done) {
        const { keys, values, indices } = entries(geocache);
        const query = `INSERT INTO geocaches ( ${keys} ) VALUES ( ${indices} ) RETURNING *`;

        client
            .query(query, values)
            .then(({ rows }) => done(null, rows[0] || null))
            .catch(({ severity, message }) => done({ query, severity, message }));
    },

    getAll(done) {
        client
            .query('SELECT * FROM geocaches')
            .then(({ rows }) => done(null, rows || []))
            .catch(({ severity, message }) => done({ query, severity, message }));
    }
});
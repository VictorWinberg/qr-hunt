const valid = key => ['score', 'comment', 'user_id', 'geocache_id'].includes(key);

const entries = geocache => {
    const keys = Object.keys(geocache).filter(valid);
    const values = keys.map(key => geocache[key]);
    const indices = keys.map((_, i) => `$${i + 1}`);
    const keyIndices = keys.map((key, i) => `${key} = $${i + 1}`);
    return { keys, values, indices, keyIndices };
};

module.exports = client => ({
    create(collectedGeocache, done) {
        const { keys, values, indices } = entries(collectedGeocache);
        const query = `INSERT INTO geocaches_collected ( ${keys} ) VALUES ( ${indices} ) RETURNING *`;

        client
            .query(query, values)
            .then(({ rows }) => done(null, rows[0] || null))
            .catch(({ severity, message }) => done({ query, severity, message }));
    },

    update(id, collectedGeocache, done) {
        const { keyIndices, values } = entries(collectedGeocache);
        const query = `UPDATE geocaches_collected SET ${keyIndices} WHERE id = ${id} RETURNING *`;

        client
            .query(query, values)
            .then(({ rows }) => done(null, rows[0] || null))
            .catch(({ severity, message }) => done({ query, severity, message }));
    },

    getAll(done) {
        client
            .query('SELECT * FROM geocaches_collected')
            .then(({ rows }) => done(null, rows || []))
            .catch(({ severity, message }) => done({ query, severity, message }));
    }
});
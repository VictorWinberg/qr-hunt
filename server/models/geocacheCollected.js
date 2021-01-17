const valid = ['score', 'comment', 'user_id', 'geocache_id'];
const keyValuePairs = require('./utils').keyValuePairs(valid)

module.exports = client => ({
    create(collectedGeocache, done) {
        const { keys, values, indices } = keyValuePairs(collectedGeocache);
        const query = `INSERT INTO geocaches_collected ( ${keys} ) VALUES ( ${indices} ) RETURNING *`;

        client
            .query(query, values)
            .then(({ rows }) => done(null, rows[0] || null))
            .catch(({ severity, message }) => done({ query, severity, message }));
    },

    update(id, collectedGeocache, done) {
        const { keyIndices, values } = keyValuePairs(collectedGeocache);
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
const valid = ['title', 'lat', 'lng', 'note', 'hint', 'qrcode', 'assigner_id'];
const keyValuePairs = require('./utils').keyValuePairs(valid)

module.exports = client => ({
    create(geocache, done) {
        const { keys, values, indices } = keyValuePairs(geocache);
        const query = `INSERT INTO geocaches ( ${keys} ) VALUES ( ${indices} ) RETURNING *`;

        client
            .query(query, values)
            .then(({ rows }) => done(null, rows[0] || null))
            .catch(({ severity, message }) => done({ query, severity, message }));
    },

    update(id, geocache, done) {
        const { keyIndices, values } = keyValuePairs(geocache);
        const query = `UPDATE geocaches SET ${keyIndices} WHERE id = ${id} RETURNING *`;

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
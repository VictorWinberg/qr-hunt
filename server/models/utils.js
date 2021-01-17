export const keyValuePairs = valid => obj => {
    const keys = Object.keys(obj).filter(key => valid.includes(key));
    const values = keys.map(key => obj[key]);
    const indices = keys.map((_, i) => `$${i + 1}`);
    const keyIndices = keys.map((key, i) => `${key} = $${i + 1}`);
    return { keys, values, indices, keyIndices };
};
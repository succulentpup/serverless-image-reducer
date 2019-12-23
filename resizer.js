resize = async (bucket, key) => {
    console.log(`resizer:: bucket: ${bucket}`);
    console.log(`resizer:: key: ${key}`);
    return Promise.resolve();
};

module.exports = {
    resize,
};

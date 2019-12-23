const { resize } = require('./resizer');
module.exports.resize = async (event) => {
    const bucket = event.Records[0].s3.bucket.name;
    console.log(`bucket: ${bucket}`);
    const key = event.Records[0].s3.object.key;
    console.log(`key: ${key}`);
    try {
        await resize(bucket, key);
        console.log(`Thumbnail was created for ${key} in bucket ${bucket}`)
    }catch (e) {
        console.log(`${e} :: Error while creating thumbnail for ${key} in bucket ${bucket}`);
    }
};

'use strict';

module.exports.hello = async event => {
    console.log('S3 event: ', event.Records[0]);
    console.log('S3 event: ', event.Records[0].s3);
    const bucket = event.Records[0].s3.bucket.name;
    const key = event.Records[0].s3.object.key;

    return { message: `A file named ${key} was put in a bucket ${bucket}!`, event };
};

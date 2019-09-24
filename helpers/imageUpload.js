import AWS from 'aws-sdk';

require('dotenv').config();

AWS.config.update({
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY,
  region: 'us-east-2',
});

const s3 = new AWS.S3();
export const upload = (key, file) => {
  const params = {
    Bucket: process.env.BUCKET,
    Key: `${file.uniquename}`,
    Body: file.buffer, // req.file.path
    // ContentEncoding: 'base64',
    ACL: 'public-read',
  };
  return new Promise((res, rej) => s3.upload(params, (error, data) => {
    if (error) {
      console.log('Error uploading data: ', error);
      rej(error);
    } else {
      res(data.Location);
    }
  }));
};

export const multiUpload = (key, files) => {
  try {
    const arr = Array.isArray(files) ? files : [files];
    const uploadedFiles = arr.map(file => upload(key, file, true));
    return Promise.all(uploadedFiles);
  } catch (error) {
    throw error;
  }
};

export const removeFiles = (key, files) => {
  const s3 = new AWS.S3();
  const arrayOfFiles = Array.isArray(files) ? files : [files];
  const params = {
    Bucket: process.env.BUCKET,
    Delete: {
      Objects: arrayOfFiles.map((file) => {
        const arr = file.split('/');
        return ({ Key: `${key}/${decodeURI(arr[arr.length - 1])}` });
      }),
    },
  };

  return new Promise((res, rej) => s3.deleteObjects(params, (error, data) => {
    if (error) {
      console.log(error, error.stack);
      rej(error);
    } else {
      console.log('deleted object: ', data);
      res(data);
    }
  }));
};

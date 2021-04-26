import { createEndpoint } from "@app/endpoint";
import AWS, { S3 } from "aws-sdk";
import fs from 'fs';
import multiparty from 'multiparty';
import FileType, { FileTypeResult } from 'file-type';

AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const s3 = new S3();

const uploadFile = (buffer: S3.Body, name: string, type: { ext: string; mime: string }) => {
  const params = {
    ACL: 'public-read',
    Body: buffer,
    Bucket: process.env.S3_BUCKET,
    ContentType: type.mime,
    Key: `${name}.${type.ext}`,
  };
  return s3.upload(params as S3.PutObjectRequest).promise();
};

export default createEndpoint({
  POST: async (req, res) => {
    console.log(req);
    const form = new multiparty.Form();
    form.parse(req, async (error, fields, files) => {
      if (error) {
        return res.status(500).send(error);
      };
      try {
        const path = files.file[0].path;
        const buffer = fs.readFileSync(path);
        const type = await FileType.fromBuffer(buffer);
        const fileName = `bucketFolder/${Date.now().toString()}`;
        const data = await uploadFile(buffer, fileName, type as FileTypeResult);
        return res.status(200).send(data);
      } catch (err) {
        return res.status(500).send(err);
      }
  });
  },
});

export const config = {
  api: {
    bodyParser: false,
  }
}
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../../lib/firebase';
import formidable from 'formidable';
import fs from 'fs';

export const dynamic = 'force-dynamic';

export const GET = (req, res) => {
  res.status(405).send('Method Not Allowed');
};

export const POST = async (req, res) => {
  const form = new formidable.IncomingForm();
  form.uploadDir = './public/uploads';
  form.keepExtensions = true;

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Server error');
    }

    const file = files.file;
    const tempPath = file.filepath;

    try {
      const fileBuffer = fs.readFileSync(tempPath);
      const storageRef = ref(storage, `uploads/${file.originalFilename}`);
      await uploadBytes(storageRef, fileBuffer);
      const downloadURL = await getDownloadURL(storageRef);
      res.status(200).json({ url: downloadURL });
    } catch (uploadError) {
      console.error(uploadError);
      res.status(500).send('Failed to upload to Firebase');
    } finally {
      fs.unlinkSync(tempPath);
    }
  });
};

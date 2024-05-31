"use client";

import { useState } from 'react';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase';

const ImageUpload = () => {
  const [image, setImage] = useState(null);
  const [url, setUrl] = useState('');

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setImage(file);
    } else {
      alert('Please select a valid image file');
      setImage(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) {
      alert('Please select an image first');
      return;
    }

    const storageRef = ref(storage, `uploads/${image.name}`);
    try {
      await uploadBytes(storageRef, image);
      const downloadURL = await getDownloadURL(storageRef);
      console.log('Download URL:', downloadURL);
      setUrl(downloadURL);
      console.log('setUrl 호출 후 URL:', downloadURL);  // setUrl 호출 후 확인
      alert('Image uploaded successfully!');
    } catch (error) {
      console.error('Error uploading image: ', error);
      alert('Error uploading image');
    }
  };

  return (
    <div className="mt-10">
      <form onSubmit={handleSubmit} className="flex flex-col items-center">
        <input type="file" onChange={handleImageChange} />
        <button type="submit" className="mt-4 px-4 py-2 bg-[#653CD5] text-white rounded">
          Upload
        </button>
      </form>
      {url && (
        <div className="mt-4">
          <h2 className="text-xl">Uploaded Image</h2>
          <img src={url} alt="Uploaded" style={{ maxWidth: '100%' }} />
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
"use client";

import { useState } from 'react';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage } from '../firebase';

const ImageUpload = ({ ondownloadURL, name }) => {
  const [image, setImage] = useState(null);
  const [url, setUrl] = useState('');

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      img.onload = async () => {
        if (img.width !== 1024 || img.height !== 576) {
          if (window.confirm('이미지 크기가 1024*576이 아닙니다. 수정해드릴까요?')) {
            const resizedImage = await resizeImage(img, 1024, 576, file.name);
            setImage(resizedImage);
            if (url) {
              await deleteExistingImage(url);
            }
            await handleSubmit(resizedImage);
          } else {
            alert('이미지를 업로드할 수 없습니다.');
            setImage(null);
          }
        } else {
          setImage(file);
          if (url) {
            await deleteExistingImage(url);
          }
          await handleSubmit(file);
        }
      };
    } else {
      alert('Please select a valid image file');
      setImage(null);
    }
  };

  const deleteExistingImage = async (url) => {
    const fileRef = ref(storage, url);
    try {
      await deleteObject(fileRef);
      console.log('Existing image deleted successfully');
    } catch (error) {
      console.error('Error deleting existing image: ', error);
      alert('Error deleting existing image');
    }
  };

  const handleSubmit = async (file) => {
    if (!file) {
      alert('Please select an image first');
      return;
    }

    const storageRef = ref(storage, `uploads/${name}/${file.name}`);
    try {
      await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(storageRef);
      ondownloadURL(downloadURL);
      console.log('Download URL:', downloadURL);
      setUrl(downloadURL);
      console.log('setUrl 호출 후 URL:', downloadURL);  // setUrl 호출 후 확인
      alert('Image uploaded successfully!');
    } catch (error) {
      console.error('Error uploading image: ', error);
      alert('Error uploading image');
    }
  };

  const resizeImage = (img, width, height, originalFileName) => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = width;
      canvas.height = height;
      ctx.fillStyle = 'rgba(0, 0, 0, 0)'; // 투명색으로 채우기
      ctx.fillRect(0, 0, width, height);

      const aspect = img.width / img.height;
      let newWidth, newHeight;
      if (aspect > width / height) {
        newWidth = width;
        newHeight = width / aspect;
      } else {
        newWidth = height * aspect;
        newHeight = height;
      }
      ctx.drawImage(img, (width - newWidth) / 2, (height - newHeight) / 2, newWidth, newHeight);

      canvas.toBlob((blob) => {
        resolve(new File([blob], originalFileName, { type: 'image/png' }));
      }, 'image/png');
    });
  };

  return (
    <div className="w-1/2 mt-10">
      <form className="flex flex-col items-center">
        <label
          className="relative w-full cursor-pointer flex flex-col items-center justify-center border-dashed border-2 border-purple-500 rounded-lg text-gray-500 mb-4"
          style={{ paddingBottom: '56.25%' }} // 16:9 aspect ratio
        >
          <input type="file" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />

          {url ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <img src={url} className="rounded object-cover" alt="Uploaded" style={{ maxWidth: '100%', maxHeight: '100%' }} />
            </div>
          ) : (
            <span className="absolute inset-0 flex items-center justify-center text-gray-500">이미지 업로드</span>
          )}
        </label>
      </form>
    </div>
  );
};

export default ImageUpload;

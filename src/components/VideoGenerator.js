'use client'
import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase";

const VideoGenerator = ({ url, entryId, vd, save}) => {
  const apiKey = process.env.STABLE_DIFFUSION_API_KEY;
  const [generationId, setGenerationId] = useState(null);
  const [videoUrl, setVideoUrl] = useState(vd);
  const [status, setStatus] = useState(null);

useEffect(() => {
  const generateVideo = async () => {
    if (!apiKey || !url) {
      setStatus("API key and image URL are required");
      console.log(apiKey);
      console.log(url);
      return;
    }

    try {
      const response = await axios.post("/api/generate-video", { apiKey, imageUrl: url });
      console.log("Generation ID received:", response.data.generationId);
      setGenerationId(response.data.generationId);
      setStatus("Video generation started...");
    } catch (error) {
      console.error(error);
      setStatus("Error starting video generation");
    }
  };

  if(save) {
    generateVideo();
    }
}, [save]);

useEffect(() => {
  console.log('useEffect 호출');
  setVideoUrl(vd);
}, [vd]);

  const saveVideo = async (entryId, video) => {
    try {
      const entryRef = doc(db, 'diaryEntries', entryId);
      await updateDoc(entryRef, {
        video: video
      });
      console.log('video saved to Firestore');
    } catch (error) {
      console.error('Error saving video to Firestore:', error);
    }
  };  

  const checkVideoResult = async () => {
    if (!generationId) return;

    try {
      const response = await axios.get(`/api/get-video-result?generationId=${generationId}&apiKey=${apiKey}`);
      if (response.status === 202) {
        setStatus("Generation is still running, try again in 10 seconds.");
      } else if (response.status === 200) {
        console.log("Video URL received:", response.data.videoUrl);
        setVideoUrl(response.data.videoUrl);
        setStatus("Generation is complete!");
        saveVideo(entryId, videoUrl);
      }
    } catch (error) {
      console.error(error);
      setStatus("Error checking video result");
    }
  };

  useEffect(() => {
    let interval;
    if (generationId) {
      interval = setInterval(checkVideoResult, 10000); // Check every 10 seconds
    }
    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, [generationId]);

  return (
    <div>
      {videoUrl && (
        <div>
          <video src={videoUrl} controls autoPlay loop width="600" />
        </div>
      )}
    </div>
  );
};

export default VideoGenerator;

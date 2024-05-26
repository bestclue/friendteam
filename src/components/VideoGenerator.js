'use client'
import { useState } from "react";
import axios from "axios";

const VideoGenerator = () => {
  const [apiKey, setApiKey] = useState("");
  const [generationId, setGenerationId] = useState(null);
  const [videoUrl, setVideoUrl] = useState(null);
  const [status, setStatus] = useState(null);

  const generateVideo = async () => {
    if (!apiKey) {
      setStatus("API key is required");
      return;
    }

    try {
      const response = await axios.post("/api/generate-video", { apiKey });
      console.log("Generation ID received:", response.data.generationId);  // Add this line
      setGenerationId(response.data.generationId);
      setStatus("Video generation started...");
    } catch (error) {
      console.error(error);
      setStatus("Error starting video generation");
    }
  };

  const checkVideoResult = async () => {
    if (!generationId) return;

    try {
      const response = await axios.get(`/api/get-video-result?generationId=${generationId}&apiKey=${apiKey}`);
      if (response.status === 202) {
        setStatus("Generation is still running, try again in 10 seconds.");
      } else if (response.status === 200) {
        console.log("Video URL received:", response.data.videoUrl);  // Add this line
        setVideoUrl(response.data.videoUrl);
        setStatus("Generation is complete!");
      }
    } catch (error) {
      console.error(error);
      setStatus("Error checking video result");
    }
  };

  return (
    <div>
      <h1>Stable Video Diffusion</h1>
      <div>
        <label>API Key: </label>
        <input type="text" value={apiKey} onChange={(e) => setApiKey(e.target.value)} />
      </div>
      <button onClick={generateVideo}>Generate Video</button>
      {generationId && (
        <div>
          <p>{status}</p>
          <button onClick={checkVideoResult}>Check Video Result</button>
        </div>
      )}
      <span>response.data.id</span>
      {videoUrl && (
        <div>
          <h2>Generated Video</h2>
          <video src={videoUrl} controls width="600" />
        </div>
      )}
    </div>
  );
};

export default VideoGenerator;

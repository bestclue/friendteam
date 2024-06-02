import axios from "axios";
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../firebase';

export async function GET(req) {
  const { searchParams } = new URL(req.url, `http://${req.headers.host}`);
  const generationId = searchParams.get("generationId");
  const apiKey = searchParams.get("apiKey");

  console.log("Generation ID for fetching result:", generationId);
  console.log("API Key for fetching result:", apiKey);

  try {
    const response = await axios.request({
      url: `https://api.stability.ai/v2beta/image-to-video/result/${generationId}`,
      method: "GET",
      validateStatus: undefined,
      responseType: "arraybuffer",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Accept: "video/*",
      },
    });

    if (response.status === 202) {
      return new Response(JSON.stringify({ message: "Generation is still running, try again in 10 seconds." }), {
        status: 202,
        headers: { 'Content-Type': 'application/json' },
      });
    } else if (response.status === 200) {
      const videoBuffer = Buffer.from(response.data);
      const storageRef = ref(storage, `videos/${generationId}.mp4`);

      // Upload the video to Firebase Storage
      await uploadBytes(storageRef, videoBuffer);

      // Get the download URL
      const downloadUrl = await getDownloadURL(storageRef);

      return new Response(JSON.stringify({ message: "Generation is complete!", videoUrl: downloadUrl }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    } else {
      return new Response(JSON.stringify({ error: response.data.toString() }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

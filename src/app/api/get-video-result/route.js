import axios from "axios";
import fs from "node:fs";
import path from "path";

export async function GET(req) {
  const { searchParams } = new URL(req.url, `http://${req.headers.host}`);
  const generationId = searchParams.get("generationId");
  const apiKey = searchParams.get("apiKey");

  console.log("Generation ID for fetching result:", generationId);  // Add this line to print the generation ID
  console.log("API Key for fetching result:", apiKey);  // Add this line to print the API Key

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
      const videoPath = path.join(process.cwd(), "public", "video.mp4");
      fs.writeFileSync(videoPath, Buffer.from(response.data));
      return new Response(JSON.stringify({ message: "Generation is complete!", videoUrl: "/video.mp4" }), {
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

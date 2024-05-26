import fs from "node:fs";
import axios from "axios";
import FormData from "form-data";

export async function POST(req) {
  const { apiKey } = await req.json();

  const data = new FormData();
  data.append("image", fs.readFileSync("./public/image.png"), "image.png");
  data.append("seed", 0);
  data.append("cfg_scale", 0.5);
  data.append("motion_bucket_id", 100);

  try {
    const response = await axios.request({
      url: `https://api.stability.ai/v2beta/image-to-video`,
      method: "post",
      validateStatus: undefined,
      headers: {
        authorization: `Bearer ${apiKey}`,
        ...data.getHeaders(),
      },
      data: data,
    });

    console.log("Generation ID:", response.data.id);  // Add this line to print the generation ID

    return new Response(JSON.stringify({ generationId: response.data.id }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error(error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}

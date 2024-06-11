import axios from "axios";
import FormData from "form-data";

export async function POST(req) {
  const { apiKey, imageUrl } = await req.json();

  try {
    // Fetch the image from the URL
    const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const imageBuffer = Buffer.from(imageResponse.data, 'binary');

    const data = new FormData();
    data.append("image", imageBuffer, "image.png");
    data.append("seed", 0);
    data.append("cfg_scale", 1.8);
    data.append("motion_bucket_id", 127);

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

    console.log("Generation ID:", response.data.id);

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

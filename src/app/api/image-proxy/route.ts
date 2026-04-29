// app/api/image-proxy/route.ts (App Router example)
import { NextRequest, NextResponse } from 'next/server';
import axios, { AxiosResponse } from 'axios';
import NodeCache from 'node-cache'; // Install using `npm install node-cache`
//import { randomUUID } from 'crypto';
const cache = new NodeCache({ stdTTL: 3600 });

export async function GET(request: NextRequest) {
    const url = request.nextUrl.searchParams.get('url');

    if (!url) {
        return new NextResponse('Missing image URL', { status: 400 });
    }

    const cacheKey = url;
    const cachedData = cache.get< AxiosResponse<any, any, {}>>(cacheKey);

    if (cachedData) {
          const data = new NextResponse(cachedData.data, {
            headers: {
                'Content-Type': cachedData.headers['content-type'],
            },
        });
        return data;
    }

    try {
        //console.log(url)
        // Fetch the image data from the external source
        const response = await axios.get(url, {
            responseType: 'arraybuffer',
            headers: {
                'referer': 'https://ia.kyaaa.net/',
                //'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36', // Helps prevent being blocked by some servers
                // Add any other necessary headers (e.g., auth tokens) here
            },
        });

        // Return the image with the correct content type
        const data = new NextResponse(response.data, {
            headers: {
                'Content-Type': response.headers['content-type'],
            },
        });
        //cache.set(cacheKey, response); // Store data in cache
        return data;
    } catch (error) {
        console.error(error);
        return new NextResponse('Failed to fetch image', { status: 500 });
    }
}
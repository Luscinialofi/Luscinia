const fs = require("fs");

const API_KEY = process.env.YOUTUBE_API_KEY;

const PLAYLIST_ID = "PLsek7MBfZwvkd9KoVOw0MDErwfCOMgInY";

async function getPlaylistVideos() {

  const url =
    `https://www.googleapis.com/youtube/v3/playlistItems` +
    `?part=snippet&maxResults=50` +
    `&playlistId=${PLAYLIST_ID}` +
    `&key=${API_KEY}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("YouTube API error");
  }

  const data = await response.json();

  return data.items.map(item => ({
    title: item.snippet.title,
    videoId: item.snippet.resourceId.videoId,
    thumbnail:
      item.snippet.thumbnails.high?.url ||
      item.snippet.thumbnails.medium.url,
    publishedAt: item.snippet.publishedAt
  }));
}


async function main() {

  const videos = await getPlaylistVideos();

  if (!videos.length) {
    throw new Error("No videos found");
  }


  const latest = videos[0];


  fs.writeFileSync(
    "data/latest.json",
    JSON.stringify(latest, null, 2)
  );


  fs.writeFileSync(
    "data/discography.json",
    JSON.stringify(videos, null, 2)
  );


  console.log("YouTube data updated");
}


main();

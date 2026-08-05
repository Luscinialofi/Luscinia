const fs = require("fs");

const API_KEY = process.env.YOUTUBE_API_KEY;

const PLAYLIST_ID = "PLsek7MBfZwvkd9KoVOw0MDErwfCOMgInY";


async function getPlaylistVideoIds() {

  const url =
    `https://www.googleapis.com/youtube/v3/playlistItems` +
    `?part=contentDetails&maxResults=50` +
    `&playlistId=${PLAYLIST_ID}` +
    `&key=${API_KEY}`;


  const response = await fetch(url);
  const data = await response.json();


  return data.items.map(
    item => item.contentDetails.videoId
  );
}



async function getVideoDetails(ids) {

  const url =
    `https://www.googleapis.com/youtube/v3/videos` +
    `?part=snippet` +
    `&id=${ids.join(",")}` +
    `&key=${API_KEY}`;


  const response = await fetch(url);
  const data = await response.json();


  return data.items.map(video => ({

    title: video.snippet.title,

    videoId: video.id,

    thumbnail:
      video.snippet.thumbnails.high?.url ||
      video.snippet.thumbnails.medium.url,

    publishedAt:
      video.snippet.publishedAt

  }));

}



async function main() {

  const ids = await getPlaylistVideoIds();

  const videos = await getVideoDetails(ids);


  fs.writeFileSync(
    "data/latest.json",
    JSON.stringify(videos[0], null, 2)
  );


  fs.writeFileSync(
    "data/discography.json",
    JSON.stringify(videos, null, 2)
  );


  console.log("YouTube data updated");

}


main();

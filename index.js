const instagramScraper = require("instagram-scraper");
const download = require("image-downloader");
var fs = require("fs");
//sync download image
function downloadImage(option) {
  download
    .image(option)
    .then(({ filename, image }) => {
      console.log("File saved to", filename);
    })
    .catch(err => {
      throw err;
    });
}
// async download image
async function DownloadIngAsync(option) {
  try {
    const { filename, image } = await download.image(option);
    console.log(filename); // => /path/to/dest/image.jpg
  } catch (e) {
    throw e;
  }
}
function GetInstagramPhoto(UserName,Dir) {
  instagramScraper.getUserPosts(UserName).then(posts => {
    var dir = `${Dir}${UserName}`;
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
    console.log(`Loading ${UserName}'s images`)
    let options = posts
      .map(a => {
        return { url: a.display_url, dest: dir };
      })
      .filter(b => b.url !== undefined);
      console.log(`Download ${UserName}'s images`)

    for (const option of options) {
      DownloadIngAsync(option);
    }
  });
}
GetInstagramPhoto(process.argv[2],process.argv[3]);

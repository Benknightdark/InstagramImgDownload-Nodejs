//require('./lib/scraper')(process.argv[2]);
const instagramScraper = require("instagram-scraper");
const download = require("image-downloader");
var fs = require("fs");
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
async function DownloadIngAsync() {
    try {
      const { filename, image } = await download.image(options)
      console.log(filename) // => /path/to/dest/image.jpg 
    } catch (e) {
      throw e
    }
  }
instagramScraper.getUserPosts("nanaliangbadgal").then(posts => {
  var dir = "./img/nanaliangbadgal";
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
  let options = posts
    .map(a => {
      return { url: a.display_url, dest: "./mg/nanaliangbadgal" };
    })
    .filter(b => b.url !== undefined);
  for (const option of options) {
    downloadImage(option);
  }
});

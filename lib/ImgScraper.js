const instagramScraper = require("instagram-scraper");
var fs = require("fs");
var ImgDownload = require("./ImgDownload");

const GetInstagramPhoto=(UserName,Dir) =>{
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
        ImgDownload.DownloadIngAsync(option);
      }
    });
  }

  module.exports={GetInstagramPhoto};
  

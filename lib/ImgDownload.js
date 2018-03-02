const download = require("image-downloader");

//sync download image
 const  DownloadImage=(option)=> {
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
  const  DownloadIngAsync=async (option)=>{
    try {
      const { filename, image } = await download.image(option);
      console.log(filename); // => /path/to/dest/image.jpg
    } catch (e) {
      throw e;
    }
  }
  module.exports = {DownloadImage,DownloadIngAsync}


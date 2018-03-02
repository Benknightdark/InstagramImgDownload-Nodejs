const Promise = require('bluebird')
const request = require('request-promise')
const fs = Promise.promisifyAll(require('fs'))
const path = require('path')

const failed = []

module.exports = (username) => {
  const destDir = path.join('./', username)

  _mkdir(destDir, (err) => {
    if (err) {
      return console.error(err)
    }

    new Scraper(username).crawl()
  })
}

class Scraper {

  constructor(username) {
    this.username = username
    this.baseUrl = require('url').format({
      protocol: 'https',
      host: 'instagram.com',
      pathname: path.join(username, 'media')
    })

    this.crawl = this.crawl.bind(this)
    this.download = this.download.bind(this)
  }

  crawl(maxId) {
    const url = `${this.baseUrl}?max_id=${maxId}`

    return request(url)
      .then(body => {
        let media = []

        try {
          media = JSON.parse(body)
        } catch (e) {
          console.error('Failed to parse json body ' + url)
        }

        media.items.forEach(item => {
          _getUrls(item).forEach(url => this.download({url, mtime: item.created_time}))
        })

        if (media.more_available) {
          console.log('Loading after ' + media.items[media.items.length - 1].id)
          setTimeout(() => {
            this.crawl(media.items[media.items.length - 1].id)
          }, 500) // Cooldown helps with request blocking!
        } else {
          if (failed.length > 0) {
            console.log('Re-trying failed downloads...')
            setTimeout(() => {
              failed.forEach(this.download)
            }, 5000) // Cooldown helps with request blocking!
          }
        }
      })
      .catch(err => console.error(err.stack))
  }

  download({url, mtime}) {
    const filename = path.basename(url)
    const localFile = path.join('./', this.username, filename)
    const filemtime = mtime || Date.now() / 1000

    if (fs.existsSync(localFile)) {
      return console.log('Skipping ' + filename)
    }

    try {
      return request(url, {encoding: null})
        .then(body => {
          return fs.writeFileAsync(localFile, body)
            .then(() => {
              console.log('Downloaded ' + filename)
              return fs.utimesAsync(localFile, filemtime, filemtime)
            })
        })
        .catch(err => console.error(err.stack))

    } catch (e) {
      console.log('Downloaded Failed ' + filename)
      failed.push({url, filemtime})
    }
  }
}

const _getUrls = (item) => {
  const urls = []

  if (item.type === 'carousel') {
    item.carousel_media.forEach((carouselItem) => {
      urls.push(_getOriginalSize(carouselItem))
    })
  } else {
    urls.push(_getOriginalSize(item))
  }

  return urls
}

const _getOriginalSize = (item) => {
  return item[item.type + 's'].standard_resolution.url
    .split('?')[0]
    .replace(/\/s\d{3,}x\d{3,}\//, '/') // get full size dimensions
    .replace(/\/c\d{1,}.\d{1,}.\d{1,}.\d{1,}\//, '/') // get non-square image
}

const _mkdir = (path, mask, cb) => {
  if (typeof mask === 'function') {
    cb = mask
    mask = 0o777
  }

  fs.mkdir(path, mask, (err) => {
    if (err) {
      if (err.code === 'EEXIST') {
        cb(null) // ignore the error if the folder already exists
      } else {
        cb(err) // something else went wrong
      }
    } else {
      cb(null) // successfully created folder
    }
  })
}
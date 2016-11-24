const LinkedInScraper2 = require('linkedin-scraper2')

module.exports = (url) => {
  return new Promise((resolve, reject) => {
    LinkedInScraper2(url, (err, data) => {
      if (err) {
        reject(err)
      }
      else {
        resolve(data)
      }
    })
  })
}

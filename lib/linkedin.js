import linkedinScraper from 'linkedin-scraper2'

export default function (url) {
  return new Promise((resolve, reject) => {
    linkedinScraper(url, function (err, data) {
      if (err) {
        reject(err)
      }
      else {
        resolve(data)
      }
    })
  })
}

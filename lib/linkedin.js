const Xray = require('x-ray')
const requestXray = require('request-x-ray')
const userAgentGenerator = require('user-agent-string-generator')

const options = {
  headers: {
    'Accept': 'text/html',
    'Accept-Language': 'en-US;q=0.6,en;q=0.4',
    'User-Agent': userAgentGenerator()
  },
  method: 'GET'
}

const x = Xray()

console.log('Bot uses these options for LinkedIn resquests:', options)
x.driver(requestXray(options))

module.exports = (url) => {
  return new Promise((resolve, reject) => {
    x(url, {
      name: '#name',
      headline: '.headline',
      location: '#demographics .locality',
      experience: x('#experience .positions', '.position', [{
        title: '.item-title',
        company: '.item-subtitle',
        logo: '.logo img@data-delayed-url',
        dateRange: '.date-range',
        location: '.location',
        description: '.description'
      }]),
      summary: x('#summary', '.description p@html'),
      skills: x('#skills .pills', ['.skill span']),
      education: x('#education .schools', '.school', [{
        school: '.item-title',
        field: '.item-subtitle',
        logo: '.logo img@data-delayed-url',
        dateRange: '.date-range'
      }])
    })((err, data) => {
      if (err) {
        reject(err)
      }
      else {
        resolve(data)
      }
    })
  })
}

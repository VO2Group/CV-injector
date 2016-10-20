var system = require('system'),
    webpage = require('webpage'),
    page = webpage.create()

page.open(system.args[1], function (status) {
  if ('success' === status) {
    var r = page.evaluate(function () {
      var result = {}

      var name = document.getElementById('name')
      if (name) {
        result.name = name.textContent
      }

      var headline = document.querySelector('#topcard > div.profile-card.vcard > div.profile-overview > div > p')
      if (headline) {
        result.headline = headline.textContent
      }

      var locality = document.querySelector('#demographics > dd.descriptor.adr > span')
      if (locality) {
        result.locality = locality.textContent
      }

      var domain = document.querySelector('#demographics > dd:nth-child(4)')
      if (domain) {
        result.domain = domain.textContent
      }

      var firm = document.querySelector('#topcard > div.profile-card.vcard > div.profile-overview > div > table > tbody > tr:nth-child(1) > td > ol')
      if (firm) {
        result.firm = firm.textContent
      }

      var firms = document.querySelector('#topcard > div.profile-card.vcard > div.profile-overview > div > table > tbody > tr:nth-child(2) > td > ol')
      if (firms) {
        result.firms = firms.textContent.split(', ')
      }

      var educations = document.querySelector('#topcard > div.profile-card.vcard > div.profile-overview > div > table > tbody > tr:nth-child(3) > td > ol')
      if (educations) {
        result.educations = educations.textContent
      }

      var skills = document.querySelectorAll('.skill')
      if (skills) {
        result.skills = [].slice.call(skills).map(function (s) { return s.textContent }).filter(function (s) { return !s.startsWith('Voir + de ') && s != 'Voir moins' })
      }

      return result
    })
    console.log(JSON.stringify(r))
  }
  phantom.exit(0)
})

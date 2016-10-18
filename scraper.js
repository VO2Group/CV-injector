var system = require('system'),
    webpage = require('webpage'),
    page = webpage.create()

page.open(system.args[1], function (status) {
  if ('success' === status) {
    var r = page.evaluate(function () {
      return {
        name: document.getElementById('name').textContent,
        headline: document.querySelector('#topcard > div.profile-card.vcard > div.profile-overview > div > p').textContent,
        locality: document.querySelector('#demographics > dd.descriptor.adr > span').textContent,
        domain: document.querySelector('#demographics > dd:nth-child(4)').textContent,
        firm: document.querySelector('#topcard > div.profile-card.vcard > div.profile-overview > div > table > tbody > tr:nth-child(1) > td > ol').textContent,
        firms: document.querySelector('#topcard > div.profile-card.vcard > div.profile-overview > div > table > tbody > tr:nth-child(2) > td > ol').textContent.split(', '),
        educations: document.querySelector('#topcard > div.profile-card.vcard > div.profile-overview > div > table > tbody > tr:nth-child(3) > td > ol').textContent,
        skills: [].slice.call(document.querySelectorAll('.skill')).map(function (s) { return s.textContent }).filter(function (s) { return !s.startsWith('Voir + de ') && s != 'Voir moins' })
      }
    })
    console.log(JSON.stringify(r))
  }
  phantom.exit(0)
})

var system = require('system')
var page = require('webpage').create()

page.open(system.args[1], function (status) {
  if ('success' === status) {
    var name = page.evaluate(function () {
      return document.getElementById('name')
    })
    console.log(name.textContent)

    var headline = page.evaluate(function () {
      return document.querySelector('#topcard > div.profile-card.vcard > div.profile-overview > div > p')
    })
    console.log(headline.textContent)

    var locality = page.evaluate(function () {
      return document.querySelector('#demographics > dd.descriptor.adr > span')
    })
    console.log(locality.textContent)

    var domain = page.evaluate(function () {
      return document.querySelector('#demographics > dd:nth-child(4)')
    })
    console.log(domain.textContent)

    var firm = page.evaluate(function () {
      return document.querySelector('#topcard > div.profile-card.vcard > div.profile-overview > div > table > tbody > tr:nth-child(1) > td > ol > li > span > a')
    })
    console.log(firm.textContent)
    console.log(firm.href)

    var firms = page.evaluate(function () {
      return document.querySelectorAll('#topcard > div.profile-card.vcard > div.profile-overview > div > table > tbody > tr:nth-child(2) > td > ol > li')
    })
    for (i = 1; i <= firms.length; i++) {
      var f = page.evaluate(function (i) {
        return document.querySelector('#topcard > div.profile-card.vcard > div.profile-overview > div > table > tbody > tr:nth-child(2) > td > ol > li:nth-child(' + i + ')')
      }, i)
      console.log(f.textContent)
      console.log(f.tagName)
    }

    // [].slice.call(page.evaluate(function () {
    //   return document.querySelectorAll('#topcard > div.profile-card.vcard > div.profile-overview > div > table > tbody > tr:nth-child(2) > td > ol > li > a')
    // }))
    // .forEach(function (f) {
    //   console.log(f.textContent)
    //   console.log(f.href)
    // })

  }
  phantom.exit(0)
})

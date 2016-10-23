var Botkit = require('botkit'),
    linkedinScraper = require('linkedin-scraper2'),
    jsforce = require('jsforce')

var config = require(process.argv[2])

var controller = Botkit.slackbot(),
    connection = new jsforce.Connection()

var bot = controller.spawn({
  token: process.env.token
}).startRTM()

controller.hears(['^bonjour$', '^salut$', '^hello$'], 'direct_message,direct_mention,mention', function (bot, message) {
  bot.reply(message, 'Bonjour, je suis un spécialiste Salesforce! Que puis je faire pour vous ?')
  bot.reply(message, 'Je suis capable de créer ou de mettre à jours des contacts Salesforce si vous donnez une url de profil LinkedIn, contactez moi avec: contact <url LinkedIn>')
})

controller.hears(['contact <https://fr.linkedin.com/in/(.*)>'], 'direct_message,direct_mention,mention', function (bot, message) {
  var url = 'https://fr.linkedin.com/in/' + message.match[1]

  linkedinScraper(url, function (err, profile) {
    if (err) {
      bot.reply(message, "linkedIn trouve qu'on le solicite trop, rappellez moi dans quelques minutes")
      bot.reply(message, 'Contactez le support IT si le problème persite')
    } else {
      bot.startConversation(message, function (err, convo) {
        convo.ask("Vous allez créer ou mettre à jour un contact dans Salesforce, à partir de l'url: " + url + ', on continue ?', [
          {
            pattern: 'oui',
            callback: function (response, convo) {
              convo.say('ok on continue, je contacte Salesforce...')
              connection.login(config.username, config.password + config.securitytoken, function (err, res) {
                if (err) {
                  convo.say("Salesforce à l'air occupé, je n'arrive pas à le contacter, rappellez moi dans quelques minutes")
                  convo.say('Contactez le support IT si le problème persite')
                  convo.next()
                }
                else {
                  connection.query("SELECT Id, Name, Email FROM Contact WHERE Name = '" + profile.name + "'", function (err, res) {
                    if (err) {
                      convo.say('Salesforce ne me répond pas, contactez le support IT')
                      convo.next()
                    }
                    else {
                      if (res.totalSize != 1) {
                        convo.ask('Salesforce ne connait pas ' + profile.name + ', voulez vous créer le contact ?', [
                          {
                            pattern: 'oui',
                            callback: function (response, convo) {
                              convo.say('insert')
                              convo.next()
                            }
                          },
                          {
                            default: true,
                            callback: function (response, convo) {
                              convo.say("on s'arrête là alors!")
                              convo.next()
                            }
                          }
                        ])
                      }
                      else {
                        convo.ask('Salesforce connait déjà ' + profile.name + ', voulez vous mettre à jour le contact ?', [
                          {
                            pattern: 'oui',
                            callback: function (response, convo) {
                              convo.say('update')
                              convo.next()
                            }
                          },
                          {
                            default: true,
                            callback: function (response, convo) {
                              convo.say("on s'arrête là alors!")
                              convo.next()
                            }
                          }
                        ])
                      }
                      convo.next()
                    }
                  })
                }
              })
            }
          },
          {
            default: true,
            callback: function (response, convo) {
              convo.say("on s'arrête là alors!")
              convo.next()
            }
          }
        ])
      })
    }
  })
})

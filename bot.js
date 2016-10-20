var child_process = require('child_process')
    Botkit = require('botkit'),
    jsforce = require('jsforce')

var config = require(process.argv[2])

var controller = Botkit.slackbot(),
    connection = new jsforce.Connection()

var bot = controller.spawn({
  token: process.env.token
}).startRTM()

controller.hears(['contact <https://fr.linkedin.com/in/(.*)>'], 'direct_message,direct_mention,mention', function (bot, message) {
  var data = '',
      url = 'https://fr.linkedin.com/in/' + message.match[1],
      scraper = child_process.spawn(__dirname + '/node_modules/.bin/phantomjs', [
        __dirname + '/scraper.js',
        url
      ])
  scraper.stdout.on('data', function (buffer) {
    data += buffer.toString()
  })
  scraper.on('close', function (code) {
    bot.startConversation(message, function (err, convo) {
      convo.ask("Vous allez créer ou mettre à jour un contact dans Salesforce, à partir de l'url: " + url + ', on continue ?', [
        {
          pattern: 'oui|o',
          callback: function (response, convo) {
            convo.say('ok on continue, je contacte Salesforce...')
            connection.login(config.username, config.password + config.securitytoken, function (err, res) {
              if (err) {
                convo.say("Salesforce à l'air occupé, je n'arrive pas à le contacter, rappellez moi dans quelques minutes")
                convo.say('Contactez le support IT si le problème persite')
                convo.next()
              }
              else {
                try {
                  var contact = JSON.parse(data)
                  connection.query("SELECT Id, Name, Email FROM Contact WHERE Name = '" + contact.profil.firstName + ' ' + contact.profil.lastName + "'", function (err, res) {
                    if (err) {
                      convo.say('Salesforce ne me répond pas, contactez le support IT')
                      convo.next()
                    }
                    else {
                      convo.say(JSON.stringify(res.records[0]))
                      convo.next()
                    }
                  })
                }
                catch(err) {
                  convo.say("linkedIn trouve qu'on le solicite trop, rappellez moi dans quelques minutes")
                  convo.say('Contactez le support IT si le problème persite')
                  convo.next()
                }
              }
            })
          }
        },
        {
          pattern: 'non|n',
          callback: function (response, convo) {
            convo.say("on s'arrête là alors!")
            convo.next()
          }
        }
      ])
    })
  })
})

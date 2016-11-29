const Botkit = require('botkit')
const linkedIn = require('./lib/linkedin.js')
const {login, query} = require('./lib/salesforce.js')
const {startCreateConvo, startUpdateConvo} = require('./lib/convos.js')

const config = require(process.argv[2])
const token =  process.env.TOKEN

const controller = Botkit.slackbot()
const bot = controller.spawn({token}).startRTM()

const where = ['direct_message', 'direct_mention', 'mention']

controller.hears(['hello', 'hi', 'bonjour', 'salut', 'coucou', 'cc'], where, (bot, message) => {
  bot.reply(message, `Bonjour, que puis je faire pour vous ?
Je peux créer un contact Salesforce à partir d'un profil linkedIn, envoyez moi simplement l'url public du profil.`)
})

controller.hears(['<https://fr.linkedin.com/in/(.*)>'], where, (bot, message) => {
  const url = `https://fr.linkedin.com/in/${message.match[1]}`
  console.log('Bot hears this url:', url)
  linkedIn(url)
    .then((profile) => {
      console.log('Bot retrieves this linkedIn profile:', profile)
      login(config)
        .then(() => {
          query(profile)
            .then((contacts) => {
              console.log('Bot retreives these Salesforce contacts:', contacts)
              if (contacts.totalSize == 0) {
                startCreateConvo(bot, message, url, profile)
              }
              else {
                const contact = contacts.records[0]
                startUpdateConvo(bot, message, url, contact, profile)
              }
            })
            .catch((err) => {
              bot.reply(message, `Contactez le support IT (query, ${err})`)
            })
        })
        .catch((err) => {
          bot.reply(message, `Contactez le support IT (login, ${err})`)
        })
    })
    .catch((err) => {
      bot.reply(message, `Contactez le support IT (linkedIn, ${err})`)
    })
})

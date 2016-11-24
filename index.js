const Botkit = require('botkit')
const LinkedIn = require('./lib/linkedin.js')
const Salesforce = require('./lib/salesforce.js')
const Convos = require('./lib/convos.js')

const config = require(process.argv[2])
const token =  process.env.TOKEN

const controller = Botkit.slackbot()
const bot = controller.spawn({ token }).startRTM()

const where = ['direct_message', 'direct_mention', 'mention']

controller.hears(['hello', 'hi', 'bonjour', 'salut', 'coucou', 'cc'], where, (bot, message) => {
  bot.reply(message, `Bonjour, que puis je faire pour vous ?
Je peux créer un contact Salesforce à partir d'un profil linkedIn, envoyez moi simplement l'url public du profil.`)
})

controller.hears(['<https://fr.linkedin.com/in/(.*)>'], where, (bot, message) => {
  const url = `https://fr.linkedin.com/in/${message.match[1]}`
  console.log(url)
  LinkedIn(url)
    .then((profile) => {
      console.log(`Retrieve linkedIn profile: ${profile}`)
      Salesforce.login(config)
        .then(() => {
          Salesforce.query(profile)
            .then((contacts) => {
              console.log(`Salesforce contacts: ${contacts}`)
              if (contacts.totalSize == 0) {
                Convos.startCreateConvo(bot, message, url, profile)
              }
              else {
                const contact = contacts.records[0]
                console.log(`Salesforce contact: ${contact}`)
                Convos.startUpdateConvo(bot, message, url, contact, profile)
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

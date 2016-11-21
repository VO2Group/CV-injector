import { readFileSync } from 'fs'

import Botkit from 'botkit'

import linkedIn from './lib/linkedin.js'
import { login, query } from './lib/salesforce.js'
import { createConvo, updateConvo } from './lib/convo.js'

const config = JSON.parse(readFileSync(process.argv[2]))
const token =  process.env.TOKEN

const controller = Botkit.slackbot()
const bot = controller.spawn({ token }).startRTM()

const where = ['direct_message', 'direct_mention', 'mention']

controller.hears(['hello', 'hi', 'bonjour', 'salut', 'coucou', 'cc'], where, (bot, message) => {
  bot.reply(message, `Bonjour,
que puis je faire pour vous ?
Je peux creer un contact Salesforce à partir d'un profil linkedIn,
envoyez moi simplement une url linkedIn.`)
})

controller.hears(['<https://fr.linkedin.com/in/(.*)>'], where, (bot, message) => {
  const url = `https://fr.linkedin.com/in/${message.match[1]}`
  console.log(url)
  linkedIn(url)
    .then((profile) => {
      console.log(profile)
      login(config)
        .then(() => {
          query(profile)
            .then((contacts) => {
              console.log(contacts)
              if (contacts.totalSize == 0) {
                createConvo(bot, message, url, profile)
              }
              else {
                const contact = contacts.records[0]
                console.log(contact)
                updateConvo(bot, message, url, contact, profile)
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

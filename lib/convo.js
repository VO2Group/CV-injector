import { insert, update } from './salesforce.js'

function createConvo(bot, message, url, profile) {
  bot.startConversation(message, (err, convo) => {
    convo.ask(`Voulez vous créer contact Salesforce à partir de l'url: ${url} ?`, [
      {
        pattern: 'oui',
        callback: (reply, convo) => {
          insert(profile)
            .then(() => {
              convo.say(`Le contact ${profile.Name} à été crée dans Salesforce`)
              convo.next()
            })
            .catch((err) => {
              convo.say(`Contactez le support IT (insert, ${err})`)
              convo.next()
            })
        }
      },
      {
        default: true,
        callback: (reply, convo) => {
          convo.say('Ok, à bientôt alors !')
          convo.next()
        }
      }
    ])
  })
}

function updateConvo(bot, message, url, contact, profile) {
  bot.startConversation(message, (err, convo) => {
    convo.ask(`Voulez vous mettre à jour le contact Salesforce ${contact.Name} à partir de l'url: ${url} ?`, [
      {
        pattern: 'oui',
        callback: (reply, convo) => {
          update(contact.Id, profile)
            .then(() => {
              convo.say(`Le contact ${contact.Name} à été crée dans Salesforce`)
              convo.next()
            })
            .catch((err) => {
              convo.say(`Contactez le support IT (update, ${err})`)
              convo.next()
            })
        }
      },
      {
        default: true,
        callback: (reply, convo) => {
          convo.say('Ok, à bientôt alors !')
          convo.next()
        }
      }
    ])
  })
}

export { createConvo, updateConvo }
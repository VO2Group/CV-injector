const {insert, update} = require('./salesforce.js')

function startCreateConvo(bot, message, url, profile) {
  bot.startConversation(message, (err, convo) => {
    convo.say(`Hey ! c'est un profil LinkedIn ça: ${JSON.stringify(profile)}`)
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

function startUpdateConvo(bot, message, url, contact, profile) {
  bot.startConversation(message, (err, convo) => {
    convo.say(`Hey ! c'est un profil LinkedIn ça: ${JSON.stringify(profile)}`)
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

module.exports = {startCreateConvo, startUpdateConvo}

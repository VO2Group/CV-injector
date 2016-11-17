import { readFileSync } from 'fs'

import Botkit from 'botkit'
import jsforce from 'jsforce'
import linkedinScraper from 'linkedin-scraper2'

const config = readFileSync(process.argv[2])
const controller = Botkit.slackbot()
const connection = new jsforce.Connection()

const bot = controller.spawn({
  token: process.env.token
}).startRTM()

function stopHere(response, convo) {
  convo.say("Ok, on s'arrête là alors!")
  convo.next()
}

function insertContact(profile) {
  return function (response, convo) {
    connection
      .sobject('Contact')
      .create({
        Name: profile.name
      },
      function (err, res) {
        convo.say('insert: ' + JSON.stringify(err || {}))
        convo.say('insert: ' + JSON.stringify(res || {}))
        convo.next()
      })
  }
}

function updateContact(profile, contact) {
  return function (response, convo) {
    console.log(contact)
    connection
      .sobject('Contact')
      .update({
        Id: contact.Id,
        Name: profile.name
      },
      function (err, res) {
        convo.say('update: ' + JSON.stringify(err || {}))
        convo.say('update: ' + JSON.stringify(res || {}))
        convo.next()
      })
  }
}

controller.hears(['bonjour', 'salut', 'hello', 'coucou', 'cc'], 'direct_message,direct_mention,mention', function (bot, message) {
  bot.reply(message, 'Bonjour, je suis un spécialiste Salesforce! Que puis je faire pour vous ?')
})

controller.hears(['contact <https://fr.linkedin.com/in/(.*)>'], 'direct_message,direct_mention,mention', function (bot, message) {
  var url = 'https://fr.linkedin.com/in/' + message.match[1]

  linkedinScraper(url, function (err, profile) {
    if (err) {
      bot.reply(message, 'LinkedIn ne me répond pas (' + JSON.stringify(err) + '), contactez le support IT')
    }
    else {
      bot.startConversation(message, function (err, convo) {
        convo.ask("Vous allez créer ou mettre à jour un contact dans Salesforce, à partir de l'url: " + url + ', on continue ?', [
          {
            pattern: 'oui',
            callback: function (response, convo) {
              convo.say('ok on continue, je contacte Salesforce...')
              connection.login(config.username, config.password + config.securitytoken, function (err, res) {
                if (err) {
                  convo.say('Salesforce ne me répond pas (' + JSON.stringify(err) + '), contactez le support IT')
                  convo.next()
                }
                else {
                  connection.query("SELECT ID,ISDELETED,MASTERRECORDID,ACCOUNTID,LASTNAME,FIRSTNAME,SALUTATION,MIDDLENAME,SUFFIX,NAME,RECORDTYPEID,MAILINGSTREET,MAILINGCITY,MAILINGSTATE,MAILINGPOSTALCODE,MAILINGCOUNTRY,MAILINGLATITUDE,MAILINGLONGITUDE,MAILINGGEOCODEACCURACY,MAILINGADDRESS,PHONE,FAX,MOBILEPHONE,REPORTSTOID,EMAIL,TITLE,DEPARTMENT,DESCRIPTION,CURRENCYISOCODE,OWNERID,CREATEDDATE,CREATEDBYID,LASTMODIFIEDDATE,LASTMODIFIEDBYID,SYSTEMMODSTAMP,LASTACTIVITYDATE,LASTCUREQUESTDATE,LASTCUUPDATEDATE,LASTVIEWEDDATE,LASTREFERENCEDDATE,EMAILBOUNCEDREASON,EMAILBOUNCEDDATE,ISEMAILBOUNCED,PHOTOURL,JIGSAWCONTACTID,RELATIONSHIP_LEVEL__C,NEWSLETTER__C,CONTACT_ROLE__C,CREATE_A_RESOURCE__C,TYPE_OF_RESOURCE__C,DATE_OF_BIRTH__C,N_S_CURIT_SOCIALE_FRANCE__C,NATIONALITY__C,OFFER__C,PLACE_OF_BIRH__C,PROFESSIONAL_EMAIL__C,PROFILE_LEVEL__C,ROLE__C,TECHNO__C,UNAVAILABILITY_STARTING_DATE__C,USERRELATED__C,AVAILABILITY__C,LINKEDIN_ET_AUTRES_SITES__C,EXPECTATION__C,EXPECTATION_TEXT__C,SOURCING_PRINCIPAL__C,OBSERVATIONS__C,GODFATHERMOTHER__C,SOURCING_SECONDAIRE__C,LIEU_DE_TRAVAIL__C FROM Contact WHERE Name = '" + profile.name + "'", function (err, res) {
                    if (err) {
                      convo.say('Salesforce ne me répond pas (' + JSON.stringify(err) + '), contactez le support IT')
                      convo.next()
                    }
                    else {
                      if (res.totalSize == 0) {
                        convo.ask('Salesforce ne connait pas ' + profile.name + ', voulez vous créer le contact ?', [
                          {
                            pattern: 'oui',
                            callback: insertContact(profile)
                          },
                          {
                            default: true,
                            callback: stopHere
                          }
                        ])
                      }
                      else {
                        convo.ask('Salesforce connait déjà ' + profile.name + ', voulez vous mettre à jour le contact ?', [
                          {
                            pattern: 'oui',
                            callback: updateContact(profile, res.records[0])
                          },
                          {
                            default: true,
                            callback: stopHere
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
            callback: stopHere
          }
        ])
      })
    }
  })
})

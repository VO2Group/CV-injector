const jsforce = require('jsforce')

const connexion = new jsforce.Connection()

function login(config) {
  return new Promise((resolve, reject) => {
    connexion.login(config.username, `${config.password}${config.securitytoken}`, function (err, data) {
      if (err) {
        reject(err)
      }
      else {
        resolve(data)
      }
    })
  })
}

function query(profile) {
  const fields = [
    'ID',
    'ISDELETED',
    'MASTERRECORDID',
    'ACCOUNTID',
    'LASTNAME',
    'FIRSTNAME',
    'SALUTATION',
    'MIDDLENAME',
    'SUFFIX',
    'NAME',
    'RECORDTYPEID',
    'MAILINGSTREET',
    'MAILINGCITY',
    'MAILINGSTATE',
    'MAILINGPOSTALCODE',
    'MAILINGCOUNTRY',
    'MAILINGLATITUDE',
    'MAILINGLONGITUDE',
    'MAILINGGEOCODEACCURACY',
    'MAILINGADDRESS',
    'PHONE',
    'FAX',
    'MOBILEPHONE',
    'REPORTSTOID',
    'EMAIL',
    'TITLE',
    'DEPARTMENT',
    'DESCRIPTION',
    'CURRENCYISOCODE',
    'OWNERID',
    'CREATEDDATE',
    'CREATEDBYID',
    'LASTMODIFIEDDATE',
    'LASTMODIFIEDBYID',
    'SYSTEMMODSTAMP',
    'LASTACTIVITYDATE',
    'LASTCUREQUESTDATE',
    'LASTCUUPDATEDATE',
    'LASTVIEWEDDATE',
    'LASTREFERENCEDDATE',
    'EMAILBOUNCEDREASON',
    'EMAILBOUNCEDDATE',
    'ISEMAILBOUNCED',
    'PHOTOURL',
    'JIGSAWCONTACTID',
    'RELATIONSHIP_LEVEL__C',
    'NEWSLETTER__C',
    'CONTACT_ROLE__C',
    'CREATE_A_RESOURCE__C',
    'TYPE_OF_RESOURCE__C',
    'DATE_OF_BIRTH__C',
    'N_S_CURIT_SOCIALE_FRANCE__C',
    'NATIONALITY__C',
    'OFFER__C',
    'PLACE_OF_BIRH__C',
    'PROFESSIONAL_EMAIL__C',
    'PROFILE_LEVEL__C',
    'ROLE__C',
    'TECHNO__C',
    'UNAVAILABILITY_STARTING_DATE__C',
    'USERRELATED__C',
    'AVAILABILITY__C',
    'LINKEDIN_ET_AUTRES_SITES__C',
    'EXPECTATION__C',
    'EXPECTATION_TEXT__C',
    'SOURCING_PRINCIPAL__C',
    'OBSERVATIONS__C',
    'GODFATHERMOTHER__C',
    'SOURCING_SECONDAIRE__C',
    'LIEU_DE_TRAVAIL__C'
  ].join(',')
  return new Promise((resolve, reject) => {
    connexion.query(`SELECT ${fields} FROM Contact WHERE Name = '${profile.name}'`, (err, data) => {
      if (err) {
        reject(err)
      }
      else {
        resolve(data)
      }
    })
  })
}

function insert(profile) {
  return new Promise((resolve, reject) => {
    connexion
      .sobject('Contact')
      .create({
        Name: profile.name
      },
     (err, data) => {
        if (err) {
          reject(err)
        }
        else {
          resolve(data)
        }
      })
  })
}

function update(id, profile) {
  return new Promise((resolve, reject) => {
    connexion
      .sobject('Contact')
      .update({
        Id: id,
        Name: profile.name
      },
      (err, data) => {
        if (err) {
          reject(err)
        }
        else {
          resolve(data)
        }
      })
  })
}

module.exports = { login, query, insert, update }

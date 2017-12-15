const {Connection} = require('jsforce')

const connexion = null

function init(config) {
  const environment = config.environment === 'sandbox' ? 'test' : 'login'
  connexion = new Connection({loginUrl: `https://${environment}.salesforce.com`})
}

function login(config) {
  return new Promise((resolve, reject) => {
    connexion.login(config.username, `${config.password}${config.securitytoken}`, (err, data) => {
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
    'JIGSAWCONTACTID'
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

module.exports = {
  init,
  login,
  query,
  insert,
  update
}

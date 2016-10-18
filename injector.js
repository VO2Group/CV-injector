var jsforce = require('jsforce'),
    config = require(process.argv[2])
    data = '',
    connection = new jsforce.Connection()

process.stdin.resume()
process.stdin.setEncoding('utf8')
process.stdin.on('data', function (chunk) {
  data += chunk
})
process.stdin.on('end', function () {
  connection.login(config.username, config.password + config.securitytoken, function (err, res) {
    if (err)
      throw err
    console.log(JSON.parse(data))
  })
})

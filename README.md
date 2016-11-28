# CV-injector

A Slack bot to play with Salesforce (made with [Botkit][1]).

# Usage

```
TOKEN=<bot token> node . ./config.json
```

## Configuration

in **./config.json** :

```json
{
  "version": "<version>",
  "clientid": "<client id>",
  "clientsecret": "<client secret>",
  "username": "<email>",
  "password": "<password>",
  "securitytoken": "<security token>",
  "environment": "<environment>"
}
```

> The Salesforce user must be able to create or modify records in Contact object !

## Salesforce

This bot uses [JSforce][2] library to perform actions in your sweet Salesforce.

## Run as daemon

Use this command to launch your bot eternally:

```
TOKEN=<bot token> nohup node . ./config.json >./bot.log 2>&1 &
```

[1]: https://howdy.ai/botkit/ "Botkit"
[2]: https://jsforce.github.io/ "JSforce"

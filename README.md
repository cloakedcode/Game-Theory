# Asychronous Game Web App

This is a project I developed for Mathematics Professor [David Housman](http://www.goshen.edu/dhousman/) at [Goshen College](http://goshen.edu/) for his 2013-2014 Game Theory course.

It's a [NodeJS](http://nodejs.org) web app that allows people who visit the running server URL to play each other asynchronously in games used for Game Theory research (the win/lose results are recorded for analysis).

## How it works

The players join the lobby by visiting the URL and entering a username. Once the admin has chosen a game and starts it, the players are paired up and passed off to the game logic (e.g. [Rock, Paper, Scissors](https://github.com/cloakedcode/Game-Theory.git/games/rockpaperscissors/)). The game is passed the players which individually expose an interface for getting arbitrary input from the user.

## Installation

    git clone https://github.com/cloakedcode/gametheory.git
    cd gametheory
    node server.js

## Testing

    make test
or

    npm test

## The ingredients

 - [NodeJS](http://nodejs.org)
 - [socket.io](http://socket.io) - WebSocket implementation
 - [express](http://expressjs.com) - web server
 - [mustache](http://mustache.github.io/) - "logic-less" templating language
 - [mocha](http://visionmedia.github.io/mocha/) - testing framework
 - [should.js](http://github.com/visionmedia/should.js) - BDD assertion library
 - [node-sqlite3](https://github.com/developmentseed/node-sqlite3) - database

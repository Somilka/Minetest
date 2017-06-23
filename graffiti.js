/*
 * What's better than a bot that knows how to read and understands art?
 *
 * Learn how easy it is to interact with signs and paintings in this example.
 *
 * You can send commands to this bot using chat messages, the bot will
 * reply by telling you the name of the nearest painting or the text written on
 * the nearest sign, and you can also update signs with custom messages!
 *
 * To update a sign simply send a message in this format: write [your message]
 */
var

        // Зависимости...

        // Интерфейс к Minecraft
        mineflayer = require('mineflayer'),

        // Конфигурация (см. `config.yaml`)
        config = require('./lib/config'),

        // Создаём бота...
        bot = mineflayer.createBot({
                host : config.host,
                port : config.port,
                username : 'graffiti',
                // password : 'password',
                verbose : true,
        }),

        target = null
;

bot.on('chat', function(username, message) {
    if(username === bot.username) return;
    switch(true) {
        case /^watch$/.test(message):
            watchPaintingOrSign();
            break;
        case /^write .+$/.test(message):
            // write message
            // ex: write I love diamonds
            updateSign(message);
            break;
    }
});

function watchPaintingOrSign() {
    var paintingBlock = bot.findBlock({
        matching: function(block) {
            return !!block.painting;
        }
    });
    var signBlock = bot.findBlock({
        matching: [63, 68]
    });
    if(signBlock) {
        console.log('Found sign', signBlock );
        bot.chat('The sign says: ' + signBlock.signText);
    } else if(paintingBlock) {
        bot.chat('The painting is: ' + paintingBlock.painting.name);
    } else {
        bot.chat('There are no signs or paintings near me');
    }
}

function updateSign(message) {
    var signBlock = bot.findBlock({
        matching: [63, 68]
    });
    if(signBlock) {
        console.log('changing sign', signBlock, message);
        bot.updateSign(signBlock, message);//.split(' ').slice(1).join(' '));
        bot.chat('Sign updated');
    } else {
        bot.chat('There are no signs near me');
    }
}

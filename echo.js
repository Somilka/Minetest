/*
 * This is one of the simplest examples.
 *
 * We created a simple bot that echoes back everything that is said on chat.
 *
 * It's not very useful yet, but you can use this as a starting point
 * to create your own bot.
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
        username : 'echo',
        // password : 'password',
        verbose : true,
    })
;

bot.on('chat', function(username, message) {
    if(username === bot.username) return;
    bot.chat(message);
});

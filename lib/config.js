/* jshint camelcase:false, unused:false, laxbreak:true, expr:true, boss:true */
/* globals debugger */
/**
 *
 * @module config
 * @overview Загрузка конфигурации из внешнего yaml-файла
 *
 * @author lilliputten <lilliputten@yandex.ru>
 * @since 2017.06.22, 12:41
 * @version 2017.06.22, 12:41
 *
 */

var configFile = 'config.yaml', // Имя файла конфигурации

    // Зависимости...
    fs = require('fs-extra'),
    yaml = require('js-yaml'),

    // Ищем, загружаем и парсим данные из файла
    configData = fs.existsSync(configFile) && yaml.load(fs.readFileSync(configFile), 'utf8') || {}
;

module.exports = configData;

cordova.define('cordova/plugin_list', function(require, exports, module) {
module.exports = [
    {
        "file": "plugins/edu.ucla.sait.lobby.plugins.CardReader/www/CardReader.js",
        "id": "edu.ucla.sait.lobby.plugins.CardReader.CardReader",
        "clobbers": [
            "window.cardreader"
        ]
    }
];
module.exports.metadata = 
// TOP OF METADATA
{
    "edu.ucla.sait.lobby.plugins.CardReader": "1.0.0"
}
// BOTTOM OF METADATA
});
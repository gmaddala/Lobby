cordova.define("edu.ucla.sait.lobby.plugins.CardReader.CardReader", function(require, exports, module) { var cardreader = {
	startCardReader: function(successCallback, errorCallback){
		cordova.exec(
			successCallback,
			errorCallback,
			"CardReader",
			"RunCardReaderListener",
			new Array()
		);
	},
    closeCardReader: function(successCallback, errorCallback){
        cordova.exec(
            successCallback,
            errorCallback,
            "CardReader",
            "StopCardReaderListener",
            new Array()
        );
    }
}

module.exports = cardreader;

});

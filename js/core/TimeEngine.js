/**
 * @file TimeEngine.js
 * @description Gestore centralizzato del tempo e dei timestamp di sistema.
 * @version 0.0.5
 */

/**
 * @function getTimestamp
 * @description Ritorna il timestamp corrente in millisecondi.
 * @return {Number} var_n_now - Timestamp attuale.
 */
Objectis.getTimestamp = function() {
    Objectis.trackCall("getTimestamp");
    var var_n_now = new Date().getTime();
    return var_n_now;
};

/**
 * @function formatTime
 * @description Converte un numero di secondi in formato leggibile HH:MM:SS.
 * @param {Number} N_SECONDS - Secondi da formattare.
 * @return {String} var_s_time - Stringa formattata.
 */
Objectis.formatTime = function(N_SECONDS) {
    Objectis.trackCall("formatTime");
    
    if (!Objectis.isNumber(N_SECONDS)) {
        Objectis.logError("formatTime: N_SECONDS deve essere un numero.");
        return "00:00:00";
    }

    var var_n_h = Math.floor(N_SECONDS / 3600);
    var var_n_m = Math.floor((N_SECONDS % 3600) / 60);
    var var_n_s = Math.floor(N_SECONDS % 60);

    // Padding manuale (compatibilità IE6)
    var var_s_res = (var_n_h < 10 ? "0" : "") + var_n_h + ":" +
                    (var_n_m < 10 ? "0" : "") + var_n_m + ":" +
                    (var_n_s < 10 ? "0" : "") + var_n_s;
                    
    return var_s_res;
};
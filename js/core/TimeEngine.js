/**
 * @file TimeEngine.js
 * @description Gestore del tempo e dei timestamp per il framework.
 * @version 0.0.13
 */

/**
 * @function getTimestamp
 * @description Ritorna il timestamp corrente in millisecondi.
 * @return {Number} var_n_time - Il timestamp attuale.
 */
Objectis.getTimestamp = function() {
    if (typeof this.trackCall === "function") this.trackCall("getTimestamp");
    
    var var_n_time = new Date().getTime();
    return var_n_time;
};

/**
 * @function formatTime
 * @description Converte un numero di secondi in formato leggibile HH:MM:SS.
 * @param {Number} N_SECONDS - Secondi da formattare.
 * @return {String} var_s_time - Stringa formattata.
 */
Objectis.formatTime = function(N_SECONDS) {
    if (typeof this.trackCall === "function") this.trackCall("formatTime");
    
    if (typeof this.isNumber === "function" && !this.isNumber(N_SECONDS)) {
        if (this.logError) this.logError("formatTime: N_SECONDS deve essere un numero.");
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

/**
 * @function formatDate
 * @description Converte un timestamp (secondi) in formato DD/MM/YYYY.
 * @param {Number} var_n_ts - Timestamp in secondi.
 * @return {String} var_s_date - Data formattata.
 */
Objectis.formatDate = function(var_n_ts) {
    var var_o_d = new Date(var_n_ts * 1000);
    var var_n_day = var_o_d.getDate();
    var var_n_month = var_o_d.getMonth() + 1;
    var var_n_year = var_o_d.getFullYear();

    var var_s_res = (var_n_day < 10 ? "0" : "") + var_n_day + "/" +
                    (var_n_month < 10 ? "0" : "") + var_n_month + "/" +
                    var_n_year;
                    
    return var_s_res;
};
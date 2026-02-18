/**
 * @file Crypto.js
 * @description Gestisce la cifratura dei parametri.
 */

(function() {
    // Chiave protetta nella closure, inaccessibile da console
    var var_s_internalKey = "OBJ-SECRET-2026"; 

    Objectis.cryptoEncode = function(S_STR) {
        Objectis.trackCall("cryptoEncode");
        if (!S_STR) return "";
        var var_s_out = "";
        for (var var_n_i = 0; var_n_i < S_STR.length; var_n_i++) {
            var var_n_char = S_STR.charCodeAt(var_n_i) ^ var_s_internalKey.charCodeAt(var_n_i % var_s_internalKey.length);
            var_s_out += String.fromCharCode(var_n_char);
        }
        // Fallback per Base64 se btoa non esiste (IE legacy)
        return (typeof btoa !== 'undefined') ? btoa(var_s_out) : var_s_out; 
    };

    Objectis.cryptoDecode = function(S_STR) {
        Objectis.trackCall("cryptoDecode");
        if (!S_STR) return "";
        var var_s_input = (typeof atob !== 'undefined') ? atob(S_STR) : S_STR;
        var var_s_out = "";
        for (var var_n_i = 0; var_n_i < var_s_input.length; var_n_i++) {
            var var_n_char = var_s_input.charCodeAt(var_n_i) ^ var_s_internalKey.charCodeAt(var_n_i % var_s_internalKey.length);
            var_s_out += String.fromCharCode(var_n_char);
        }
        return var_s_out;
    };
})();
/**
 * @file posts.js
 * @description Logica per la lista dei post - Compatibilità IE6 Syntax.
 * @version 1.0.4
 */

/**
 * @method loadPosts
 * @description Recupera la lista dei post dal file locale samples/posts.json.
 */
window.Objectis.loadPosts = function() {
    var var_o_self = this;
    // In IE6 NON usare la parola chiave 'const', usiamo 'var' con prefisso
    var const_S_URL = this.const_S_BASE + "samples/posts.json";

    this.Ajax.get(const_S_URL, function(var_a_data) {
        if (var_a_data) {
            var_o_self.log("Dati post ricevuti. Elementi: " + var_a_data.length, "SUCCESS");
            
            // 1. Il binding dei dati (Data.js) gestirà la lista tramite obj-data-list
            var_o_self.Data.bind(var_a_data);

            // 2. Ricalcolo layout per attivare eventuale scrollbar
            setTimeout(function() {
                if (var_o_self.Layout) {
                    var_o_self.Layout.fixLayout();
                }
            }, 200);
        } else {
            var_o_self.log("Errore: caricamento posts.json fallito.", "ERROR");
        }
    });
};

// Auto-esecuzione all'avvio del framework
(function() {
    var var_n_timer = setInterval(function() {
        if (window.Objectis && window.Objectis.var_b_isReady) {
            clearInterval(var_n_timer);
            window.Objectis.log("Logica Posts inizializzata.", "SYSTEM");
            window.Objectis.loadPosts();
        }
    }, 100);
})();
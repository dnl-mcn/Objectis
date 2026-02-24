/**
 * @file post.js
 * @description Logica per la visualizzazione del singolo post.
 * @version 1.0.1
 */

/**
 * @method getUrlParam
 * @description Helper per estrarre parametri dalla query string (compatibile IE6).
 */
window.Objectis.getUrlParam = function(var_s_name) {
    var var_s_results = new RegExp('[\?&]' + var_s_name + '=([^&#]*)').exec(window.location.href);
    if (var_s_results == null) {
        return null;
    }
    return decodeURI(var_s_results[1]) || 0;
};

/**
 * @method loadSinglePost
 * @description Carica il JSON e filtra l'elemento per ID.
 */
window.Objectis.loadSinglePost = function() {
    var var_o_self = this;
    var var_n_postId = this.getUrlParam("id");
    const const_S_URL = this.const_S_BASE + "samples/posts.json";

    if (!var_n_postId) {
        this.log("Nessun ID post specificato nell'URL.", "ERROR");
        return;
    }

    this.log("Caricamento dettaglio per post ID: " + var_n_postId, "DEBUG");

    this.Ajax.get(const_S_URL, function(var_a_data) {
        if (var_a_data && var_a_data instanceof Array) {
            var var_o_postFound = null;
            
            for (var var_n_i = 0; var_n_i < var_a_data.length; var_n_i++) {
                if (var_a_data[var_n_i].id == var_n_postId) {
                    var_o_postFound = var_a_data[var_n_i];
                    break;
                }
            }

            if (var_o_postFound) {
                var_o_self.log("Post trovato: " + var_o_postFound.title, "SUCCESS");
                
                // 1. Eseguiamo il binding
                var_o_self.Data.bind(var_o_postFound);

                // 2. DOPO IL BIND: Forziamo il ricalcolo del layout
                // Usiamo un timeout per assicurarci che il DOM sia renderizzato
                setTimeout(function() {
                    if (var_o_self.Layout) {
                        var_o_self.Layout.fixLayout();
                    }
                }, 150);

            } else {
                var_o_self.log("Post con ID " + var_n_postId + " non trovato.", "WARNING");
                var var_o_cont = document.getElementById("post-detail-container");
                if (var_o_cont) var_o_cont.innerHTML = "<h2>Errore: Post non trovato.</h2>";
            }
        }
    });
};

// Inizializzazione
(function() {
    var var_n_timer = setInterval(function() {
        if (window.Objectis && window.Objectis.var_b_isReady) {
            clearInterval(var_n_timer);
            window.Objectis.loadSinglePost();
        }
    }, 100);
})();
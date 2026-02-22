/**
 * @file script.js
 * @description Logica applicativa: gestione eventi e interazioni componenti.
 */

window.Objectis.setEvents = function() {
    // Gestione Bottone Test
    var var_o_btn = this.var_a_components["btn-test-log"];
    if (var_o_btn && !var_o_btn.var_b_bound) {
        var_o_btn.var_b_bound = true;
        var_o_btn.onComponentClick = function() {
            window.Objectis.log("User action: Button Test clicked", "UI");
        };
    }

    // Gestione Bottone Menu
    var var_o_btn_menu = this.var_a_components["btn-menu"];
    if (var_o_btn_menu && !var_o_btn_menu.var_b_bound) {
        var_o_btn_menu.var_b_bound = true;
        var_o_btn_menu.onComponentClick = function() {
            window.Objectis.log("User action: Button Menu clicked", "UI");
        };
    }

    // Gestione Checkbox Accept
    var var_o_chk = this.var_a_components["chk-accept"];
    if (var_o_chk && !var_o_chk.var_b_bound) {
        var_o_chk.var_b_bound = true;
        var_o_chk.onComponentChange = function(var_b_newVal) {
            window.Objectis.log("Checkbox chk-accept status changed: " + var_b_newVal, "USER");
        };
    }

    // Gestione Checkbox Accept
    var var_o_chk1 = this.var_a_components["chk-1"];
    if (var_o_chk1 && !var_o_chk1.var_b_bound) {
        var_o_chk1.var_b_bound = true;
        var_o_chk1.onComponentChange = function(var_b_newVal) {
            window.Objectis.log("Checkbox chk-1 status changed: " + var_b_newVal, "USER");
        };
    }

    
    // Altri eventi...
};

// Post
/**
 * @method loadBlogPost
 */
window.Objectis.loadBlogPost = function() {
    var var_o_self = this;
    
    this.log("Tentativo di caricamento dati post...", "DEBUG");

    if (!this.Data || !this.Ajax) {
        this.log("Moduli Data/Ajax non ancora pronti, riprovo...", "DEBUG");
        setTimeout(function() { var_o_self.loadBlogPost(); }, 200);
        return;
    }

    this.Ajax.get("../test/post.json", function(var_o_data) {
        var_o_self.log("Dati JSON ricevuti con successo.", "DEBUG");
        var_o_self.Data.bind(var_o_data);
    });
};

// Avvio automatico corretto
(function() {
    var var_n_attempts = 0;
    var var_n_timer = setInterval(function() {
        var_n_attempts++;
        
        if (window.Objectis && window.Objectis.var_b_isReady) {
            clearInterval(var_n_timer);
            window.Objectis.log("Framework pronto, avvio loadBlogPost.", "SYSTEM");
            window.Objectis.loadBlogPost();
        } 
        
        // Kill-switch dopo 5 secondi se il framework non si scalda
        if (var_n_attempts > 50) {
            clearInterval(var_n_timer);
            if (window.Objectis && window.Objectis.log) {
                window.Objectis.log("Timeout: Framework non inizializzato correttamente.", "ERROR");
            }
        }
    }, 100);
})();
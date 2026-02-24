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
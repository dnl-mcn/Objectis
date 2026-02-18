/**
 * @file DomScanner.js
 * @description Scanner ottimizzato con filtraggio sub-componenti.
 * @version 1.2.7
 */

(function(var_o_root) {
    if (!var_o_root.Objectis) {
        var_o_root.Objectis = { var_a_components: {} };
    }

    /**
     * @method scan
     */
    var_o_root.Objectis.scan = function() {
        this.log("Scansione UI avviata...", "INFO");
        
        var var_a_allElements = document.getElementsByTagName("*");
        var var_a_targets = [];

        for (var var_n_i = 0; var_n_i < var_a_allElements.length; var_n_i++) {
            var var_o_el = var_a_allElements[var_n_i];
            if (var_o_el.className && var_o_el.className.indexOf("obj-") !== -1) {
                var_a_targets.push(var_o_el);
            }
        }

        for (var var_n_j = 0; var_n_j < var_a_targets.length; var_n_j++) {
            var var_o_target = var_a_targets[var_n_j];
            var var_s_compType = this.extractComponentType(var_o_target.className);
            
            // FILTRO: Carica solo se è un componente reale e non una parte interna (-content, -header)
            if (var_s_compType && !this.isSubComponent(var_s_compType)) {
                this.loadAndInitComponent(var_s_compType, var_o_target);
            }
        }
    };

    /**
     * @method isSubComponent
     * @description Verifica se la classe appartiene a una parte interna di un componente.
     */
    var_o_root.Objectis.isSubComponent = function(var_s_type) {
        var var_a_blacklist = ["panel-content", "panel-header", "button-label"];
        for (var var_n_m = 0; var_n_m < var_a_blacklist.length; var_n_m++) {
            if (var_s_type === var_a_blacklist[var_n_m]) return true;
        }
        return false;
    };

    /**
     * @method extractComponentType
     */
    var_o_root.Objectis.extractComponentType = function(var_s_className) {
        var var_a_parts = var_s_className.split(/\s+/);
        for (var var_n_k = 0; var_n_k < var_a_parts.length; var_n_k++) {
            if (var_a_parts[var_n_k].indexOf("obj-") === 0) {
                return var_a_parts[var_n_k].substring(4);
            }
        }
        return null;
    };

    /**
     * @method loadAndInitComponent
     */
    var_o_root.Objectis.loadAndInitComponent = function(var_s_type, var_o_el) {
        var var_o_self = this;
        
        if (this[var_s_type]) {
            var var_o_inst = new this[var_s_type](var_o_el);
            if (var_o_el.id) {
                this.var_a_components[var_o_el.id] = var_o_inst;
            }
            var_o_inst.init();
            this.setEvents();
        } else {
            var var_s_path = "js/ui/" + var_s_type + ".js";
            var var_o_script = document.createElement("script");
            var_o_script.type = "text/javascript";
            var_o_script.src = var_s_path;
            
            var_o_script.onload = function() {
                var_o_self.log("Modulo UI caricato: " + var_s_type, "LOADER");
                var_o_self.loadAndInitComponent(var_s_type, var_o_el);
            };
            
            // Gestione errore 404 per evitare log sporchi in console
            var_o_script.onerror = function() {
                var_o_self.log("Impossibile trovare il modulo: " + var_s_path, "ERROR");
            };
            
            document.getElementsByTagName("head")[0].appendChild(var_o_script);
        }
    };

    if (var_o_root.Objectis.var_b_isBooting) {
        setTimeout(function() {
            var_o_root.Objectis.var_b_isBooting = false;
            var_o_root.Objectis.init();
        }, 50);
    }

})(window);
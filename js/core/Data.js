/**
 * @file Data.js
 * @description Gestore Data Binding - Versione robusta con debug integrato.
 * @version 1.0.2
 */

(function(var_o_root) {
    if (!var_o_root.Objectis) return;

    var_o_root.Objectis.Data = {
        /**
         * @method bind
         * @param {Object} var_o_dataset - L'oggetto JSON con i dati
         */
        bind: function(var_o_dataset) {
            var var_a_elements = document.getElementsByTagName("*");
            var var_s_prefix = "obj-data-";
            var var_n_count = 0;

            if (!var_o_dataset) {
                Objectis.log("Data.bind: Dataset nullo o non valido.", "ERROR");
                return;
            }

            for (var var_n_i = 0; var_n_i < var_a_elements.length; var_n_i++) {
                var var_o_el = var_a_elements[var_n_i];
                
                // Verifichiamo se l'elemento ha la classe obj-data-bind
                if (var_o_el.className && var_o_el.className.indexOf("obj-data-bind") !== -1) {
                    // Pulizia estrema del contenuto (rimozione spazi, tab, newline)
                    var var_s_rawContent = var_o_el.innerHTML || "";
                    var var_s_cleanContent = var_s_rawContent.replace(/\s+/g, "").replace(/<[^>]*>/g, "");
                    
                    if (var_s_cleanContent.indexOf(var_s_prefix) === 0) {
                        var var_s_key = var_s_cleanContent.substring(var_s_prefix.length);
                        
                        if (typeof var_o_dataset[var_s_key] !== "undefined") {
                            var var_v_val = var_o_dataset[var_s_key];
                            
                            // Formattazione data semplice per IE6
                            if (var_s_key === "date" && typeof var_v_val === "number") {
                                var var_o_d = new Date(var_v_val * 1000);
                                var_v_val = var_o_d.getDate() + "/" + (var_o_d.getMonth() + 1) + "/" + var_o_d.getFullYear();
                            }
                            
                            var_o_el.innerHTML = var_v_val;
                            var_n_count++;
                        } else {
                            Objectis.log("Chiave '" + var_s_key + "' non trovata nel JSON.", "WARNING");
                        }
                    }
                }
            }

            // Dopo il binding, ricalcoliamo le altezze del layout
            Objectis.log("Data Binding completato. Sostituzioni effettuate: " + var_n_count, "DATA");

            if (Objectis.Layout && typeof Objectis.Layout.fixHeights === "function") {
                Objectis.Layout.fixHeights();
            }
        }
    };
})(window);
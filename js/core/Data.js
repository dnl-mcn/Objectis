/**
 * @file Data.js
 * @description Gestore Data Binding - Supporta caricamento on-demand di TimeEngine.
 * @version 1.0.5
 */

(function(var_o_root) {
    if (!var_o_root.Objectis) return;

    var_o_root.Objectis.Data = {
        /**
         * @method bind
         * @param {Object} var_o_dataset - L'oggetto JSON con i dati
         */
        bind: function(var_o_dataset) {
            var var_o_self = this;
            var var_a_elements = document.getElementsByTagName("*");
            // RegExp per trovare tutti i pattern obj-data-CHIAVE (gestisce lettere, numeri e underscore)
            var var_re_pattern = /obj-data-([a-zA-Z0-9_]+)/g;

            if (!var_o_dataset) {
                Objectis.log("Data.bind: Dataset nullo o non valido.", "ERROR");
                return;
            }

            // FASE 1: Controllo se è necessaria la gestione date
            var var_b_needsTime = false;
            for (var var_s_k in var_o_dataset) {
                if (var_s_k === "date") {
                    var_b_needsTime = true;
                    break;
                }
            }

            // FASE 2: Caricamento Lazy di TimeEngine se necessario
            if (var_b_needsTime && typeof Objectis.formatDate === "undefined") {
                Objectis.log("Rilevata chiave 'date'. Caricamento on-demand di TimeEngine.js...", "SYSTEM");
                
                Objectis.importModule("js/core/TimeEngine.js", "TimeEngine");
                
                // Attendiamo il caricamento prima di procedere (ricorsione controllata)
                var var_n_wait = setInterval(function() {
                    if (typeof Objectis.formatDate === "function") {
                        clearInterval(var_n_wait);
                        var_o_self.bind(var_o_dataset);
                    }
                }, 50);
                return; // Interrompiamo l'esecuzione corrente
            }

            // FASE 3: Esecuzione Binding Reale
            for (var var_n_i = 0; var_n_i < var_a_elements.length; var_n_i++) {
                var var_o_el = var_a_elements[var_n_i];
                
                // Verifichiamo se l'elemento ha la classe obj-data-bind
                if (var_o_el.className && var_o_el.className.indexOf("obj-data-bind") !== -1) {
                    var var_s_html = var_o_el.innerHTML;
                    var var_s_newHtml = var_s_html;
                    var var_a_match;
                    var var_b_changed = false;

                    // Reset dell'indice della RegExp per IE
                    var_re_pattern.lastIndex = 0;

                    // Cerchiamo tutti i match nel contenuto del tag
                    while ((var_a_match = var_re_pattern.exec(var_s_html)) !== null) {
                        var var_s_fullMatch = var_a_match[0]; // es: obj-data-date
                        var var_s_key = var_a_match[1];       // es: date
                        
                        if (typeof var_o_dataset[var_s_key] !== "undefined") {
                            var var_v_val = var_o_dataset[var_s_key];
                            
                            // Formattazione via TimeEngine (ora garantito dalla FASE 2)
                            if (var_s_key === "date" && typeof var_v_val === "number") {
                                if (typeof Objectis.formatDate === "function") {
                                    var_v_val = Objectis.formatDate(var_v_val);
                                }
                            }
                            
                            // Sostituiamo il segnaposto con il valore reale
                            var_s_newHtml = var_s_newHtml.replace(var_s_fullMatch, var_v_val);
                            var_b_changed = true;
                        } else {
                            Objectis.log("Chiave '" + var_s_key + "' non trovata nel JSON.", "WARNING");
                        }
                    }

                    if (var_b_changed) var_o_el.innerHTML = var_s_newHtml;
                }
            }
            
            Objectis.log("Data Binding completato con successo.", "DATA");

            if (Objectis.Layout && typeof Objectis.Layout.fixHeights === "function") {
                Objectis.Layout.fixHeights();
            }
        }
    };
})(window);
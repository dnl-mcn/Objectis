/**
 * @file Data.js
 * @description Gestore Data Binding - Supporta liste, placeholder negli attributi e caricamento on-demand.
 * @version 1.0.9
 */

(function(var_o_root) {
    if (!var_o_root.Objectis) return;

    var_o_root.Objectis.Data = {
        /**
         * @method bind
         * @param {Object|Array} var_v_dataset - L'oggetto JSON o l'Array con i dati
         */
        bind: function(var_v_dataset) {
            var var_o_self = this;
            var var_a_elements = document.getElementsByTagName("*");
            // RegExp per trovare tutti i pattern obj-data-CHIAVE (gestisce lettere, numeri e underscore)
            var var_re_pattern = /obj-data-([a-zA-Z0-9_]+)/g;

            if (!var_v_dataset) {
                Objectis.log("Data.bind: Dataset nullo o non valido.", "ERROR");
                return;
            }

            // FASE 1: Controllo se è necessaria la gestione date
            // Verifichiamo sia in caso di oggetto singolo che di array (prendendo il primo elemento)
            var var_b_needsTime = false;
            var var_o_check = (var_v_dataset instanceof Array) ? var_v_dataset[0] : var_v_dataset;
            
            if (var_o_check) {
                for (var var_s_k in var_o_check) {
                    if (var_s_k === "date") {
                        var_b_needsTime = true;
                        break;
                    }
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
                        var_o_self.bind(var_v_dataset);
                    }
                }, 50);
                return; // Interrompiamo l'esecuzione corrente
            }

            // FASE 3: Esecuzione Binding Reale
            
            // --- LOGICA A: GESTIONE LISTE (ARRAY) ---
            if (var_v_dataset instanceof Array || (typeof var_v_dataset.length === "number")) {
                for (var var_n_i = 0; var_n_i < var_a_elements.length; var_n_i++) {
                    var var_o_container = var_a_elements[var_n_i];
                    var var_s_className = var_o_container.className || "";
                    
                    // Cerchiamo la classe che identifica la lista (es. obj-data-list-posts)
                    if (var_s_className.indexOf("obj-data-list-") !== -1) {
                        var var_s_tpl = var_o_container.innerHTML;
                        var var_s_finalHtml = "";

                        for (var var_n_j = 0; var_n_j < var_v_dataset.length; var_n_j++) {
                            var var_o_item = var_v_dataset[var_n_j];
                            var var_s_itemHtml = var_s_tpl;

                            // Sostituzione placeholder nell'item della lista
                            var_re_pattern.lastIndex = 0;
                            var var_a_match;
                            while ((var_a_match = var_re_pattern.exec(var_s_tpl)) !== null) {
                                var var_s_full = var_a_match[0];
                                var var_s_key = var_a_match[1];
                                
                                if (typeof var_o_item[var_s_key] !== "undefined") {
                                    var var_v_val = var_o_item[var_s_key];
                                    if (var_s_key === "date" && typeof var_v_val === "number") {
                                        if (Objectis.formatDate) var_v_val = Objectis.formatDate(var_v_val);
                                    }
                                    
                                    // Sostituzione globale (innerHTML e attributi simulati nel testo del template)
                                    // Usiamo un loop per rimpiazzare tutte le occorrenze nello snippet dell'item
                                    while(var_s_itemHtml.indexOf(var_s_full) !== -1) {
                                        var_s_itemHtml = var_s_itemHtml.replace(var_s_full, var_v_val);
                                    }
                                }
                            }
                            var_s_finalHtml += var_s_itemHtml;
                        }
                        var_o_container.innerHTML = var_s_finalHtml;
                    }
                }
            }
            // --- LOGICA B: GESTIONE OGGETTO SINGOLO ---
            else {
                // Binding oggetto singolo (rimasto invariato ma ora supporta sostituzione multipla)
                for (var var_n_e = 0; var_n_e < var_a_elements.length; var_n_e++) {
                    var var_o_el = var_a_elements[var_n_e];
                    
                    // Verifichiamo se l'elemento ha la classe obj-data-bind
                    if (var_o_el.className && var_o_el.className.indexOf("obj-data-bind") !== -1) {
                        var var_s_newHtml = var_o_el.innerHTML;
                        var_re_pattern.lastIndex = 0;

                        // Cerchiamo tutti i match nel contenuto del tag
                        while ((var_a_match = var_re_pattern.exec(var_o_el.innerHTML)) !== null) {
                            var var_s_key = var_a_match[1];
                            if (typeof var_v_dataset[var_s_key] !== "undefined") {
                                var var_v_val = var_v_dataset[var_s_key];
                                if (var_s_key === "date" && typeof var_v_val === "number" && Objectis.formatDate) {
                                    var_v_val = Objectis.formatDate(var_v_val);
                                }
                                var_s_newHtml = var_s_newHtml.replace(var_a_match[0], var_v_val);
                            }
                        }
                        var_o_el.innerHTML = var_s_newHtml;
                    }
                }
            }
            
            Objectis.log("Data Binding completato con successo.", "DATA");

            if (Objectis.Layout && typeof Objectis.Layout.fixHeights === "function") {
                Objectis.Layout.fixHeights();
            }
        }
    };
})(window);
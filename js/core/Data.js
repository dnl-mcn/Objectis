/**
 * @file Data.js
 * @description Gestore Data Binding - Supporta liste, placeholder e sincronizzazione Heartbeat.
 * @version 1.2.0
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

            // FASE 2: Caricamento Lazy di TimeEngine se necessario (tramite Heartbeat)
            if (var_b_needsTime && typeof Objectis.formatDate === "undefined") {
                if (!Objectis.var_a_loadingQueue) Objectis.var_a_loadingQueue = {};
                if (Objectis.var_a_loadingQueue["TimeEngine"] !== "loading") {
                    Objectis.log("Rilevata chiave 'date'. Caricamento on-demand di TimeEngine.js...", "SYSTEM");
                    Objectis.var_a_loadingQueue["TimeEngine"] = "loading";
                    Objectis.importModule("js/core/TimeEngine.js", "TimeEngine");
                }
                
                // MODIFICA: Utilizzo del TimeEngine per la ricorsione se disponibile, altrimenti fallback sicuro.
                if (Objectis.TimeEngine) {
                    Objectis.TimeEngine.addAction(function() {
                        var_o_self.bind(var_v_dataset);
                    }, 50, true);
                } else {
                    setTimeout(function() {
                        var_o_self.bind(var_v_dataset);
                    }, 50);
                }
                return;
            }

            // FASE 3: Esecuzione Binding Reale
            
            // --- LOGICA A: GESTIONE LISTE (ARRAY) ---
            if (var_v_dataset instanceof Array || (var_v_dataset && typeof var_v_dataset.length === "number")) {
                for (var var_n_i = 0; var_n_i < var_a_elements.length; var_n_i++) {
                    var var_o_container = var_a_elements[var_n_i];
                    var var_s_className = var_o_container.className || "";
                    
                    // Cerchiamo la classe che identifica la lista (es. obj-data-list-posts)
                    if (var_s_className.indexOf("obj-data-list-") !== -1) {
                        // MODIFICA: Salviamo il template originale in una proprietà per permettere refresh infiniti.
                        if (!var_o_container._obj_tpl) {
                            var_o_container._obj_tpl = var_o_container.innerHTML;
                        }
                        
                        var var_s_tpl = var_o_container._obj_tpl;
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
                        // MODIFICA: Aggiunto supporto per tag input e textarea.
                        var var_b_isInput = (var_o_el.tagName.toLowerCase() === "input" || var_o_el.tagName.toLowerCase() === "textarea");
                        var var_s_content = var_b_isInput ? var_o_el.value : var_o_el.innerHTML;
                        
                        var_re_pattern.lastIndex = 0;
                        var var_a_m;
                        while ((var_a_m = var_re_pattern.exec(var_s_content)) !== null) {
                            var var_s_key = var_a_m[1];
                            if (typeof var_v_dataset[var_s_key] !== "undefined") {
                                var var_v_val = var_v_dataset[var_s_key];
                                if (var_s_key === "date" && typeof var_v_val === "number" && Objectis.formatDate) {
                                    var_v_val = Objectis.formatDate(var_v_val);
                                }
                                var_s_content = var_s_content.replace(var_a_m[0], var_v_val);
                            }
                        }
                        
                        if (var_b_isInput) var_o_el.value = var_s_content;
                        else var_o_el.innerHTML = var_s_content;
                    }
                }
            }
            
            Objectis.log("Data Binding completato.", "DATA");

            // Notifica il Layout (anche qui tramite Heartbeat per stabilità IE6)
            if (Objectis.Layout && typeof Objectis.Layout.fixHeights === "function") {
                if (Objectis.TimeEngine) {
                    Objectis.TimeEngine.addAction(function() { Objectis.Layout.fixHeights(); }, 50, false);
                } else {
                    setTimeout(function() { Objectis.Layout.fixHeights(); }, 50);
                }
            }
        }
    };
})(window);
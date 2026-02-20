/**
 * @file DomScanner.js
 * @description Scanner DOM JIT - Logica strutturale rigida per il riconoscimento componenti.
 * @version 1.3.0
 */

(function(var_o_root) {
    if (!var_o_root.Objectis) {
        var_o_root.Objectis = { var_a_components: {}, var_a_loadingQueue: {} };
    }

    // Contatore per l'hard kill-switch: previene loop se onerror fallisce
    var_o_root.Objectis.var_a_retryCount = {};

    var_o_root.Objectis.scan = function() {
        var var_o_self = this;
        var var_a_liveElements = document.getElementsByTagName("*");
        var var_a_staticElements = [];
        
        // FIX FONDAMENTALE: Congeliamo gli elementi in un array statico. 
        // Impedisce loop infiniti causati dalla modifica del DOM (es. da panel.js) durante il ciclo.
        for (var var_n_k = 0; var_n_k < var_a_liveElements.length; var_n_k++) {
            var_a_staticElements.push(var_a_liveElements[var_n_k]);
        }

        var var_s_prefix = "obj-";
        var var_b_pending = false;

        for (var var_n_i = 0; var_n_i < var_a_staticElements.length; var_n_i++) {
            var var_o_el = var_a_staticElements[var_n_i];
            
            // FIX IE: Ignora i nodi commento o testo
            if (!var_o_el || var_o_el.nodeType !== 1) continue;

            // Usiamo una proprietà diretta sul nodo (invece di getAttribute) per solidità cross-browser
            if (var_o_el._obj_init === true) continue;

            var var_s_class = var_o_el.className;
            
            if (var_s_class && typeof var_s_class === "string" && var_s_class.indexOf(var_s_prefix) !== -1) {
                var var_a_classes = var_s_class.split(" ");
                
                for (var var_n_j = 0; var_n_j < var_a_classes.length; var_n_j++) {
                    var var_s_name = var_a_classes[var_n_j];

                    // Regola: deve iniziare con il prefisso
                    if (var_s_name.indexOf(var_s_prefix) === 0) {
                        var var_a_parts = var_s_name.split("-");
                        
                        /**
                         * REGOLA STRUTTURALE:
                         * Un componente valido deve essere esattamente "obj-nome".
                         * Se ha meno di 2 parti (obj-) o più di 2 parti (obj-checkbox-status), lo scartiamo.
                         */
                        if (var_a_parts.length !== 2) {
                            continue;
                        }

                        var var_s_compName = var_a_parts[1];

                        // Controllo rigoroso contro i loop: se è 'undefined', il modulo non esiste ANCORA in memoria
                        if (typeof this[var_s_compName] === "undefined") {
                            
                            // Inizializza contatore tentativi
                            if (typeof this.var_a_retryCount[var_s_compName] === "undefined") {
                                this.var_a_retryCount[var_s_compName] = 0;
                            }

                            // KILL-SWITCH: Dopo 3 tentativi ignoriamo il modulo per sempre
                            if (this.var_a_retryCount[var_s_compName] >= 3) {
                                this.log("Modulo " + var_s_compName + " abortito.", "ERROR");
                                this[var_s_compName] = false; 
                                continue;
                            }

                            if (this.var_a_loadingQueue[var_s_compName] !== "loading") {
                                this.var_a_loadingQueue[var_s_compName] = "loading";
                                this.var_a_retryCount[var_s_compName]++;
                                
                                this.importStyle("css/" + var_s_compName + ".css");
                                // Passiamo il nome componente a importModule per mappare gli errori
                                this.importModule("js/ui/" + var_s_compName + ".js", var_s_compName);
                            }
                            var_b_pending = true;
                            continue;
                        }

                        // Se il componente è una funzione (caricato correttamente), lo istanziamo
                        if (typeof this[var_s_compName] === "function") {
                            // Segniamo come inizializzato istantaneamente prima di qualsiasi esecuzione
                            var_o_el._obj_init = true;
                            
                            var var_s_id = var_o_el.id || (var_s_compName + "_" + Math.random().toString().substring(2, 8));
                            
                            if (!this.var_a_components[var_s_id]) {
                                try {
                                    var var_o_instance = new this[var_s_compName](var_o_el);
                                    this.var_a_components[var_s_id] = var_o_instance;
                                    
                                    if (typeof var_o_instance.init === "function") {
                                        var_o_instance.init();
                                    }
                                } catch (var_o_err) {
                                    this.log("Errore critico in " + var_s_compName + ": " + (var_o_err.message || "Unknown Error"), "ERROR");
                                }
                            }
                            
                            // Chiamata centralizzata al gestore eventi (camelCase come richiesto)
                            this.setEvents();
                        }
                    }
                }
            }
        }

        if (var_b_pending) {
            setTimeout(function() { var_o_self.scan(); }, 1000);
        }
    };
})(window);
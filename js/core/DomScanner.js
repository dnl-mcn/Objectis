/**
 * @file DomScanner.js
 * @description Scanner DOM JIT - Integrazione Heartbeat Clock e Security.
 * @version 1.5.0
 */

(function(var_o_root) {
    if (!var_o_root.Objectis) {
        var_o_root.Objectis = { var_a_components: {}, var_a_loadingQueue: {} };
    }

    // Contatore per l'hard kill-switch: previene loop se onerror fallisce
    var_o_root.Objectis.var_a_retryCount = {};

    var_o_root.Objectis.scan = function() {
        var var_o_self = this;

        // 1. SECURITY LOCKDOWN (Eseguito ad ogni battito di scansione)
        if (typeof this.lockdown === "function") {
            this.lockdown();
        }

        // 2. CHECK ON-DEMAND CORE MODULES
        if (typeof this.Ajax === "undefined" && this.var_a_loadingQueue["Ajax"] !== "loading") {
            if (this.loadPosts || (this.var_s_logicPath && this.var_s_logicPath.indexOf("posts") !== -1)) {
                this.var_a_loadingQueue["Ajax"] = "loading";
                this.importModule("js/core/Ajax.js", "Ajax");
                this.log("Iniezione JIT: Ajax.js richiesto.", "SYSTEM");
            }
        }

        // Se abbiamo elementi con attributi data- o se usiamo binding, iniettiamo Data.js
        if (typeof this.Data === "undefined" && this.var_a_loadingQueue["Data"] !== "loading") {
            var var_a_binds = document.querySelectorAll ? document.querySelectorAll('[class*="obj-"]') : [];
            if (var_a_binds.length > 0 || this.loadPosts) {
                this.var_a_loadingQueue["Data"] = "loading";
                this.importModule("js/core/Data.js", "Data");
                this.log("Iniezione JIT: Data.js richiesto.", "SYSTEM");
            }
        }

        // 3. CONGELAMENTO DOM PER IE6
        var var_a_liveElements = document.getElementsByTagName("*");
        var var_a_staticElements = [];
        
        // FIX FONDAMENTALE: Congeliamo gli elementi in un array statico. 
        // Impedisce loop infiniti causati dalla modifica del DOM (es. da panel.js) durante il ciclo.
        for (var var_n_k = 0; var_n_k < var_a_liveElements.length; var_n_k++) {
            var_a_staticElements.push(var_a_liveElements[var_n_k]);
        }

        var var_s_prefix = "obj-";
        var var_b_pending = false;

        // MODIFICA: Lista di parole riservate che iniziano con obj- ma non sono componenti UI
        var var_o_reserved = { "ready": true, "loading": true, "active": true, "error": true };

        if (this.var_a_loadingQueue["Ajax"] === "loading" || this.var_a_loadingQueue["Data"] === "loading") {
            var_b_pending = true;
        }

        // 4. CICLO DI ANALISI COMPONENTI
        for (var var_n_i = 0; var_n_i < var_a_staticElements.length; var_n_i++) {
            var var_o_el = var_a_staticElements[var_n_i];
            
            // FIX IE: Ignora i nodi commento o testo
            if (!var_o_el || var_o_el.nodeType !== 1 || var_o_el._obj_init === true) continue;

            var var_s_class = var_o_el.className;
            
            if (var_s_class && typeof var_s_class === "string" && var_s_class.indexOf(var_s_prefix) !== -1) {
                var var_a_classes = var_s_class.split(" ");
                
                for (var var_n_j = 0; var_n_j < var_a_classes.length; var_n_j++) {
                    var var_s_name = var_a_classes[var_n_j];

                    // Regola: deve iniziare con il prefisso
                    if (var_s_name.indexOf(var_s_prefix) === 0) {
                        
                        // Gestione Layout
                        if (var_s_name.indexOf("obj-layout-") === 0) {
                            if (this.var_a_loadingQueue["layout"] !== "loaded") {
                                this.var_a_loadingQueue["layout"] = "loaded";
                                // Carichiamo il CSS del layout e il modulo JS del Layout se non presente
                                this.importStyle("css/layout.css");
                                if (typeof this.Layout === "undefined") {
                                    this.importModule("js/core/Layout.js", "Layout");
                                }
                                this.log("Rilevato layout: iniezione layout.css e core/Layout.js", "SYSTEM");
                            }
                            continue; // Non procedere con il controllo componenti JS per il layout
                        }

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
                        if (var_o_reserved[var_s_compName]) continue;

                        // Se il componente non è ancora carico, lo mettiamo in coda
                        if (typeof this[var_s_compName] === "undefined") {
                            if (this.var_a_loadingQueue[var_s_compName] !== "loading") {
                                this.var_a_loadingQueue[var_s_compName] = "loading";
                                this.importStyle("css/" + var_s_compName + ".css");
                                // Passiamo il nome componente a importModule per mappare gli errori
                                this.importModule("js/ui/" + var_s_compName + ".js", var_s_compName);
                            }
                            var_b_pending = true;
                            continue;
                        }

                        // Istanziazione Componente
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
                                    this.log("Errore istanza: " + var_o_err.message, "ERROR");
                                }
                            }
                            
                            // FIX: Chiamata sicura al gestore eventi
                            if (typeof this.setEvents === "function") {
                                this.setEvents();
                            }
                        }
                    }
                }
            }
        }

        // 5. GESTIONE RICORSIONE TRAMITE TIMEENGINE (Sostituzione setTimeout)
        if (var_b_pending) {
            if (this.TimeEngine) {
                this.TimeEngine.addAction(function() { var_o_self.scan(); }, 100, true);
            } else {
                // Fallback se TimeEngine non è ancora pronto durante il boot iniziale
                setTimeout(function() { var_o_self.scan(); }, 100);
            }
        } else {
            // Se non ci sono più pendenti, il framework è "stabile"
            // Lanciamo il ricalcolo layout con supporto per colonne expand
            if (typeof this.Layout !== "undefined" && typeof this.Layout.fixLayout === "function") {
                if (this.TimeEngine) {
                    this.TimeEngine.addAction(function() { var_o_self.Layout.fixLayout(); }, 50, false);
                } else {
                    setTimeout(function() { var_o_self.Layout.fixLayout(); }, 50);
                }
            }
            this.log("Scansione completata e layout stabilizzato.", "SYSTEM");
        }
    };
})(window);
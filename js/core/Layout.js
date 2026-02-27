/**
 * @file Layout.js
 * @description Motore di rendering ricorsivo - Versione Heartbeat Sync.
 * @version 1.4.0
 */

(function(var_o_root) {
    if (!var_o_root.Objectis) return;

    var_o_root.Objectis.Layout = {
        var_b_initialized: false,
        var_b_resizePending: false, // Flag per gestire il debounce nel clock

        /**
         * @method init
         * Configura i listener per il ridimensionamento della finestra.
         */
        init: function() {
            var var_o_self = this;
            if (this.var_b_initialized) return;
            
            // Fix IE6: Utilizziamo il clock per gestire il ridimensionamento senza saturare la CPU
            window.onresize = function() { 
                if (var_o_self.var_b_resizePending) return;
                var_o_self.var_b_resizePending = true;

                if (window.Objectis.TimeEngine) {
                    window.Objectis.TimeEngine.addAction(function() {
                        var_o_self.var_b_resizePending = false;
                        var_o_self.fixLayout();
                    }, 100, false); // Debounce di 100ms sincronizzato
                } else {
                    // Fallback se il motore tempo non è ancora pronto
                    setTimeout(function() {
                        var_o_self.var_b_resizePending = false;
                        var_o_self.fixLayout();
                    }, 100);
                }
            };
            this.var_b_initialized = true;
        },

        /**
         * @method fixLayout
         * Punto di ingresso principale per il ricalcolo globale.
         */
        fixLayout: function() {
            this.init(); // Assicura che i listener siano attivi
            var var_o_main = document.getElementById("main-viewport");
            
            // Fix critico IE6: Se il viewport non ha altezza, usiamo l'altezza della finestra
            if (var_o_main) {
                var var_n_winH = 0;
                // Calcolo altezza finestra cross-browser
                if (document.documentElement && document.documentElement.clientHeight) {
                    var_n_winH = document.documentElement.clientHeight;
                } else if (document.body) {
                    var_n_winH = document.body.clientHeight;
                }
                
                if (var_o_main.className.indexOf("obj-layout-full") !== -1) {
                    // Invece di 0px, usiamo l'altezza calcolata direttamente 
                    // per evitare il blackout visivo
                    var_o_main.style.height = var_n_winH + "px";
                }
                
                var_o_main.style.zoom = "1";
                this.processContainer(var_o_main);
            }
        },

        /**
         * @method processContainer
         * Analizza un contenitore e processa i suoi figli (righe e colonne).
         * @param {HTMLElement} var_o_parent - Il nodo da processare
         */
        processContainer: function(var_o_parent) {
            if (!var_o_parent || !var_o_parent.childNodes) return;

            var var_a_children = var_o_parent.childNodes;
            var var_a_rows = [];
            var var_n_totalHUsed = 0;
            var var_a_expandRows = [];
            
            // RESET SELETTIVO: Portiamo a 1px solo le righe expand per permettere lo shrink
            // senza causare il blackout dell'intero viewport.
            for (var var_n_res = 0; var_n_res < var_a_children.length; var_n_res++) {
                var var_o_res = var_a_children[var_n_res];
                if (var_o_res.nodeType === 1 && var_o_res.className && var_o_res.className.indexOf("obj-layout-row-expand") !== -1) {
                    var_o_res.style.height = "1px";
                }
            }

            // Misuriamo lo spazio ora che è "vuoto"
            var var_n_parentH = var_o_parent.clientHeight || 0;

            // Ripristiniamo e calcoliamo
            for (var var_n_i = 0; var_n_i < var_a_children.length; var_n_i++) {
                var var_o_child = var_a_children[var_n_i];
                if (var_o_child && var_o_child.nodeType === 1 && var_o_child.className && var_o_child.className.indexOf("obj-layout-row") !== -1) {
                    
                    // IE6 BUG FIX: Reset font-size per permettere altezze arbitrarie
                    var_o_child.style.zoom = "1";
                    var_o_child.style.overflow = "hidden";
                    
                    // MODIFICA: Azzeriamo il font solo se la riga è un contenitore strutturale.
                    // Se contiene testo (no classi obj-layout-), ripristiniamo la visibilità.
                    var var_b_hasLayoutChildren = (var_o_child.innerHTML.indexOf("obj-layout-") !== -1);
                    
                    if (var_b_hasLayoutChildren && var_o_child.className.indexOf("obj-layout-row-no-reset") === -1) {
                        var_o_child.style.fontSize = "0px";
                        var_o_child.style.lineHeight = "0px";
                    } else {
                        var_o_child.style.fontSize = "12px";
                        var_o_child.style.lineHeight = "normal";
                    }

                    var_a_rows.push(var_o_child);
                    
                    // Se ha una classe percentuale (es: row-20) calcoliamo l'altezza in px
                    var var_re_pct = /obj-layout-row-(\d+)/;
                    var var_a_match = var_o_child.className.match(var_re_pct);
                    
                    if (var_a_match && var_a_match[1]) {
                        var var_n_px = Math.floor((var_n_parentH * parseInt(var_a_match[1], 10)) / 100);
                        var_o_child.style.height = var_n_px + "px";
                        var_n_totalHUsed += var_n_px;
                    } else if (var_o_child.className.indexOf("obj-layout-row-expand") !== -1) {
                        var_a_expandRows.push(var_o_child);
                    } else {
                        var_n_totalHUsed += var_o_child.offsetHeight || 0;
                    }
                }
            }

            // Calcolo dinamico righe expand
            if (var_a_expandRows.length > 0) {
                var var_n_availableH = var_n_parentH - var_n_totalHUsed;
                var var_n_eachH = Math.floor(var_n_availableH / var_a_expandRows.length);
                if (var_n_eachH < 0) var_n_eachH = 0;
                
                for (var var_n_r = 0; var_n_r < var_a_expandRows.length; var_n_r++) {
                    var_a_expandRows[var_n_r].style.height = var_n_eachH + "px";
                }
            }

            // FIX: Corretto var_k in var_n_k per evitare crash ricorsivo
            for (var var_n_k = 0; var_n_k < var_a_rows.length; var_n_k++) {
                this.processRow(var_a_rows[var_n_k]);
            }
        },

        /**
         * @method processRow
         * Gestisce il bilanciamento orizzontale e la nidificazione.
         */
        processRow: function(var_o_row) {
            if (!var_o_row) return;

            var var_a_children = var_o_row.childNodes;
            var var_n_rowW = var_o_row.clientWidth || 0;
            var var_a_cols = [];
            var var_n_totalWUsed = 0;
            var var_a_expandCols = [];

            for (var var_n_i = 0; var_n_i < var_a_children.length; var_n_i++) {
                var var_o_child = var_a_children[var_n_i];
                if (var_o_child && var_o_child.nodeType === 1 && var_o_child.className && var_o_child.className.indexOf("obj-layout-col") !== -1) {
                    
                    var_o_child.style.zoom = "1";
                    // Le colonne contengono quasi sempre contenuto, quindi font attivo
                    var_o_child.style.fontSize = "12px"; 
                    var_o_child.style.lineHeight = "normal";
                    
                    var_a_cols.push(var_o_child);
                    
                    if (var_o_child.className.indexOf("obj-layout-col-expand") !== -1) {
                        // Reset larghezza per misurazione
                        var_o_child.style.width = "1px";
                        var_a_expandCols.push(var_o_child);
                    } else {
                        var_n_totalWUsed += var_o_child.offsetWidth || 0;
                    }
                }
            }

            // Suddivisione equa larghezza per colonne expand
            if (var_a_expandCols.length > 0) {
                var var_n_availableW = var_n_rowW - var_n_totalWUsed - 1;
                var var_n_eachW = Math.floor(var_n_availableW / var_a_expandCols.length);
                if (var_n_eachW < 0) var_n_eachW = 0;
                
                for (var var_n_c = 0; var_n_c < var_a_expandCols.length; var_n_c++) {
                    var_a_expandCols[var_n_c].style.width = var_n_eachW + "px";
                }
            }

            // Rilevamento altezza massima e gestione overflow
            for (var var_n_m = 0; var_n_m < var_a_cols.length; var_n_m++) {
                var var_o_col = var_a_cols[var_n_m];
                this.processContainer(var_o_col);
                
                if (var_o_col._objScrollbar) {
                    var_o_col._objScrollbar.update();
                } else {
                    // Controllo altezze per iniezione dinamica
                    var var_n_sh = var_o_col.scrollHeight || 0;
                    var var_n_oh = var_o_col.offsetHeight || 0;
                    if (var_n_sh > var_n_oh + 5) {
                        this.requestScrollbar(var_o_col);
                    }
                }
            }
        },

        /**
         * @method requestScrollbar
         * Iniezione asincrona tramite Heartbeat per stabilità DOM.
         */
        requestScrollbar: function(var_o_el) {
            if (!var_o_el || var_o_el.className.indexOf("obj-scrollbar") !== -1) return;
            var_o_el.className += " obj-scrollbar";
            var_o_el.style.zoom = "1";
            
            // Usiamo il clock per attivare lo scan dei nuovi componenti scrollbar
            if (window.Objectis.TimeEngine) {
                window.Objectis.TimeEngine.addAction(function() {
                    if (window.Objectis.scan) window.Objectis.scan();
                }, 10, false);
            }
        },

        fixHeights: function() { this.fixLayout(); }
    };
})(window);
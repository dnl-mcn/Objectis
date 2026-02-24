/**
 * @file Layout.js
 * @description Motore di rendering ricorsivo - Fix stabilità resize e errori null su IE6.
 * @version 1.2.4
 */

(function(var_o_root) {
    if (!var_o_root.Objectis) return;

    var_o_root.Objectis.Layout = {
        var_b_initialized: false,

        /**
         * @method init
         * Configura i listener per il ridimensionamento della finestra.
         */
        init: function() {
            var var_o_self = this;
            if (this.var_b_initialized) return;
            
            // Gestione resize sicura per IE6
            window.onresize = function() { 
                if (var_o_self.fixLayout) {
                    var_o_self.fixLayout(); 
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
            var var_o_main = document.getElementById("main-viewport") || document.body;
            if (var_o_main) {
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

            // --- FASE 1: GESTIONE RIGHE (Verticale) ---
            for (var var_n_i = 0; var_n_i < var_a_children.length; var_n_i++) {
                var var_o_child = var_a_children[var_n_i];
                if (var_o_child && var_o_child.nodeType === 1 && var_o_child.className && var_o_child.className.indexOf("obj-layout-row") !== -1) {
                    var_a_rows.push(var_o_child);
                    
                    // Se ha una classe percentuale (es: row-20) calcoliamo l'altezza in px
                    var var_re_pct = /obj-layout-row-(\d+)/;
                    var var_a_match = var_o_child.className.match(var_re_pct);
                    
                    if (var_a_match && var_a_match[1]) {
                        var var_n_px = Math.floor((var_o_parent.offsetHeight * parseInt(var_a_match[1], 10)) / 100);
                        var_o_child.style.height = var_n_px + "px";
                    }

                    if (var_o_child.className.indexOf("obj-layout-row-expand") !== -1) {
                        var_a_expandRows.push(var_o_child);
                    } else {
                        var_n_totalHUsed += var_o_child.offsetHeight || 0;
                    }
                }
            }

            // Calcolo spazio per righe expand
            if (var_a_expandRows.length > 0) {
                var var_n_parentH = var_o_parent.offsetHeight || 0;
                var var_n_availableH = var_n_parentH - var_n_totalHUsed;
                var var_n_eachH = Math.floor(var_n_availableH / var_a_expandRows.length);
                for (var var_n_r = 0; var_n_r < var_a_expandRows.length; var_n_r++) {
                    var_a_expandRows[var_n_r].style.height = (var_n_eachH > 0 ? var_n_eachH : 0) + "px";
                }
            }

            // --- FASE 2: GESTIONE COLONNE (Orizzontale) PER OGNI RIGA ---
            for (var var_n_k = 0; var_n_k < var_a_rows.length; var_n_k++) {
                this.processRow(var_a_rows[var_n_k]);
            }
        },

        /**
         * @method processRow
         * Gestisce il bilanciamento orizzontale e la nidificazione.
         */
        processRow: function(var_o_row) {
            if (!var_o_row || !var_o_row.childNodes) return;

            var var_a_children = var_o_row.childNodes;
            var var_a_cols = [];
            var var_n_totalWUsed = 0;
            var var_a_expandCols = [];

            for (var var_n_i = 0; var_n_i < var_a_children.length; var_n_i++) {
                var var_o_child = var_a_children[var_n_i];
                if (var_o_child && var_o_child.nodeType === 1 && var_o_child.className && var_o_child.className.indexOf("obj-layout-col") !== -1) {
                    var_a_cols.push(var_o_child);
                    
                    if (var_o_child.className.indexOf("obj-layout-col-expand") !== -1) {
                        var_a_expandCols.push(var_o_child);
                    } else {
                        var_n_totalWUsed += var_o_child.offsetWidth || 0;
                    }
                }
            }

            // Suddivisione equa larghezza per colonne expand
            if (var_a_expandCols.length > 0) {
                var var_n_rowW = var_o_row.offsetWidth || 0;
                var var_n_availableW = var_n_rowW - var_n_totalWUsed - 2;
                var var_n_eachW = Math.floor(var_n_availableW / var_a_expandCols.length);
                for (var var_n_c = 0; var_n_c < var_a_expandCols.length; var_n_c++) {
                    var_a_expandCols[var_n_c].style.width = (var_n_eachW > 0 ? var_n_eachW : 0) + "px";
                }
            }

            // Rilevamento altezza massima e gestione overflow
            for (var var_n_m = 0; var_n_m < var_a_cols.length; var_n_m++) {
                var var_o_col = var_a_cols[var_n_m];
                
                // Ricorsione: Se la colonna contiene altre righe, processale prima di misurare l'altezza
                this.processContainer(var_o_col);
                
                // --- GESTIONE SCROLLBAR SICURA ---
                if (var_o_col._objScrollbar && var_o_col._objScrollbar.update) {
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

        requestScrollbar: function(var_o_el) {
            if (!var_o_el) return;
            if (var_o_el.className.indexOf("obj-scrollbar") === -1) {
                var_o_el.className += " obj-scrollbar";
                // Delay per IE6 per permettere l'aggiornamento delle classi
                setTimeout(function() {
                    if (window.Objectis && window.Objectis.scan) {
                        window.Objectis.scan();
                    }
                }, 20);
            }
        },

        fixHeights: function() { this.fixLayout(); }
    };
})(window);
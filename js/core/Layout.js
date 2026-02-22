/**
 * @file Layout.js
 * @version 1.0.2
 */

(function(var_o_root) {
    if (!var_o_root.Objectis) return;

    var_o_root.Objectis.Layout = {
        /**
         * @method fixHeights
         * Ora include un reset forzato per evitare calcoli su altezze precedentemente "bloccate"
         */
        fixHeights: function() {
            var var_a_divs = document.getElementsByTagName("div");
            for (var var_n_i = 0; var_n_i < var_a_divs.length; var_n_i++) {
                var var_o_row = var_a_divs[var_n_i];
                
                // Cerca la classe del layout row
                if (var_o_row.className && var_o_row.className.indexOf("obj-layout-row") !== -1) {
                    var var_a_cols = [];
                    var var_a_children = var_o_row.childNodes;
                    var var_n_maxH = 0;

                    // FASE 1: Reset totale per permettere al contenuto di espandersi naturalmente
                    for (var var_n_j = 0; var_n_j < var_a_children.length; var_n_j++) {
                        var var_o_child = var_a_children[var_n_j];
                        // Cerca le colonne all'interno della riga
                        if (var_o_child.nodeType === 1 && var_o_child.className.indexOf("obj-layout-col") !== -1) {
                            var_o_child.style.height = "auto";
                            var_a_cols.push(var_o_child);
                        }
                    }

                    // FASE 2: Rilevamento altezza massima DOPO il reset
                    for (var var_n_m = 0; var_n_m < var_a_cols.length; var_n_m++) {
                        if (var_a_cols[var_n_m].offsetHeight > var_n_maxH) {
                            var_n_maxH = var_a_cols[var_n_m].offsetHeight;
                        }
                    }

                    // FASE 3: Applicazione altezza uniforme
                    if (var_n_maxH > 0) {
                        for (var var_n_k = 0; var_n_k < var_a_cols.length; var_n_k++) {
                            var_a_cols[var_n_k].style.height = var_n_maxH + "px";
                        }
                    }
                }
            }
        }
    };
})(window);
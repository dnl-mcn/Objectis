/**
 * @file panel.js
 * @description Componente Pannello conforme HTML 4.01. Preserva i nodi figli.
 * @version 1.1.6
 */

(function(var_o_root) {
    if (!var_o_root.Objectis) {
        var_o_root.Objectis = { var_a_components: {} };
    }

    var_o_root.Objectis.panel = function(var_o_el) {
        this.var_o_element = var_o_el;
        this.var_s_title = "";

        /**
         * @method init
         */
        this.init = function() {
            if (typeof Objectis.trackCall === "function") {
                Objectis.trackCall("panel.init");
            }
            
            if (typeof Objectis.loadStyle === "function") {
                Objectis.loadStyle("css/panel.css");
            }

            this.var_s_title = Objectis.getParam(this.var_o_element, "title", "Panel");
            this.render();
            
            Objectis.log("Pannello '" + this.var_s_title + "' inizializzato.", "UI");
        };

        /**
         * @method render
         * @description Costruisce la UI usando manipolazione DOM reale invece di innerHTML.
         */
        this.render = function() {
            if (this.var_o_element.getAttribute("data-rendered") === "true") return;

            // 1. Creiamo i nuovi contenitori
            var var_o_header = document.createElement("div");
            var_o_header.className = "ui-panel-header";
            var_o_header.innerHTML = "<strong>" + this.var_s_title + "</strong>";

            var var_o_body = document.createElement("div");
            var_o_body.className = "ui-panel-body";

            // 2. SPOSTIAMO i nodi esistenti uno per uno (preserva i parametri degli object)
            // Usiamo un array temporaneo per evitare problemi di mutazione della NodeList
            var var_a_children = [];
            for (var var_n_i = 0; var_n_i < this.var_o_element.childNodes.length; var_n_i++) {
                var_a_children.push(this.var_o_element.childNodes[var_n_i]);
            }

            for (var var_n_j = 0; var_n_j < var_a_children.length; var_n_j++) {
                var_o_body.appendChild(var_a_children[var_n_j]);
            }

            // 3. Puliamo il container originale e iniettiamo la nuova struttura
            this.var_o_element.innerHTML = ""; 
            this.var_o_element.appendChild(var_o_header);
            this.var_o_element.appendChild(var_o_body);

            this.var_o_element.setAttribute("data-rendered", "true");
            this.var_o_element.style.display = "block";
            this.var_o_element.style.visibility = "visible";
        };
    };
})(window);
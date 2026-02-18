/**
 * @file panel.js
 * @description Componente Pannello. Gestione layout senza distruzione nodi DOM.
 * @version 1.2.1
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
            this.var_s_title = Objectis.getParam(this.var_o_element, "title", "Pannello");
            this.render();
            Objectis.log("Pannello '" + this.var_s_title + "' renderizzato correttamente.", "UI");
        };

        /**
         * @method render
         */
        this.initLayout = function() {
            // Salviamo i figli esistenti (bottoni, p, etc) prima di svuotare
            var var_a_children = [];
            while (this.var_o_element.firstChild) {
                var_a_children.push(this.var_o_element.removeChild(this.var_o_element.firstChild));
            }
            
            // Creazione Header
            var var_o_header = document.createElement("div");
            var_o_header.className = "panel-header";
            var_o_header.innerHTML = this.var_s_title;
            
            // Creazione Content
            var var_o_content = document.createElement("div");
            var_o_content.className = "panel-content";
            
            // Reinseriamo i vecchi figli nel nuovo content
            for (var var_n_i = 0; var_n_i < var_a_children.length; var_n_i++) {
                var_o_content.appendChild(var_a_children[var_n_i]);
            }
            
            this.var_o_element.appendChild(var_o_header);
            this.var_o_element.appendChild(var_o_content);
        };

        this.render = function() {
            this.initLayout();
        };
    };
})(window);
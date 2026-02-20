/**
 * @file panel.js
 * @description Componente Pannello con protezione anti-nesting.
 * @version 1.2.5
 */

(function(var_o_root) {
    if (!var_o_root.Objectis) {
        var_o_root.Objectis = { var_a_components: {} };
    }

    /**
     * Costruttore del componente Panel.
     * @param {HTMLElement} var_o_el L'elemento DOM originale da trasformare.
     */
    var_o_root.Objectis.panel = function(var_o_el) {
        this.var_o_element = var_o_el;
        this.var_s_title = "";

        /**
         * @method init
         */
        this.init = function() {
            // Objectis.getParam -> Defined in Dom.js
            this.var_s_title = Objectis.getParam(this.var_o_element, "title", "Pannello");
            
            this.render();
            
            // Objectis.log -> Defined in Objectis.js
            Objectis.log("Pannello '" + this.var_s_title + "' renderizzato correttamente.", "UI");
        };

        /**
         * @method initLayout
         * Implementa la logica di preservazione dei nodi figli per non perdere gli eventi.
         */
        this.initLayout = function() {
            // Verifica se l'header esiste già per evitare nidificazione infinita
            for (var var_n_i = 0; var_n_i < this.var_o_element.childNodes.length; var_n_i++) {
                if (this.var_o_element.childNodes[var_n_i].className === "panel-header") {
                    return; 
                }
            }

            var var_a_children = [];
            
            // Estrazione sicura dei nodi esistenti
            while (this.var_o_element.firstChild) {
                var_a_children.push(this.var_o_element.removeChild(this.var_o_element.firstChild));
            }
            
            // Creazione Header del pannello
            var var_o_header = document.createElement("div");
            var_o_header.className = "panel-header";
            var_o_header.innerHTML = this.var_s_title;
            
            // Creazione Content del pannello
            var var_o_content = document.createElement("div");
            var_o_content.className = "panel-content";
            
            // Reinserimento dei nodi originali nel nuovo contenitore
            for (var var_n_i = 0; var_n_i < var_a_children.length; var_n_i++) {
                var_o_content.appendChild(var_a_children[var_n_i]);
            }
            
            // Assemblaggio finale nel DOM
            this.var_o_element.appendChild(var_o_header);
            this.var_o_element.appendChild(var_o_content);
        };

        /**
         * @method render
         */
        this.render = function() {
            this.initLayout();
        };
    };
})(window);
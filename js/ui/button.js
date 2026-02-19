/**
 * @file button.js
 * @description Componente Bottone - Pulizia stili inline e fix eventi.
 * @version 1.1.3
 */

(function(var_o_root) {
    if (!var_o_root.Objectis) {
        var_o_root.Objectis = { var_a_components: {} };
    }

    var_o_root.Objectis.button = function(var_o_el) {
        var var_o_self = this;
        this.htmlElement = var_o_el;
        this.label = Objectis.getParam(var_o_el, "label", "Button");
        this.onComponentClick = null;

        this.init = function() {
            // Prepariamo il contenuto testuale sostituendo gli underscore
            var var_s_text = this.label.replace(/_/g, " ");
            
            // Creiamo l'elemento label internamente invece di usare innerHTML crudo
            var var_o_span = document.createElement("div");
            var_o_span.className = "obj-button-label";
            var_o_span.appendChild(document.createTextNode(var_s_text));
            
            // Puliamo e appendiamo
            this.htmlElement.innerHTML = "";
            this.htmlElement.appendChild(var_o_span);

            this.setEvents();
            Objectis.log("Bottone '" + this.label + "' inizializzato.", "UI");
        };

        this.setEvents = function() {
            // Gestione stato attivo (visuale)
            Objectis.addEvent(this.htmlElement, "mousedown", function() {
                var_o_self.htmlElement.className += " obj-button-active";
            });

            Objectis.addEvent(document, "mouseup", function() {
                // Rimuoviamo la classe usando una regex per sicurezza su IE
                var_o_self.htmlElement.className = var_o_self.htmlElement.className.replace(/\bobj-button-active\b/g, "");
            });

            // Gestione click logico
            Objectis.addEvent(this.htmlElement, "click", function() {
                if (typeof var_o_self.onComponentClick === "function") {
                    var_o_self.onComponentClick();
                }
            });
        };
    };
})(window);
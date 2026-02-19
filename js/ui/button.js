/**
 * @file button.js
 * @description Componente Bottone Objectis per browser legacy.
 * @version 1.1.2
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
            // Setup HTML interno
            this.htmlElement.innerHTML = '<div class="obj-button-label">' + this.label.replace(/_/g, " ") + '</div>';
            this.htmlElement.style.cursor = "pointer";
            
            // HasLayout per IE
            this.htmlElement.style.zoom = "1";

            this.setEvents();
            Objectis.log("Bottone '" + this.label + "' inizializzato.", "UI");
        };

        this.setEvents = function() {
            Objectis.addEvent(this.htmlElement, "mousedown", function() {
                var_o_self.htmlElement.className += " obj-button-active";
            });

            Objectis.addEvent(document, "mouseup", function() {
                var_o_self.htmlElement.className = var_o_self.htmlElement.className.replace(" obj-button-active", "");
            });

            Objectis.addEvent(this.htmlElement, "click", function() {
                if (var_o_self.onComponentClick) {
                    var_o_self.onComponentClick();
                }
            });
        };
    };
})(window);
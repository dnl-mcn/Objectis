/**
 * @file button.js
 * @description Componente Bottone con stili inline di sicurezza.
 * @version 1.1.5
 */

(function(var_o_root) {
    if (!var_o_root.Objectis) {
        var_o_root.Objectis = { var_a_components: {} };
    }

    var_o_root.Objectis.button = function(var_o_el) {
        this.var_o_element = var_o_el;
        this.var_s_label = "Button";
        this.onComponentClick = null;

        /**
         * @method init
         */
        this.init = function() {
            if (typeof Objectis.trackCall === "function") {
                Objectis.trackCall("button.init");
            }
            
            if (typeof Objectis.loadStyle === "function") {
                Objectis.loadStyle("css/button.css");
            }

            this.var_s_label = Objectis.getParam(this.var_o_element, "label", "Default");
            this.render();
            this.setEvents();
            
            Objectis.log("Bottone '" + this.var_s_label + "' pronto.", "UI");
        };

        /**
         * @method render
         */
        this.render = function() {
            // HTML 4.01 Compatibile con stili inline per forzare la visibilità
            var var_s_html = '<button type="button" class="ui-button-inner" style="' + 
                             'display:inline-block !important; padding:10px 20px !important; ' +
                             'background:#007bff !important; color:#fff !important; ' +
                             'border:1px solid #000 !important; cursor:pointer !important; ' +
                             'visibility:visible !important; min-width:120px !important;">' + 
                             this.var_s_label + 
                             '</button>';
            
            this.var_o_element.innerHTML = var_s_html;
            this.var_o_element.style.display = "inline-block";
            this.var_o_element.style.visibility = "visible";
        };

        /**
         * @method setEvents
         */
        this.setEvents = function() {
            var var_o_self = this;
            var var_a_btns = this.var_o_element.getElementsByTagName("button");
            
            if (var_a_btns.length > 0) {
                var_a_btns[0].onclick = function() {
                    Objectis.log("Interazione su: " + var_o_self.var_s_label, "EVENT");
                    if (typeof var_o_self.onComponentClick === "function") {
                        var_o_self.onComponentClick();
                    }
                };
            }
        };

        this.reset = function() {
            this.render();
            this.setEvents();
        };
    };
})(window);
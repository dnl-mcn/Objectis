/**
 * @file checkbox.js
 * @description Componente Checkbox - Namespace obj-checkbox.
 * @version 1.0.1
 */

(function(var_o_root) {
    if (!var_o_root.Objectis) {
        var_o_root.Objectis = { var_a_components: {} };
    }

    /**
     * @constructor checkbox
     * @param {HTMLElement} var_o_el
     */
    var_o_root.Objectis.checkbox = function(var_o_el) {
        var var_o_self = this;
        this.htmlElement = var_o_el;
        this.var_b_status = false;
        this.var_s_value = "";
        this.onComponentChange = null;

        /**
         * @method init
         */
        this.init = function() {
            // Lettura dati dagli span interni
            var var_a_spans = this.htmlElement.getElementsByTagName("span");
            for (var var_n_i = 0; var_n_i < var_a_spans.length; var_n_i++) {
                var var_o_s = var_a_spans[var_n_i];
                var var_s_cn = var_o_s.className;

                if (var_s_cn.indexOf("checkbox-status") !== -1) {
                    // Legge true/false dal testo dello span
                    var var_s_txt = var_o_s.innerHTML.replace(/^\s+|\s+$/g, '').toLowerCase();
                    this.var_b_status = (var_s_txt === "true");
                    var_o_s.innerHTML = ""; // Svuotiamo per lo stile grafico
                }
                if (var_s_cn.indexOf("checkbox-value") !== -1) {
                    this.var_s_value = var_o_s.innerHTML;
                }
            }

            this.updateAppearance();
            this.setEvents();
            
            Objectis.log("Checkbox '" + this.var_s_value + "' (Status: " + this.var_b_status + ") pronta.", "UI");
        };

        /**
         * @method updateAppearance
         */
        this.updateAppearance = function() {
            if (this.var_b_status) {
                Objectis.addClass(this.htmlElement, "obj-checkbox-checked");
            } else {
                Objectis.removeClass(this.htmlElement, "obj-checkbox-checked");
            }
        };

        /**
         * @method toggle
         */
        this.toggle = function() {
            this.var_b_status = !this.var_b_status;
            this.updateAppearance();
            if (typeof this.onComponentChange === "function") {
                this.onComponentChange(this.var_b_status);
            }
        };

        /**
         * @method setEvents
         */
        this.setEvents = function() {
            Objectis.addEvent(this.htmlElement, "click", function() {
                var_o_self.toggle();
            });
        };
    };
})(window);
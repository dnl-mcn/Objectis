/**
 * @file button.js
 * @description Componente Bottone - Gestione label diretta e fix classi IE6.
 * @version 1.1.6
 */

(function(var_o_root) {
    if (!var_o_root.Objectis) {
        var_o_root.Objectis = { var_a_components: {} };
    }

    /**
     * @constructor button
     * @param {HTMLElement} var_o_el L'elemento DOM del bottone
     */
    var_o_root.Objectis.button = function(var_o_el) {
        var var_o_self = this;
        this.htmlElement = var_o_el;
        this.onComponentClick = null;
        this.label = "";
        
        /**
         * @method init
         * Inizializzazione pulita: legge il testo e resetta il contenuto.
         */
        this.init = function() {
            // 1. Leggiamo il testo presente nel tag (nuovo standard)
            // Usiamo una regex per il trim compatibile con IE6
            var var_s_inner = this.htmlElement.innerHTML.replace(/^\s+|\s+$/g, '');
            
            if (var_s_inner !== "" && var_s_inner.indexOf('<') === -1) {
                // Se c'è testo semplice, lo usiamo come label
                this.label = var_s_inner;
            } else {
                // 2. Fallback: se il tag è vuoto, usiamo il vecchio opt-label-
                var var_s_param = Objectis.getParam(this.htmlElement, "label", "Button");
                this.label = var_s_param.replace(/_/g, " ");
            }

            // 3. Riscrittura pulita (rimuove spazi sporchi e garantisce solo testo)
            this.htmlElement.innerHTML = "";
            this.htmlElement.appendChild(document.createTextNode(this.label));

            // Attivazione ascoltatori eventi
            this.setEvents();
            
            Objectis.log("Bottone '" + this.label + "' inizializzato.", "UI");
        };

        /**
         * @method setEvents
         * Gestione interazioni senza dipendenze da classi interne.
         */
        this.setEvents = function() {
            // Stato attivo: usiamo i nuovi metodi helper di Dom.js
            Objectis.addEvent(this.htmlElement, "mousedown", function() {
                Objectis.addClass(var_o_self.htmlElement, "obj-button-active");
            });

            // Reset stato attivo
            Objectis.addEvent(document, "mouseup", function() {
                Objectis.removeClass(var_o_self.htmlElement, "obj-button-active");
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
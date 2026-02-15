/**
 * @file Button.js
 * @description Componente Button con binding rinforzato.
 * @version 0.1.9
 */

Objectis.Button = function(O_EL) {
    Objectis.trackCall("Button.constructor");
    this.var_o_element = O_EL;
    
    // Carichiamo il CSS dedicato (Punto 15 Roadmap)
    Objectis.loadStyle("js/ui/Button.css");

    var var_o_self = this;
    
    // Binding dell'evento click
    Objectis.addEvent(this.var_o_element, "click", function() {
        Objectis.logError("Click intercettato su " + var_o_self.var_o_element.id);
        var_o_self.onClick();
    });

    if (const_B_DEBUG) {
        Objectis.logError("OK: Button #" + this.var_o_element.id + " istanziato.");
    }
};

Objectis.Button.prototype.onClick = function() {
    Objectis.trackCall("Button.onClick");
    this.var_o_element.innerHTML = "ATTIVATO (" + this.var_o_element.id + ")";
};
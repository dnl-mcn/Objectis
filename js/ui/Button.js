/**
 * @file Button.js
 * @description Componente Button con binding rinforzato.
 * @version 0.1.9
 */

Objectis.Button = function(O_EL) {
    Objectis.trackCall("Button.constructor");
    this.var_o_element = O_EL;
    
    Objectis.loadStyle("js/ui/Button.css");

    // Leggiamo i parametri dall'HTML
    var var_s_bgColor = Objectis.getParam(this.var_o_element, "obj-color", "");
    var var_s_label = Objectis.getParam(this.var_o_element, "obj-label", "");

    if (var_s_bgColor !== "") {
        this.var_o_element.style.backgroundColor = var_s_bgColor;
    }
    if (var_s_label !== "") {
        this.var_o_element.innerHTML = var_s_label;
    }

    var var_o_self = this;
    Objectis.addEvent(this.var_o_element, "click", function() {
        var_o_self.onClick();
    });
};

Objectis.Button.prototype.onClick = function() {
    Objectis.trackCall("Button.onClick");
    this.var_o_element.innerHTML = "ELABORAZIONE...";
    
    // Notifichiamo al mondo che il bottone è stato premuto
    Objectis.fireEvent(this.var_o_element, "ComponentClick", {
        id: this.var_o_element.id,
        timestamp: Objectis.getTimestamp()
    });
};

/**
 * @function reset
 * @description Ripristina lo stato del bottone.
 */
Objectis.Button.prototype.reset = function(S_LABEL) {
    Objectis.trackCall("Button.reset");
    var var_s_default = Objectis.getParam(this.var_o_element, "obj-label", "Invia");
    this.var_o_element.innerHTML = S_LABEL || var_s_default;
};
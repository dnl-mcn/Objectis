/**
 * @file Panel.js
 * @description Componente contenitore con testata e corpo.
 * @version 0.2.0
 */

/**
 * @function Panel
 * @description Costruttore del componente Panel.
 * @param {Object} O_EL - L'elemento DOM (div.obj-panel).
 */
Objectis.Panel = function(O_EL) {
    Objectis.trackCall("Panel.constructor");
    this.var_o_element = O_EL;

    // Carichiamo il CSS dedicato
    Objectis.loadStyle("js/ui/Panel.css");

    if (const_B_DEBUG) {
        Objectis.logError("Panel #" + this.var_o_element.id + " formattato via CSS.");
    }
};

Objectis.loadStyle = function(S_PATH) {
    Objectis.trackCall("loadStyle");
    
    // Assicuriamoci che il percorso inizi correttamente
    var var_s_fullPath = S_PATH;
    var var_s_id = "css-" + S_PATH.replace(/\//g, "-").replace(/\./g, "-");
    
    if (document.getElementById(var_s_id)) return;

    var var_o_link = document.createElement("link");
    var_o_link.id = var_s_id;
    var_o_link.rel = "stylesheet";
    var_o_link.type = "text/css";
    var_o_link.href = var_s_fullPath;

    document.getElementsByTagName("head")[0].appendChild(var_o_link);
    Objectis.logError("Caricamento stile: " + var_s_fullPath);
};
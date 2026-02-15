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

    if (!Objectis.isObject(O_EL)) return;

    // 1. Setup Struttura
    var var_s_title = O_EL.getAttribute("title") || "Panel";
    var var_s_content = O_EL.innerHTML;
    
    // Pulizia e ricostruzione per controllo totale del layout
    O_EL.innerHTML = "";
    
    // Creazione Header
    var var_o_header = document.createElement("div");
    var_o_header.innerHTML = var_s_title;
    
    // Creazione Body
    var var_o_body = document.createElement("div");
    var_o_body.innerHTML = var_s_content;

    // 2. Iniezione Stili (Punto 14)
    O_EL.style.border = "1px solid #999";
    O_EL.style.marginBottom = "10px";
    
    var_o_header.style.backgroundColor = "#333";
    var_o_header.style.color = "#fff";
    var_o_header.style.padding = "4px 8px";
    var_o_header.style.fontWeight = "bold";
    
    var_o_body.style.padding = "10px";
    var_o_body.style.backgroundColor = "#fff";

    // 3. Applicazione BoxModel (Punto 13)
    // Usiamo la nostra utility per assicurarci che il panel occupi lo spazio corretto
    Objectis.setSafeWidth(O_EL, Objectis.getRealWidth(O_EL));

    // Componiamo il DOM
    O_EL.appendChild(var_o_header);
    O_EL.appendChild(var_o_body);
};
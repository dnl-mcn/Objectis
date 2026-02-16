/**
 * @file DomScanner.js
 * @description Gestore attivazione componenti con attesa asincrona del costruttore.
 * @version 0.1.10
 */

Objectis.scanDocument = function(O_ROOT) {
    Objectis.trackCall("scanDocument");
    var var_o_base = O_ROOT || document;
    var var_a_nodes = var_o_base.getElementsByTagName("div");
    
    var var_n_i = 0;
    for (var_n_i = 0; var_n_i < var_a_nodes.length; var_n_i++) {
        var var_o_current = var_a_nodes[var_n_i];
        var var_s_className = var_o_current.className || "";

        // Log di debug per ogni div trovato per capire cosa vede lo scanner
        if (const_B_DEBUG) {
            window.status = "Scansione div " + var_n_i + " con classe: " + var_s_className;
        }

        // Controllo per il Panel
        if (var_s_className.indexOf("obj-panel") !== -1) {
            Objectis.activateComponent(var_o_current, "Panel", "ui/Panel.js");
        }

        // Controllo per il Button
        if (var_s_className.indexOf("obj-button") !== -1) {
            Objectis.activateComponent(var_o_current, "Button", "ui/Button.js");
        }
    }
};

Objectis.activateComponent = function(O_EL, S_COMP_NAME, S_PATH) {
    // Debug estremo: vediamo se la funzione viene chiamata
    if (const_B_DEBUG) {
        window.status = "Tentativo attivazione: " + S_COMP_NAME;
    }

    if (typeof Objectis[S_COMP_NAME] === "function") {
        new Objectis[S_COMP_NAME](O_EL);
        O_EL.var_b_isObjectisInstanced = true;
        Objectis.logError("OK: " + S_COMP_NAME + " istanziato.");
    } else {
        // Se arriviamo qui, il JS non è ancora pronto. 
        // Verifichiamo se loadModule sta almeno provando a caricarlo.
        Objectis.logError("In attesa di: " + S_PATH);
        Objectis.loadModule(S_PATH);
        
        setTimeout(function() {
            Objectis.activateComponent(O_EL, S_COMP_NAME, S_PATH);
        }, 500); // Aumentiamo a 500ms per vedere il log rallentato
    }
};

// Aggiunta all'interno della logica di scansione
Objectis.bindAll = function() {
    Objectis.trackCall("bindAll");
    
    // Ora la funzione esiste!
    var var_a_binds = Objectis.getElementsByClassName("obj-bind");
    
    for (var var_n_i = 0; var_n_i < var_a_binds.length; var_n_i++) {
        var var_o_el = var_a_binds[var_n_i];
        var var_s_key = var_o_el.getAttribute("obj-key");
        if (var_s_key) {
            Objectis.syncElement(var_o_el, var_s_key);
        }
    }
};
/**
 * @file DomScanner.js
 * @description Scansiona il DOM e istanzia i componenti UI corrispondenti.
 * @version 0.1.2
 */

Objectis.scanDocument = function(O_ROOT) {
    Objectis.trackCall("scanDocument");

    var var_o_base = O_ROOT || document;
    var var_a_nodes = var_o_base.getElementsByTagName("div");
    var var_n_i = 0;

    for (var_n_i = 0; var_n_i < var_a_nodes.length; var_n_i++) {
        var var_o_current = var_a_nodes[var_n_i];
        var var_s_className = var_o_current.className || "";

        // Logica di instanziamento basata su classi specifiche
        if (var_s_className.indexOf("obj-button") !== -1) {
            // Istanzia il componente Button
            new Objectis.Button(var_o_current);
            
            if (const_B_DEBUG) {
                window.status = "Scanner: Activated Button on " + var_o_current.id;
            }
        }

        if (var_s_className.indexOf("obj-panel") !== -1) {
            new Objectis.Panel(var_o_current);
        }
        
        // Qui aggiungeremo gli altri componenti (obj-slider, obj-panel, ecc.)
    }
};
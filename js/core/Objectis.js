/**
 * @file Objectis.js
 * @description Core Framework v1.7.1 - Bootloader asincrono con caricamento script.js.
 * @version 1.7.1
 */

if (typeof window.Objectis === "undefined") {
    window.Objectis = {
        var_a_components: {},
        const_B_DEBUG: true,
        var_s_version: "1.7.1",
        var_b_isBooting: false,
        var_b_isReady: false,
        var_a_loadingQueue: {},
        var_n_bootRetries: 0 
    };
}

/**
 * @method init
 * Inizializza il framework e carica i moduli core + la logica script.js.
 */
window.Objectis.init = function() {
    var var_o_self = this;
    if (this.var_b_isReady) return;

    // Verifica la presenza dei moduli core fondamentali
    if (typeof this.scan !== "function" || typeof this.getParam !== "function") {
        if (!this.var_b_isBooting) {
            this.var_b_isBooting = true;
            this.importStyle("css/style.css"); // Carica il CSS basilare
            this.importStyle("css/layout.css"); // Carica il CSS del layout
            this.importModule("js/core/Dom.js", "Dom");
            this.importModule("js/core/DomScanner.js", "DomScanner");
            this.importModule("js/core/Layout.js", "Layout"); // Carica il motore di layout
            this.importModule("js/core/Ajax.js", "Ajax");
            
            // IMPORTAZIONE LOGICA APPLICATIVA
            this.importModule("js/script.js", "script");
        }
        
        this.var_n_bootRetries++;
        // KILL-SWITCH Boot: 20 tentativi (circa 2 secondi), poi stacca tutto
        if (this.var_n_bootRetries > 20) {
            // FIX IE: Controlla sempre se la console esiste prima di usarla
            if (window.console && window.console.error) {
                console.error("FATAL: Boot interrotto.");
            }
            return; 
        }

        setTimeout(function() { var_o_self.init(); }, 100);
        return;
    }

    // Se i file core sono presenti, dichiariamo il framework pronto
    this.var_b_isReady = true;
    this.log("Objectis Core Ready. IE6 Shield Active.", "SYSTEM");
    this.scan();

    // ... alla fine di init, dopo scan() ...
    //if (this.Layout) {
    //    this.Layout.fixHeights();
    //}
};

/**
 * @method importStyle
 * Inserisce dinamicamente fogli di stile nell'head.
 */
window.Objectis.importStyle = function(var_s_path) {
    var var_o_head = document.getElementsByTagName("head")[0];
    var var_a_links = var_o_head.getElementsByTagName("link");
    
    for (var var_n_i = 0; var_n_i < var_a_links.length; var_n_i++) {
        if (var_a_links[var_n_i].getAttribute("href") && var_a_links[var_n_i].getAttribute("href").indexOf(var_s_path) !== -1) return;
    }
    
    var var_o_link = document.createElement("link");
    var_o_link.rel = "stylesheet";
    var_o_link.type = "text/css";
    var_o_link.href = var_s_path + "?v=" + this.var_s_version;
    var_o_head.appendChild(var_o_link);
};

/**
 * @method importModule
 * Carica file Javascript in modo asincrono.
 */
window.Objectis.importModule = function(var_s_path, var_s_compName) {
    var var_o_self = this;
    var var_o_head = document.getElementsByTagName("head")[0];
    var var_o_script = document.createElement("script");
    var_o_script.type = "text/javascript";
    var_o_script.src = var_s_path + "?v=" + this.var_s_version;
    
    if (var_o_script.readyState) { // IE Legacy
        var_o_script.onreadystatechange = function() {
            if (var_o_script.readyState == "loaded" || var_o_script.readyState == "complete") {
                var_o_script.onreadystatechange = null;
                if (var_s_compName) var_o_self.var_a_loadingQueue[var_s_compName] = "loaded";
            }
        };
    } else {
        var_o_script.onload = function() {
            if (var_s_compName) var_o_self.var_a_loadingQueue[var_s_compName] = "loaded";
        };
    }
    
    var_o_head.appendChild(var_o_script);
};

/**
 * @method log
 * Gestisce l'output di sistema. Se il contenitore ha uno slider, scrive nel viewport.
 */
window.Objectis.log = function(var_s_msg, var_s_type) {
    var var_s_prefix = var_s_type ? "[" + var_s_type + "] " : "";
    var var_o_cont = document.getElementById("system-log-container");
    
    if (var_o_cont) {
        // Ricerca Viewport compatibile IE6 (niente getElementsByClassName)
        var var_o_target = null;
        var var_a_divs = var_o_cont.getElementsByTagName("div");
        for (var var_n_d = 0; var_n_d < var_a_divs.length; var_n_d++) {
            if (var_a_divs[var_n_d].className.indexOf("obj-slider-viewport") !== -1) {
                var_o_target = var_a_divs[var_n_d];
                break;
            }
        }
        if (!var_o_target) var_o_target = var_o_cont;
        
        var var_o_div = document.createElement("div");
        var_o_div.innerHTML = "<strong>" + var_s_prefix + "</strong> " + var_s_msg;
        var_o_target.appendChild(var_o_div);
        
        // CERCA LO SLIDER: Notifica il componente che il contenuto è cambiato
        var var_o_slider = this.var_a_components["system-log-container"];
        if (var_o_slider && typeof var_o_slider.refresh === "function") {
            var_o_slider.refresh();
            // Forza lo scroll verso il basso per l'ultimo log
            var var_n_max = Math.max(0, var_o_target.scrollHeight - var_o_cont.offsetHeight);
            var_o_slider.setValue(var_n_max);
        } else {
            var_o_cont.scrollTop = var_o_cont.scrollHeight;
        }
    } else if (window.console && window.console.log) {
        console.log(var_s_prefix + var_s_msg);
    }
};

(function() {
    if (window.attachEvent) {
        window.attachEvent("onload", function() { window.Objectis.init(); });
    } else {
        window.addEventListener("load", function() { window.Objectis.init(); }, false);
    }
})();
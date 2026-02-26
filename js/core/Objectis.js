/**
 * @file Objectis.js
 * @description Core Framework v1.9.1 - Security Lockdown & Sentinel Edition.
 * @version 1.9.1
 */

if (typeof window.Objectis === "undefined") {
    window.Objectis = {
        var_a_components: {},
        const_B_DEBUG: true,
        var_s_version: "1.9.1",
        var_b_isBooting: false,
        var_b_isReady: false,
        var_a_loadingQueue: {},
        var_n_bootRetries: 0,
        const_S_BASE: "", 
        var_s_logicPath: "js/script.js",
        var_n_safetyTimer: null,
        var_n_sentinelTimer: null // Timer per il monitoraggio costante
    };
}

/**
 * @method setEvents
 * @description Gestore centralizzato degli eventi globali.
 */
window.Objectis.setEvents = function() {
    // Implementazione futura per eventi delegati globali
    // Per ora funge da entry point richiesto dal DomScanner
    if (this.const_B_DEBUG) {
        // this.log("SetEvents richiamato", "SYSTEM");
    }
};

/**
 * @method lockdown
 * @description Esegue la pulizia di sicurezza e rimuove intrusioni esterne.
 */
window.Objectis.lockdown = function() {
    this.log("Avvio lockdown di sicurezza...", "SECURITY");

    // 1. RIMOZIONE COOKIE (Direttiva: Niente Cookie)
    if (document.cookie && document.cookie !== "") {
        var var_a_cookies = document.cookie.split(";");
        for (var var_n_c = 0; var_n_c < var_a_cookies.length; var_n_c++) {
            var var_s_cookie = var_a_cookies[var_n_c];
            var var_n_eqPos = var_s_cookie.indexOf("=");
            var var_s_name = var_n_eqPos > -1 ? var_s_cookie.substr(0, var_n_eqPos) : var_s_cookie;
            var_s_name = var_s_name.replace(/^\s+|\s+$/g, ""); // Trim
            document.cookie = var_s_name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/";
        }
    }

    // 2. RIMOZIONE RISORSE ESTERNE (Sanificazione HEAD e BODY)
    var var_o_self = this;
    var var_f_clean = function(var_s_tagName, var_s_attr) {
        var var_a_els = document.getElementsByTagName(var_s_tagName);
        // Ciclo inverso per evitare problemi di indice durante la rimozione
        for (var var_n_i = var_a_els.length - 1; var_n_i >= 0; var_n_i--) {
            var var_o_el = var_a_els[var_n_i];
            var var_s_src = var_o_el[var_s_attr] || var_o_el.getAttribute(var_s_attr) || "";
            
            // Logica di esclusione: deve appartenere alla nostra BASE o essere il core
            var var_b_isLocal = (var_s_src.indexOf(var_o_self.const_S_BASE) !== -1);
            var var_b_isCore = (var_s_src.indexOf("Objectis.js") !== -1);
            
            if (var_s_src !== "" && !var_b_isLocal && !var_b_isCore) {
                if (var_o_el.parentNode) {
                    var_o_el.parentNode.removeChild(var_o_el);
                    if (var_o_self.const_B_DEBUG) {
                        var_o_self.log("Rimosso elemento non autorizzato: " + var_s_src, "SECURITY");
                    }
                }
            }
        }
    };

    var_f_clean("script", "src");
    var_f_clean("link", "href");
};

/**
 * @method startSentinel
 * @description Avvia un monitoraggio costante per IE6.
 */
window.Objectis.startSentinel = function() {
    var var_o_self = this;
    if (this.var_n_sentinelTimer) return;
    
    // Controlliamo ogni 2 secondi se qualcuno ha iniettato sporcizia
    this.var_n_sentinelTimer = setInterval(function() {
        var_o_self.lockdown();
    }, 2000);
};

/**
 * @method unlockDisplay
 * @description Sblocca la visibilità della pagina forzatamente.
 */
window.Objectis.unlockDisplay = function(var_b_isError) {
    if (this.var_n_safetyTimer) {
        clearTimeout(this.var_n_safetyTimer);
        this.var_n_safetyTimer = null;
    }
    
    if (document.body && document.body.className.indexOf("obj-ready") === -1) {
        document.body.className += " obj-ready";
        if (var_b_isError) {
            this.log("Timeout sicurezza: sblocco forzato della pagina (possibile errore dati).", "WARNING");
        } else {
            this.log("Pagina visibile (layout stabilizzato).", "SYSTEM");
        }
    }
};

window.Objectis.getBasePathAndLogic = function() {
    var var_a_scripts = document.getElementsByTagName("script");
    for (var var_n_i = 0; var_n_i < var_a_scripts.length; var_n_i++) {
        var var_o_script = var_a_scripts[var_n_i];
        var var_s_src = var_o_script.src || "";
        
        // Cerchiamo il tag che carica il kernel
        if (var_s_src.indexOf("js/core/Objectis.js") !== -1) {
            // 1. Calcolo Base Path
            var var_s_base = var_s_src.split("js/core/Objectis.js")[0];
            if (var_s_base !== "" && var_s_base.substr(var_s_base.length - 1) !== "/") {
                var_s_base += "/";
            }
            this.const_S_BASE = var_s_base;

            // 2. Logic Parsing (HTML 4.01 Strict Friendly)
            // Legge il testo tra <script> e </script> per trovare "logic: percorso/file.js"
            var var_s_content = var_o_script.text || var_o_script.innerHTML || "";
            if (var_s_content.indexOf("logic:") !== -1) {
                // Estraiamo il percorso dopo 'logic:' fino a fine riga o punto e virgola
                var var_s_rawPath = var_s_content.split("logic:")[1].split("\n")[0].split(";")[0];
                // Pulizia spazi bianchi (trim manuale per IE6)
                this.var_s_logicPath = var_s_rawPath.replace(/^\s+|\s+$/g, "");
            }
            break;
        }
    }
};

/**
 * @method init
 * Inizializza il framework e avvia la sentinella.
 */
window.Objectis.init = function() {
    var var_o_self = this;
    if (this.var_b_isReady) return;

    // Rilevamento base e logica al primo avvio
    if (this.const_S_BASE === "") {
        this.getBasePathAndLogic();
    }

    // MODIFICA: Eseguiamo il lockdown immediatamente dopo aver trovato la BASE
    if (!this.var_b_isBooting) {
        this.lockdown();
        this.startSentinel(); // Avvio sentinella periodica
    }

    if (!this.var_n_safetyTimer) {
        this.var_n_safetyTimer = setTimeout(function() {
            var_o_self.unlockDisplay(true);
        }, 5000); // 5 secondi di tolleranza
    }

    // Controllo dipendenze core
    if (typeof this.scan !== "function" || (this.var_s_logicPath.indexOf("posts.js") !== -1 && typeof this.Ajax === "undefined")) {
        if (!this.var_b_isBooting) {
            this.var_b_isBooting = true;
            
            // 1. CARICAMENTO CSS STRUTTURALI
            this.importStyle("css/style.css");

            // 2. CARICAMENTO MODULI CORE
            this.importModule("js/core/Dom.js", "Dom");
            this.importModule("js/core/DomScanner.js", "DomScanner");
            
            // MODIFICA: Ajax viene caricato come modulo core se rileviamo una logica complessa 
            // o se lo scanner lo richiederà. Per sicurezza lo carichiamo qui per prevenire undefined.
            this.importModule("js/core/Ajax.js", "Ajax");
        }
        
        this.var_n_bootRetries++;
        // KILL-SWITCH Boot: 40 tentativi (circa 4 secondi)
        if (this.var_n_bootRetries > 40) return;

        setTimeout(function() { var_o_self.init(); }, 100);
        return;
    }

    // Se i moduli core sono pronti, carichiamo la logica della pagina (posts.js)
    // solo se non è già stata caricata.
    if (this.var_a_loadingQueue["script"] !== "loaded") {
        this.importModule(this.var_s_logicPath, "script");
        
        // Attendiamo un ultimo ciclo per posts.js
        setTimeout(function() { var_o_self.init(); }, 50);
        return;
    }

    // MODIFICA: Il framework è pronto tecnicamente, ma aspettiamo lo scan per mostrare il body.
    this.var_b_isReady = true;
    this.log("Objectis Ready. Esecuzione scanner...", "SYSTEM");
    
    this.scan(); 
    
    // MODIFICA: Invece di iniettare la classe direttamente, usiamo unlockDisplay
    setTimeout(function() {
        var_o_self.unlockDisplay(false);
    }, 200);
};

/**
 * @method importStyle
 * @description Iniezione CSS con risoluzione URL assoluta. (Invariata)
 */
window.Objectis.importStyle = function(var_s_path) {
    var var_o_head = document.getElementsByTagName("head")[0];
    if (!var_o_head) return;

    var var_s_fullPath = (var_s_path.indexOf("http") === 0) ? var_s_path : this.const_S_BASE + var_s_path;
    
    // Verifica duplicati basata sull'URL assoluto risolto
    var var_a_links = var_o_head.getElementsByTagName("link");
    for (var var_n_i = 0; var_n_i < var_a_links.length; var_n_i++) {
        if (var_a_links[var_n_i].href.indexOf(var_s_path) !== -1) return;
    }

    var var_o_link = document.createElement("link");
    var_o_link.rel = "stylesheet";
    var_o_link.type = "text/css";
    var_o_link.href = var_s_fullPath + "?v=" + this.var_s_version;
    
    this.log("Iniezione CSS: " + var_o_link.href, "CORE");
    var_o_head.appendChild(var_o_link);
};

/**
 * @method importModule
 * Carica file Javascript in modo asincrono. (Invariata)
 */
window.Objectis.importModule = function(var_s_path, var_s_compName) {
    var var_o_self = this;
    var var_o_head = document.getElementsByTagName("head")[0];
    var var_o_script = document.createElement("script");
    var_o_script.type = "text/javascript";
    
    var var_s_fullPath = (var_s_path.indexOf("http") === 0) ? var_s_path : this.const_S_BASE + var_s_path;
    var_o_script.src = var_s_fullPath + "?v=" + this.var_s_version;
    
    // Gestione onload IE6...
    if (var_o_script.readyState) {
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
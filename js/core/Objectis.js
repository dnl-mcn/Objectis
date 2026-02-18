/**
 * @file Objectis.js
 * @description Core Framework. Supporto Viewport Relativo e Scrolling proprietario.
 * @version 1.4.2
 */

if (typeof window.Objectis === "undefined") {
    window.Objectis = {
        var_a_components: {},
        const_B_DEBUG: true,
        var_s_version: "1.4.2",
        var_b_isBooting: false,
        var_b_isReady: false,
        var_s_vaultId: "obj-dynamic-vault",
        var_o_viewport: null
    };
}

window.Objectis.applyGlobalStyles = function() {
    var var_o_html = document.getElementsByTagName("html")[0];
    var var_o_body = document.body;
    
    var_o_html.style.overflow = "hidden";
    var_o_html.style.height = "100%";
    
    var_o_body.style.overflow = "hidden";
    var_o_body.style.height = "100%";
    
    this.var_o_viewport = document.getElementById("main-viewport");
    this.log("Interfaccia vincolata. Scrolling nativo disabilitato.", "UI");
};

/**
 * @function scrollViewport
 * @description Metodo che verrà richiamato dalla nostra scrollbar.
 */
window.Objectis.scrollViewport = function(var_n_pixels) {
    if (this.var_o_viewport) {
        // Muove la "tela" relativa verso l'alto o il basso
        this.var_o_viewport.style.top = var_n_pixels + "px";
    }
};

window.Objectis.createDataVault = function() {
    if (document.getElementById(this.var_s_vaultId)) return;
    var var_o_vault = document.createElement("object");
    var_o_vault.id = this.var_s_vaultId;
    var_o_vault.type = "text/plain";
    var_o_vault.style.display = "none";
    document.body.appendChild(var_o_vault);
};

window.Objectis.init = function() {
    if (this.var_b_isReady) return;
    
    if (typeof this.scan !== "function" && !this.var_b_isBooting) {
        this.var_b_isBooting = true;
        this.importModule("js/core/Dom.js");
        this.importModule("js/core/DomScanner.js");
        this.importModule("js/core/Ajax.js");
        return;
    }
    
    if (typeof this.scan === "function") {
        this.var_b_isReady = true;
        this.var_b_isBooting = false;
        
        this.applyGlobalStyles();
        this.createDataVault();
        this.scan();
        this.setEvents();
    }
};

window.Objectis.setEvents = function() {
    var var_o_self = this;
    var var_o_vault = document.getElementById(this.var_s_vaultId);
    
    var var_o_btnCrypto = this.var_a_components["btn-save-custom"];
    if (var_o_btnCrypto) {
        var_o_btnCrypto.onComponentClick = function() {
            var var_s_encoded = btoa("DatoLocale2026");
            var_o_self.setMeta(var_o_vault, "local_data_b64", var_s_encoded);
            var_o_self.log("Vault aggiornato via posizionamento relativo.", "STORAGE");
        };
    }

    var var_o_btnAjax = this.var_a_components["btn-ajax-test"];
    if (var_o_btnAjax) {
        var_o_btnAjax.onComponentClick = function() {
            if (typeof var_o_self.ajax === "function") {
                var_o_self.ajax({
                    url: "test/data.json",
                    method: "GET",
                    onSuccess: function(var_o_res) {
                        if (var_o_res && var_o_res.data) {
                            var var_s_crypto = btoa(var_o_res.data.message);
                            var_o_self.setMeta(var_o_vault, "remote_payload_b64", var_s_crypto);
                            var_o_self.log("Dati caricati nel Vault Dinamico.", "SUCCESS");
                        }
                    }
                });
            }
        };
    }
};

window.Objectis.log = function(var_s_msg, var_s_type) {
    var var_s_prefix = var_s_type ? "[" + var_s_type + "] " : "";
    if (window.console) console.log("Objectis: " + var_s_prefix + var_s_msg);
    var var_o_cont = document.getElementById("system-log-container");
    if (var_o_cont) {
        var var_o_div = document.createElement("div");
        var_o_div.innerHTML = "<strong>" + var_s_prefix + "</strong> " + var_s_msg;
        var_o_cont.appendChild(var_o_div);
        var_o_cont.scrollTop = var_o_cont.scrollHeight;
    }
};

window.Objectis.importModule = function(var_s_path) {
    var var_o_script = document.createElement("script");
    var_o_script.type = "text/javascript";
    var_o_script.src = var_s_path;
    document.getElementsByTagName("head")[0].appendChild(var_o_script);
};

window.Objectis.init();
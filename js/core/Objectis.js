/**
 * @file Objectis.js
 * @description Core Framework. Generazione dinamica del tag Object (Data Vault).
 * @version 1.4.0
 */

if (typeof window.Objectis === "undefined") {
    window.Objectis = {
        var_a_components: {},
        const_B_DEBUG: true,
        var_s_version: "1.4.0",
        var_b_isBooting: false,
        var_b_isReady: false,
        var_s_vaultId: "obj-dynamic-vault"
    };
}

/**
 * @function createDataVault
 * @description Genera un tag <object> a fine body per lo storage dei parametri.
 */
window.Objectis.createDataVault = function() {
    if (document.getElementById(this.var_s_vaultId)) return;
    
    var var_o_vault = document.createElement("object");
    var_o_vault.id = this.var_s_vaultId;
    var_o_vault.type = "text/plain";
    var_o_vault.style.display = "none";
    
    // Inizializzazione con parametri di default
    var var_o_p1 = document.createElement("param");
    var_o_p1.name = "vault_status";
    var_o_p1.value = "initialized";
    var_o_vault.appendChild(var_o_p1);
    
    document.body.appendChild(var_o_vault);
    this.log("Data Vault generato a fondo pagina.", "CORE");
};

window.Objectis.init = function() {
    if (this.var_b_isReady) return;
    
    if (typeof this.scan !== "function" && !this.var_b_isBooting) {
        this.var_b_isBooting = true;
        this.log("Avvio sistema v" + this.var_s_version, "BOOT");
        this.importModule("js/core/Dom.js");
        this.importModule("js/core/DomScanner.js");
        this.importModule("js/core/Ajax.js");
        return;
    }
    
    if (typeof this.scan === "function") {
        this.var_b_isReady = true;
        this.var_b_isBooting = false;
        
        // Creazione Vault prima della scansione
        this.createDataVault();
        
        this.scan();
        this.setEvents();
    }
};

window.Objectis.setEvents = function() {
    var var_o_self = this;
    var var_o_vault = document.getElementById(this.var_s_vaultId);
    
    // 1. Bottone Cifratura (Scrive nel Vault Dinamico)
    var var_o_btnCrypto = this.var_a_components["btn-save-custom"];
    if (var_o_btnCrypto && !var_o_btnCrypto.var_b_logicBound) {
        var_o_btnCrypto.onComponentClick = function() {
            var var_s_testData = "DatoLocale2026";
            var var_s_encoded = btoa(var_s_testData);
            
            var_o_self.setMeta(var_o_vault, "local_data_b64", var_s_encoded);
            var_o_self.log("Dato locale cifrato nel Vault Dinamico.", "STORAGE");
        };
        var_o_btnCrypto.var_b_logicBound = true;
    }

    // 2. Bottone AJAX (Carica JSON nel Vault Dinamico)
    var var_o_btnAjax = this.var_a_components["btn-ajax-test"];
    if (var_o_btnAjax && !var_o_btnAjax.var_b_logicBound) {
        var_o_btnAjax.onComponentClick = function() {
            var_o_self.log("Recupero JSON per Vault...", "AJAX");
            
            if (typeof var_o_self.ajax === "function") {
                var_o_self.ajax({
                    url: "test/data.json",
                    method: "GET",
                    onSuccess: function(var_o_res) {
                        if (var_o_res && var_o_res.data) {
                            var var_s_crypto = btoa(var_o_res.data.message);
                            
                            // Iniezione nel vault dinamico
                            var_o_self.setMeta(var_o_vault, "remote_sync_id", var_o_res.data.sync_id);
                            var_o_self.setMeta(var_o_vault, "remote_payload_b64", var_s_crypto);
                            
                            var_o_self.log("Parametri JSON iniettati nel Vault Dinamico.", "SUCCESS");
                        }
                    }
                });
            }
        };
        var_o_btnAjax.var_b_logicBound = true;
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
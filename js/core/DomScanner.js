/**
 * @file DomScanner.js
 * @description Scanner ufficiale con supporto loadAndInitComponent.
 */

(function(var_o_root) {
    if (!var_o_root.Objectis) {
        var_o_root.Objectis = { var_a_components: {} };
    }

    var_o_root.Objectis.scan = function() {
        var var_a_allElements = document.getElementsByTagName("*");
        var var_a_targets = [];

        for (var var_n_i = 0; var_n_i < var_a_allElements.length; var_n_i++) {
            var var_o_el = var_a_allElements[var_n_i];
            if (var_o_el.className && var_o_el.className.indexOf("obj-") !== -1) {
                var_a_targets.push(var_o_el);
            }
        }

        for (var var_n_j = 0; var_n_j < var_a_targets.length; var_n_j++) {
            var var_o_target = var_a_targets[var_n_j];
            var var_s_compType = this.extractComponentType(var_o_target.className);
            
            if (var_s_compType && !this.isSubComponent(var_s_compType)) {
                this.loadAndInitComponent(var_s_compType, var_o_target);
            }
        }
    };

    var_o_root.Objectis.isSubComponent = function(var_s_type) {
        var var_a_blacklist = ["panel-content", "panel-header", "button-label"];
        for (var var_n_m = 0; var_n_m < var_a_blacklist.length; var_n_m++) {
            if (var_s_type === var_a_blacklist[var_n_m]) return true;
        }
        return false;
    };

    var_o_root.Objectis.extractComponentType = function(var_s_className) {
        var var_a_parts = var_s_className.split(/\s+/);
        for (var var_n_k = 0; var_n_k < var_a_parts.length; var_n_k++) {
            if (var_a_parts[var_n_k].indexOf("obj-") === 0) {
                return var_a_parts[var_n_k].substring(4);
            }
        }
        return null;
    };

    var_o_root.Objectis.loadAndInitComponent = function(var_s_type, var_o_el) {
        var var_o_self = this;
        if (this[var_s_type]) {
            var var_o_inst = new this[var_s_type](var_o_el);
            if (var_o_el.id) this.var_a_components[var_o_el.id] = var_o_inst;
            var_o_inst.init();
        } else {
            var var_s_path = "js/ui/" + var_s_type + ".js";
            var var_o_script = document.createElement("script");
            var_o_script.type = "text/javascript";
            var_o_script.src = var_s_path;
            var_o_script.onload = function() {
                var_o_self.loadAndInitComponent(var_s_type, var_o_el);
            };
            document.getElementsByTagName("head")[0].appendChild(var_o_script);
        }
    };

    if (var_o_root.Objectis.var_b_isBooting) {
        setTimeout(function() {
            var_o_root.Objectis.var_b_isBooting = false;
            var_o_root.Objectis.init();
        }, 50);
    }
})(window);
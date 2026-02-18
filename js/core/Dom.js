/**
 * @file Dom.js
 * @description Utility DOM conforme HTML 4.01. Gestione database via tag Param.
 * @version 1.2.6
 */

if (typeof window.Objectis === "undefined") {
    window.Objectis = { var_a_components: {} };
}

window.Objectis.getElementsByClassName = function(var_s_class, var_o_root) {
    var var_o_base = var_o_root || document;
    var var_a_res = [];
    if (var_o_base.getElementsByClassName) {
        var var_o_l = var_o_base.getElementsByClassName(var_s_class);
        for (var var_n_i = 0; var_n_i < var_o_l.length; var_n_i++) var_a_res.push(var_o_l[var_n_i]);
    } else {
        var var_a_all = var_o_base.getElementsByTagName("*");
        var var_s_re = new RegExp("(^|\\s)" + var_s_class + "(\\s|$)");
        for (var var_n_j = 0; var_n_j < var_a_all.length; var_n_j++) {
            if (var_s_re.test(var_a_all[var_n_j].className)) var_a_res.push(var_a_all[var_n_j]);
        }
    }
    return var_a_res;
};

window.Objectis.getParam = function(var_o_el, var_s_key, var_s_def) {
    if (!var_o_el || !var_o_el.className) return var_s_def;
    var var_s_pre = "opt-" + var_s_key + "-";
    var var_a_p = var_o_el.className.split(/\s+/);
    for (var var_n_i = 0; var_n_i < var_a_p.length; var_n_i++) {
        if (var_a_p[var_n_i].indexOf(var_s_pre) === 0) {
            return var_a_p[var_n_i].substring(var_s_pre.length).split("_").join(" ");
        }
    }
    return var_s_def;
};

window.Objectis.loadStyle = function(var_s_path) {
    var var_o_link = document.createElement("link");
    var_o_link.rel = "stylesheet";
    var_o_link.type = "text/css";
    var_o_link.href = var_s_path;
    document.getElementsByTagName("head")[0].appendChild(var_o_link);
};

window.Objectis.getMeta = function(var_o_el, var_s_key) {
    if (!var_o_el) return "";
    var var_a_p = var_o_el.getElementsByTagName("param");
    for (var var_n_i = 0; var_n_i < var_a_p.length; var_n_i++) {
        if (var_a_p[var_n_i].getAttribute("name") === var_s_key) {
            return var_a_p[var_n_i].getAttribute("value") || "";
        }
    }
    return "";
};

/**
 * @function setMeta
 * @description Inserisce o aggiorna un tag <param> nell'Object per la verifica via Inspector.
 */
window.Objectis.setMeta = function(var_o_el, var_s_key, var_s_val) {
    if (!var_o_el) return false;
    
    var var_a_p = var_o_el.getElementsByTagName("param");
    var var_b_found = false;

    for (var var_n_i = 0; var_n_i < var_a_p.length; var_n_i++) {
        if (var_a_p[var_n_i].getAttribute("name") === var_s_key) {
            var_a_p[var_n_i].setAttribute("value", var_s_val);
            var_b_found = true;
            break;
        }
    }

    if (!var_b_found) {
        var var_o_newParam = document.createElement("param");
        var_o_newParam.name = var_s_key;
        var_o_newParam.value = var_s_val;
        var_o_el.appendChild(var_o_newParam);
    }
    
    this.log("Inspector Update: " + var_s_key + " caricato.", "DOM");
    return true;
};
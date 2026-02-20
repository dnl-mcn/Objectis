/**
 * @file Dom.js
 * @description Utility DOM con calcolo rettangoli potenziato per IE6.
 * @version 1.3.1
 */

(function(var_o_root) {
    if (!var_o_root.Objectis) {
        var_o_root.Objectis = { var_a_components: {} };
    }

    var_o_root.Objectis.requestFrame = function(var_f_callback) {
        var var_f_raf = window.requestAnimationFrame ||
                        function(var_f_cb) { return window.setTimeout(var_f_cb, 32); };
        return var_f_raf(var_f_callback);
    };

    var_o_root.Objectis.getRect = function(var_o_el) {
        if (!var_o_el) return { width: 0, height: 0, top: 0, left: 0 };
        
        // IE6/7 a volte restituisce 0 se l'elemento non ha 'layout'
        var var_n_w = var_o_el.offsetWidth;
        var var_n_h = var_o_el.offsetHeight;
        
        // Fallback per IE6 se offsetHeight è 0 ma l'elemento deve essere visibile
        if (var_n_h === 0 && var_o_el.style.display !== 'none') {
            var_n_h = parseInt(var_o_el.currentStyle.height, 10) || 0;
        }

        var var_n_t = 0;
        var var_n_l = 0;
        var var_o_curr = var_o_el;
        
        while (var_o_curr && var_o_curr.tagName !== "BODY") {
            var_n_t += var_o_curr.offsetTop;
            var_n_l += var_o_curr.offsetLeft;
            var_o_curr = var_o_curr.offsetParent;
        }

        return {
            width: var_n_w,
            height: var_n_h,
            top: var_n_t,
            left: var_n_l
        };
    };

    var_o_root.Objectis.addEvent = function(var_o_el, var_s_type, var_f_fn) {
        if (!var_o_el) return;
        if (var_o_el.addEventListener) {
            var_o_el.addEventListener(var_s_type, var_f_fn, false);
        } else {
            var_o_el.attachEvent("on" + var_s_type, var_f_fn);
        }
    };

    var_o_root.Objectis.preventDefault = function(e) {
        var var_o_ev = e || window.event;
        if (var_o_ev.preventDefault) var_o_ev.preventDefault();
        else var_o_ev.returnValue = false;
    };

    var_o_root.Objectis.getParam = function(var_o_el, var_s_key, var_s_def) {
        if (!var_o_el || !var_o_el.className) return var_s_def;
        var var_s_cls = var_o_el.className;
        var var_a_parts = var_s_cls.split(/\s+/);
        var var_s_prefix = "opt-" + var_s_key + "-";
        for (var var_n_i = 0; var_n_i < var_a_parts.length; var_n_i++) {
            if (var_a_parts[var_n_i].indexOf(var_s_prefix) === 0) {
                return var_a_parts[var_n_i].substring(var_s_prefix.length);
            }
        }
        return var_s_def;
    };

    /**
     * @method hasClass
     * Verifica la presenza di una classe su un elemento.
     */
    var_o_root.Objectis.hasClass = function(var_o_el, var_s_name) {
        if (!var_o_el || !var_o_el.className) return false;
        return new RegExp('(\\s|^)' + var_s_name + '(\\s|$)').test(var_o_el.className);
    };

    /**
     * @method addClass
     * Aggiunge una classe se non presente.
     */
    var_o_root.Objectis.addClass = function(var_o_el, var_s_name) {
        if (!this.hasClass(var_o_el, var_s_name)) {
            var_o_el.className += (var_o_el.className ? " " : "") + var_s_name;
        }
    };

    /**
     * @method removeClass
     * Rimuove una classe e pulisce gli spazi bianchi.
     */
    var_o_root.Objectis.removeClass = function(var_o_el, var_s_name) {
        if (this.hasClass(var_o_el, var_s_name)) {
            var var_o_reg = new RegExp('(\\s|^)' + var_s_name + '(\\s|$)');
            var_o_el.className = var_o_el.className.replace(var_o_reg, ' ').replace(/^\s+|\s+$/g, '');
        }
    };
})(window);
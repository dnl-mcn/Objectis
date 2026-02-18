/**
 * @file Dom.js
 * @description Utility DOM per Objectis. Supporta il timing dei frame e calcoli rettangoli.
 * @version 1.3.0
 */

(function(var_o_root) {
    if (!var_o_root.Objectis) {
        var_o_root.Objectis = { var_a_components: {} };
    }

    /**
     * @method requestFrame
     * @description Gestisce il timing del rendering per evitare calcoli a dimensione zero.
     */
    var_o_root.Objectis.requestFrame = function(var_f_callback) {
        var var_f_raf = window.requestAnimationFrame ||
                        window.webkitRequestAnimationFrame ||
                        window.mozRequestAnimationFrame ||
                        function(var_f_cb) { return window.setTimeout(var_f_cb, 16); };
        return var_f_raf(var_f_callback);
    };

    /**
     * @method getRect
     * @description Restituisce le dimensioni e la posizione reale di un elemento.
     */
    var_o_root.Objectis.getRect = function(var_o_el) {
        if (!var_o_el) return { width: 0, height: 0, top: 0, left: 0 };
        
        // Per IE6/7 usiamo le proprietà offset classiche
        var var_n_w = var_o_el.offsetWidth;
        var var_n_h = var_o_el.offsetHeight;
        var var_n_t = 0;
        var var_n_l = 0;
        
        var var_o_curr = var_o_el;
        while (var_o_curr) {
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

    /**
     * @method addEvent
     */
    var_o_root.Objectis.addEvent = function(var_o_el, var_s_type, var_f_fn) {
        if (!var_o_el) return;
        if (var_o_el.addEventListener) {
            var_o_el.addEventListener(var_s_type, var_f_fn, false);
        } else if (var_o_el.attachEvent) {
            var_o_el.attachEvent("on" + var_s_type, var_f_fn);
        } else {
            var_o_el["on" + var_s_type] = var_f_fn;
        }
    };

    /**
     * @method preventDefault
     */
    var_o_root.Objectis.preventDefault = function(e) {
        var var_o_ev = e || window.event;
        if (var_o_ev.preventDefault) var_o_ev.preventDefault();
        else var_o_ev.returnValue = false;
    };

    /**
     * @method getParam
     * @description Estrae i parametri dalle classi opt-
     */
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

})(window);
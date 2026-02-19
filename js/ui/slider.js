/**
 * @file slider.js
 * @description Componente Slider - Fix divisione per zero e stabilità IE6.
 * @version 1.2.8
 */

(function(var_o_root) {
    if (!var_o_root.Objectis) {
        var_o_root.Objectis = { var_a_components: {} };
    }

    var_o_root.Objectis.slider = function(var_o_el) {
        var var_o_self = this;
        this.htmlElement = var_o_el;
        
        this.minRange = parseInt(Objectis.getParam(var_o_el, "min", "0"), 10);
        this.maxRange = parseInt(Objectis.getParam(var_o_el, "max", "100"), 10);
        this.isVertical = Objectis.getParam(var_o_el, "dir", "h") === "v";
        this.cursorReal = parseInt(Objectis.getParam(var_o_el, "val", "0"), 10);
        
        this.isDown = false;
        this.cursor = null;
        this.onValueChange = null;
        this.targetElement = null;

        this.init = function() {
            if (this.isVertical) {
                this.htmlElement.className += " obj-slider-vertical";
            }
            
            this.cursor = document.createElement("div");
            this.cursor.className = "cursor";
            this.htmlElement.appendChild(this.cursor);

            if (this.htmlElement.id === "console-slider") {
                this.targetElement = document.getElementById("system-log-container");
                this.onValueChange = function(var_n_val) {
                    if (var_o_self.targetElement) {
                        var_o_self.targetElement.scrollTop = var_n_val;
                    }
                };
            }

            this.setEvents();
            this.refresh();
        };

        this.refresh = function() {
            var var_n_diff = this.maxRange - this.minRange;
            if (var_n_diff <= 0) {
                this.htmlElement.style.visibility = "hidden";
            } else {
                this.htmlElement.style.visibility = "visible";
                this.setCursor(this.convertRealToPixel(this.cursorReal), false);
            }
        };

        this.setEvents = function() {
            var var_f_handleInput = function(e) {
                var var_o_rect = Objectis.getRect(var_o_self.htmlElement);
                var var_o_ev = e || window.event;
                var var_n_offset = var_o_self.isVertical ? (var_o_ev.clientY - var_o_rect.top) : (var_o_ev.clientX - var_o_rect.left);
                var_o_self.setCursor(var_n_offset - 7, true);
            };

            Objectis.addEvent(this.htmlElement, "mousedown", function(e) {
                var_o_self.isDown = true;
                var_f_handleInput(e);
                Objectis.preventDefault(e);
            });

            Objectis.addEvent(document, "mousemove", function(e) {
                if (var_o_self.isDown) var_f_handleInput(e || window.event);
            });

            Objectis.addEvent(window, "mouseup", function() {
                var_o_self.isDown = false;
            });

            var var_s_wheelEvt = window.addEventListener ? "wheel" : "mousewheel";
            var var_f_onWheel = function(e) {
                var var_o_ev = e || window.event;
                var var_n_delta = var_o_ev.wheelDelta ? var_o_ev.wheelDelta : -var_o_ev.detail;
                if (var_n_delta !== 0) {
                    Objectis.preventDefault(var_o_ev);
                    var var_n_dir = var_n_delta > 0 ? -1 : 1;
                    var_o_self.setValue(var_o_self.cursorReal + (var_n_dir * 20));
                }
            };

            Objectis.addEvent(this.htmlElement, var_s_wheelEvt, var_f_onWheel);
            if (this.targetElement) Objectis.addEvent(this.targetElement, var_s_wheelEvt, var_f_onWheel);
        };

        this.convertRealToPixel = function(vr) {
            var var_o_rect = Objectis.getRect(this.htmlElement);
            var s = (this.isVertical ? var_o_rect.height : var_o_rect.width) - 14;
            var r = this.maxRange - this.minRange;
            // FIX: Protezione divisione per zero
            if (s <= 0 || r <= 0) return 0;
            return Math.round((vr - this.minRange) * (s / r));
        };

        this.convertPixelToReal = function(vp) {
            var var_o_rect = Objectis.getRect(this.htmlElement);
            var s = (this.isVertical ? var_o_rect.height : var_o_rect.width) - 14;
            var r = this.maxRange - this.minRange;
            // FIX: Protezione divisione per zero
            if (s <= 0 || r <= 0) return this.minRange;
            return Math.round(this.minRange + (vp * (r / s)));
        };

        this.setCursor = function(vp, update) {
            var var_o_rect = Objectis.getRect(this.htmlElement);
            var s = (this.isVertical ? var_o_rect.height : var_o_rect.width) - 14;
            if (s < 0) s = 0;
            if (vp < 0) vp = 0; 
            if (vp > s) vp = s;

            if (this.isVertical) this.cursor.style.top = vp + "px";
            else this.cursor.style.left = vp + "px";

            if (update) {
                this.cursorReal = this.convertPixelToReal(vp);
                if (this.onValueChange) this.onValueChange(this.cursorReal);
            }
        };

        this.setValue = function(v) {
            this.cursorReal = Math.max(this.minRange, Math.min(this.maxRange, v));
            this.setCursor(this.convertRealToPixel(this.cursorReal), true);
        };
    };
})(window);
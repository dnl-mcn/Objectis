/**
 * @file slider.js
 * @description Componente Slider - Connessione automatica al target di scroll.
 * @version 1.2.5
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
            this.htmlElement.style.zoom = "1";
            if (this.isVertical) {
                this.htmlElement.className += " obj-slider-vertical";
            }
            
            this.cursor = document.createElement("div");
            this.cursor.className = "cursor";
            this.htmlElement.appendChild(this.cursor);

            // AUTO-LINK: Se è lo slider della console, aggancia il log automaticamente
            if (this.htmlElement.id === "console-slider") {
                this.targetElement = document.getElementById("system-log-container");
                this.onValueChange = function(var_n_val) {
                    if (var_o_self.targetElement) {
                        var_o_self.targetElement.scrollTop = var_n_val;
                    }
                };
            }

            this.setEvents();
            
            Objectis.requestFrame(function() {
                var_o_self.refresh();
            });
        };

        this.refresh = function() {
            var var_n_range = this.maxRange - this.minRange;
            if (var_n_range <= 0 && this.isVertical) {
                this.htmlElement.style.display = "none";
            } else {
                this.htmlElement.style.display = "block";
                this.setCursor(this.convertRealToPixel(this.cursorReal), false);
            }
        };

        this.setEvents = function() {
            var var_f_handleInput = function(e) {
                var var_o_rect = Objectis.getRect(var_o_self.htmlElement);
                var var_o_ev = e || window.event;
                var var_n_offset = var_o_self.isVertical ? (var_o_ev.clientY - var_o_rect.top) : (var_o_ev.clientX - var_o_rect.left);
                var var_n_pixel = var_n_offset - (var_o_self.getCursorSize() / 2);
                var_o_self.setCursor(var_n_pixel, true);
            };

            Objectis.addEvent(this.htmlElement, "mousedown", function(e) {
                var_o_self.isDown = true;
                var_f_handleInput(e);
                Objectis.preventDefault(e);
            });

            Objectis.addEvent(document, "mousemove", function(e) {
                if (var_o_self.isDown) {
                    var_f_handleInput(e || window.event);
                }
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
                    var var_n_step = 20; // Step fisso per test
                    var var_n_dir = var_n_delta > 0 ? -1 : 1;
                    var_o_self.setValue(var_o_self.cursorReal + (var_n_dir * var_n_step));
                }
            };

            Objectis.addEvent(this.htmlElement, var_s_wheelEvt, var_f_onWheel);
            if (this.targetElement) {
                Objectis.addEvent(this.targetElement, var_s_wheelEvt, var_f_onWheel);
            }
        };

        this.getCursorSize = function() {
            return 14; 
        };

        this.convertRealToPixel = function(vr) {
            var s = (this.isVertical ? this.htmlElement.offsetHeight : this.htmlElement.offsetWidth) - 14;
            var r = this.maxRange - this.minRange;
            if (s <= 0 || r <= 0) return 0;
            return Math.round((vr - this.minRange) * (s / r));
        };

        this.convertPixelToReal = function(vp) {
            var s = (this.isVertical ? this.htmlElement.offsetHeight : this.htmlElement.offsetWidth) - 14;
            var r = this.maxRange - this.minRange;
            if (s <= 0) return this.minRange;
            return Math.round(this.minRange + (vp * (r / s)));
        };

        this.setCursor = function(vp, update) {
            var s = (this.isVertical ? this.htmlElement.offsetHeight : this.htmlElement.offsetWidth) - 14;
            if (vp < 0) vp = 0; if (vp > s) vp = s;

            if (this.isVertical) {
                this.cursor.style.top = vp + "px";
            } else {
                this.cursor.style.left = vp + "px";
            }

            if (update) {
                this.cursorReal = this.convertPixelToReal(vp);
                if (this.onValueChange) this.onValueChange(this.cursorReal);
            }
        };

        this.setValue = function(v) {
            this.cursorReal = Math.max(this.minRange, Math.min(this.maxRange, v));
            var var_n_pix = this.convertRealToPixel(this.cursorReal);
            this.setCursor(var_n_pix, true);
        };
    };
})(window);
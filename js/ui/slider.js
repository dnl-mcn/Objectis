/**
 * @file slider.js
 * @description Componente Slider Universale - IE6 Ultra-Compatibility.
 * @version 1.0.4
 */

(function(var_o_root) {
    /**
     * @constructor slider
     * @param {HTMLElement} var_o_element Elemento con classe obj-slider
     */
    var_o_root.Objectis.slider = function(var_o_element) {
        var var_o_self = this;
        this.var_o_main = var_o_element;
        this.var_o_viewport = null;
        this.var_o_cursorY = null;
        this.var_o_trackY = null;
        this.var_b_isDragging = false;
        
        /**
         * @method init
         */
        this.init = function() {
            // IE6: Ricerca manuale del viewport (niente getElementsByClassName)
            var var_a_children = this.var_o_main.getElementsByTagName("div");
            for (var var_n_i = 0; var_n_i < var_a_children.length; var_n_i++) {
                if (var_a_children[var_n_i].className.indexOf("obj-slider-viewport") !== -1) {
                    this.var_o_viewport = var_a_children[var_n_i];
                    break;
                }
            }

            if (!this.var_o_viewport) {
                this.var_o_viewport = document.createElement("div");
                this.var_o_viewport.className = "obj-slider-viewport";
                
                while (this.var_o_main.firstChild) {
                    this.var_o_viewport.appendChild(this.var_o_main.firstChild);
                }
                this.var_o_main.appendChild(this.var_o_viewport);
            }

            // Inizializza assi basandosi sulle classi
            if (this.var_o_main.className.indexOf("scroll-y") !== -1) {
                this.createAxis("Y");
            }

            this.bindGlobalEvents();
            this.refresh();
        };

        /**
         * @method createAxis
         * Crea track e cursor per l'asse specificato.
         */
        this.createAxis = function(var_s_type) {
            var var_o_track = document.createElement("div");
            var_o_track.className = "obj-slider-track-" + var_s_type.toLowerCase();
            
            var var_o_cursor = document.createElement("div");
            var_o_cursor.className = "obj-slider-cursor obj-slider-cursor-" + var_s_type.toLowerCase();
            
            this.var_o_main.appendChild(var_o_track);
            this.var_o_main.appendChild(var_o_cursor);
            
            if (var_s_type === "Y") {
                this.var_o_cursorY = var_o_cursor;
                this.var_o_trackY = var_o_track;
            }

            this.bindDrag(var_o_cursor, var_s_type);
        };

        /**
         * @method bindGlobalEvents
         * Gestisce la rotella del mouse (compatibile IE/Chrome/FF).
         */
        this.bindGlobalEvents = function() {
            var var_f_wheelHandler = function(var_o_e) {
                var_o_e = var_o_e || window.event;
                // IE6 usa wheelDelta (120 /-120)
                var var_n_delta = var_o_e.wheelDelta ? -(var_o_e.wheelDelta / 3) : (var_o_e.detail * 40);
                var_o_self.var_o_viewport.scrollTop += var_n_delta;
                var_o_self.syncCursor();
                
                if (var_o_e.preventDefault) var_o_e.preventDefault();
                var_o_e.returnValue = false; // IE Legacy prevent default
                return false;
            };

            // IE6 supporta solo attachEvent
            if (this.var_o_main.attachEvent) {
                this.var_o_main.attachEvent("onmousewheel", var_f_wheelHandler);
            } else if (this.var_o_main.addEventListener) {
                this.var_o_main.addEventListener("mousewheel", var_f_wheelHandler, false);
                this.var_o_main.addEventListener("DOMMouseScroll", var_f_wheelHandler, false);
            }
        };

        /**
         * @method bindDrag
         */
        this.bindDrag = function(var_o_cursor, var_s_axis) {
            var_o_cursor.onmousedown = function(var_o_e) {
                var_o_e = var_o_e || window.event;
                var_o_self.var_b_isDragging = true;
                var var_n_startCoord = (var_s_axis === "Y") ? var_o_e.clientY : var_o_e.clientX;
                var var_n_startPos = (var_s_axis === "Y") ? var_o_cursor.offsetTop : var_o_cursor.offsetLeft;

                // IE6 richiede setCapture per non perdere il drag fuori dal div
                if (var_o_cursor.setCapture) var_o_cursor.setCapture();

                document.onmousemove = function(var_o_me) {
                    if (!var_o_self.var_b_isDragging) return;
                    var_o_me = var_o_me || window.event;
                    
                    if (var_s_axis === "Y") {
                        var var_n_delta = var_o_me.clientY - var_n_startCoord;
                        var var_n_maxTop = var_o_self.var_o_main.offsetHeight - var_o_cursor.offsetHeight;
                        var var_n_newTop = Math.max(0, Math.min(var_n_startPos + var_n_delta, var_n_maxTop));
                        var_o_cursor.style.top = var_n_newTop + "px";
                        
                        var var_n_perc = var_n_newTop / var_n_maxTop;
                        var_o_self.var_o_viewport.scrollTop = var_n_perc * (var_o_self.var_o_viewport.scrollHeight - var_o_self.var_o_main.offsetHeight);
                    }
                };

                document.onmouseup = function() {
                    var_o_self.var_b_isDragging = false;
                    if (var_o_cursor.releaseCapture) var_o_cursor.releaseCapture();
                    document.onmousemove = null;
                };
                return false;
            };
        };

        /**
         * @method refresh
         * Ricalcola la visibilità e la dimensione del cursor.
         */
        this.refresh = function() {
            if (this.var_o_cursorY) {
                var var_n_viewH = this.var_o_main.offsetHeight;
                var var_n_contentH = this.var_o_viewport.scrollHeight;
                
                if (var_n_contentH <= var_n_viewH) {
                    this.var_o_cursorY.style.display = "none";
                } else {
                    this.var_o_cursorY.style.display = "block";
                    var var_n_ratio = var_n_viewH / var_n_contentH;
                    var var_n_cursorH = Math.floor(var_n_viewH * var_n_ratio);
                    this.var_o_cursorY.style.height = Math.max(20, var_n_cursorH) + "px";
                    this.syncCursor();
                }
            }
        };

        /**
         * @method syncCursor
         */
        this.syncCursor = function() {
            if (this.var_o_cursorY && !this.var_b_isDragging) {
                var var_n_maxScroll = this.var_o_viewport.scrollHeight - this.var_o_main.offsetHeight;
                if (var_n_maxScroll > 0) {
                    var var_n_perc = this.var_o_viewport.scrollTop / var_n_maxScroll;
                    var var_n_maxTop = this.var_o_main.offsetHeight - this.var_o_cursorY.offsetHeight;
                    this.var_o_cursorY.style.top = Math.floor(var_n_perc * var_n_maxTop) + "px";
                }
            }
        };

        /**
         * @method setValue
         */
        this.setValue = function(var_n_val) {
            if (this.var_o_viewport) {
                this.var_o_viewport.scrollTop = var_n_val;
                this.syncCursor();
            }
        };
    };
})(window);
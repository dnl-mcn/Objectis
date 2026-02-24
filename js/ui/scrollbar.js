/**
 * @file scrollbar.js
 * @description Scrollbar UI - Aggiunta interazione mouse (Drag & Jump).
 * @version 1.4.0
 */

(function(var_o_root) {
    if (!var_o_root.Objectis) return;

    var_o_root.Objectis.scrollbar = function(var_o_element) {
        this.var_o_container = var_o_element;
        this.var_o_wrapper = null;
        this.var_o_track = null;
        this.var_o_thumb = null;
        
        this.var_n_ratio = 0;
        this.var_n_currentTop = 0;
        
        // Variabili per il Drag
        this.var_b_isDragging = false;
        this.var_n_dragStartY = 0;
        this.var_n_scrollStartY = 0;

        this.init = function() {
            var var_o_self = this;
            this.var_o_container._objScrollbar = this;
            this.var_o_wrapper = this.var_o_container.firstChild;
            
            if (!this.var_o_wrapper || this.var_o_wrapper.className !== "obj-scrollbar-content") {
                this.var_o_wrapper = document.createElement("div");
                this.var_o_wrapper.className = "obj-scrollbar-content";
                while (this.var_o_container.firstChild) {
                    this.var_o_wrapper.appendChild(this.var_o_container.firstChild);
                }
                this.var_o_container.appendChild(this.var_o_wrapper);
            }
            
            this.var_o_container.style.position = "relative";
            this.var_o_container.style.overflow = "hidden";
            this.var_o_wrapper.style.position = "absolute";
            this.var_o_wrapper.style.top = "0px";
            this.var_o_wrapper.style.left = "0px";

            this.var_o_track = document.createElement("div");
            this.var_o_track.className = "obj-scrollbar-track";
            this.var_o_thumb = document.createElement("div");
            this.var_o_thumb.className = "obj-scrollbar-thumb";
            
            this.var_o_track.appendChild(this.var_o_thumb);
            this.var_o_container.appendChild(this.var_o_track);

            this.update();
            this.bindEvents();
        };

        this.update = function() {
            if (!this.var_o_container || !this.var_o_wrapper) return;
            var var_n_viewH = this.var_o_container.offsetHeight;
            var var_n_totalH = this.var_o_wrapper.offsetHeight;
            if (var_n_totalH <= var_n_viewH) {
                if (this.var_o_track) this.var_o_track.style.display = "none";
                this.var_o_wrapper.style.top = "0px";
                this.var_n_currentTop = 0;
                return;
            }
            if (this.var_o_track) this.var_o_track.style.display = "block";
            this.var_n_ratio = var_n_viewH / var_n_totalH;
            var var_n_calcH = Math.floor(var_n_viewH * this.var_n_ratio);
            var var_n_thumbH = (var_n_calcH > 30) ? var_n_calcH : 30;
            if (this.var_o_thumb) this.var_o_thumb.style.height = var_n_thumbH + "px";
            this.scrollTo(this.var_n_currentTop);
        };

        this.scrollTo = function(var_n_newTop) {
            var var_n_viewH = this.var_o_container.offsetHeight;
            var var_n_totalH = this.var_o_wrapper.offsetHeight;
            var var_n_minTop = -(var_n_totalH - var_n_viewH);
            if (var_n_newTop > 0) var_n_newTop = 0;
            if (var_n_newTop < var_n_minTop) var_n_newTop = var_n_minTop;
            this.var_n_currentTop = var_n_newTop;
            this.var_o_wrapper.style.top = this.var_n_currentTop + "px";
            var var_n_thumbTop = Math.abs(Math.floor(this.var_n_currentTop * this.var_n_ratio));
            if (this.var_o_thumb) this.var_o_thumb.style.top = var_n_thumbTop + "px";
        };

        this.bindEvents = function() {
            var var_o_self = this;

            // 1. GESTIONE ROTELLINA
            var var_f_handleScroll = function(var_o_e) {
                var_o_e = var_o_e || window.event;
                var var_n_delta = 0;
                if (var_o_e.wheelDelta) {
                    var_n_delta = var_o_e.wheelDelta / 120;
                } else if (var_o_e.detail) {
                    var_n_delta = -var_o_e.detail / 3;
                }
                var_o_self.scrollTo(var_o_self.var_n_currentTop + (var_n_delta * 60));
                if (var_o_e.preventDefault) var_o_e.preventDefault();
                var_o_e.returnValue = false;
                return false;
            };

            this.var_o_container.onmousewheel = var_f_handleScroll;
            if (this.var_o_container.addEventListener) {
                this.var_o_container.addEventListener("DOMMouseScroll", var_f_handleScroll, false);
            }

            // 2. INIZIO DRAG SUL THUMB
            this.var_o_thumb.onmousedown = function(var_o_e) {
                var_o_e = var_o_e || window.event;
                var_o_self.var_b_isDragging = true;
                var_o_self.var_n_dragStartY = var_o_e.clientY;
                var_o_self.var_n_scrollStartY = var_o_self.var_n_currentTop;
                
                // CSS Feedback
                var_o_self.var_o_thumb.className += " active";
                
                // Impedisce selezione testo durante il drag
                if (document.body.setCapture) document.body.setCapture(); 
                return false;
            };

            // 3. MOVIMENTO GLOBALE
            var var_f_mouseMove = function(var_o_e) {
                if (!var_o_self.var_b_isDragging) return;
                var_o_e = var_o_e || window.event;
                
                var var_n_deltaY = var_o_e.clientY - var_o_self.var_n_dragStartY;
                // Calcoliamo lo spostamento reale basandoci sul ratio inverso
                var var_n_moveContent = var_n_deltaY / var_o_self.var_n_ratio;
                
                var_o_self.scrollTo(var_o_self.var_n_scrollStartY - var_n_moveContent);
            };

            // 4. FINE DRAG
            var var_f_mouseUp = function() {
                if (var_o_self.var_b_isDragging) {
                    var_o_self.var_b_isDragging = false;
                    var_o_self.var_o_thumb.className = var_o_self.var_o_thumb.className.replace(" active", "");
                    if (document.releaseCapture) document.releaseCapture();
                }
            };

            // Bind globali per il drag (fuori dal contenitore)
            if (document.addEventListener) {
                document.addEventListener("mousemove", var_f_mouseMove, false);
                document.addEventListener("mouseup", var_f_mouseUp, false);
            } else {
                document.onmousemove = var_f_mouseMove;
                document.onmouseup = var_f_mouseUp;
            }

            // 5. JUMP CLICK SULLA TRACK
            this.var_o_track.onmousedown = function(var_o_e) {
                var_o_e = var_o_e || window.event;
                // Se clicchiamo il thumb non deve attivarsi il jump
                var var_o_target = var_o_e.target || var_o_e.srcElement;
                if (var_o_target === var_o_self.var_o_thumb) return;

                // Calcolo posizione click relativa alla track
                var var_n_rectTop = var_o_self.var_o_track.getBoundingClientRect ? 
                                    var_o_self.var_o_track.getBoundingClientRect().top : 
                                    var_o_self.var_o_track.offsetTop;
                
                var var_n_clickY = var_o_e.clientY - var_n_rectTop;
                var var_n_percent = var_n_clickY / var_o_self.var_o_track.offsetHeight;
                
                var var_n_totalH = var_o_self.var_o_wrapper.offsetHeight;
                var var_n_viewH = var_o_self.var_o_container.offsetHeight;
                
                var_o_self.scrollTo(-(var_n_totalH * var_n_percent) + (var_n_viewH / 2));
            };
        };
    };
})(window);
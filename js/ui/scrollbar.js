/**
 * @file scrollbar.js
 * @description Scrollbar UI - Fix Passive Listeners per Chrome.
 * @version 1.3.6
 */

(function(var_o_root) {
    if (!var_o_root.Objectis) return;

    var_o_root.Objectis.scrollbar = function(var_o_element) {
        this.var_o_container = var_o_element;
        this.var_o_wrapper = null;
        this.var_o_track = null;
        this.var_o_thumb = null;
        
        this.var_n_ratio = 0;
        this.var_n_currentTop = 0; // Tracciamo la posizione interna

        /**
         * @method init
         * Crea gli elementi DOM necessari per la scrollbar.
         */
        this.init = function() {
            var var_o_self = this;

            // Salviamo l'istanza nell'elemento DOM per recuperarla al resize
            this.var_o_container._objScrollbar = this;

            this.var_o_wrapper = this.var_o_container.firstChild;
            
            // Verifica se il wrapper esiste già per evitare loop infiniti
            if (!this.var_o_wrapper || this.var_o_wrapper.className !== "obj-scrollbar-content") {
                this.var_o_wrapper = document.createElement("div");
                this.var_o_wrapper.className = "obj-scrollbar-content";
                
                while (this.var_o_container.firstChild) {
                    this.var_o_wrapper.appendChild(this.var_o_container.firstChild);
                }
                this.var_o_container.appendChild(this.var_o_wrapper);
            }
            
            // 2. Setup stili critici
            this.var_o_container.style.position = "relative";
            this.var_o_container.style.overflow = "hidden";
            this.var_o_wrapper.style.position = "absolute";
            this.var_o_wrapper.style.top = "0px";
            this.var_o_wrapper.style.left = "0px";

            // 3. Creazione Track
            this.var_o_track = document.createElement("div");
            this.var_o_track.className = "obj-scrollbar-track";
            
            // 4. Creazione cursore (Thumb)
            this.var_o_thumb = document.createElement("div");
            this.var_o_thumb.className = "obj-scrollbar-thumb";
            
            this.var_o_track.appendChild(this.var_o_thumb);
            this.var_o_container.appendChild(this.var_o_track);

            this.update();
            this.bindEvents();
            
            Objectis.log("Scrollbar istanziata per " + (this.var_o_container.id || "elemento"), "SYSTEM");
        };

        /**
         * @method update
         * Calcola il ratio sottraendo eventuali bordi per precisione millimetrica.
         */
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

        /**
         * @method scrollTo
         * Sposta il wrapper e sincronizza il cursore
         */
        this.scrollTo = function(var_n_newTop) {
            var var_n_viewH = this.var_o_container.offsetHeight;
            var var_n_totalH = this.var_o_wrapper.offsetHeight;
            var var_n_minTop = -(var_n_totalH - var_n_viewH);

            // Bounds check
            if (var_n_newTop > 0) {
                var_n_newTop = 0;
            }
            if (var_n_newTop < var_n_minTop) {
                var_n_newTop = var_n_minTop;
            }

            this.var_n_currentTop = var_n_newTop;
            this.var_o_wrapper.style.top = this.var_n_currentTop + "px";

            // Sincronizza Thumb
            var var_n_thumbTop = Math.abs(Math.floor(this.var_n_currentTop * this.var_n_ratio));
            if (this.var_o_thumb) this.var_o_thumb.style.top = var_n_thumbTop + "px";
        };

        this.bindEvents = function() {
            var var_o_self = this;
            
            // Funzione interna per gestire lo scroll senza riferimenti a metodi moderni
            var var_f_handleScroll = function(var_o_e) {
                var_o_e = var_o_e || window.event;
                var var_n_delta = 0;
                
                if (var_o_e.wheelDelta) {
                    var_n_delta = var_o_e.wheelDelta / 120;
                } else if (var_o_e.detail) {
                    var_n_delta = -var_o_e.detail / 3;
                }
                
                var_o_self.scrollTo(var_o_self.var_n_currentTop + (var_n_delta * 60));

                // Standard IE6 per bloccare lo scroll della pagina esterna
                if (var_o_e.preventDefault) var_o_e.preventDefault();
                var_o_e.returnValue = false;
                return false;
            };

            // Fix Chrome Warning: passive false permette preventDefault()
            if (this.var_o_container.addEventListener) {
                this.var_o_container.addEventListener("mousewheel", var_f_handleScroll, { passive: false });
                this.var_o_container.addEventListener("DOMMouseScroll", var_f_handleScroll, false);
            } else {
                this.var_o_container.onmousewheel = var_f_handleScroll;
            }
        };
    };
})(window);
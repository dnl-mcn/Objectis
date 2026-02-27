/**
 * @file TimeEngine.js
 * @description Gestore del tempo e Heartbeat Clock centralizzato.
 * @version 1.0.0
 */

(function(var_o_root) {
    if (!var_o_root.Objectis) var_o_root.Objectis = {};

    var_o_root.Objectis.TimeEngine = {
        var_a_queue: [],
        var_n_clockInterval: 100, // Ciclo di clock (ms)
        var_n_timerId: null,

        /**
         * @method addAction
         * @description Aggiunge un'azione alla coda del clock.
         * @param {Function} var_f_callback - Funzione da eseguire.
         * @param {Number} var_n_delay - Ritardo in ms.
         * @param {Boolean} var_b_reschedule - Se true e il tempo è saltato, riprogramma; altrimenti skippa.
         */
        addAction: function(var_f_callback, var_n_delay, var_b_reschedule) {
            var var_n_now = new Date().getTime();
            this.var_a_queue.push({
                callback: var_f_callback,
                targetTime: var_n_now + var_n_delay,
                reschedule: var_b_reschedule || false
            });
            this.startClock();
        },

        /**
         * @method startClock
         * @description Avvia il battito cardiaco unico se spento.
         */
        startClock: function() {
            var var_o_self = this;
            if (this.var_n_timerId) return;
            this.var_n_timerId = setInterval(function() {
                var_o_self.tick();
            }, this.var_n_clockInterval);
        },

        /**
         * @method tick
         * @description Processa la coda delle azioni ad ogni battito.
         */
        tick: function() {
            var var_n_now = new Date().getTime();
            if (this.var_a_queue.length === 0) return;

            for (var var_n_i = this.var_a_queue.length - 1; var_n_i >= 0; var_n_i--) {
                var var_o_action = this.var_a_queue[var_n_i];

                if (var_n_now >= var_o_action.targetTime) {
                    // Se la finestra è saltata di molto (> 2 cicli) e non deve riprogrammare, skippiamo
                    var var_b_tooLate = (var_n_now > var_o_action.targetTime + (this.var_n_clockInterval * 2));
                    
                    if (!var_b_tooLate || var_o_action.reschedule) {
                        var_o_action.callback.call(window.Objectis);
                    }
                    
                    this.var_a_queue.splice(var_n_i, 1);
                }
            }
        }
    };

    // --- Metodi Utility Invariati ---

    Objectis.getTimestamp = function() {
        return new Date().getTime();
    };

    Objectis.formatTime = function(N_SECONDS) {
        var var_n_h = Math.floor(N_SECONDS / 3600);
        var var_n_m = Math.floor((N_SECONDS % 3600) / 60);
        var var_n_s = Math.floor(N_SECONDS % 60);
        return (var_n_h < 10 ? "0" : "") + var_n_h + ":" +
               (var_n_m < 10 ? "0" : "") + var_n_m + ":" +
               (var_n_s < 10 ? "0" : "") + var_n_s;
    };

    Objectis.formatDate = function(var_n_ts) {
        var var_o_d = new Date(var_n_ts * 1000);
        var var_s_res = (var_o_d.getDate() < 10 ? "0" : "") + var_o_d.getDate() + "/" +
                        ((var_o_d.getMonth() + 1) < 10 ? "0" : "") + (var_o_d.getMonth() + 1) + "/" +
                        var_o_d.getFullYear();
        return var_s_res;
    };
})(window);
/**
 * (C) Thomas Weber 2025 tom-vibrant@gmx.de
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>. 
 */

import { LocalState } from './LocalState.js';

/**
 * App version 
 */
export const NETRIS_VERSION = '0.1.0';
	
/**
 * Main Controller class
 */
export class Controller {  

    #options = null;
    #state = null;

    /**
     * {
     *      container: jQuery DOM selector for the main container
     *      gameId:    The ID of the game element (this must have an id)
     * }
     */
    constructor(options) {
        this.#options = options || {};

        this.#state = new LocalState('netris');
    }    

    /**
     * Runs the app
     */
    async run() {
        await this.#promptRom();
    }

    /**
     * Prompt the user for a ROM file
     */
    async #promptRom() {
        let input = null;
        const that = this;

        return new Promise(function(resolve) {
            $(that.#options.container)
            .empty()
            .append(
                $('<label for="gamefile"/>')
                .text('ROM File:'),

                input = $('<input type="file" id="gamefile"/>')
                .on('change', async function() {
                    // Add the ROM and return an URL to it
                    const url = await that.#addRom(input[0].files[0]);

                    // Load the game
                    that.#setupEJS(url);

                    resolve();
                }),

                $('<div class="roms"/>')
                .append(that.#getAvailableRoms())
            );
        });
    }

    /**
     * Returns DOM for the available ROMs
     */
    #getAvailableRoms() {
        const that = this;

        return (this.#state.get('roms') || []).map(function(item) {
            return $('<div class="rom"/>')
            .append(
                $('<div class="rom-link"/>')            
                .text(item.name)
                .on('click', async function() {
                    that.#setupEJS(
                        await that.#getUrlFromBase64(item.data)
                    )
                }),

                $('<span class="remove-link"/>')
                .text('Remove')
                .on('click', function() {
                    that.#removeRom(item.name);
                }),
            );
        });
    }

    /**
     * Remove ROM(s) by name
     */
    #removeRom(name) {
        let roms = this.#state.get('roms') || [];

        roms = roms.filter(function(item) {
            return item.name != name;
        });

        this.#state.set('roms', roms);

        location.href = '/';
    }

    /**
     * Adds a new ROM from a HTML input type file
     */
    async #addRom(file) {
        const base64 = await this.#fileToBase64(file);
        
        const roms = this.#state.get('roms') || [];

        roms.push({
            name: file.name,
            data: base64
        });

        this.#state.set('roms', roms);

        return this.#getUrlFromBase64(base64);
    }

    /**
     * Returns a file link (blob) to data passed in base64
     */
    async #getUrlFromBase64(base64) {
        const res = await fetch(base64);
        const blob = await res.blob();
        return URL.createObjectURL(blob);
    }

    /**
     * Converts a file (input) to base64
     */
    async #fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    /**
     * Sets up the game!
     */
    #setupEJS(url) {
        $(this.#options.container)
            .empty()
            .append(
                $('<div id="game"/>')
                .addClass('game')
            );

        window.EJS_player = '#game';
        window.EJS_gameUrl = url;
        window.EJS_gameID = 3121;
        window.EJS_gameName = 'NETris';
        window.EJS_color = "#FF9900";
        window.EJS_core = 'nes';
        window.EJS_Settings = {
            defaultControllers: {
                '0': {                   // Player 1
                    '0': {                   
                        'value': '90'         // B   -> z
                    },
                    '1': {
                        'value': '83'         // Y   -> s
                    },
                    '2': {
                        'value': '16'         // Select  ->  Shift Left
                    },
                    '3': { 
                        'value': '13'         // Start  -> Return
                    },
                    '4': {
                        'value': '38'         // Up  ->  ArrowUp
                    }, 
                    '5': {
                        'value': '40'         // Down  ->  ArrowDown
                    },
                    '6': {
                        'value': '37'         // Left  ->  ArrowLeft
                    },
                    '7': {
                        'value': '39'         // Right  ->  ArrowRight
                    },
                    '8': {
                        'value': '88'         // A -> x
                    },
                    '9': {
                        'value': '65'         // X -> a
                    } 
                    // '10': {
                    //     'value':'81',
                    //     'value2':'4'
                    // }
                },
                '1': {},     // Player 2
                '2': {},     // Player 3
                '3': {}      // Player 4
            }
        }
        window.EJS_pathtodata = "lib/ejs/data/";
        window.EJS_lightgun = false;
        window.EJS_oldCores = true;
        window.EJS_startOnLoaded = true;
        window.EJS_volume = 0;
        window.EJS_language = 'en/en';

        $('body').append(
            $('<script src="lib/ejs/data/loader.js"></script>')
        );
    }
}
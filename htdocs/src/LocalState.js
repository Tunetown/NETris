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

/**
 * Manages local storage content
 */
export class LocalState {

    #storageId = null;
    
    /**
     * storageId is the ID of the local storage cookie.
     * stateObjectId is the sub-object name. If not set, the keys will be placed in the root object.
     */
    constructor(storageId) {
        this.#storageId = storageId;
    }

    /**
     * Returns if the key exists
     */
    has(key) {
        const data = JSON.parse(localStorage.getItem(this.#storageId) || "{}");
        return data.hasOwnProperty(key);
    }

    /**
     * Set a variable in local storage
     */
    set(key, value) {
        let data = JSON.parse(localStorage.getItem(this.#storageId) || "{}");

        if (typeof data != "object") {
            data = {}
        }
        
        data[key] = value;
        
        localStorage.setItem(this.#storageId, JSON.stringify(data));
    }

    /**
     * Read local storage
     */
    get(key) {
        const data = JSON.parse(localStorage.getItem(this.#storageId) || "{}");

        if (!data.hasOwnProperty(key)) return null;
            
        return data[key];
    }
}
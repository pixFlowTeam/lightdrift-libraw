const path = require('path');

let librawAddon;
try {
    librawAddon = require('../build/Release/libraw_addon');
} catch (err) {
    try {
        librawAddon = require('../build/Debug/libraw_addon');
    } catch (err2) {
        throw new Error('LibRaw addon not built. Run "npm run build" first.');
    }
}

class LibRaw {
    constructor() {
        this._wrapper = new librawAddon.LibRawWrapper();
    }

    /**
     * Load a RAW file
     * @param {string} filename - Path to the RAW file
     * @returns {Promise<boolean>} - Success status
     */
    async loadFile(filename) {
        return new Promise((resolve, reject) => {
            try {
                const result = this._wrapper.loadFile(filename);
                resolve(result);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * Get metadata from the loaded RAW file
     * @returns {Promise<Object>} - Metadata object
     */
    async getMetadata() {
        return new Promise((resolve, reject) => {
            try {
                const metadata = this._wrapper.getMetadata();
                resolve(metadata);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * Get image dimensions
     * @returns {Promise<Object>} - Size object with width/height
     */
    async getImageSize() {
        return new Promise((resolve, reject) => {
            try {
                const size = this._wrapper.getImageSize();
                resolve(size);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * Close and cleanup resources
     * @returns {Promise<boolean>} - Success status
     */
    async close() {
        return new Promise((resolve, reject) => {
            try {
                const result = this._wrapper.close();
                resolve(result);
            } catch (error) {
                reject(error);
            }
        });
    }
}

module.exports = LibRaw;

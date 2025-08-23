const path = require("path");

let librawAddon;
try {
  librawAddon = require("../build/Release/libraw_addon");
} catch (err) {
  try {
    librawAddon = require("../build/Debug/libraw_addon");
  } catch (err2) {
    throw new Error('LibRaw addon not built. Run "npm run build" first.');
  }
}

class LibRaw {
  constructor() {
    this._wrapper = new librawAddon.LibRawWrapper();
  }

  // ============== FILE OPERATIONS ==============

  /**
   * Load a RAW file from filesystem
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
   * Load a RAW file from memory buffer
   * @param {Buffer} buffer - Buffer containing RAW data
   * @returns {Promise<boolean>} - Success status
   */
  async loadBuffer(buffer) {
    return new Promise((resolve, reject) => {
      try {
        const result = this._wrapper.loadBuffer(buffer);
        resolve(result);
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

  // ============== ERROR HANDLING ==============

  /**
   * Get the last error message
   * @returns {string} - Last error message
   */
  getLastError() {
    return this._wrapper.getLastError();
  }

  /**
   * Convert error code to string
   * @param {number} errorCode - Error code
   * @returns {string} - Error message
   */
  strerror(errorCode) {
    return this._wrapper.strerror(errorCode);
  }

  // ============== METADATA & INFORMATION ==============

  /**
   * Get basic metadata from the loaded RAW file
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
   * Get image dimensions and size information
   * @returns {Promise<Object>} - Size object with width/height details
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
   * Get advanced metadata including color matrices and calibration data
   * @returns {Promise<Object>} - Advanced metadata object
   */
  async getAdvancedMetadata() {
    return new Promise((resolve, reject) => {
      try {
        const metadata = this._wrapper.getAdvancedMetadata();
        resolve(metadata);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Get lens information
   * @returns {Promise<Object>} - Lens metadata object
   */
  async getLensInfo() {
    return new Promise((resolve, reject) => {
      try {
        const lensInfo = this._wrapper.getLensInfo();
        resolve(lensInfo);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Get color information including white balance and color matrices
   * @returns {Promise<Object>} - Color information object
   */
  async getColorInfo() {
    return new Promise((resolve, reject) => {
      try {
        const colorInfo = this._wrapper.getColorInfo();
        resolve(colorInfo);
      } catch (error) {
        reject(error);
      }
    });
  }

  // ============== IMAGE PROCESSING ==============

  /**
   * Unpack thumbnail data
   * @returns {Promise<boolean>} - Success status
   */
  async unpackThumbnail() {
    return new Promise((resolve, reject) => {
      try {
        const result = this._wrapper.unpackThumbnail();
        resolve(result);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Process the RAW image with current settings
   * @returns {Promise<boolean>} - Success status
   */
  async processImage() {
    return new Promise((resolve, reject) => {
      try {
        const result = this._wrapper.processImage();
        resolve(result);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Subtract black level from RAW data
   * @returns {Promise<boolean>} - Success status
   */
  async subtractBlack() {
    return new Promise((resolve, reject) => {
      try {
        const result = this._wrapper.subtractBlack();
        resolve(result);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Convert RAW data to image format
   * @returns {Promise<boolean>} - Success status
   */
  async raw2Image() {
    return new Promise((resolve, reject) => {
      try {
        const result = this._wrapper.raw2Image();
        resolve(result);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Adjust maximum values in the image
   * @returns {Promise<boolean>} - Success status
   */
  async adjustMaximum() {
    return new Promise((resolve, reject) => {
      try {
        const result = this._wrapper.adjustMaximum();
        resolve(result);
      } catch (error) {
        reject(error);
      }
    });
  }

  // ============== MEMORY IMAGE CREATION ==============

  /**
   * Create processed image in memory
   * @returns {Promise<Object>} - Image data object with Buffer
   */
  async createMemoryImage() {
    return new Promise((resolve, reject) => {
      try {
        const imageData = this._wrapper.createMemoryImage();
        resolve(imageData);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Create thumbnail image in memory
   * @returns {Promise<Object>} - Thumbnail data object with Buffer
   */
  async createMemoryThumbnail() {
    return new Promise((resolve, reject) => {
      try {
        const thumbData = this._wrapper.createMemoryThumbnail();
        resolve(thumbData);
      } catch (error) {
        reject(error);
      }
    });
  }

  // ============== FILE WRITERS ==============

  /**
   * Write processed image as PPM file
   * @param {string} filename - Output filename
   * @returns {Promise<boolean>} - Success status
   */
  async writePPM(filename) {
    return new Promise((resolve, reject) => {
      try {
        const result = this._wrapper.writePPM(filename);
        resolve(result);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Write processed image as TIFF file
   * @param {string} filename - Output filename
   * @returns {Promise<boolean>} - Success status
   */
  async writeTIFF(filename) {
    return new Promise((resolve, reject) => {
      try {
        const result = this._wrapper.writeTIFF(filename);
        resolve(result);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Write thumbnail to file
   * @param {string} filename - Output filename
   * @returns {Promise<boolean>} - Success status
   */
  async writeThumbnail(filename) {
    return new Promise((resolve, reject) => {
      try {
        const result = this._wrapper.writeThumbnail(filename);
        resolve(result);
      } catch (error) {
        reject(error);
      }
    });
  }

  // ============== CONFIGURATION & SETTINGS ==============

  /**
   * Set output parameters for processing
   * @param {Object} params - Parameter object
   * @returns {Promise<boolean>} - Success status
   */
  async setOutputParams(params) {
    return new Promise((resolve, reject) => {
      try {
        const result = this._wrapper.setOutputParams(params);
        resolve(result);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Get current output parameters
   * @returns {Promise<Object>} - Current parameters
   */
  async getOutputParams() {
    return new Promise((resolve, reject) => {
      try {
        const params = this._wrapper.getOutputParams();
        resolve(params);
      } catch (error) {
        reject(error);
      }
    });
  }

  // ============== UTILITY FUNCTIONS ==============

  /**
   * Check if image uses floating point data
   * @returns {Promise<boolean>} - Floating point status
   */
  async isFloatingPoint() {
    return new Promise((resolve, reject) => {
      try {
        const result = this._wrapper.isFloatingPoint();
        resolve(result);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Check if image is Fuji rotated
   * @returns {Promise<boolean>} - Fuji rotation status
   */
  async isFujiRotated() {
    return new Promise((resolve, reject) => {
      try {
        const result = this._wrapper.isFujiRotated();
        resolve(result);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Check if image is sRAW format
   * @returns {Promise<boolean>} - sRAW status
   */
  async isSRAW() {
    return new Promise((resolve, reject) => {
      try {
        const result = this._wrapper.isSRAW();
        resolve(result);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Check if thumbnail is JPEG format
   * @returns {Promise<boolean>} - JPEG thumbnail status
   */
  async isJPEGThumb() {
    return new Promise((resolve, reject) => {
      try {
        const result = this._wrapper.isJPEGThumb();
        resolve(result);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Get error count during processing
   * @returns {Promise<number>} - Number of errors
   */
  async errorCount() {
    return new Promise((resolve, reject) => {
      try {
        const count = this._wrapper.errorCount();
        resolve(count);
      } catch (error) {
        reject(error);
      }
    });
  }

  // ============== EXTENDED UTILITY FUNCTIONS ==============

  /**
   * Check if image is Nikon sRAW format
   * @returns {Promise<boolean>} - True if Nikon sRAW
   */
  async isNikonSRAW() {
    return new Promise((resolve, reject) => {
      try {
        const result = this._wrapper.isNikonSRAW();
        resolve(result);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Check if image is Coolscan NEF format
   * @returns {Promise<boolean>} - True if Coolscan NEF
   */
  async isCoolscanNEF() {
    return new Promise((resolve, reject) => {
      try {
        const result = this._wrapper.isCoolscanNEF();
        resolve(result);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Check if image has floating point data
   * @returns {Promise<boolean>} - True if floating point data available
   */
  async haveFPData() {
    return new Promise((resolve, reject) => {
      try {
        const result = this._wrapper.haveFPData();
        resolve(result);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Get sRAW midpoint value
   * @returns {Promise<number>} - sRAW midpoint
   */
  async srawMidpoint() {
    return new Promise((resolve, reject) => {
      try {
        const result = this._wrapper.srawMidpoint();
        resolve(result);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Check if thumbnail is OK
   * @param {number} [maxSize=-1] - Maximum size limit
   * @returns {Promise<number>} - Thumbnail status
   */
  async thumbOK(maxSize = -1) {
    return new Promise((resolve, reject) => {
      try {
        const result = this._wrapper.thumbOK(maxSize);
        resolve(result);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Get unpacker function name
   * @returns {Promise<string>} - Name of the unpacker function
   */
  async unpackFunctionName() {
    return new Promise((resolve, reject) => {
      try {
        const result = this._wrapper.unpackFunctionName();
        resolve(result);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Get decoder information
   * @returns {Promise<Object>} - Decoder info with name and flags
   */
  async getDecoderInfo() {
    return new Promise((resolve, reject) => {
      try {
        const result = this._wrapper.getDecoderInfo();
        resolve(result);
      } catch (error) {
        reject(error);
      }
    });
  }

  // ============== ADVANCED PROCESSING ==============

  /**
   * Unpack RAW data (low-level operation)
   * @returns {Promise<boolean>} - Success status
   */
  async unpack() {
    return new Promise((resolve, reject) => {
      try {
        const result = this._wrapper.unpack();
        resolve(result);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Convert RAW to image with extended options
   * @param {boolean} [subtractBlack=true] - Whether to subtract black level
   * @returns {Promise<boolean>} - Success status
   */
  async raw2ImageEx(subtractBlack = true) {
    return new Promise((resolve, reject) => {
      try {
        const result = this._wrapper.raw2ImageEx(subtractBlack);
        resolve(result);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Adjust sizes for information only (no processing)
   * @returns {Promise<boolean>} - Success status
   */
  async adjustSizesInfoOnly() {
    return new Promise((resolve, reject) => {
      try {
        const result = this._wrapper.adjustSizesInfoOnly();
        resolve(result);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Free processed image data
   * @returns {Promise<boolean>} - Success status
   */
  async freeImage() {
    return new Promise((resolve, reject) => {
      try {
        const result = this._wrapper.freeImage();
        resolve(result);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Convert floating point to integer data
   * @param {number} [dmin=4096] - Minimum data value
   * @param {number} [dmax=32767] - Maximum data value
   * @param {number} [dtarget=16383] - Target value
   * @returns {Promise<boolean>} - Success status
   */
  async convertFloatToInt(dmin = 4096, dmax = 32767, dtarget = 16383) {
    return new Promise((resolve, reject) => {
      try {
        const result = this._wrapper.convertFloatToInt(dmin, dmax, dtarget);
        resolve(result);
      } catch (error) {
        reject(error);
      }
    });
  }

  // ============== MEMORY OPERATIONS EXTENDED ==============

  /**
   * Get memory image format information
   * @returns {Promise<Object>} - Format info with width, height, colors, bps
   */
  async getMemImageFormat() {
    return new Promise((resolve, reject) => {
      try {
        const result = this._wrapper.getMemImageFormat();
        resolve(result);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Copy memory image to buffer
   * @param {Buffer} buffer - Destination buffer
   * @param {number} stride - Row stride in bytes
   * @param {boolean} bgr - Whether to use BGR order
   * @returns {Promise<boolean>} - Success status
   */
  async copyMemImage(buffer, stride, bgr = false) {
    return new Promise((resolve, reject) => {
      try {
        const result = this._wrapper.copyMemImage(buffer, stride, bgr);
        resolve(result);
      } catch (error) {
        reject(error);
      }
    });
  }

  // ============== COLOR OPERATIONS ==============

  /**
   * Get color filter at specific position
   * @param {number} row - Row position
   * @param {number} col - Column position
   * @returns {Promise<number>} - Color value
   */
  async getColorAt(row, col) {
    return new Promise((resolve, reject) => {
      try {
        const result = this._wrapper.getColorAt(row, col);
        resolve(result);
      } catch (error) {
        reject(error);
      }
    });
  }

  // ============== CANCELLATION SUPPORT ==============

  /**
   * Set cancellation flag to stop processing
   * @returns {Promise<boolean>} - Success status
   */
  async setCancelFlag() {
    return new Promise((resolve, reject) => {
      try {
        const result = this._wrapper.setCancelFlag();
        resolve(result);
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Clear cancellation flag
   * @returns {Promise<boolean>} - Success status
   */
  async clearCancelFlag() {
    return new Promise((resolve, reject) => {
      try {
        const result = this._wrapper.clearCancelFlag();
        resolve(result);
      } catch (error) {
        reject(error);
      }
    });
  }

  // ============== VERSION INFORMATION (INSTANCE METHODS) ==============

  /**
   * Get LibRaw version string
   * @returns {string} - Version string
   */
  version() {
    return this._wrapper.version();
  }

  /**
   * Get LibRaw version as array [major, minor, patch]
   * @returns {number[]} - Version number array
   */
  versionNumber() {
    return this._wrapper.versionNumber();
  }

  // ============== STATIC METHODS ==============

  /**
   * Get LibRaw version
   * @returns {string} - Version string
   */
  static getVersion() {
    return librawAddon.LibRawWrapper.getVersion();
  }

  /**
   * Get LibRaw capabilities
   * @returns {number} - Capabilities flags
   */
  static getCapabilities() {
    return librawAddon.LibRawWrapper.getCapabilities();
  }

  /**
   * Get list of supported cameras
   * @returns {string[]} - Array of camera names
   */
  static getCameraList() {
    return librawAddon.LibRawWrapper.getCameraList();
  }

  /**
   * Get count of supported cameras
   * @returns {number} - Number of supported cameras
   */
  static getCameraCount() {
    return librawAddon.LibRawWrapper.getCameraCount();
  }
}

module.exports = LibRaw;

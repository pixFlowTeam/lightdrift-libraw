declare module 'libraw-node' {
  /**
   * LibRaw image metadata interface
   */
  export interface LibRawMetadata {
    /** Camera manufacturer (e.g., "Canon", "Nikon", "Sony") */
    make: string;
    
    /** Camera model (e.g., "EOS R5", "D850", "α7R IV") */
    model: string;
    
    /** ISO sensitivity value */
    iso: number;
    
    /** Aperture value (f-number) */
    aperture: number;
    
    /** Shutter speed in seconds */
    shutterSpeed: number;
    
    /** Focal length in millimeters */
    focalLength: number;
    
    /** Timestamp when the image was captured (Unix timestamp) */
    timestamp: number;
    
    /** Number of color channels/planes */
    colors: number;
    
    /** Color filter array pattern (hexadecimal) */
    filters: number;
    
    /** Camera description string */
    description?: string;
    
    /** Artist/photographer name */
    artist?: string;
    
    /** Copyright information */
    copyright?: string;
  }

  /**
   * Image dimensions interface
   */
  export interface LibRawImageSize {
    /** Image width in pixels */
    width: number;
    
    /** Image height in pixels */
    height: number;
  }

  /**
   * LibRaw processing options
   */
  export interface LibRawOptions {
    /** Use embedded color profile */
    useEmbeddedProfile?: boolean;
    
    /** Color space for output (0=raw, 1=sRGB, 2=Adobe RGB, 3=Wide Gamut, 4=ProPhoto, 5=XYZ) */
    outputColorSpace?: number;
    
    /** Gamma correction (typically 2.2 for sRGB) */
    gamma?: number;
    
    /** Use camera white balance */
    useCameraWhiteBalance?: boolean;
    
    /** Highlight recovery mode (0-9) */
    highlightMode?: number;
    
    /** Four-color RGB interpolation */
    fourColorRGB?: boolean;
  }

  /**
   * Main LibRaw processor class
   */
  export class LibRaw {
    /**
     * Create a new LibRaw processor instance
     */
    constructor();

    /**
     * Load a RAW image file for processing
     * @param filepath - Absolute path to the RAW image file
     * @returns Promise that resolves when file is loaded
     * @throws Error if file cannot be loaded or is not a supported format
     */
    loadFile(filepath: string): Promise<void>;

    /**
     * Extract metadata from the loaded RAW image
     * @returns Promise that resolves to image metadata
     * @throws Error if no file is loaded or metadata cannot be extracted
     */
    getMetadata(): Promise<LibRawMetadata>;

    /**
     * Get the dimensions of the loaded RAW image
     * @returns Promise that resolves to image dimensions
     * @throws Error if no file is loaded
     */
    getImageSize(): Promise<LibRawImageSize>;

    /**
     * Close the processor and free resources
     * @returns Promise that resolves when cleanup is complete
     */
    close(): Promise<void>;

    /**
     * Check if a file is currently loaded
     * @returns True if a file is loaded, false otherwise
     */
    isLoaded(): boolean;

    /**
     * Get the currently loaded file path
     * @returns The file path if loaded, null otherwise
     */
    getCurrentFile(): string | null;
  }

  /**
   * Utility functions
   */
  export namespace LibRawUtils {
    /**
     * Check if a file extension is supported by LibRaw
     * @param extension - File extension (with or without dot)
     * @returns True if the format is supported
     */
    export function isSupportedFormat(extension: string): boolean;

    /**
     * Get list of all supported file extensions
     * @returns Array of supported file extensions
     */
    export function getSupportedFormats(): string[];

    /**
     * Get camera manufacturer from file extension
     * @param extension - File extension
     * @returns Likely camera manufacturer or null if unknown
     */
    export function getManufacturerFromExtension(extension: string): string | null;
  }

  /**
   * Version information
   */
  export const version: {
    /** libraw-node package version */
    package: string;
    
    /** LibRaw library version */
    libraw: string;
    
    /** Node.js version used for compilation */
    node: string;
  };

  // Export as default class as well
  export default LibRaw;
}

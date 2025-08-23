/**
 * TypeScript definitions for LibRaw Node.js wrapper
 * Provides type-safe access to LibRaw functionality for RAW image processing
 */

declare module 'libraw' {
  export interface LibRawMetadata {
    /** Camera manufacturer */
    make?: string;
    /** Camera model */
    model?: string;
    /** Camera software/firmware */
    software?: string;
    /** Processed image width */
    width: number;
    /** Processed image height */
    height: number;
    /** RAW image width */
    rawWidth: number;
    /** RAW image height */
    rawHeight: number;
    /** Number of color channels */
    colors: number;
    /** Color filter array pattern */
    filters: number;
    /** ISO sensitivity */
    iso?: number;
    /** Shutter speed in seconds */
    shutterSpeed?: number;
    /** Aperture value (f-number) */
    aperture?: number;
    /** Focal length in mm */
    focalLength?: number;
    /** Timestamp of image capture */
    timestamp?: number;
  }

  export interface LibRawAdvancedMetadata {
    /** Normalized camera manufacturer */
    normalizedMake?: string;
    /** Normalized camera model */
    normalizedModel?: string;
    /** Number of RAW images in file */
    rawCount: number;
    /** DNG version number */
    dngVersion: number;
    /** Foveon sensor indicator */
    is_foveon: number;
    /** Color transformation matrix (4x3) */
    colorMatrix: number[][];
    /** Camera white balance multipliers */
    camMul: number[];
    /** Preprocessing multipliers */
    preMul: number[];
    /** Sensor black level */
    blackLevel: number;
    /** Maximum data value */
    dataMaximum: number;
    /** Sensor white level */
    whiteLevel: number;
  }

  export interface LibRawImageSize {
    /** Processed image width */
    width: number;
    /** Processed image height */
    height: number;
    /** RAW image width */
    rawWidth: number;
    /** RAW image height */
    rawHeight: number;
    /** Top margin in pixels */
    topMargin: number;
    /** Left margin in pixels */
    leftMargin: number;
    /** Internal width */
    iWidth: number;
    /** Internal height */
    iHeight: number;
  }

  export interface LibRawLensInfo {
    /** Lens name/model */
    lensName?: string;
    /** Lens manufacturer */
    lensMake?: string;
    /** Lens serial number */
    lensSerial?: string;
    /** Internal lens serial number */
    internalLensSerial?: string;
    /** Minimum focal length */
    minFocal?: number;
    /** Maximum focal length */
    maxFocal?: number;
    /** Maximum aperture at minimum focal length */
    maxAp4MinFocal?: number;
    /** Maximum aperture at maximum focal length */
    maxAp4MaxFocal?: number;
    /** EXIF maximum aperture */
    exifMaxAp?: number;
    /** Focal length in 35mm equivalent */
    focalLengthIn35mmFormat?: number;
  }

  export interface LibRawColorInfo {
    /** Number of color channels */
    colors: number;
    /** Color filter array pattern */
    filters: number;
    /** Sensor black level */
    blackLevel: number;
    /** Maximum data value */
    dataMaximum: number;
    /** Sensor white level */
    whiteLevel: number;
    /** Color profile length */
    profileLength?: number;
    /** RGB to camera space matrix (3x4) */
    rgbCam: number[][];
    /** Camera white balance multipliers */
    camMul: number[];
  }

  export interface LibRawOutputParams {
    /** Gamma correction curve [gamma, toe_slope] */
    gamma?: [number, number];
    /** Brightness adjustment (0.25-8.0) */
    bright?: number;
    /** Output color space (0=raw, 1=sRGB, 2=Adobe, 3=Wide, 4=ProPhoto, 5=XYZ, 6=ACES) */
    output_color?: number;
    /** Output bits per sample (8 or 16) */
    output_bps?: number;
    /** Manual white balance multipliers [R, G, B, G2] */
    user_mul?: [number, number, number, number];
    /** Disable automatic brightness adjustment */
    no_auto_bright?: boolean;
    /** Highlight recovery mode (0-9) */
    highlight?: number;
    /** Output TIFF format instead of PPM */
    output_tiff?: boolean;
  }

  export interface LibRawImageData {
    /** Image type (1=JPEG, 3=PPM/TIFF) */
    type: number;
    /** Image height in pixels */
    height: number;
    /** Image width in pixels */
    width: number;
    /** Number of color channels */
    colors: number;
    /** Bits per channel */
    bits: number;
    /** Total data size in bytes */
    dataSize: number;
    /** Raw image data buffer */
    data: Buffer;
  }

  export class LibRaw {
    constructor();

    // ============== FILE OPERATIONS ==============
    /**
     * Load RAW image from file
     * @param filename Path to RAW image file
     */
    loadFile(filename: string): Promise<boolean>;

    /**
     * Load RAW image from buffer
     * @param buffer Binary data buffer containing RAW image
     */
    loadBuffer(buffer: Buffer): Promise<boolean>;

    /**
     * Close current image and free resources
     */
    close(): Promise<boolean>;

    // ============== METADATA & INFORMATION ==============
    /**
     * Get basic image metadata and EXIF information
     */
    getMetadata(): Promise<LibRawMetadata>;

    /**
     * Get image size and margin information
     */
    getImageSize(): Promise<LibRawImageSize>;

    /**
     * Get advanced metadata including color matrices
     */
    getAdvancedMetadata(): Promise<LibRawAdvancedMetadata>;

    /**
     * Get lens information from EXIF data
     */
    getLensInfo(): Promise<LibRawLensInfo>;

    /**
     * Get color space and sensor information
     */
    getColorInfo(): Promise<LibRawColorInfo>;

    // ============== IMAGE PROCESSING ==============
    /**
     * Unpack thumbnail from RAW file
     */
    unpackThumbnail(): Promise<boolean>;

    /**
     * Process RAW image with current settings
     */
    processImage(): Promise<boolean>;

    /**
     * Subtract black level from image data
     */
    subtractBlack(): Promise<boolean>;

    /**
     * Convert RAW data to RGB image
     */
    raw2Image(): Promise<boolean>;

    /**
     * Adjust image maximum values
     */
    adjustMaximum(): Promise<boolean>;

    // ============== MEMORY IMAGE CREATION ==============
    /**
     * Create processed image in memory
     */
    createMemoryImage(): Promise<LibRawImageData>;

    /**
     * Create thumbnail image in memory
     */
    createMemoryThumbnail(): Promise<LibRawImageData>;

    // ============== FILE WRITERS ==============
    /**
     * Write processed image as PPM file
     * @param filename Output PPM file path
     */
    writePPM(filename: string): Promise<boolean>;

    /**
     * Write processed image as TIFF file
     * @param filename Output TIFF file path
     */
    writeTIFF(filename: string): Promise<boolean>;

    /**
     * Write thumbnail as JPEG file
     * @param filename Output JPEG file path
     */
    writeThumbnail(filename: string): Promise<boolean>;

    // ============== CONFIGURATION & SETTINGS ==============
    /**
     * Set output processing parameters
     * @param params Output parameters configuration
     */
    setOutputParams(params: LibRawOutputParams): Promise<boolean>;

    /**
     * Get current output processing parameters
     */
    getOutputParams(): Promise<LibRawOutputParams>;

    // ============== UTILITY FUNCTIONS ==============
    /**
     * Check if image uses floating point values
     */
    isFloatingPoint(): Promise<boolean>;

    /**
     * Check if image is from Fuji camera and rotated
     */
    isFujiRotated(): Promise<boolean>;

    /**
     * Check if image is sRAW format
     */
    isSRAW(): Promise<boolean>;

    /**
     * Check if file contains JPEG thumbnail
     */
    isJPEGThumb(): Promise<boolean>;

    /**
     * Get current error count
     */
    errorCount(): Promise<number>;

    // ============== STATIC METHODS ==============
    /**
     * Get LibRaw library version
     */
    static getVersion(): string;

    /**
     * Get LibRaw library capabilities bitmask
     */
    static getCapabilities(): number;

    /**
     * Get list of supported camera models
     */
    static getCameraList(): string[];

    /**
     * Get count of supported camera models
     */
    static getCameraCount(): number;
  }

  export = LibRaw;
}
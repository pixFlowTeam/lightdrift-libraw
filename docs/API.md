# API Documentation

## LibRaw Class

The main class for processing RAW image files.

### Constructor

```javascript
const LibRaw = require('libraw-node');
const processor = new LibRaw();
```

### Methods

#### loadFile(filepath)

Loads a RAW image file for processing.

**Parameters:**
- `filepath` (string): Absolute path to the RAW image file

**Returns:** `Promise<void>`

**Throws:** Error if file cannot be loaded or is not supported

**Example:**
```javascript
await processor.loadFile('/path/to/image.nef');
```

#### getMetadata()

Extracts metadata from the loaded RAW image.

**Returns:** `Promise<LibRawMetadata>`

**Example:**
```javascript
const metadata = await processor.getMetadata();
console.log(`Camera: ${metadata.make} ${metadata.model}`);
console.log(`ISO: ${metadata.iso}, f/${metadata.aperture}, 1/${Math.round(1/metadata.shutterSpeed)}s`);
```

#### getImageSize()

Gets the dimensions of the loaded RAW image.

**Returns:** `Promise<LibRawImageSize>`

**Example:**
```javascript
const size = await processor.getImageSize();
console.log(`Resolution: ${size.width}x${size.height}`);
```

#### close()

Closes the processor and frees resources.

**Returns:** `Promise<void>`

**Example:**
```javascript
await processor.close();
```

## Interfaces

### LibRawMetadata

```typescript
interface LibRawMetadata {
  make: string;           // Camera manufacturer
  model: string;          // Camera model  
  iso: number;            // ISO sensitivity
  aperture: number;       // Aperture f-number
  shutterSpeed: number;   // Shutter speed in seconds
  focalLength: number;    // Focal length in mm
  timestamp: number;      // Unix timestamp
  colors: number;         // Number of color channels
  filters: number;        // Color filter pattern
  description?: string;   // Camera description
  artist?: string;        // Photographer name
  copyright?: string;     // Copyright info
}
```

### LibRawImageSize

```typescript
interface LibRawImageSize {
  width: number;   // Image width in pixels
  height: number;  // Image height in pixels
}
```

## Supported Formats

| Format | Extension | Manufacturer | Description |
|--------|-----------|--------------|-------------|
| NEF    | .nef      | Nikon        | Nikon Electronic Format |
| CR2/CR3| .cr2/.cr3 | Canon        | Canon RAW version 2/3 |
| ARW    | .arw      | Sony         | Sony Alpha RAW |
| RAF    | .raf      | Fujifilm     | Fuji RAW Format |
| RW2    | .rw2      | Panasonic    | Panasonic RAW version 2 |
| DNG    | .dng      | Adobe/Various| Digital Negative (Adobe) |

## Error Handling

All methods return Promises and may throw errors. Always use try-catch or .catch():

```javascript
try {
  await processor.loadFile('image.nef');
  const metadata = await processor.getMetadata();
  console.log(metadata);
} catch (error) {
  console.error('Processing failed:', error.message);
} finally {
  await processor.close();
}
```

## Complete Example

```javascript
const LibRaw = require('libraw-node');

async function processRAWFile(filepath) {
  const processor = new LibRaw();
  
  try {
    // Load the RAW file
    await processor.loadFile(filepath);
    
    // Extract metadata
    const metadata = await processor.getMetadata();
    const size = await processor.getImageSize();
    
    // Display information
    console.log(`Camera: ${metadata.make} ${metadata.model}`);
    console.log(`Resolution: ${size.width}x${size.height}`);
    console.log(`Settings: ISO ${metadata.iso}, f/${metadata.aperture}, 1/${Math.round(1/metadata.shutterSpeed)}s`);
    
    return { metadata, size };
    
  } catch (error) {
    console.error('Error processing file:', error.message);
    throw error;
  } finally {
    // Always cleanup
    await processor.close();
  }
}

// Usage
processRAWFile('/path/to/image.nef')
  .then(result => console.log('Processing complete'))
  .catch(error => console.error('Failed:', error));
```

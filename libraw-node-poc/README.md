# LibRaw Node.js POC

A Proof of Concept Native Addon for using LibRaw in Node.js applications.

## Features

- ✅ Load RAW image files
- ✅ Extract comprehensive metadata (camera info, EXIF data, dimensions)
- ✅ Get image dimensions (both processed and raw)
- ✅ Promise-based async API
- ✅ Proper resource cleanup

## Prerequisites

- Node.js 14+
- Python 3.x
- Visual Studio Build Tools (Windows)
- LibRaw library (included)

## Installation

```bash
# Install dependencies
npm install

# Build the native addon
npm run build
```

## Usage

```javascript
const LibRaw = require("./lib/index");

async function processRawFile() {
  const processor = new LibRaw();

  try {
    // Load RAW file
    await processor.loadFile("photo.cr2");

    // Get metadata
    const metadata = await processor.getMetadata();
    console.log("Camera:", metadata.make, metadata.model);
    console.log("Size:", metadata.width, "x", metadata.height);
    console.log("ISO:", metadata.iso);

    // Cleanup
    await processor.close();
  } catch (error) {
    console.error("Error:", error.message);
  }
}
```

## Testing

```bash
# Quick functionality test
node test/quick-test.js

# Test with a RAW file
node test/test.js path/to/your/raw/file.cr2

# Run basic example
node examples/basic-example.js path/to/your/raw/file.cr2

# Test with included sample NEF files
node test/test-samples.js
node test/compare-samples.js

# Test with specific sample
node examples/basic-example.js ../sample-images/DSC_0006.NEF
```

## API Reference

### `new LibRaw()`

Creates a new LibRaw processor instance.

### `loadFile(filename)`

Loads a RAW file from the filesystem.

- `filename` (string): Path to the RAW file
- Returns: Promise<boolean>

### `getMetadata()`

Extracts metadata from the loaded RAW file.

- Returns: Promise<Object> with camera info, EXIF data, etc.

### `getImageSize()`

Gets image dimensions.

- Returns: Promise<Object> with width/height information

### `close()`

Closes the processor and frees resources.

- Returns: Promise<boolean>

## Supported Formats

LibRaw supports 100+ RAW formats including:

- Canon (.CR2, .CR3, .CRW)
- Nikon (.NEF, .NRW)
- Sony (.ARW, .SRF, .SR2)
- Adobe (.DNG)
- And many more...

## Limitations (POC)

- Read-only operations (no image processing/export yet)
- Synchronous operations (will be made async in full version)
- Basic error handling
- Windows-only build configuration

## Next Steps for Full Implementation

- Asynchronous processing with worker threads
- Image processing and export capabilities
- Cross-platform build support
- Advanced error handling and validation
- Streaming support for large files
- TypeScript definitions

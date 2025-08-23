# LibRaw Node.js Examples

This directory contains comprehensive examples demonstrating the full capabilities of the LibRaw Node.js wrapper.

## Examples Overview

### 📚 Basic Example (`basic-example.js`)

**Purpose**: Simple introduction to LibRaw usage

```bash
node basic-example.js sample.cr2
```

**Features**:

- Load RAW file
- Extract basic metadata
- Get image dimensions
- Basic error handling

### 🔬 Advanced Features (`advanced-features.js`)

**Purpose**: Demonstrates specific LibRaw capabilities

```bash
node advanced-features.js sample.cr2
```

**Features**:

- Comprehensive metadata extraction
- Lens information
- Color information and matrices
- Image analysis functions
- Processing configuration

### 🎯 Complete Example (`complete-example.js`)

**Purpose**: Full processing pipeline demonstration

```bash
node complete-example.js sample.cr2 ./output
```

**Features**:

- Complete 10-step processing pipeline
- All metadata types (basic, advanced, lens, color)
- Image processing with custom parameters
- Memory operations (image and thumbnail)
- Multiple output formats (PPM, TIFF, thumbnail)
- Buffer processing example
- Performance metrics
- Comprehensive error handling

### 📦 Batch Processing (`batch-example.js`)

**Purpose**: Process multiple files efficiently

```bash
node batch-example.js ./input-folder ./output-folder --formats tiff,thumbnail --concurrency 3
```

**Features**:

- Multi-file processing with concurrency control
- Progress tracking and statistics
- Configurable output formats
- Error handling per file
- Performance metrics and throughput analysis
- Camera and processing summaries

## Quick Start

1. **Install dependencies** (if not already done):

   ```bash
   npm install
   ```

2. **Run basic example**:

   ```bash
   node examples/basic-example.js path/to/your/image.cr2
   ```

3. **Try complete processing**:

   ```bash
   node examples/complete-example.js path/to/your/image.cr2 ./output
   ```

4. **Process multiple files**:
   ```bash
   node examples/batch-example.js ./raw-photos ./processed-output
   ```

## Supported File Formats

The examples work with all RAW formats supported by LibRaw, including:

- **Canon**: `.cr2`, `.cr3`, `.crw`
- **Nikon**: `.nef`, `.nrw`
- **Sony**: `.arw`, `.srf`, `.sr2`
- **Fujifilm**: `.raf`
- **Olympus**: `.orf`
- **Panasonic**: `.raw`, `.rw2`
- **Adobe**: `.dng`
- **Kodak**: `.dcr`, `.kdc`
- **And many more** (1000+ camera models supported)

## Example Outputs

### Basic Metadata

```
📷 Camera: Canon EOS R5
📐 Resolution: 8192×5464 (RAW: 8192×5464)
🎯 ISO: 100
🔍 Aperture: f/2.8
⏱️ Shutter: 1/125s
📏 Focal Length: 85mm
```

### Complete Processing Pipeline

```
🎯 Complete RAW Processing Pipeline
=====================================
📁 Input: sample.cr2
📂 Output Directory: ./output

📊 Library Information:
   LibRaw Version: 0.21.4
   Supported Cameras: 1181
   Capabilities: 0x7F

🔄 Loading RAW Image...
   ✅ Image loaded successfully

📋 Extracting Metadata...
   📷 Camera: Canon EOS R5
   📐 Resolution: 8192×5464 (RAW: 8192×5464)
   🎯 ISO: 100
   🔍 Aperture: f/2.8
   ⏱️ Shutter: 1/125s
   📏 Focal Length: 85mm
   📏 Margins: 96px×48px
   🔍 Lens: Canon RF 85mm F2 Macro IS STM
   🎨 Color Channels: 3
   ⚫ Black Level: 2048
   ⚪ White Level: 15000

🖼️ Processing Image...
   ✅ RAW to image conversion
   ✅ Maximum adjustment
   ✅ Image processing completed

💾 Memory Operations...
   📸 Memory Image: 8192×5464
   📊 Format: Type 3, 3 colors, 16-bit
   💽 Size: 268.4 MB

💾 File Outputs...
   ✅ PPM: 268.4 MB -> ./output/sample.ppm
   ✅ TIFF: 134.2 MB -> ./output/sample.tiff
   ✅ Thumbnail: 12.3 KB -> ./output/sample_thumbnail.jpg

⏱️ Performance Summary:
   🕐 Total Processing Time: 3450ms
   📊 Throughput: 15.2 MB/s
   ⚠️ Final Error Count: 0

🎉 Complete processing pipeline finished!
```

### Batch Processing

```
🚀 Starting batch processing: 12 files with concurrency 3

📦 Processing batch 1/4 (3 files)
  ✅ IMG_001.cr2
     📷 Canon EOS R5 | 📐 8192×5464
     🎯 ISO 100 | 🔍 f/2.8 | ⏱️ 1/125s
     💾 TIFF: 134.2MB, Thumb: 12.3KB | ⏱️ 3450ms

📊 Progress: 12/12 (100.0%) | ✅ 11 | ❌ 1

🎉 Batch Processing Complete!
===============================
📊 Files: 11/12 successful (91.7%)
⏱️ Total Time: 45.2s (avg: 3864ms per file)
💽 Total Input: 312.4 MB
📷 Cameras: Canon EOS R5, Nikon D850, Sony A7R IV
🚀 Throughput: 6.9 MB/s
```

## Advanced Configuration

### Processing Parameters

```javascript
const outputParams = {
  bright: 1.1, // Brightness adjustment (0.5-4.0)
  gamma: [2.2, 4.5], // Gamma correction [gamma, toe_slope]
  output_bps: 16, // Output bits per sample (8 or 16)
  no_auto_bright: false, // Disable auto brightness
  highlight: 1, // Highlight recovery mode (0-9)
  output_color: 1, // Color space (0=raw, 1=sRGB, 2=Adobe, etc.)
  user_mul: [1, 1, 1, 1], // Manual white balance multipliers
};
```

### Memory Management

```javascript
// Process large images efficiently
const imageData = await processor.createMemoryImage();
console.log(`Processing ${imageData.width}×${imageData.height} image`);
console.log(
  `Memory usage: ${(imageData.dataSize / 1024 / 1024).toFixed(1)} MB`
);

// Always cleanup
await processor.close();
```

## Troubleshooting

### Common Issues

1. **File not found errors**:

   - Ensure the RAW file path is correct
   - Check file permissions

2. **Memory errors with large files**:

   - Use batch processing with lower concurrency
   - Process files sequentially for very large RAW files

3. **Unsupported format**:
   - Check if your camera model is supported
   - Verify the file is not corrupted

### Performance Tips

1. **Batch Processing**:

   - Use concurrency of 2-4 for optimal performance
   - Monitor memory usage with very large files

2. **Output Formats**:

   - TIFF provides good compression for 16-bit data
   - PPM is fastest but largest file size
   - Thumbnails are great for quick previews

3. **Processing Parameters**:
   - 16-bit output preserves maximum quality
   - Adjust brightness and gamma for your display
   - Use highlight recovery for overexposed images

## Contributing

Feel free to add more examples or improve existing ones! Each example should:

1. Include comprehensive error handling
2. Provide clear console output
3. Demonstrate specific LibRaw features
4. Include performance metrics
5. Show proper resource cleanup

## License

These examples are provided under the same license as the main project.

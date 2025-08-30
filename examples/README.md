# LibRaw Node.js Examples

This directory contains comprehensive examples demonstrating the full capabilities of the LibRaw Node.js wrapper, including both traditional file-based operations and modern buffer-based streaming operations.

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

### 🚀 **NEW**: Stream/Buffer Operations (`stream-buffer-example.js`)

**Purpose**: Modern buffer-based API for web services and cloud applications

```bash
node stream-buffer-example.js sample.cr2 ./buffer-output
```

**Features**:

- Create image buffers directly in memory (no file I/O)
- Multiple format support: JPEG, PNG, WebP, AVIF, TIFF, PPM
- Perfect for web APIs and cloud storage
- Performance-optimized processing
- Practical usage examples for HTTP responses, cloud uploads
- Format efficiency comparison

### 📸 **NEW**: Simple Buffer API (`simple-buffer-example.js`)

**Purpose**: Quick start guide for the most common buffer operations

```bash
node simple-buffer-example.js sample.cr2
```

**Features**:

- Web-optimized JPEG buffer creation
- Thumbnail generation in memory
- High-quality image buffers
- Practical code examples for web development
- Performance benefits demonstration

### 🔄 **NEW**: API Comparison (`api-comparison-example.js`)

**Purpose**: Side-by-side comparison of file-based vs buffer-based approaches

```bash
node api-comparison-example.js sample.cr2 ./comparison-output
```

**Features**:

- Performance comparison between file and buffer APIs
- Use case recommendations
- Format efficiency analysis
- Code examples for different scenarios
- Best practices for each approach

## Buffer/Stream API Highlights

The new buffer-based API provides several advantages for modern applications:

### 🌐 Web Service Integration

```javascript
// Express.js endpoint
app.get("/convert/:id", async (req, res) => {
  const processor = new LibRaw();
  await processor.loadFile(`photos/${req.params.id}.raw`);
  const result = await processor.createJPEGBuffer({ quality: 85, width: 1920 });
  res.set("Content-Type", "image/jpeg");
  res.send(result.buffer);
});
```

### ☁️ Cloud Storage Upload

```javascript
// Upload directly to cloud storage
const result = await processor.createJPEGBuffer({ quality: 90 });
await bucket.file("processed.jpg").save(result.buffer, {
  metadata: { contentType: "image/jpeg" },
});
```

### 🔄 Multiple Format Generation

```javascript
// Create multiple formats in parallel
const [jpeg, webp, avif] = await Promise.all([
  processor.createJPEGBuffer({ quality: 85 }),
  processor.createWebPBuffer({ quality: 80 }),
  processor.createAVIFBuffer({ quality: 50 }),
]);
```

### 🚀 Available Buffer Methods

- `createJPEGBuffer(options)` - JPEG with quality, resizing, progressive options
- `createPNGBuffer(options)` - Lossless PNG with compression control
- `createWebPBuffer(options)` - Modern WebP format (smaller than JPEG)
- `createAVIFBuffer(options)` - Next-gen AVIF format (smallest file size)
- `createTIFFBuffer(options)` - High-quality TIFF with various compression options
- `createPPMBuffer()` - Raw PPM format for further processing
- `createThumbnailJPEGBuffer(options)` - Optimized thumbnail generation

## Quick Start

1. **Install dependencies** (if not already done):

   ```bash
   npm install
   ```

2. **Run basic example**:

   ```bash
   node examples/basic-example.js path/to/your/image.cr2
   ```

3. **Try buffer API (recommended for web apps)**:

   ```bash
   node examples/simple-buffer-example.js path/to/your/image.cr2
   ```

4. **Compare APIs**:

   ```bash
   node examples/api-comparison-example.js path/to/your/image.cr2
   ```

5. **Process multiple files**:
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

### Buffer API Example

````
📸 Simple Buffer API Example
============================
📁 Processing: sample.cr2

🔄 Loading RAW file...
⚙️ Processing image...

📸 Creating web-optimized JPEG buffer...
✅ Web JPEG created: 1,234,567 bytes
   Size: 1920x1280
   Compression: 15.2:1

🔍 Creating thumbnail buffer...
✅ Thumbnail created: 45,123 bytes
   Size: 300x200

🎨 Creating high-quality buffer...
✅ High-quality JPEG created: 8,765,432 bytes
   Size: 8192x5464

💡 Practical Usage Examples:

1️⃣ Save buffer to file:
```javascript
fs.writeFileSync("output.jpg", webJpeg.buffer);
````

2️⃣ Send via HTTP response:

```javascript
app.get("/image", async (req, res) => {
  const result = await processor.createJPEGBuffer({ quality: 85 });
  res.set("Content-Type", "image/jpeg");
  res.send(result.buffer);
});
```

⚡ Performance Benefits:
• No filesystem I/O - faster processing
• Direct memory operations
• Perfect for serverless/cloud functions
• Reduced disk space usage
• Better for concurrent processing

✅ Complete! Your images are ready to use in memory.

```

### Format Efficiency Comparison

```

# 🎨 Format Efficiency Comparison

📊 Formats ranked by file size (smallest to largest):
🏆 AVIF: 0.89 MB
🥈 WebP: 1.23 MB
🥉 JPEG: 1.85 MB
📊 PNG: 12.4 MB
📊 TIFF: 45.2 MB

````

## Advanced Configuration

### Buffer Creation Options

```javascript
// JPEG with resizing and quality control
const jpegResult = await processor.createJPEGBuffer({
    quality: 85,           // 1-100
    width: 1920,          // Resize to width
    progressive: true,     // Progressive loading
    colorSpace: 'srgb'    // Color space
});

// WebP with lossless option
const webpResult = await processor.createWebPBuffer({
    quality: 80,           // 1-100
    lossless: false,      // Lossy compression
    effort: 4             // Encoding effort 0-6
});

// AVIF for maximum compression
const avifResult = await processor.createAVIFBuffer({
    quality: 50,          // Lower quality for smaller files
    effort: 6             // Maximum effort for best compression
});
````

### Performance Optimization

```javascript
// Fast mode for real-time processing
const fastResult = await processor.createJPEGBuffer({
  quality: 80,
  fastMode: true, // Optimize for speed over quality
  effort: 1, // Minimum encoding effort
});

// High-quality mode for archival
const archiveResult = await processor.createTIFFBuffer({
  compression: "lzw", // Lossless compression
  pyramid: true, // Multi-resolution TIFF
});
```

## When to Use Which API

### 📁 Use File-based API when:

- Building traditional desktop applications
- Need permanent file storage
- Working with very large images (memory constraints)
- Integrating with file-based workflows
- Creating archives or backups

### 🚀 Use Buffer-based API when:

- Building web services and REST APIs
- Uploading to cloud storage (AWS S3, Google Cloud, etc.)
- Creating real-time image processing pipelines
- Developing serverless/lambda functions
- Streaming image data over networks
- Building mobile app backends
- Memory-to-memory processing workflows

## Troubleshooting

### Common Issues

1. **File not found errors**:

   - Ensure the RAW file path is correct
   - Check file permissions

2. **Memory errors with large files**:

   - Use batch processing with lower concurrency
   - Process files sequentially for very large RAW files
   - Consider using file-based API for extremely large images

3. **Buffer size errors**:

   - Monitor memory usage when creating multiple large buffers
   - Process images one at a time if memory is limited

4. **Sharp installation issues**:
   - Ensure Sharp is properly installed: `npm install sharp`
   - May require native compilation on some systems

### Performance Tips

1. **Buffer Processing**:

   - Reuse LibRaw instances when processing multiple images
   - Use appropriate quality settings for your use case
   - Consider image resizing to reduce buffer sizes

2. **Format Selection**:

   - AVIF: Best compression, slower encoding
   - WebP: Good compression, fast encoding
   - JPEG: Universal compatibility, fast encoding
   - PNG: Lossless, large file size
   - TIFF: Professional workflows, various compression options

3. **Memory Management**:
   - Always call `processor.close()` when done
   - Process large batches sequentially to avoid memory issues
   - Monitor buffer sizes for cloud function limits

## Contributing

Feel free to add more examples or improve existing ones! Each example should:

1. Include comprehensive error handling
2. Provide clear console output
3. Demonstrate specific LibRaw features
4. Include performance metrics
5. Show proper resource cleanup
6. Document both file and buffer approaches where applicable

## License

These examples are provided under the same license as the main project.

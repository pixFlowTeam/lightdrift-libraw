# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2025-08-23

### Added
- Initial release of libraw-node
- Native Node.js addon for LibRaw 0.21.4
- Support for 6 major RAW formats:
  - Canon CR2/CR3
  - Nikon NEF
  - Sony ARW
  - Fujifilm RAF
  - Panasonic RW2
  - Adobe DNG (Leica and others)
- Comprehensive metadata extraction:
  - Camera make and model
  - ISO, aperture, shutter speed, focal length
  - Image dimensions and resolution
  - Capture timestamp
  - Color profile information
- Promise-based JavaScript API
- TypeScript definitions included
- Cross-platform support (Windows, macOS, Linux)
- Comprehensive test suite with real sample images
- Performance benchmarking tools
- Detailed documentation and examples

### Features
- **Fast Processing**: 115+ MB/s average throughput
- **Format Coverage**: 100+ RAW formats supported via LibRaw
- **Metadata Rich**: Extracts 12+ metadata fields
- **Memory Efficient**: Automatic resource cleanup
- **Production Ready**: Comprehensive error handling
- **Developer Friendly**: Full TypeScript support

### Performance
- Canon CR3: ~47 MB/s average
- Nikon NEF: ~30 MB/s average  
- Fujifilm RAF: ~261 MB/s average
- Sony ARW: ~339 MB/s average
- Panasonic RW2: ~66 MB/s average
- Adobe DNG: ~32 MB/s average

### Tested Cameras
- Canon EOS R5
- Nikon D5600, D500
- Fujifilm X-M5
- Sony ILCE-7RM5
- Panasonic DC-S1M2
- Leica Q3 43

### Documentation
- Complete API documentation
- Usage examples for common scenarios
- Supported formats reference
- Performance optimization guide
- LibRaw upgrade instructions

## [Unreleased]

### Planned Features
- Full RAW image decoding to RGB
- Thumbnail extraction
- Additional metadata fields
- Batch processing utilities
- Image preprocessing options
- Color space conversion
- Histogram generation

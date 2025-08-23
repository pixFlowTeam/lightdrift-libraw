# LibRaw Test Suite

Comprehensive testing framework for the LibRaw Node.js wrapper.

## Test Overview

The test suite includes comprehensive coverage of all LibRaw functionality:

### 🧪 Test Categories

1. **Static Methods** (`static-methods.test.js`)

   - Library version and capabilities
   - Camera list and count validation
   - Capability flags analysis

2. **Error Handling** (`error-handling.test.js`)

   - Invalid file loading scenarios
   - Parameter validation
   - Memory management edge cases
   - Graceful error recovery

3. **Buffer Operations** (`buffer-operations.test.js`)

   - File vs buffer loading comparison
   - Memory management stress testing
   - Buffer size and content validation
   - Corner case handling

4. **Configuration** (`configuration.test.js`)

   - Output parameter setting/getting
   - Parameter validation and ranges
   - Real-world configuration scenarios

5. **Comprehensive** (`comprehensive.test.js`)
   - End-to-end processing pipeline
   - All API methods demonstration
   - Real file processing

## Quick Start

### Run All Tests

```bash
npm test
```

### Run Specific Test Suites

```bash
# Quick smoke test
npm run test:quick

# All comprehensive tests
npm run test:all

# Individual test categories
npm run test:static
npm run test:errors
npm run test:buffers
npm run test:config

# Legacy comprehensive test
npm run test:comprehensive
```

### Command Line Options

```bash
# Run specific test suites
node test/index.js [command]

# Available commands:
node test/index.js quick     # Quick functionality check
node test/index.js smoke     # Basic smoke test
node test/index.js static    # Static methods only
node test/index.js errors    # Error handling only
node test/index.js buffers   # Buffer operations only
node test/index.js config    # Configuration only
node test/index.js full      # All tests (default)
```

## Test Requirements

### Basic Requirements

- Node.js 14+
- LibRaw compiled and linked
- No sample files required for basic tests

### Enhanced Testing (Optional)

- RAW sample files in `sample-images/` directory
- Supported formats: CR2, CR3, NEF, ARW, RAF, RW2, DNG
- At least 1MB free disk space for output files

### Sample File Structure

```
project-root/
├── sample-images/
│   ├── sample.cr2      # Canon RAW
│   ├── sample.nef      # Nikon RAW
│   ├── sample.arw      # Sony RAW
│   └── sample.dng      # Adobe DNG
└── test/
    └── output/         # Generated test outputs
```

## Test Results

### Expected Outputs

**Quick Test:**

```
⚡ LibRaw Quick Test
==============================
📊 Library Info:
   Version: 0.21.4
   Cameras: 1181
🏗️ Constructor Test:
   ✅ LibRaw instance created
   ✅ Instance closed

🎉 Quick test passed!
```

**Comprehensive Test Summary:**

```
📊 TEST SUITE SUMMARY
============================================================
Total Test Suites: 4
✅ Passed: 4
❌ Failed: 0
Success Rate: 100.0%
Total Duration: 12.34s
Finished at: 2025-08-23T10:30:00.000Z

🎉 ALL TESTS PASSED! 🎉
LibRaw wrapper is working correctly.
```

### Performance Benchmarks

Typical performance on modern hardware:

- **Static Methods**: <100ms
- **Error Handling**: 500-1000ms
- **Buffer Operations**: 1-5s (depending on available memory)
- **Configuration**: 200-500ms
- **Comprehensive**: 5-15s (with real RAW files)

## Test Data

### Synthetic Test Data

Tests automatically generate synthetic data when real RAW files are not available:

- Empty buffers
- Pattern-filled buffers
- Large memory allocations
- Invalid file formats

### Real RAW File Testing

When sample files are available, tests perform:

- Actual RAW processing
- Metadata extraction validation
- Image processing pipeline
- Output file generation
- Performance measurement

## Troubleshooting

### Common Issues

1. **"No file loaded" errors**

   - Expected behavior for methods requiring loaded files
   - Tests validate proper error handling

2. **Missing sample files**

   - Tests gracefully handle missing sample files
   - Synthetic data used as fallback

3. **Memory allocation errors**

   - Large buffer tests may fail on low-memory systems
   - Tests include memory stress scenarios

4. **LibRaw compilation issues**
   - Ensure LibRaw library is properly compiled
   - Check `npm run build` completes successfully

### Debug Mode

Add debug output to tests:

```javascript
// Set environment variable for verbose output
process.env.DEBUG = "1";
```

### Performance Issues

If tests run slowly:

```bash
# Run lighter test suite
npm run test:quick

# Skip memory-intensive tests
npm run test:static
npm run test:config
```

## Contributing Tests

### Adding New Tests

1. Create test file in `test/` directory
2. Follow naming convention: `feature-name.test.js`
3. Export test functions for use in test runner
4. Add test to `test/index.js` main runner

### Test Structure Template

```javascript
async function testFeatureName() {
  console.log("🔧 Feature Name Test");
  console.log("=".repeat(40));

  try {
    // Test implementation
    console.log("   ✅ Test passed");
  } catch (error) {
    console.log(`   ❌ Test failed: ${error.message}`);
  }
}

module.exports = { testFeatureName };
```

### Test Guidelines

1. **Error Handling**: Always test both success and failure cases
2. **Resource Cleanup**: Ensure proper cleanup with `finally` blocks
3. **Clear Output**: Use emoji and formatting for readable results
4. **Performance**: Include timing for performance-sensitive tests
5. **Validation**: Verify results, don't just check for absence of errors

## Continuous Integration

### GitHub Actions Integration

```yaml
- name: Run LibRaw Tests
  run: |
    npm install
    npm run test:smoke
    npm run test:all
```

### Test Coverage

The test suite covers:

- ✅ All public API methods (30+ functions)
- ✅ Error conditions and edge cases
- ✅ Memory management and cleanup
- ✅ Parameter validation
- ✅ Cross-platform compatibility
- ✅ Performance characteristics

## License

Tests are provided under the same MIT license as the main project.

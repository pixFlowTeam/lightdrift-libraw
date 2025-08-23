/**
 * Thumbnail Extraction Test Suite
 * Comprehensive testing of thumbnail operations
 */

const LibRaw = require("../lib/index");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

class ThumbnailExtractionTests {
  constructor() {
    this.results = {
      extraction: {},
      memory: {},
      formats: {},
      validation: {},
    };
    this.testFiles = [];
    this.outputDir = path.join(__dirname, "thumbnail-output");
  }

  log(message, type = "info") {
    const icons = {
      info: "ℹ️",
      success: "✅",
      warning: "⚠️",
      error: "❌",
      test: "🧪",
      data: "📊",
    };
    console.log(`${icons[type]} ${message}`);
  }

  findTestFiles() {
    const sampleDir = path.join(__dirname, "..", "sample-images");
    if (!fs.existsSync(sampleDir)) {
      this.log("Sample images directory not found", "warning");
      return [];
    }

    const files = fs.readdirSync(sampleDir);
    const rawExtensions = [
      ".cr2",
      ".cr3",
      ".nef",
      ".arw",
      ".dng",
      ".raf",
      ".rw2",
    ];

    return files
      .filter((file) =>
        rawExtensions.some((ext) => file.toLowerCase().endsWith(ext))
      )
      .map((file) => path.join(sampleDir, file))
      .slice(0, 5); // Test with up to 5 files
  }

  ensureOutputDir() {
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  async testThumbnailDetection() {
    console.log("\n🔍 Testing Thumbnail Detection");
    console.log("==============================");

    if (this.testFiles.length === 0) {
      this.log("No test files available for thumbnail detection", "warning");
      return false;
    }

    let totalTests = 0;
    let passedTests = 0;
    const detectionResults = [];

    for (const testFile of this.testFiles) {
      const processor = new LibRaw();
      totalTests++;

      try {
        const fileName = path.basename(testFile);
        this.log(`Detecting thumbnails in: ${fileName}`, "test");

        await processor.loadFile(testFile);

        // Check if thumbnail exists
        const thumbOK = await processor.thumbOK();
        this.log(
          `  Thumbnail available: ${thumbOK ? "Yes" : "No"}`,
          thumbOK ? "success" : "warning"
        );

        if (thumbOK) {
          // Get thumbnail list
          try {
            const thumbList = await processor.getThumbnailList();
            if (thumbList && thumbList.length > 0) {
              this.log(`  Found ${thumbList.length} thumbnail(s):`, "data");
              thumbList.forEach((thumb, index) => {
                this.log(
                  `    [${index}] ${thumb.width}x${thumb.height}, format: ${thumb.format}, size: ${thumb.size} bytes`,
                  "data"
                );
              });
              passedTests++;
            } else {
              this.log(`  No thumbnail list available`, "warning");
            }
          } catch (listError) {
            this.log(`  Thumbnail list error: ${listError.message}`, "warning");
          }

          detectionResults.push({
            file: fileName,
            hasThumb: true,
            processor: processor,
          });
        } else {
          detectionResults.push({
            file: fileName,
            hasThumb: false,
            processor: processor,
          });
        }
      } catch (error) {
        this.log(`  Detection failed: ${error.message}`, "error");
        await processor.close();
      }
    }

    // Clean up processors for files without thumbnails
    for (const result of detectionResults) {
      if (!result.hasThumb) {
        await result.processor.close();
      }
    }

    this.results.extraction = {
      tested: totalTests,
      passed: passedTests,
      successRate:
        totalTests > 0 ? ((passedTests / totalTests) * 100).toFixed(1) : 0,
      withThumbnails: detectionResults.filter((r) => r.hasThumb).length,
    };

    this.log(
      `Thumbnail detection results: ${passedTests}/${totalTests} passed (${this.results.extraction.successRate}%)`,
      passedTests > 0 ? "success" : "warning"
    );

    return { success: passedTests > 0, results: detectionResults };
  }

  async testThumbnailExtraction(detectionResults) {
    console.log("\n📤 Testing Thumbnail Extraction");
    console.log("===============================");

    const filesWithThumbs = detectionResults.filter((r) => r.hasThumb);

    if (filesWithThumbs.length === 0) {
      this.log(
        "No files with thumbnails available for extraction testing",
        "warning"
      );
      return false;
    }

    this.ensureOutputDir();

    let totalTests = 0;
    let passedTests = 0;

    for (const result of filesWithThumbs) {
      const processor = result.processor;
      const fileName = path.basename(result.file, path.extname(result.file));

      try {
        totalTests++;
        this.log(`Extracting thumbnail from: ${result.file}`, "test");

        // Unpack thumbnail
        const startTime = Date.now();
        const unpacked = await processor.unpackThumbnail();
        const unpackTime = Date.now() - startTime;

        if (unpacked) {
          this.log(`  ✓ Thumbnail unpacked in ${unpackTime}ms`, "success");

          // Test memory thumbnail creation
          const memThumb = await processor.createMemoryThumbnail();
          if (memThumb && memThumb.data) {
            this.log(
              `  ✓ Memory thumbnail: ${memThumb.width}x${memThumb.height}, ${memThumb.dataSize} bytes`,
              "success"
            );

            // Validate thumbnail data
            const validation = this.validateThumbnailData(memThumb);
            this.log(
              `  Validation: ${validation.valid ? "Passed" : "Failed"} - ${
                validation.message
              }`,
              validation.valid ? "success" : "warning"
            );

            // Test file writing
            const outputPath = path.join(
              this.outputDir,
              `${fileName}_thumb.jpg`
            );

            try {
              await processor.writeThumbnail(outputPath);

              if (fs.existsSync(outputPath)) {
                const stats = fs.statSync(outputPath);
                this.log(
                  `  ✓ Thumbnail file written: ${stats.size} bytes`,
                  "success"
                );

                // Verify file format
                const formatValidation = this.validateThumbnailFile(outputPath);
                this.log(
                  `  File format: ${formatValidation.format} (${
                    formatValidation.valid ? "Valid" : "Invalid"
                  })`,
                  formatValidation.valid ? "success" : "warning"
                );

                if (validation.valid && formatValidation.valid) {
                  passedTests++;
                }
              } else {
                this.log(`  ✗ Thumbnail file not created`, "error");
              }
            } catch (writeError) {
              this.log(
                `  ✗ Thumbnail write failed: ${writeError.message}`,
                "error"
              );
            }
          } else {
            this.log(`  ✗ Memory thumbnail creation failed`, "error");
          }
        } else {
          this.log(`  ✗ Thumbnail unpack failed`, "error");
        }

        await processor.close();
      } catch (error) {
        this.log(`  ✗ Extraction failed: ${error.message}`, "error");
        await processor.close();
      }
    }

    this.results.memory = {
      tested: totalTests,
      passed: passedTests,
      successRate:
        totalTests > 0 ? ((passedTests / totalTests) * 100).toFixed(1) : 0,
    };

    this.log(
      `Thumbnail extraction results: ${passedTests}/${totalTests} passed (${this.results.memory.successRate}%)`,
      passedTests > 0 ? "success" : "warning"
    );

    return passedTests > 0;
  }

  validateThumbnailData(thumbnail) {
    try {
      // Check basic properties
      if (!thumbnail.data || thumbnail.data.length === 0) {
        return { valid: false, message: "No thumbnail data" };
      }

      if (thumbnail.width <= 0 || thumbnail.height <= 0) {
        return { valid: false, message: "Invalid dimensions" };
      }

      if (thumbnail.dataSize !== thumbnail.data.length) {
        return {
          valid: false,
          message: `Size mismatch: ${thumbnail.dataSize} vs ${thumbnail.data.length}`,
        };
      }

      // Check for JPEG signature if format indicates JPEG
      const header = thumbnail.data.slice(0, 10);
      const hasJPEGHeader = header[0] === 0xff && header[1] === 0xd8;

      if (hasJPEGHeader) {
        return {
          valid: true,
          message: `JPEG thumbnail ${thumbnail.width}x${thumbnail.height}`,
        };
      }

      // Check for other formats or raw data
      const isNonZero = header.some((byte) => byte !== 0);
      if (isNonZero) {
        return {
          valid: true,
          message: `Raw thumbnail data ${thumbnail.width}x${thumbnail.height}`,
        };
      }

      return { valid: false, message: "Thumbnail data appears to be empty" };
    } catch (error) {
      return { valid: false, message: `Validation error: ${error.message}` };
    }
  }

  validateThumbnailFile(filePath) {
    try {
      const buffer = fs.readFileSync(filePath, { start: 0, end: 10 });

      // Check JPEG signature
      if (buffer[0] === 0xff && buffer[1] === 0xd8) {
        // Look for JFIF or Exif markers
        const restBuffer = fs.readFileSync(filePath, { start: 2, end: 20 });
        const hasJFIF = restBuffer.includes(Buffer.from("JFIF"));
        const hasExif = restBuffer.includes(Buffer.from("Exif"));

        if (hasJFIF || hasExif) {
          return { valid: true, format: "JPEG with metadata" };
        } else {
          return { valid: true, format: "JPEG" };
        }
      }

      // Check TIFF signature
      const tiffMagic = buffer.toString("hex", 0, 4);
      if (tiffMagic === "49492a00" || tiffMagic === "4d4d002a") {
        return { valid: true, format: "TIFF" };
      }

      // Check PNG signature
      if (buffer.toString("hex", 0, 8) === "89504e470d0a1a0a") {
        return { valid: true, format: "PNG" };
      }

      return { valid: false, format: "Unknown format" };
    } catch (error) {
      return { valid: false, format: `Validation error: ${error.message}` };
    }
  }

  async testThumbnailFormats() {
    console.log("\n🎨 Testing Thumbnail Format Variations");
    console.log("======================================");

    if (this.testFiles.length === 0) {
      this.log("No test files available for format testing", "warning");
      return false;
    }

    let totalTests = 0;
    let passedTests = 0;
    const formatStats = {
      jpeg: 0,
      tiff: 0,
      raw: 0,
      unknown: 0,
    };

    for (const testFile of this.testFiles) {
      const processor = new LibRaw();

      try {
        totalTests++;
        const fileName = path.basename(testFile);
        this.log(`Analyzing thumbnail format: ${fileName}`, "test");

        await processor.loadFile(testFile);

        const thumbOK = await processor.thumbOK();
        if (!thumbOK) {
          this.log(`  No thumbnail available`, "warning");
          await processor.close();
          continue;
        }

        const unpacked = await processor.unpackThumbnail();
        if (unpacked) {
          const memThumb = await processor.createMemoryThumbnail();

          if (memThumb && memThumb.data && memThumb.data.length > 0) {
            const format = this.detectThumbnailFormat(memThumb.data);
            this.log(
              `  ✓ Format: ${format.name} (${format.confidence}% confidence)`,
              "success"
            );

            formatStats[format.type]++;
            passedTests++;

            // Additional format-specific tests
            if (format.type === "jpeg") {
              const jpegInfo = this.analyzeJPEGThumbnail(memThumb.data);
              this.log(
                `    JPEG quality: ~${jpegInfo.quality}%, subsampling: ${jpegInfo.subsampling}`,
                "data"
              );
            }
          } else {
            this.log(`  ✗ No thumbnail data available`, "error");
          }
        } else {
          this.log(`  ✗ Thumbnail unpack failed`, "error");
        }

        await processor.close();
      } catch (error) {
        this.log(`  ✗ Format analysis failed: ${error.message}`, "error");
        await processor.close();
      }
    }

    this.results.formats = {
      tested: totalTests,
      passed: passedTests,
      successRate:
        totalTests > 0 ? ((passedTests / totalTests) * 100).toFixed(1) : 0,
      formatStats,
    };

    this.log(
      `Format analysis results: ${passedTests}/${totalTests} passed (${this.results.formats.successRate}%)`,
      passedTests > 0 ? "success" : "warning"
    );

    this.log(`Format distribution:`, "data");
    Object.entries(formatStats).forEach(([format, count]) => {
      if (count > 0) {
        this.log(`  ${format.toUpperCase()}: ${count} files`, "data");
      }
    });

    return passedTests > 0;
  }

  detectThumbnailFormat(data) {
    // JPEG detection
    if (data[0] === 0xff && data[1] === 0xd8) {
      return { name: "JPEG", type: "jpeg", confidence: 100 };
    }

    // TIFF detection
    const tiffMagic = data.slice(0, 4);
    if (
      (tiffMagic[0] === 0x49 &&
        tiffMagic[1] === 0x49 &&
        tiffMagic[2] === 0x2a &&
        tiffMagic[3] === 0x00) ||
      (tiffMagic[0] === 0x4d &&
        tiffMagic[1] === 0x4d &&
        tiffMagic[2] === 0x00 &&
        tiffMagic[3] === 0x2a)
    ) {
      return { name: "TIFF", type: "tiff", confidence: 100 };
    }

    // PNG detection
    const pngSignature = [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a];
    if (data.length >= 8 && pngSignature.every((byte, i) => data[i] === byte)) {
      return { name: "PNG", type: "png", confidence: 100 };
    }

    // Raw RGB data detection (heuristic)
    const nonZeroBytes = data
      .slice(0, Math.min(100, data.length))
      .filter((b) => b !== 0).length;
    if (nonZeroBytes > 10) {
      return { name: "Raw RGB Data", type: "raw", confidence: 70 };
    }

    return { name: "Unknown Format", type: "unknown", confidence: 0 };
  }

  analyzeJPEGThumbnail(data) {
    try {
      // Look for quantization tables to estimate quality
      let quality = 75; // Default assumption
      let subsampling = "Unknown";

      // Find SOF (Start of Frame) marker
      for (let i = 0; i < data.length - 10; i++) {
        if (data[i] === 0xff && data[i + 1] === 0xc0) {
          // Found SOF0 marker, read sampling factors
          const components = data[i + 9];
          if (components === 3) {
            const y_sampling = data[i + 11];
            const cb_sampling = data[i + 14];
            const cr_sampling = data[i + 17];

            if (
              y_sampling === 0x22 &&
              cb_sampling === 0x11 &&
              cr_sampling === 0x11
            ) {
              subsampling = "4:2:0";
            } else if (
              y_sampling === 0x21 &&
              cb_sampling === 0x11 &&
              cr_sampling === 0x11
            ) {
              subsampling = "4:2:2";
            } else if (
              y_sampling === 0x11 &&
              cb_sampling === 0x11 &&
              cr_sampling === 0x11
            ) {
              subsampling = "4:4:4";
            }
          }
          break;
        }
      }

      return { quality, subsampling };
    } catch (error) {
      return { quality: "Unknown", subsampling: "Unknown" };
    }
  }

  async testThumbnailPerformance() {
    console.log("\n⚡ Testing Thumbnail Performance");
    console.log("===============================");

    if (this.testFiles.length === 0) {
      this.log("No test files available for performance testing", "warning");
      return false;
    }

    const performanceResults = [];
    let totalTime = 0;
    let successfulTests = 0;

    for (const testFile of this.testFiles) {
      const processor = new LibRaw();

      try {
        const fileName = path.basename(testFile);
        this.log(`Performance test: ${fileName}`, "test");

        const startTime = Date.now();

        await processor.loadFile(testFile);
        const loadTime = Date.now() - startTime;

        const thumbOK = await processor.thumbOK();
        if (!thumbOK) {
          this.log(`  No thumbnail - skipping`, "warning");
          await processor.close();
          continue;
        }

        const unpackStart = Date.now();
        const unpacked = await processor.unpackThumbnail();
        const unpackTime = Date.now() - unpackStart;

        if (unpacked) {
          const memStart = Date.now();
          const memThumb = await processor.createMemoryThumbnail();
          const memTime = Date.now() - memStart;

          const totalTestTime = Date.now() - startTime;
          totalTime += totalTestTime;
          successfulTests++;

          const result = {
            file: fileName,
            loadTime,
            unpackTime,
            memTime,
            totalTime: totalTestTime,
            thumbSize: memThumb ? memThumb.dataSize : 0,
            thumbDimensions: memThumb
              ? `${memThumb.width}x${memThumb.height}`
              : "N/A",
          };

          performanceResults.push(result);

          this.log(
            `  ✓ Total: ${totalTestTime}ms (load: ${loadTime}ms, unpack: ${unpackTime}ms, memory: ${memTime}ms)`,
            "success"
          );
          this.log(
            `    Thumbnail: ${result.thumbDimensions}, ${result.thumbSize} bytes`,
            "data"
          );
        }

        await processor.close();
      } catch (error) {
        this.log(`  ✗ Performance test failed: ${error.message}`, "error");
        await processor.close();
      }
    }

    if (successfulTests > 0) {
      const avgTime = Math.round(totalTime / successfulTests);
      const avgThroughput =
        (performanceResults.reduce((sum, r) => sum + r.thumbSize, 0) /
          totalTime) *
        1000; // bytes per second

      this.log(`\nPerformance Summary:`, "data");
      this.log(`  Average processing time: ${avgTime}ms`, "data");
      this.log(
        `  Thumbnail throughput: ${(avgThroughput / 1024).toFixed(2)} KB/s`,
        "data"
      );
      this.log(
        `  Successful extractions: ${successfulTests}/${this.testFiles.length}`,
        "data"
      );
    }

    return successfulTests > 0;
  }

  cleanupOutputFiles() {
    try {
      if (fs.existsSync(this.outputDir)) {
        const files = fs.readdirSync(this.outputDir);
        files.forEach((file) => {
          const filePath = path.join(this.outputDir, file);
          fs.unlinkSync(filePath);
        });
        fs.rmdirSync(this.outputDir);
        this.log("Test output files cleaned up", "info");
      }
    } catch (error) {
      this.log(`Cleanup failed: ${error.message}`, "warning");
    }
  }

  printSummary() {
    console.log("\n📊 Thumbnail Extraction Test Summary");
    console.log("====================================");

    const categories = [
      { name: "Thumbnail Detection", result: this.results.extraction },
      { name: "Memory Operations", result: this.results.memory },
      { name: "Format Analysis", result: this.results.formats },
    ];

    let totalTests = 0;
    let passedTests = 0;

    categories.forEach((category) => {
      if (category.result.tested !== undefined) {
        totalTests += category.result.tested;
        passedTests += category.result.passed;
        this.log(
          `${category.name}: ${category.result.passed}/${category.result.tested} (${category.result.successRate}%)`,
          category.result.passed > 0 ? "success" : "warning"
        );
      }
    });

    if (this.results.extraction.withThumbnails !== undefined) {
      this.log(
        `Files with thumbnails: ${this.results.extraction.withThumbnails}/${this.testFiles.length}`,
        "data"
      );
    }

    if (this.results.formats.formatStats) {
      this.log(`Format distribution:`, "data");
      Object.entries(this.results.formats.formatStats).forEach(
        ([format, count]) => {
          if (count > 0) {
            this.log(`  ${format.toUpperCase()}: ${count}`, "data");
          }
        }
      );
    }

    if (totalTests > 0) {
      const overallSuccessRate = ((passedTests / totalTests) * 100).toFixed(1);
      this.log(
        `\nOverall Success Rate: ${passedTests}/${totalTests} (${overallSuccessRate}%)`,
        passedTests === totalTests ? "success" : "warning"
      );
    }
  }

  async runAllTests() {
    console.log("🧪 LibRaw Thumbnail Extraction Test Suite");
    console.log("==========================================");

    // Find test files
    this.testFiles = this.findTestFiles();

    if (this.testFiles.length === 0) {
      this.log("No RAW test files found in sample-images directory", "error");
      this.log(
        "Please add some RAW files (CR2, CR3, NEF, ARW, DNG, RAF, RW2) to test/",
        "info"
      );
      return false;
    }

    this.log(`Found ${this.testFiles.length} test files`, "success");

    // Run all test categories
    const results = [];

    const detectionResult = await this.testThumbnailDetection();
    results.push(detectionResult.success);

    if (detectionResult.success) {
      results.push(await this.testThumbnailExtraction(detectionResult.results));
      results.push(await this.testThumbnailFormats());
      results.push(await this.testThumbnailPerformance());
    }

    this.printSummary();

    // Clean up test files
    this.cleanupOutputFiles();

    const allPassed = results.every((result) => result);

    if (allPassed) {
      console.log(
        "\n🎉 All thumbnail extraction tests completed successfully!"
      );
    } else {
      console.log(
        "\n⚠️  Some thumbnail extraction tests failed or had warnings"
      );
    }

    return allPassed;
  }
}

async function main() {
  const tester = new ThumbnailExtractionTests();

  try {
    const success = await tester.runAllTests();
    process.exit(success ? 0 : 1);
  } catch (error) {
    console.error("❌ Test suite failed:", error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { ThumbnailExtractionTests };

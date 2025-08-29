const LibRaw = require("../lib/index");
const path = require("path");
const fs = require("fs");

async function quickMultiSizeDemo() {
  const sampleDir = path.join(__dirname, "..", "sample-images");
  const outputDir = path.join(__dirname, "output", "multi-size-demo");

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Find a test file
  const testFiles = fs
    .readdirSync(sampleDir)
    .filter((file) =>
      [".cr3", ".nef", ".arw"].includes(path.extname(file).toLowerCase())
    )
    .slice(0, 1);

  if (testFiles.length === 0) {
    console.log("No RAW files found for demo");
    return;
  }

  const testFile = path.join(sampleDir, testFiles[0]);
  const fileName = path.basename(testFile, path.extname(testFile));

  console.log(`🚀 Multi-Size JPEG Demo: ${fileName}`);

  const processor = new LibRaw();
  await processor.loadFile(testFile);

  const metadata = await processor.getMetadata();
  console.log(`Original: ${metadata.width}x${metadata.height}`);

  // Define some different sizes
  const sizes = [
    { name: "thumb", width: 200, height: 150, quality: 85 },
    { name: "web", width: 800, height: 600, quality: 85 },
    { name: "hd", width: 1920, height: 1080, quality: 85 },
    { name: "full", quality: 95 },
  ];

  const results = [];

  for (const size of sizes) {
    const outputPath = path.join(outputDir, `${fileName}_${size.name}.jpg`);
    const startTime = Date.now();

    const options = {
      quality: size.quality,
      fastMode: true,
      effort: 3,
    };

    if (size.width) options.width = size.width;
    if (size.height) options.height = size.height;

    const result = await processor.convertToJPEG(outputPath, options);
    const processTime = Date.now() - startTime;

    const stats = fs.statSync(outputPath);
    const dims = result.metadata.outputDimensions;

    results.push({
      name: size.name,
      size: `${dims.width}x${dims.height}`,
      fileSize: (stats.size / 1024).toFixed(1) + "KB",
      time: processTime + "ms",
    });

    console.log(
      `✓ ${size.name}: ${dims.width}x${dims.height}, ${(
        stats.size / 1024
      ).toFixed(1)}KB (${processTime}ms)`
    );
  }

  await processor.close();

  console.log("\n📊 Summary:");
  results.forEach((r) => {
    console.log(`  ${r.name}: ${r.size} → ${r.fileSize} (${r.time})`);
  });

  console.log(`\n📁 Files saved to: ${outputDir}`);
}

quickMultiSizeDemo().catch(console.error);

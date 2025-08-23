const LibRaw = require("../lib/index");

async function basicExample() {
  console.log("LibRaw Basic Usage Example");
  console.log("==========================\n");

  const processor = new LibRaw();

  try {
    // Replace with your RAW file path
    const rawFile = process.argv[2] || "sample.cr2";

    console.log(`📁 Loading RAW file: ${rawFile}`);
    await processor.loadFile(rawFile);

    console.log("📊 Extracting metadata...");
    const metadata = await processor.getMetadata();

    console.log("\n📷 Camera Information:");
    console.log(`   Make: ${metadata.make || "Unknown"}`);
    console.log(`   Model: ${metadata.model || "Unknown"}`);

    console.log("\n📐 Image Dimensions:");
    console.log(`   Processed: ${metadata.width} x ${metadata.height}`);
    console.log(`   Raw: ${metadata.rawWidth} x ${metadata.rawHeight}`);

    console.log("\n🎯 Shooting Parameters:");
    console.log(`   ISO: ${metadata.iso || "Unknown"}`);
    console.log(`   Aperture: f/${metadata.aperture || "Unknown"}`);
    console.log(
      `   Shutter Speed: ${
        metadata.shutterSpeed
          ? `1/${Math.round(1 / metadata.shutterSpeed)}s`
          : "Unknown"
      }`
    );
    console.log(`   Focal Length: ${metadata.focalLength || "Unknown"}mm`);

    console.log("\n🎨 Color Information:");
    console.log(`   Colors: ${metadata.colors}`);
    console.log(`   Filters: 0x${metadata.filters?.toString(16) || "0"}`);

    if (metadata.timestamp) {
      const date = new Date(metadata.timestamp * 1000);
      console.log(`\n📅 Capture Date: ${date.toISOString()}`);
    }

    console.log("\n🧹 Cleaning up...");
    await processor.close();

    console.log("\n✅ Complete!");
  } catch (error) {
    console.error("\n❌ Error:", error.message);
    console.error("\nMake sure you have:");
    console.error("1. Built the addon with: npm run build");
    console.error("2. Provided a valid RAW file path");
    console.error("3. The RAW file is accessible and not corrupted");
  }
}

// Usage instructions
if (process.argv.length < 3) {
  console.log("Usage: node basic-example.js <path-to-raw-file>");
  console.log("Example: node basic-example.js C:\\photos\\IMG_1234.CR2");
  process.exit(1);
}

basicExample();

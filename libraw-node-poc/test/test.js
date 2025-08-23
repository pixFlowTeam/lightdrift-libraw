const LibRaw = require("../lib/index");
const path = require("path");

async function testLibRaw() {
  console.log("LibRaw Node.js POC Test");
  console.log("========================");

  const processor = new LibRaw();

  try {
    // Test with a sample RAW file (you'll need to provide one)
    const testFile = process.argv[2];

    if (!testFile) {
      console.log("Usage: node test.js <path-to-raw-file>");
      console.log("Example: node test.js sample.cr2");
      return;
    }

    console.log(`Loading file: ${testFile}`);
    await processor.loadFile(testFile);
    console.log("✓ File loaded successfully");

    console.log("\nExtracting metadata...");
    const metadata = await processor.getMetadata();
    console.log("✓ Metadata extracted:");
    console.log(JSON.stringify(metadata, null, 2));

    console.log("\nGetting image size...");
    const size = await processor.getImageSize();
    console.log("✓ Image size:", size);

    console.log("\nClosing processor...");
    await processor.close();
    console.log("✓ Processor closed");

    console.log("\n🎉 All tests passed!");
  } catch (error) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  testLibRaw().catch(console.error);
}

module.exports = testLibRaw;

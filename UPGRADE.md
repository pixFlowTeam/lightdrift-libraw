# LibRaw Upgrade Guide

## Upgrading from current to X.X.X

### Automatic Upgrade (Recommended)

Run the upgrade script:
```bash
npm run upgrade:libraw
```

### Manual Upgrade Steps

#### 1. Download LibRaw X.X.X

Visit: https://www.libraw.org/download

Download these files:
- `LibRaw-X.X.X-Win64.zip` (for Windows)
- `LibRaw-X.X.X.tar.gz` (source code)

#### 2. Backup Current Installation

```bash
# Backup current deps folder
cp -r deps deps-backup-$(date +%Y%m%d)
```

#### 3. Replace Library Files

**Windows:**
```bash
# Extract new LibRaw-X.X.X-Win64.zip
# Replace deps/LibRaw-Win64/ with new files
# Ensure these files are present:
#   - LibRaw-Win64/bin/libraw.dll
#   - LibRaw-Win64/lib/libraw.lib  
#   - LibRaw-Win64/include/libraw/
```

**macOS/Linux:**
```bash
# Extract and compile from source
tar -xzf LibRaw-X.X.X.tar.gz
cd LibRaw-X.X.X
./configure --prefix=../deps/LibRaw-Unix
make -j$(nproc)
make install
```

#### 4. Update Build Configuration

Check `binding.gyp` for version-specific changes:

```json
{
  "target_name": "libraw_wrapper",
  "sources": ["src/libraw_wrapper.cpp"],
  "include_dirs": [
    "<!(node -e \"console.log(require('node-addon-api').include)\")",
    "deps/LibRaw-Win64/include"  # Update path if needed
  ],
  "libraries": [
    "../deps/LibRaw-Win64/lib/libraw.lib"  # Update path if needed
  ],
  "copies": [{
    "destination": "build/Release/",
    "files": [
      "deps/LibRaw-Win64/bin/libraw.dll"  # Update path if needed
    ]
  }]
}
```

#### 5. Rebuild Native Addon

```bash
npm run clean
npm run build
```

#### 6. Test Compatibility

```bash
# Run comprehensive tests
npm test

# Test with your sample images
npm run test:formats

# Performance regression check
npm run test:performance
```

#### 7. Update Documentation

```bash
# Update supported formats list
npm run docs:generate

# Update version info in package.json
# Update CHANGELOG.md with new features
```

### Potential Breaking Changes

#### API Changes
Check LibRaw changelog for API modifications:
- New metadata fields may be available
- Some deprecated functions might be removed
- New camera support added

#### Performance Changes
- Processing speed may improve or change
- Memory usage patterns might differ
- New optimization flags available

#### Compatibility Changes
- New camera models supported
- Some older formats might be deprecated
- Color profile handling improvements

### Version-Specific Notes

#### LibRaw X.X.X
Check the official LibRaw changelog at:
https://github.com/LibRaw/LibRaw/releases/tag/X.X.X

Common improvements in newer versions:
- Support for latest camera models
- Performance optimizations
- Bug fixes in metadata extraction
- Enhanced color profile handling
- Security updates

### Troubleshooting

#### Build Errors
```bash
# Clear all build artifacts
npm run clean
rm -rf node_modules
npm install
npm run build
```

#### Runtime Errors
```bash
# Check library loading
node -e "console.log(require('./lib/index.js'))"

# Verify DLL/SO dependencies
# Windows: use Dependency Walker
# Linux: ldd build/Release/libraw_wrapper.node
# macOS: otool -L build/Release/libraw_wrapper.node
```

#### Test Failures
```bash
# Test individual formats
node test/test.js sample-images/test.nef

# Check for new metadata fields
node -e "
const LibRaw = require('./lib');
const proc = new LibRaw();
proc.loadFile('sample.nef').then(() => {
  return proc.getMetadata();
}).then(meta => {
  console.log(JSON.stringify(meta, null, 2));
}).catch(console.error);
"
```

### Rollback Procedure

If the upgrade fails:

```bash
# Restore backup
rm -rf deps
mv deps-backup-YYYYMMDD deps

# Rebuild with old version
npm run clean
npm run build
npm test
```

### Post-Upgrade Checklist

- [ ] All tests pass
- [ ] Performance is acceptable
- [ ] Sample images process correctly
- [ ] New camera formats work (if any)
- [ ] Documentation is updated
- [ ] CHANGELOG.md reflects changes
- [ ] Package version bumped appropriately

### Publishing Updated Package

```bash
# Update version
npm version patch  # or minor/major based on changes

# Test before publishing
npm run prepublishOnly

# Publish to npm
npm publish
```

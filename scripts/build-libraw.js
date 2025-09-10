const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const os = require("os");

class LibRawBuilder {
  constructor() {
    this.platform = os.platform();
    this.arch = os.arch();
    this.librawSourceDir = path.join(__dirname, "../deps/LibRaw-Source/LibRaw-0.21.4");
    this.buildDir = path.join(this.librawSourceDir, "build");
    this.libDir = path.join(this.librawSourceDir, "lib");
    this.binDir = path.join(this.librawSourceDir, "bin");
    
    // 参考已完成项目的配置
    this.platformConfigs = {
      'win32': {
        toolchain: 'x86_64-w64-mingw32',
        cmakeArgs: [
          '-DCMAKE_BUILD_TYPE=Release',
          '-DBINARY_PACKAGE_BUILD=ON',
          '-DLIBRAW_ENABLE_WERROR=OFF',
          '-DBUILD_EXAMPLES=OFF',
          '-DBUILD_TESTING=OFF',
          '-DBUILD_DOCS=OFF',
          '-DCMAKE_CXX_FLAGS=-w -O2 -D_GNU_SOURCE -D_USE_MATH_DEFINES -DWIN32 -DNO_LCMS',
          '-DCMAKE_C_FLAGS=-w -O2 -D_GNU_SOURCE -D_USE_MATH_DEFINES -DWIN32 -DNO_LCMS',
          '-DCMAKE_EXE_LINKER_FLAGS=-lws2_32 -lwsock32 -lmswsock'
        ],
        libExt: 'lib',
        dllExt: 'dll'
      },
      'darwin': {
        toolchain: this.arch === 'arm64' ? 'aarch64-apple-darwin' : 'x86_64-apple-darwin',
        cmakeArgs: [
          '-DCMAKE_BUILD_TYPE=Release',
          '-DBINARY_PACKAGE_BUILD=ON',
          '-DLIBRAW_ENABLE_WERROR=OFF',
          '-DBUILD_EXAMPLES=ON',
          '-DBUILD_TESTING=OFF',
          '-DBUILD_DOCS=OFF',
          '-DCMAKE_CXX_FLAGS=-DNO_LCMS',
          '-DCMAKE_C_FLAGS=-DNO_LCMS'
        ],
        libExt: 'a',
        dllExt: 'dylib'
      },
      'linux': {
        toolchain: 'native',
        cmakeArgs: [
          '-DCMAKE_BUILD_TYPE=Release',
          '-DBINARY_PACKAGE_BUILD=ON',
          '-DLIBRAW_ENABLE_WERROR=OFF',
          '-DBUILD_EXAMPLES=ON',
          '-DBUILD_TESTING=OFF',
          '-DBUILD_DOCS=OFF',
          '-DCMAKE_CXX_FLAGS=-DNO_LCMS',
          '-DCMAKE_C_FLAGS=-DNO_LCMS'
        ],
        libExt: 'a',
        dllExt: 'so'
      }
    };
  }

  log(message) {
    console.log(`[LibRaw Builder] ${message}`);
  }

  async ensureDirectories() {
    const dirs = [this.buildDir, this.libDir, this.binDir];
    for (const dir of dirs) {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
        this.log(`Created directory: ${dir}`);
      }
    }
  }

  async buildWindows() {
    this.log("Building LibRaw for Windows...");
    
    try {
      // 检查是否有 Visual Studio
      execSync("where cl", { stdio: 'ignore' });
      this.log("Found Visual Studio compiler");
    } catch (error) {
      this.log("Visual Studio not found, trying to use pre-built binaries...");
      return this.copyPrebuiltWindows();
    }

    // 使用 MSBuild 编译
    const vcxprojPath = path.join(this.librawSourceDir, "buildfiles", "libraw.vcxproj");
    if (fs.existsSync(vcxprojPath)) {
      execSync(`msbuild "${vcxprojPath}" /p:Configuration=Release /p:Platform=x64`, {
        cwd: this.librawSourceDir,
        stdio: 'inherit'
      });
      
      // 复制生成的文件
      this.copyBuildOutputs();
    } else {
      this.log("VCXPROJ file not found, using pre-built binaries");
      return this.copyPrebuiltWindows();
    }
  }

  async buildUnix() {
    this.log(`Building LibRaw for ${this.platform}...`);
    
    // 检查构建工具
    try {
      execSync("which make", { stdio: 'ignore' });
      if (this.platform === 'darwin') {
        execSync("which clang", { stdio: 'ignore' });
      } else {
        execSync("which gcc", { stdio: 'ignore' });
      }
    } catch (error) {
      throw new Error(`Required build tools not found for ${this.platform}`);
    }

    // 配置构建 - 参考已完成项目的配置
    const configureArgs = [
      `--prefix=${this.librawSourceDir}`,
      '--disable-shared',
      '--enable-static',
      '--disable-lcms',      // 禁用 LCMS 颜色管理
      '--disable-jpeg',      // 禁用 JPEG 支持
      '--disable-zlib',      // 禁用 zlib 压缩
      '--disable-openmp',    // 禁用 OpenMP 多线程
      '--disable-examples'   // 禁用示例程序
    ];

    const configureCmd = `./configure ${configureArgs.join(' ')}`;
    this.log(`Running: ${configureCmd}`);
    
    execSync(configureCmd, {
      cwd: this.librawSourceDir,
      stdio: 'inherit'
    });

    // 编译
    const makeCmd = `make -j${os.cpus().length}`;
    this.log(`Running: ${makeCmd}`);
    
    execSync(makeCmd, {
      cwd: this.librawSourceDir,
      stdio: 'inherit'
    });

    // 安装
    this.log("Installing...");
    execSync("make install", {
      cwd: this.librawSourceDir,
      stdio: 'inherit'
    });
  }

  copyPrebuiltWindows() {
    this.log("Copying pre-built Windows binaries...");
    
    // 从 LibRaw-Win64 复制文件（如果存在）
    const win64Dir = path.join(__dirname, "../deps/LibRaw-Win64/LibRaw-0.21.4");
    if (fs.existsSync(win64Dir)) {
      const sourceLib = path.join(win64Dir, "lib", "libraw.lib");
      const sourceDll = path.join(win64Dir, "bin", "libraw.dll");
      
      if (fs.existsSync(sourceLib)) {
        fs.copyFileSync(sourceLib, path.join(this.libDir, "libraw.lib"));
        this.log("Copied libraw.lib");
      }
      
      if (fs.existsSync(sourceDll)) {
        fs.copyFileSync(sourceDll, path.join(this.binDir, "libraw.dll"));
        this.log("Copied libraw.dll");
      }
    } else {
      throw new Error("Pre-built Windows binaries not found and Visual Studio not available");
    }
  }

  copyBuildOutputs() {
    this.log("Copying build outputs...");
    
    // 查找生成的文件
    const possibleLibPaths = [
      path.join(this.buildDir, "release-x86_64", "libraw.lib"),
      path.join(this.buildDir, "Release", "libraw.lib"),
      path.join(this.librawSourceDir, "lib", "libraw.lib")
    ];
    
    const possibleDllPaths = [
      path.join(this.buildDir, "release-x86_64", "libraw.dll"),
      path.join(this.buildDir, "Release", "libraw.dll"),
      path.join(this.librawSourceDir, "bin", "libraw.dll")
    ];
    
    for (const libPath of possibleLibPaths) {
      if (fs.existsSync(libPath)) {
        fs.copyFileSync(libPath, path.join(this.libDir, "libraw.lib"));
        this.log(`Copied library: ${libPath}`);
        break;
      }
    }
    
    for (const dllPath of possibleDllPaths) {
      if (fs.existsSync(dllPath)) {
        fs.copyFileSync(dllPath, path.join(this.binDir, "libraw.dll"));
        this.log(`Copied DLL: ${dllPath}`);
        break;
      }
    }
  }

  async build() {
    this.log(`Building LibRaw for ${this.platform} (${this.arch})`);
    
    await this.ensureDirectories();
    
    switch (this.platform) {
      case 'win32':
        await this.buildWindows();
        break;
      case 'darwin':
      case 'linux':
        await this.buildUnix();
        break;
      default:
        throw new Error(`Unsupported platform: ${this.platform}`);
    }
    
    this.log("LibRaw build completed successfully!");
  }

  async checkBuildStatus() {
    this.log("Checking LibRaw build status...");
    
    const requiredFiles = [];
    
    if (this.platform === 'win32') {
      requiredFiles.push(
        path.join(this.libDir, "libraw.lib"),
        path.join(this.binDir, "libraw.dll")
      );
    } else {
      const libExt = this.platform === 'darwin' ? 'dylib' : 'so';
      requiredFiles.push(
        path.join(this.libDir, `libraw.${libExt}`)
      );
    }
    
    const missingFiles = requiredFiles.filter(file => !fs.existsSync(file));
    
    if (missingFiles.length === 0) {
      this.log("✅ LibRaw is properly built");
      return true;
    } else {
      this.log(`❌ Missing files: ${missingFiles.join(', ')}`);
      return false;
    }
  }
}

// 导出类
module.exports = LibRawBuilder;

// 如果直接运行此脚本
if (require.main === module) {
  const builder = new LibRawBuilder();
  
  builder.checkBuildStatus().then(isBuilt => {
    if (!isBuilt) {
      console.log("LibRaw not built, starting build process...");
      return builder.build();
    }
  }).catch(error => {
    console.error("Build failed:", error.message);
    process.exit(1);
  });
}

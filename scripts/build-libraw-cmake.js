const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");
const os = require("os");

class LibRawCMakeBuilder {
  constructor() {
    this.platform = os.platform();
    this.arch = os.arch();
    this.librawSourceDir = path.join(__dirname, "../deps/LibRaw-Source/LibRaw-0.21.4");
    this.buildDir = path.join(this.librawSourceDir, "build");
    this.libDir = path.join(this.librawSourceDir, "lib");
    this.binDir = path.join(this.librawSourceDir, "bin");
    
    // 基于已完成项目的配置
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
          '-DNO_LCMS=ON',
          '-DNO_JPEG=ON',
          '-DNO_ZLIB=ON',
          '-DNO_OPENMP=ON',
          '-DCMAKE_INSTALL_PREFIX=' + this.librawSourceDir,
          '-DCMAKE_PREFIX_PATH=' + this.librawSourceDir
        ]
      },
      'darwin': {
        cmakeArgs: [
          '-DCMAKE_BUILD_TYPE=Release',
          '-DBINARY_PACKAGE_BUILD=ON',
          '-DLIBRAW_ENABLE_WERROR=OFF',
          '-DBUILD_EXAMPLES=ON',
          '-DBUILD_TESTING=OFF',
          '-DBUILD_DOCS=OFF',
          '-DNO_LCMS=ON',
          '-DNO_JPEG=ON',
          '-DNO_ZLIB=ON',
          '-DNO_OPENMP=ON',
          '-DCMAKE_INSTALL_PREFIX=' + this.librawSourceDir,
          '-DCMAKE_PREFIX_PATH=' + this.librawSourceDir
        ]
      },
      'linux': {
        cmakeArgs: [
          '-DCMAKE_BUILD_TYPE=Release',
          '-DBINARY_PACKAGE_BUILD=ON',
          '-DLIBRAW_ENABLE_WERROR=OFF',
          '-DBUILD_EXAMPLES=ON',
          '-DBUILD_TESTING=OFF',
          '-DBUILD_DOCS=OFF',
          '-DNO_LCMS=ON',
          '-DNO_JPEG=ON',
          '-DNO_ZLIB=ON',
          '-DNO_OPENMP=ON',
          '-DCMAKE_INSTALL_PREFIX=' + this.librawSourceDir,
          '-DCMAKE_PREFIX_PATH=' + this.librawSourceDir
        ]
      }
    };
  }

  log(message) {
    console.log(`[LibRaw CMake Builder] ${message}`);
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

  async checkBuildStatus() {
    const libFile = path.join(this.libDir, "libraw.a");
    const binFiles = fs.existsSync(this.binDir) ? fs.readdirSync(this.binDir) : [];
    
    if (fs.existsSync(libFile) && binFiles.length > 0) {
      this.log("LibRaw already built");
      return true;
    }
    return false;
  }

  async build() {
    this.log(`Building LibRaw for ${this.platform} using CMake...`);
    
    await this.ensureDirectories();
    
    // 检查 CMake 是否可用
    try {
      execSync("cmake --version", { stdio: 'ignore' });
    } catch (error) {
      throw new Error("CMake not found. Please install CMake first.");
    }

    // 检查 LibRaw 源码是否存在
    if (!fs.existsSync(this.librawSourceDir)) {
      throw new Error(`LibRaw source directory not found: ${this.librawSourceDir}`);
    }

    // 检查是否有 CMakeLists.txt
    const cmakeFile = path.join(this.librawSourceDir, "CMakeLists.txt");
    if (!fs.existsSync(cmakeFile)) {
      this.log("LibRaw source doesn't have CMakeLists.txt, using configure/make instead...");
      return await this.buildWithConfigure();
    }

    const config = this.platformConfigs[this.platform];
    if (!config) {
      throw new Error(`Unsupported platform: ${this.platform}`);
    }

    // 配置 CMake
    const cmakeCmd = `cmake ${config.cmakeArgs.join(' ')} -B ${this.buildDir} -S ${this.librawSourceDir}`;
    this.log(`Configuring: ${cmakeCmd}`);
    
    try {
      execSync(cmakeCmd, {
        cwd: this.librawSourceDir,
        stdio: 'inherit'
      });
    } catch (error) {
      this.log("CMake configuration failed, falling back to configure/make...");
      return await this.buildWithConfigure();
    }

    // 编译
    const buildCmd = `cmake --build ${this.buildDir} --config Release --parallel ${os.cpus().length}`;
    this.log(`Building: ${buildCmd}`);
    
    execSync(buildCmd, {
      cwd: this.librawSourceDir,
      stdio: 'inherit'
    });

    // 安装
    const installCmd = `cmake --install ${this.buildDir}`;
    this.log(`Installing: ${installCmd}`);
    
    execSync(installCmd, {
      cwd: this.librawSourceDir,
      stdio: 'inherit'
    });

    this.log("LibRaw build completed successfully!");
  }

  async buildWithConfigure() {
    this.log("Building LibRaw using configure/make...");
    
    // 检查构建工具
    try {
      execSync("which make", { stdio: 'ignore' });
      execSync("which gcc", { stdio: 'ignore' });
    } catch (error) {
      throw new Error("Required build tools (make, gcc) not found");
    }

    // 配置构建
    const configureArgs = [
      `--prefix=${this.librawSourceDir}`,
      '--disable-shared',
      '--enable-static',
      '--disable-lcms',
      '--disable-jpeg',
      '--disable-zlib',
      '--disable-openmp',
      '--disable-examples'
    ];

    const configureCmd = `./configure ${configureArgs.join(' ')}`;
    this.log(`Configuring: ${configureCmd}`);
    
    execSync(configureCmd, {
      cwd: this.librawSourceDir,
      stdio: 'inherit'
    });

    // 编译
    const makeCmd = `make -j${os.cpus().length}`;
    this.log(`Building: ${makeCmd}`);
    
    execSync(makeCmd, {
      cwd: this.librawSourceDir,
      stdio: 'inherit'
    });

    // 安装
    execSync("make install", {
      cwd: this.librawSourceDir,
      stdio: 'inherit'
    });

    this.log("LibRaw build completed successfully!");
  }

  async buildAll() {
    this.log("Building LibRaw for all supported platforms...");
    
    const platforms = ['win32', 'darwin', 'linux'];
    for (const platform of platforms) {
      this.log(`Building for ${platform}...`);
      // 这里可以实现交叉编译逻辑
      // 暂时只构建当前平台
      if (platform === this.platform) {
        await this.build();
      }
    }
  }
}

// 主执行逻辑
if (require.main === module) {
  const builder = new LibRawCMakeBuilder();
  
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

module.exports = LibRawCMakeBuilder;
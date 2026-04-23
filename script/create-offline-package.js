const fs = require('fs');
const path = require('path');
const archiver = require('archiver');

// ==================== 配置区域 ====================

// 命令行参数解析
const args = process.argv.slice(2);
const modeArg = args.find(arg => arg.startsWith('--mode='));
const mode = modeArg ? modeArg.split('=')[1] : 'prod';

// 路径配置
const PATH_CONFIG = {
  rootDir: path.join(__dirname, '..'),
  get distDir() { return path.join(this.rootDir, 'dist'); },
  get h5WebDir() { return path.join(this.rootDir, 'dist_package', 'h5-web', 'psiesearchsdk'); },
  get outputBaseDir() { return path.join(this.rootDir, 'dist_package', 'packages', 'product'); },
  get zipOutputDir() { return path.join(this.rootDir, 'dist_package', 'packages', 'packages-zip'); },
  get distPackageDir() { return path.join(this.rootDir, 'dist_package'); }
};

// 环境配置
const ENV_CONFIG = {
  prod: {
    url_host: ['h.app.coc.10086.cn'],
    url_path: '/ngpsie/psiesearchsdk',
    baseUrl: '/ngpsie/psiesearchsdk',
    cdnDomain: 'https://res.app.coc.10086.cn'
  },
  gray: {
    url_host: ['testh.app.coc.10086.cn'],
    url_path: '/ngpsie/psiesearchsdk',
    baseUrl: '/ngpsie/psiesearchsdk',
    cdnDomain: 'https://res.app.coc.10086.cn'
  }
};

// 黑名单配置（不打包进离线包的文件）
const BLACKLIST_CONFIG = {
  extensions: ['.png', '.jpg', '.jpeg'],
  filenames: ['zxkf_AI_sdk.js']
};

// 资源文件扩展名白名单
const RESOURCE_EXTENSIONS = ['.js', '.css', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp', '.ico', '.woff', '.woff2', '.ttf', '.eot'];

// Skynet 配置
const SKYNET_CONFIG = {
  appName: 'CMCCAPP',
  usePathKey: true,
  rate: 100,
  scriptFile: 'skynet-1.5.6.js'
};

// 验证模式
const currentConfig = ENV_CONFIG[mode];
if (!currentConfig) {
  console.error(`❌ 不支持的模式: ${mode}`);
  console.log('支持的模式: prod, gray');
  process.exit(1);
}

console.log(`🚀 开始创建离线包 (模式: ${mode})...`);

// ==================== 工具函数区域 ====================

// 确保目录存在
function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

// 递归复制文件夹
function copyDir(src, dest) {
  ensureDir(dest);
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

// 检查文件是否在黑名单中
function isBlacklisted(filename, ext) {
  return BLACKLIST_CONFIG.extensions.includes(ext) || BLACKLIST_CONFIG.filenames.includes(filename);
}

// 清理目录（带重试机制）
async function cleanDirectory(dir, maxRetries = 3) {
  if (!fs.existsSync(dir)) {
    console.log('   ℹ️  目录不存在，跳过清理');
    return true;
  }

  for (let i = 0; i < maxRetries; i++) {
    try {
      fs.rmSync(dir, { recursive: true, force: true, maxRetries: 3, retryDelay: 100 });
      console.log('   ✅ 目录已清空');
      return true;
    } catch (error) {
      if (i === maxRetries - 1) {
        console.warn('   ⚠️  无法完全清空目录，继续执行...');
        console.warn('   提示: 如遇到文件占用，请关闭相关程序后重试');
        return false;
      }
      console.log(`   ⏳ 重试删除 (${i + 1}/${maxRetries})...`);
      await new Promise(resolve => setTimeout(resolve, 500));
    }
  }
}

// 创建 ZIP 包
function createZip(sourceDir, outputPath, folderName) {
  return new Promise((resolve, reject) => {
    const output = fs.createWriteStream(outputPath);
    const archive = archiver('zip', { zlib: { level: 9 } });

    output.on('close', () => {
      const sizeMB = (archive.pointer() / 1024 / 1024).toFixed(2);
      console.log(`   ✅ ZIP 包创建成功 (${sizeMB} MB)`);
      resolve();
    });

    archive.on('error', (err) => reject(err));
    archive.pipe(output);

    if (folderName === false) {
      archive.directory(sourceDir, false);
    } else {
      archive.directory(sourceDir, folderName);
    }

    archive.finalize();
  });
}

// ==================== 业务逻辑区域 ====================

// 自动扫描并生成离线包配置
function generatePackagesConfig(sourceDir) {
  const configs = [];

  try {
    const files = fs.readdirSync(sourceDir);
    const htmlFiles = files.filter(file =>
      file.endsWith('.html') &&
      fs.statSync(path.join(sourceDir, file)).isFile()
    );

    htmlFiles.forEach(htmlFile => {
      const packageName = htmlFile === 'index.html'
        ? path.basename(sourceDir)
        : htmlFile.replace('.html', '');

      configs.push({
        name: packageName,
        htmlFile: htmlFile,
        zipPrefix: `cmcc${packageName}`
      });
    });

    const fileList = configs.map(cfg => `${cfg.htmlFile} -> ${cfg.name}`).join(', ');
    console.log(`   ✅ 自动发现 ${configs.length} 个 HTML 文件: ${fileList}`);

    return configs;
  } catch (error) {
    console.error('❌ 扫描 HTML 文件失败:', error);
    return [];
  }
}

// 递归扫描目录下的所有资源文件
function scanResourceFiles(dir, baseDir, isRoot = false) {
  const resourceFiles = [];

  try {
    if (!fs.existsSync(dir)) return resourceFiles;

    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      const relativePath = path.relative(baseDir, fullPath).replace(/\\/g, '/');

      if (entry.isDirectory()) {
        resourceFiles.push(...scanResourceFiles(fullPath, baseDir, false));
      } else if (entry.isFile()) {
        const ext = path.extname(entry.name).toLowerCase();
        if (RESOURCE_EXTENSIONS.includes(ext) && !isBlacklisted(entry.name, ext)) {
          resourceFiles.push(relativePath);
        }
      }
    }
  } catch (error) {
    console.warn(`   ⚠️  扫描目录失败 ${isRoot ? '(根目录)' : dir}:`, error.message);
  }
  return resourceFiles;
}

// 生成 config.json
function generateConfigJson(htmlFile, sourceDir) {
  const allResourceFiles = scanResourceFiles(sourceDir, sourceDir, true);
  const specifyHashList = allResourceFiles.map(file => ({
    path: `${currentConfig.baseUrl}/${file}`
  }));

  console.log(`   ✅ 共扫描到 ${allResourceFiles.length} 个资源文件（已排除黑名单）`);

  return {
    url_host: currentConfig.url_host,
    url_path: [`${currentConfig.url_path}/${htmlFile}`],
    specify_hash_list: specifyHashList
  };
}

// 生成 Skynet 脚本
function generateSkynetScript(urlPath, timestamp) {
  const formatUrlValue = `${urlPath}-v${timestamp}.html`;
  return `
    <script>window.__SKYNET = {
                appName: '${SKYNET_CONFIG.appName}',
                usePathKey: ${SKYNET_CONFIG.usePathKey},
                rate: ${SKYNET_CONFIG.rate},
                formatUrl: function () { return "${formatUrlValue}" }
          }</script>
    <script src="${currentConfig.cdnDomain}${currentConfig.baseUrl}/${SKYNET_CONFIG.scriptFile}"></script>`;
}

// 注入 Skynet 脚本到 HTML
function injectSkynetScript(htmlContent, skynetScript) {
  // 1. 检查并移除所有现有的 window.__SKYNET 配置（包括多行格式）
  const skynetConfigPattern = /<script[^>]*>\s*window\.__SKYNET\s*=\s*\{[\s\S]*?\}\s*<\/script>/gi;
  const hasSkynetConfig = skynetConfigPattern.test(htmlContent);

  if (hasSkynetConfig) {
    console.log('      ℹ️  检测到已存在 window.__SKYNET 配置，将移除并使用新配置');
    htmlContent = htmlContent.replace(skynetConfigPattern, '');
  }

  // 2. 检查并移除所有现有的 skynet 脚本引用
  const skynetScriptPattern = new RegExp(`<script[^>]*src=["'][^"']*${SKYNET_CONFIG.scriptFile}["'][^>]*>(?:\\s*</script>)?`, 'gi');
  const hasSkynetScript = skynetScriptPattern.test(htmlContent);

  if (hasSkynetScript) {
    console.log('      ℹ️  检测到已存在 skynet 脚本引用，将移除并使用新引用');
    htmlContent = htmlContent.replace(skynetScriptPattern, '');
  }

  // 3. 在 </head> 之前注入新的 skynet 配置和脚本
  const insertPoints = [
    { pattern: '</head>', replacement: (match) => `${skynetScript}\n  ${match}` },
    { pattern: /(<body[^>]*>)/i, replacement: (match) => `${skynetScript}\n  ${match}` }
  ];

  for (const { pattern, replacement } of insertPoints) {
    if (htmlContent.match(pattern)) {
      return htmlContent.replace(pattern, replacement);
    }
  }

  // 兜底：追加到文件开头
  return skynetScript + '\n' + htmlContent;
}

// 复制资源文件
function copyResourceFiles(configData, sourceDir, packageDir) {
  return configData.specify_hash_list.reduce((count, item) => {
    const relativePath = item.path.replace(currentConfig.baseUrl + '/', '').replace(/^\//, '');
    const srcFile = path.join(sourceDir, relativePath);
    const destFile = path.join(packageDir, relativePath);

    if (fs.existsSync(srcFile)) {
      ensureDir(path.dirname(destFile));
      fs.copyFileSync(srcFile, destFile);
      return count + 1;
    } else {
      console.warn(`      ⚠️  文件不存在: ${relativePath}`);
      return count;
    }
  }, 0);
}

// 处理 HTML 文件（复制并注入 Skynet 脚本）
function processHtmlFile(htmlFile, sourceDir, packageDir, configData, timestamp) {
  const htmlSrc = path.join(sourceDir, htmlFile);
  const htmlDest = path.join(packageDir, htmlFile);

  if (!fs.existsSync(htmlSrc)) {
    console.warn(`      ⚠️  ${htmlFile} 不存在，跳过`);
    return false;
  }

  const htmlContent = fs.readFileSync(htmlSrc, 'utf8');
  const skynetScript = generateSkynetScript(configData.url_path[0], timestamp);
  const processedContent = injectSkynetScript(htmlContent, skynetScript);

  fs.writeFileSync(htmlDest, processedContent, 'utf8');
  return true;
}

// 创建单个离线包
async function createOfflinePackage(packageConfig, sourceDir, timestamp) {
  const { name, htmlFile, zipPrefix } = packageConfig;
  const packageBaseDir = path.join(PATH_CONFIG.outputBaseDir, name);
  const packageDir = path.join(packageBaseDir, 'ngpsie', 'psiesearchsdk');

  console.log(`\n   📦 正在创建 ${name} 离线包...`);

  // 清理并创建输出目录
  if (fs.existsSync(packageDir)) {
    fs.rmSync(packageDir, { recursive: true, force: true });
  }
  ensureDir(packageDir);

  // 生成 config.json
  const configData = generateConfigJson(htmlFile, sourceDir);

  // 复制资源文件
  const copiedCount = copyResourceFiles(configData, sourceDir, packageDir);
  console.log(`      ✅ 已复制 ${copiedCount} 个资源文件`);

  // 处理 HTML 文件
  const htmlProcessed = processHtmlFile(htmlFile, sourceDir, packageDir, configData, timestamp);
  if (!htmlProcessed) return;

  // 写入 config.json
  const configDir = path.join(packageBaseDir, 'ngpsie');
  ensureDir(configDir);
  const configPath = path.join(configDir, 'config.json');
  fs.writeFileSync(configPath, JSON.stringify(configData, null, 2), 'utf8');
  console.log(`      ✅ ${htmlFile} 已处理，config.json 已生成，正在打包...`);

  // 创建 ZIP 包
  const zipFileName = `${zipPrefix}-v${timestamp}.zip`;
  const zipFilePath = path.join(PATH_CONFIG.zipOutputDir, zipFileName);
  await createZip(packageBaseDir, zipFilePath, false);

  return { packageDir, zipFilePath };
}

// ==================== 主流程区域 ====================

// 主函数
async function main() {
  try {
    // 步骤 0: 清理输出目录
    console.log('🧹 步骤 0: 清理输出目录...');
    await cleanDirectory(PATH_CONFIG.distPackageDir);
    ensureDir(PATH_CONFIG.h5WebDir);
    ensureDir(PATH_CONFIG.outputBaseDir);
    ensureDir(PATH_CONFIG.zipOutputDir);

    // 步骤 1: 复制构建产物
    console.log('📦 步骤 1: 复制 dist 到 h5-web...');
    if (!fs.existsSync(PATH_CONFIG.distDir)) {
      console.error('❌ dist 目录不存在，请先执行构建命令');
      process.exit(1);
    }
    copyDir(PATH_CONFIG.distDir, PATH_CONFIG.h5WebDir);
    console.log('   ✅ 复制完成');

    // 步骤 2: 扫描 HTML 文件
    console.log('\n📦 步骤 2: 自动扫描 HTML 文件并生成配置...');
    const packagesConfig = generatePackagesConfig(PATH_CONFIG.h5WebDir);
    if (packagesConfig.length === 0) {
      console.error('❌ 未找到任何 HTML 文件');
      process.exit(1);
    }

    // 步骤 3: 准备离线包
    const timestamp = Math.floor(Date.now() / 1000);
    console.log(`\n📦 步骤 3: 准备离线包 (时间戳版本: ${timestamp})`);

    // 步骤 4: 创建离线包
    console.log('\n📦 步骤 4: 创建离线包...');
    const results = [];
    for (const packageConfig of packagesConfig) {
      const result = await createOfflinePackage(packageConfig, PATH_CONFIG.h5WebDir, timestamp);
      if (result) {
        results.push({ name: packageConfig.name, ...result });
      }
    }

    // 输出汇总信息
    console.log('\n' + '='.repeat(60));
    console.log('🎉 离线包创建完成！');
    console.log('='.repeat(60));
    console.log(`\n📊 构建模式: ${mode.toUpperCase()} | 版本时间戳: ${timestamp} | 生成包数量: ${results.length}\n`);

    results.forEach((result, index) => {
      console.log(`${index + 1}. ${result.name}`);
      console.log(`   📁 离线包目录: ${result.packageDir}`);
      console.log(`   📦 ZIP 文件: ${result.zipFilePath}`);
      if (index < results.length - 1) console.log('');
    });

    console.log('\n' + '='.repeat(60));
  } catch (error) {
    console.error('❌ 创建离线包失败:', error);
    process.exit(1);
  }
}

// 运行
main();

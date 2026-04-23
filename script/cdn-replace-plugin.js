/**
 * CDN 资源路径替换插件
 * 在 webpack 构建完成后，将所有本地资源路径替换为 CDN 路径
 */

class CdnReplacePlugin {
  constructor(options = {}) {
    this.options = {
      cdnDomain: options.cdnDomain || 'https://res.app.coc.10086.cn',
      baseUrl: options.baseUrl || '/ngpsie/psiesearchsdk',
      // 支持的资源类型
      assetExtensions: options.assetExtensions || ['png', 'jpg', 'jpeg', 'gif', 'svg', 'webp', 'ico', 'woff', 'woff2', 'ttf', 'eot'],
      // 是否启用插件
      enabled: options.enabled !== false,
    };
  }

  apply(compiler) {
    if (!this.options.enabled) {
      return;
    }

    const { cdnDomain, baseUrl } = this.options;

    // 在生成资源后处理
    compiler.hooks.emit.tapAsync('CdnReplacePlugin', (compilation, callback) => {
      console.log('\n🎨 CdnReplacePlugin: 开始处理资源路径...');

      let totalReplacements = 0;

      // 遍历所有生成的资源文件
      Object.keys(compilation.assets).forEach(filename => {
        const asset = compilation.assets[filename];

        // 只处理 CSS、HTML 和 JS 文件
        if (!/\.(css|html|js)$/.test(filename)) {
          return;
        }

        // 获取文件内容
        let source = asset.source();
        if (Buffer.isBuffer(source)) {
          source = source.toString('utf8');
        }

        let replacements = 0;
        let newSource = source;

        // 1. 替换 CSS 中的 url() 引用
        // 匹配: url(/ngpsie/psiesearchsdk/assets/...) 或 url(/ngpsie-pre/psiesearchsdk/assets/...)
        newSource = newSource.replace(
          /url\((["']?)(\/ngpsie(?:-pre)?\/psiesearchsdk\/assets\/[^)'"]+)(["']?)\)/g,
          (match, quote1, path, quote2) => {
            replacements++;
            return `url(${quote1}${cdnDomain}${path}${quote2})`;
          }
        );

        // 2. 替换 HTML/JS 中的 src 和 href 属性
        // 匹配: src="/ngpsie/psiesearchsdk/assets/..." 或 href="/ngpsie/psiesearchsdk/assets/..."
        newSource = newSource.replace(
          /(src|href)=(["'])(\/ngpsie(?:-pre)?\/psiesearchsdk\/assets\/[^"']+)(["'])/g,
          (match, attr, quote1, path, quote2) => {
            replacements++;
            return `${attr}=${quote1}${cdnDomain}${path}${quote2}`;
          }
        );

        // 3. 替换 JS 中的字符串路径（如动态 import 等）
        // 匹配: "/ngpsie/psiesearchsdk/assets/..." 或 '/ngpsie/psiesearchsdk/assets/...'
        newSource = newSource.replace(
          /(["'])(\/ngpsie(?:-pre)?\/psiesearchsdk\/assets\/[^"']+)(["'])/g,
          (match, quote1, path, quote2) => {
            // 避免重复替换已经有 CDN 域名的
            if (match.includes(cdnDomain)) {
              return match;
            }
            replacements++;
            return `${quote1}${cdnDomain}${path}${quote2}`;
          }
        );

        // 4. 替换背景图等 CSS 属性中的路径
        // 匹配: background: url(...) 或 background-image: url(...)
        newSource = newSource.replace(
          /(background(?:-image)?:\s*url\()(["']?)(\/ngpsie(?:-pre)?\/psiesearchsdk\/assets\/[^)'"]+)(["']?)(\))/g,
          (match, prefix, quote1, path, quote2, suffix) => {
            replacements++;
            return `${prefix}${quote1}${cdnDomain}${path}${quote2}${suffix}`;
          }
        );

        // 5. 替换 webpack 打包后的资源路径
        // 匹配: e.exports=a.p+"assets/img/xxx.png"
        // 将 webpack 的动态拼接改为完整的 CDN 路径
        newSource = newSource.replace(
          /([a-zA-Z_$][\w$]*\.exports\s*=\s*)([a-zA-Z_$][\w$]*\.p\s*\+\s*)(["'])(assets\/[^"']+)\3/g,
          (match, prefix, publicPath, quote, assetPath) => {
            replacements++;
            // 将 a.p+"assets/..." 替换为完整的 CDN URL
            return `${prefix}${quote}${cdnDomain}${baseUrl}/${assetPath}${quote}`;
          }
        );

        // 如果有替换，更新资源
        if (replacements > 0) {
          totalReplacements += replacements;
          compilation.assets[filename] = {
            source: () => newSource,
            size: () => newSource.length
          };
          console.log(`   ✅ ${filename} - 替换了 ${replacements} 个资源路径`);
        }
      });

      if (totalReplacements > 0) {
        console.log(`\n🎉 CdnReplacePlugin: 总共替换了 ${totalReplacements} 个资源路径\n`);
      } else {
        console.log(`\n   ℹ️  未找到需要替换的资源路径\n`);
      }

      callback();
    });
  }
}

module.exports = CdnReplacePlugin;

const fs = require('fs');
const path = require('path');
const glob = require('glob'); // 使用glob模块来匹配文件模式

// 生产加载的资源文件集
const prodJsCssUrl = ['assets/js/app', 'assets/js/chunk-libs', 'assets/css/app', 'assets/css/chunk-libs']

// 使用上线日期做加载资源版本号后缀
const dateVersion = `20260423`
const prodJsCssVersion = {
    'assets/js/app': `.${dateVersion}.js`,
    'assets/js/chunk-libs': `.${dateVersion}.js`,
    'assets/css/app': `.${dateVersion}.css`,
    'assets/css/chunk-libs': `.${dateVersion}.css`,
}

// 更新index.html中的文件引用
async function updateIndexHtml(files, pre) {
    const indexHtmlPath = path.join(__dirname, '../dist', 'index.html');
    const indexHtmlContent = fs.readFileSync(indexHtmlPath, 'utf8');

    // 重命名打包后的资源文件
    files.forEach(file => {
        prodJsCssUrl.map(urlItem => {
            if (file.indexOf(urlItem) !== -1) {
                const fielOldUrlArr = file.split(urlItem)
                const fileNewUrl = fielOldUrlArr[0] + urlItem + prodJsCssVersion[urlItem]
                // 同步重命名文件
                try {
                    fs.renameSync(file, fileNewUrl);
                    // console.log('重命名成功');
                } catch (error) {
                    console.log('重命名失败', error);
                }
            }
        })
    });

    // 替换所有旧文件引用为新文件引用
    let updatedContent = indexHtmlContent;
    const oldRootPath = '/ngpsie/psiesearchsdk/assets/';
    const newRootPath = `/${pre ? 'ngpsie-pre' : 'ngpsie'}/psiesearchsdk/`;

    files.forEach(file => {
        const fileName = path.basename(file);

        if (fileName.endsWith('.js')) {
            const oldBaseNameJs = oldRootPath + 'js/' + fileName;

            let fileNewUrl = ''
            prodJsCssUrl.map(urlItem => {
                if (file.indexOf(urlItem) !== -1) {
                    fileNewUrl = newRootPath + urlItem + prodJsCssVersion[urlItem];
                }
            })
            updatedContent = updatedContent.replace(oldBaseNameJs, `https://res.app.coc.10086.cn${fileNewUrl}`);
        } else if (fileName.endsWith('.css')) {
            const oldBaseNameCss = oldRootPath + 'css/' + fileName;

            let fileNewUrl = ''
            prodJsCssUrl.map(urlItem => {
                if (file.indexOf(urlItem) !== -1) {
                    fileNewUrl = newRootPath + urlItem + prodJsCssVersion[urlItem];
                }
            })
            updatedContent = updatedContent.replace(oldBaseNameCss, `https://res.app.coc.10086.cn${fileNewUrl}`);
        }
    });

    // 替换 js/ 和 css/ 目录下的文件路径为 CDN 链接
    // 匹配 src="/ngpsie/psiesearchsdk/js/*.js" 和 href="/ngpsie/psiesearchsdk/css/*.css"
    const cdnDomain = 'https://res.app.coc.10086.cn';

    // 替换 JS 文件路径
    updatedContent = updatedContent.replace(
        /src="\/ngpsie\/psiesearchsdk\/js\/([^"]+)"/g,
        `src="${cdnDomain}/ngpsie/psiesearchsdk/js/$1"`
    );

    // 替换 CSS 文件路径
    updatedContent = updatedContent.replace(
        /href="\/ngpsie\/psiesearchsdk\/css\/([^"]+)"/g,
        `href="${cdnDomain}/ngpsie/psiesearchsdk/css/$1"`
    );
    fs.writeFileSync(indexHtmlPath, updatedContent);
    console.log('index.html updated with new file references.');
}

function parseArgs(argv) {
    const args = { _: [] };
    for (let i = 0; i < argv.length; i++) {
        const arg = argv[i];
        if (arg.startsWith('--')) {
            const key = arg.slice(2);
            const next = argv[i + 1];
            args[key] = next && !next.startsWith('-') ? next : true;
            if (next && !next.startsWith('-')) i++;
        } else if (arg.startsWith('-')) {
            const key = arg.slice(1);
            const next = argv[i + 1];
            args[key] = next && !next.startsWith('-') ? next : true;
            if (next && !next.startsWith('-')) i++;
        } else {
            args._.push(arg);
        }
    }
    return args;
}

// 主函数
async function main() {
    const argv = parseArgs(process.argv.slice(2));
    const pre = (argv && argv.pre) || false;
    const distDir = path.join(__dirname, '../dist');
    const jsFiles = glob.sync(path.join(distDir, '**', '*.js'));
    const cssFiles = glob.sync(path.join(distDir, '**', '*.css'));
    const allFiles = [...jsFiles, ...cssFiles];
    // 更新index.html中的文件引用
    await updateIndexHtml(allFiles, pre);
}

// 运行主函数
main().catch(console.error);

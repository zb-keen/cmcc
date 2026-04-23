const fs = require('fs');  
const path = require('path');  
const glob = require('glob'); // 使用glob模块来匹配文件模式  
  
// 更新index.html中的文件引用  
async function updateIndexHtml(files) {  
    const indexHtmlPath = path.join(__dirname, '../dist', 'index.html');  
    const indexHtmlContent = fs.readFileSync(indexHtmlPath, 'utf8');  
    
    // 替换所有旧文件引用为新文件引用  
    let updatedContent = indexHtmlContent;  
    files.forEach(file => {
        const newBaseNameJs = '/ngpsie/psiesearchsdk/assets/js/' + path.basename(file);  
        const newBaseNameCss = '/ngpsie/psiesearchsdk/assets/css/' + path.basename(file);  
        updatedContent = updatedContent.replace(newBaseNameJs, 'https://res.app.coc.10086.cn'+newBaseNameJs);  
        updatedContent = updatedContent.replace(newBaseNameCss, 'https://res.app.coc.10086.cn'+newBaseNameCss); 
    });  
   
    
    fs.writeFileSync(indexHtmlPath, updatedContent);  
    console.log('index.html updated with new file references.');  
  }  
  
// 主函数  
async function main() {  
  const distDir = path.join(__dirname, '../dist');  
  const jsFiles = glob.sync(path.join(distDir, '**', '*.js'));  
  const cssFiles = glob.sync(path.join(distDir, '**', '*.css'));  
  const allFiles = [...jsFiles, ...cssFiles];  
  // 更新index.html中的文件引用  
  await updateIndexHtml(allFiles);  
}  
  
// 运行主函数  
main().catch(console.error);
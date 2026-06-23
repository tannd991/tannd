const fs = require('fs');
const path = require('path');

const newPhoneHtml = `  <!-- Nút gọi ngay nổi (Floating Call Button) -->
  <a href="tel:0772219688" class="phone-float shadow-2xl">
    <i class="fa-solid fa-phone"></i>
  </a>`;

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            if (!file.includes('node_modules') && !file.includes('.git') && !file.includes('.vercel') && !file.includes('admin')) {
                results = results.concat(walk(file));
            }
        } else {
            if (file.endsWith('.html')) {
                results.push(file);
            }
        }
    });
    return results;
}

const files = walk(__dirname);

files.forEach(f => {
    let content = fs.readFileSync(f, 'utf8');
    let modified = false;

    // 1. Replace HTML
    const htmlRegex = /<!-- Nút gọi ngay nổi \(Floating Call Button\) -->[\s\S]*?<\/a>/;
    if (htmlRegex.test(content)) {
        content = content.replace(htmlRegex, newPhoneHtml);
        modified = true;
    }

    // 2. Remove old CSS in <style> block
    const cssRegex = /\/\* CSS cho nút gọi điện nổi \(Floating Phone Button\) \*\/[\s\S]*?(?=<\/style>)/;
    if (cssRegex.test(content)) {
        content = content.replace(cssRegex, '');
        modified = true;
    }

    if (modified) {
        fs.writeFileSync(f, content);
        console.log('Updated: ' + f);
    }
});

console.log('Finished updating HTML files.');

const fs = require('fs');
['index.html', 'about.html', 'news.html', 'services.html'].forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  if (!content.includes('mobile-menu-btn')) {
    content = content.replace('<header>', '<header>\n    <button class="mobile-menu-btn" onclick="document.querySelector(\'nav\').classList.toggle(\'show-nav\')"><i class="fa-solid fa-bars"></i></button>');
    fs.writeFileSync(f, content);
  }
});

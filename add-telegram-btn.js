const fs = require('fs');
const path = require('path');

const telegramHTML = `
  <!-- Telegram Button -->
  <a href="https://t.me/repocskh_bot" target="_blank" rel="noopener noreferrer" class="telegram-toggle shadow-2xl">
    <i class="fa-brands fa-telegram"></i>
  </a>
`;

function walk(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    file = path.join(dir, file);
    const stat = fs.statSync(file);
    if (stat && stat.isDirectory()) {
      if (!file.includes('node_modules') && !file.includes('.git')) {
        results = results.concat(walk(file));
      }
    } else {
      if (file.endsWith('.html') || file.endsWith('.js')) {
        results.push(file);
      }
    }
  });
  return results;
}

const files = walk(__dirname);

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  if (content.includes('id="chatbot-toggle"') && !content.includes('telegram-toggle')) {
    // Replace the specific line so it inserts just before chatbot-toggle
    content = content.replace(
      '<!-- Floating Chatbot Toggle Button -->',
      telegramHTML + '\n  <!-- Floating Chatbot Toggle Button -->'
    );
    // For admin.js where it might be in a string template
    if (f.endsWith('admin.js') || f.endsWith('inject-chatbot.js')) {
        // Just in case it uses different format or we want to update the raw string
        if(content.includes('const chatHTML = `')) {
            content = content.replace(
                'const chatHTML = `\n  <!-- Floating Chatbot Toggle Button -->',
                'const chatHTML = `' + telegramHTML + '\n  <!-- Floating Chatbot Toggle Button -->'
            );
        }
    }
    fs.writeFileSync(f, content);
    console.log('Updated: ' + f);
  }
});

console.log("Done adding Telegram button to HTML and JS files.");

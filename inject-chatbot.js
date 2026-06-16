const fs = require('fs');
const path = require('path');

const chatHTML = `
  <!-- Floating Chatbot Toggle Button -->
  <button id="chatbot-toggle" class="chatbot-toggle shadow-2xl" onclick="toggleChatbot()">
      <i class="fa-solid fa-robot"></i>
  </button>

  <!-- Chatbot Window -->
  <div id="chatbot-window" class="chatbot-window shadow-2xl hidden">
      <!-- Header -->
      <div class="chat-header">
          <div class="header-info">
              <div class="avatar-container">
                  <img src="https://ui-avatars.com/api/?name=AI&background=0D8ABC&color=fff" alt="AI Avatar">
                  <span class="online-indicator"></span>
              </div>
              <div class="bot-info">
                  <h3>Trợ lý AI</h3>
                  <span>Luôn sẵn sàng hỗ trợ</span>
              </div>
          </div>
          <div class="header-actions">
              <button id="refresh-btn" class="icon-btn" title="Làm mới trò chuyện" onclick="refreshChat()">
                  <i class="fa-solid fa-rotate-right"></i>
              </button>
              <button class="icon-btn" title="Đóng" onclick="toggleChatbot()">
                  <i class="fa-solid fa-xmark"></i>
              </button>
          </div>
      </div>

      <!-- Chat Messages -->
      <div id="chat-messages" class="chat-messages">
          <!-- Messages will be injected here -->
      </div>

      <!-- Chat Input -->
      <div class="chat-input-container">
          <input type="text" id="chat-input" placeholder="Nhập tin nhắn của bạn..." onkeypress="handleEnter(event)">
          <button id="send-btn" class="send-btn" onclick="sendMessage()">
              <i class="fa-solid fa-paper-plane"></i>
          </button>
      </div>
  </div>`;

// 1. Inject into static HTML files
const files = ['about.html', 'services.html'];

files.forEach(file => {
    if (fs.existsSync(file)) {
        let content = fs.readFileSync(file, 'utf8');
        if (!content.includes('id="chatbot-toggle"')) {
            if (content.includes('<script src="script.js"></script>')) {
               content = content.replace('<script src="script.js"></script>', chatHTML + '\n  <script src="script.js"></script>');
            } else {
               content = content.replace('</body>', chatHTML + '\n</body>');
            }
            fs.writeFileSync(file, content);
        }
    }
});

// 2. Inject into admin.js template
let adminContent = fs.readFileSync('admin.js', 'utf8');
if (!adminContent.includes('id="chatbot-toggle"')) {
    adminContent = adminContent.replace('<script src="../script.js"></script>', chatHTML + '\n  <script src="../script.js"></script>');
    fs.writeFileSync('admin.js', adminContent);
}

// 3. Inject into generated post files
const postDir = path.join(__dirname, 'post');
if (fs.existsSync(postDir)) {
    const postFiles = fs.readdirSync(postDir).filter(f => f.endsWith('.html'));
    postFiles.forEach(file => {
        let content = fs.readFileSync(path.join(postDir, file), 'utf8');
        if (!content.includes('id="chatbot-toggle"')) {
            content = content.replace('<script src="../script.js"></script>', chatHTML + '\n  <script src="../script.js"></script>');
            fs.writeFileSync(path.join(postDir, file), content);
        }
    });
}

console.log("Chatbot UI injected successfully into all missing pages and templates.");

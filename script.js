// d:\Cole\tannd\script.js

// Knowledge Base Text (embedded from chatbot_data.txt)
const knowledgeBase = `Tên chuyên gia: Nguyễn Duy Tân
Định vị thương hiệu: Chuyên gia IT & Tự động hóa cho doanh nghiệp.
Giải pháp cung cấp:
  - Dịch vụ CNTT: Computer Network, IT Support
  - Xây dựng AI: tự động hóa quy trình làm việc
  - Xây dựng thương hiệu cá nhân bằng AI
Liên hệ tư vấn: Zalo 0772219688 | Facebook: https://www.facebook.com/duytan1991/`;

const API_KEY = "sk-f4cf750b41904d9580df8254cede2f16";
const API_URL = "https://api.deepseek.com/chat/completions";
const ACTUAL_MODEL_NAME = "deepseek-v4-flash";

const SYSTEM_PROMPT = `Bạn là trợ lý AI độc quyền cho chuyên gia Nguyễn Duy Tân.
Chỉ được trả lời dựa trên Knowledge Base dưới đây.
Phải trả lời bằng định dạng Markdown đẹp, rõ ràng.
Luôn tuân thủ các quy tắc sau:
1. Chào hỏi thân thiện ở câu đầu tiên.
2. Trả lời rõ ràng, đúng trọng tâm.
3. Kết thúc bằng lời mời hỏi thêm.
4. Nếu câu hỏi ngoài phạm vi Knowledge Base, hãy từ chối nhẹ nhàng và hướng dẫn liên hệ trực tiếp.

Knowledge Base:
${knowledgeBase}`;

let messages = [
    { role: "system", content: SYSTEM_PROMPT }
];

const chatMessages = document.getElementById("chat-messages");
const chatInput = document.getElementById("chat-input");
const chatbotWindow = document.getElementById("chatbot-window");

// Khởi tạo Chatbot
function initChat() {
    chatMessages.innerHTML = '';
    messages = [
        { role: "system", content: SYSTEM_PROMPT }
    ];
    appendMessage("bot", "Xin chào! 👋 Tôi là trợ lý AI của chuyên gia Nguyễn Duy Tân. Tôi có thể giúp gì cho bạn hôm nay?");
}

// Toggle cửa sổ chatbot
function toggleChatbot() {
    chatbotWindow.classList.toggle("hidden");
    const phoneFloat = document.querySelector('.phone-float');
    if (!chatbotWindow.classList.contains("hidden")) {
        chatInput.focus();
        if (phoneFloat) phoneFloat.style.display = 'none';
    } else {
        if (phoneFloat) phoneFloat.style.display = 'flex';
    }
}

// Nút Refresh chat
function refreshChat() {
    const refreshBtnIcon = document.querySelector("#refresh-btn i");
    
    // 1. Thêm animation xoay
    refreshBtnIcon.classList.add("rotating");
    
    // 2. Xóa toàn bộ lịch sử
    chatMessages.innerHTML = '';
    
    // 3. Hiển thị lại lời chào
    initChat();
    
    // 4. Dừng animation sau đúng 500ms
    setTimeout(() => {
        refreshBtnIcon.classList.remove("rotating");
    }, 500);
}

// Lắng nghe phím Enter
function handleEnter(event) {
    if (event.key === "Enter") {
        sendMessage();
    }
}

// Render Markdown qua marked.js
function renderMarkdown(text) {
    return marked.parse(text);
}

// Thêm tin nhắn vào giao diện
function appendMessage(sender, text, isMarkdown = true) {
    const msgDiv = document.createElement("div");
    msgDiv.classList.add("message", sender);
    
    if (isMarkdown && sender === 'bot') {
        msgDiv.classList.add("chat-markdown");
        msgDiv.innerHTML = renderMarkdown(text);
    } else {
        msgDiv.textContent = text;
    }
    
    chatMessages.appendChild(msgDiv);
    scrollToBottom();
}

// Hiển thị trạng thái "Đang nhập..."
function showTyping() {
    const typingDiv = document.createElement("div");
    typingDiv.id = "typing-indicator";
    typingDiv.classList.add("typing-indicator");
    typingDiv.innerHTML = `
        <span>Đang nhập</span>
        <div class="typing-dots">
            <div class="dot"></div>
            <div class="dot"></div>
            <div class="dot"></div>
        </div>
    `;
    chatMessages.appendChild(typingDiv);
    scrollToBottom();
}

// Tắt trạng thái "Đang nhập..."
function removeTyping() {
    const typingDiv = document.getElementById("typing-indicator");
    if (typingDiv) {
        typingDiv.remove();
    }
}

// Tự động cuộn xuống dưới
function scrollToBottom() {
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Gửi tin nhắn qua API DeepSeek
async function sendMessage() {
    const text = chatInput.value.trim();
    if (!text) return;

    // Hiển thị tin nhắn user
    appendMessage("user", text, false);
    chatInput.value = "";
    messages.push({ role: "user", content: text });

    // Hiện loading
    showTyping();

    try {
        const response = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: ACTUAL_MODEL_NAME,
                messages: messages,
                stream: false
            })
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();
        const botReply = data.choices[0].message.content;

        removeTyping();
        appendMessage("bot", botReply);
        messages.push({ role: "assistant", content: botReply });

    } catch (error) {
        console.error(error);
        removeTyping();
        appendMessage("bot", "Xin lỗi, đã có lỗi xảy ra khi kết nối tới hệ thống. Vui lòng thử lại sau.");
    }
}

// Khởi chạy khi load xong
document.addEventListener("DOMContentLoaded", () => {
    initChat();
});

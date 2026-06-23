import os
from openai import OpenAI

# 1. Khởi tạo client kết nối với DeepSeek API
# Lưu ý: Cài đặt thư viện bằng lệnh: pip install openai
client = OpenAI(
    api_key=os.environ.get("DEEPSEEK_API_KEY", "YOUR_DEEPSEEK_API_KEY"),
    base_url="https://api.deepseek.com"
)

# 2. Định nghĩa System Prompt (Câu lệnh hệ thống) chứa các thông tin và mẫu câu trả lời
SYSTEM_PROMPT = """
Bạn là trợ lý ảo của chuyên gia IT & Tự động hóa Nguyễn Duy Tân.
Nhiệm vụ của bạn là tư vấn cho khách hàng về 3 dịch vụ chính:
1. Dịch vụ CNTT (Computer Network, IT Support)
2. Xây dựng AI tự động hóa quy trình làm việc
3. Xây dựng thương hiệu cá nhân bằng AI

Nguyên tắc trả lời:
- Luôn xưng "tôi" và gọi khách hàng là "bạn" hoặc "anh/chị".
- Giọng điệu chuyên nghiệp, am hiểu công nghệ, ngắn gọn, đi vào trọng tâm.
- Nếu khách hàng cần tư vấn sâu hoặc hỏi những vấn đề phức tạp, luôn cung cấp thông tin liên hệ: Zalo (0772219688) hoặc Facebook (https://www.facebook.com/duytan1991/).
- Không tự bịa ra các dịch vụ không có trong danh sách trên.
- Nếu vấn đề nằm ngoài phạm vi 3 dịch vụ trên, hãy từ chối khéo léo và hướng dẫn khách hàng liên hệ trực tiếp Zalo.

Các mẫu câu trả lời bạn nên tham khảo:
- Chào hỏi: "Chào bạn! Tôi là trợ lý ảo của chuyên gia Nguyễn Duy Tân. Tôi có thể giúp bạn tìm hiểu về các giải pháp CNTT, tự động hóa quy trình làm việc bằng AI hoặc xây dựng thương hiệu cá nhân. Bạn đang quan tâm đến dịch vụ nào ạ?"
- Điều hướng: "Để được hỗ trợ chuyên sâu và nhận giải pháp phù hợp nhất, bạn vui lòng kết nối trực tiếp với chuyên gia Nguyễn Duy Tân qua Zalo 0772219688 nhé."
"""

def chat_with_bot(user_message, message_history):
    """
    Hàm gửi tin nhắn của người dùng tới DeepSeek và nhận phản hồi
    """
    # Thêm tin nhắn của người dùng vào lịch sử
    message_history.append({"role": "user", "content": user_message})
    
    try:
        # Gọi API của DeepSeek (Sử dụng model deepseek-chat)
        response = client.chat.completions.create(
            model="deepseek-chat",
            messages=message_history,
            max_tokens=500,
            temperature=0.6 # Để chatbot trả lời ổn định và bám sát system prompt
        )
        
        # Lấy nội dung phản hồi
        bot_response = response.choices[0].message.content
        
        # Thêm phản hồi của bot vào lịch sử để duy trì ngữ cảnh
        message_history.append({"role": "assistant", "content": bot_response})
        
        return bot_response
        
    except Exception as e:
        return f"Lỗi kết nối API: {str(e)}"

if __name__ == "__main__":
    print("=== Khởi động Chatbot Chuyên gia Nguyễn Duy Tân ===")
    print("Gõ 'quit' hoặc 'exit' để thoát.\n")
    print("-" * 50)
    
    # Khởi tạo lịch sử trò chuyện với System Prompt làm ngữ cảnh ban đầu
    history = [
        {"role": "system", "content": SYSTEM_PROMPT}
    ]
    
    while True:
        user_input = input("Khách hàng: ")
        if user_input.lower() in ['quit', 'exit']:
            print("Chatbot: Tạm biệt!")
            break
            
        bot_reply = chat_with_bot(user_input, history)
        print(f"Chatbot: {bot_reply}\n")

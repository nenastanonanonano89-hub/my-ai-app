<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <title>مشروع الذكاء الاصطناعي</title>
    <style>
        body { font-family: sans-serif; padding: 20px; background: #f4f4f4; text-align: center; }
        #chat-box { background: white; padding: 20px; border-radius: 8px; min-height: 250px; max-width: 600px; margin: 0 auto 10px auto; border: 1px solid #ddd; text-align: right; overflow-y: auto; }
        input { width: 70%; padding: 12px; border: 1px solid #ccc; border-radius: 4px; }
        button { padding: 12px 20px; cursor: pointer; background: #007bff; color: white; border: none; border-radius: 4px; }
        .error-msg { color: red; font-weight: bold; }
    </style>
</head>
<body>
    <h1>مرحباً بك في مشروعي</h1>
    <div id="chat-box"></div>
    <input type="text" id="userInput" placeholder="اسألي Gemini أي شيء...">
    <button onclick="sendData()">إرسال</button>

    <script>
        async function sendData() {
            const inputField = document.getElementById('userInput');
            const input = inputField.value;
            const chatBox = document.getElementById('chat-box');
            
            if (!input) return; // لو مفيش نص مكتوب متعملش حاجة

            chatBox.innerHTML += `<p><b>أنتِ:</b> ${input}</p>`;
            inputField.value = ''; // مسح الخانة بعد الإرسال

            try {
                const response = await fetch('/api/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ prompt: input })
                });
                
                const result = await response.json();
                console.log("الرد الكامل من السيرفر:", result);

                // التأكد من أن Gemini رد فعلاً
                if (result.candidates && result.candidates[0] && result.candidates[0].content) {
                    const aiResponse = result.candidates[0].content.parts[0].text;
                    chatBox.innerHTML += `<p><b>Gemini:</b> ${aiResponse}</p>`;
                    localStorage.setItem('last_chat', aiResponse);
                } else {
                    // لو الـ API Key غلط أو فيه مشكلة في جوجل
                    console.error("تفاصيل الخطأ:", result);
                    chatBox.innerHTML += `<p class="error-msg"><b>خطأ:</b> الرد وصل فاضي. تأكدي من الـ API Key في Vercel.</p>`;
                }
            } catch (error) {
                console.error("خطأ في الاتصال:", error);
                chatBox.innerHTML += `<p class="error-msg"><b>خطأ:</b> مش قادرة أوصل للسيرفر.</p>`;
            }
        }
    </script>
</body>
</html>

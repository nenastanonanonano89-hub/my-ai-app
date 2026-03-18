export default async function handler(req, res) {
  // ده السطر اللي بيقرأ المفتاح من Vercel بأمان
  const apiKey = process.env.GOOGLE_API_KEY; 

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'برجاء استخدام POST فقط' });
  }

  try {
    const { prompt } = req.body;
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: 'خطأ في الاتصال بالسيرفر' });
  }
}
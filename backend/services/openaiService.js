const axios = require('axios');

/**
 * Chat with OpenAI as an agriculture expert assistant
 * @param {String} userMessage - The user's question/message
 * @returns {String} AI response
 */
const chatWithAI = async (userMessage) => {
  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'openai/gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are an agriculture expert assistant. You help farmers with crop management, soil health, weather patterns, pest control, fertilizer usage, and farming best practices. Always provide practical, actionable advice. Be concise but thorough.'
          },
          {
            role: 'user',
            content: userMessage
          }
        ],
        max_tokens: 1000,
        temperature: 0.7
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    throw new Error(`OpenAI Error: ${error.response?.data?.error?.message || error.message}`);
  }
};

module.exports = { chatWithAI };

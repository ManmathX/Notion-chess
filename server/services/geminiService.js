import { GoogleGenerativeAI } from '@google/generative-ai';

/**
 * GeminiService — Socratic chess coaching powered by Gemini API.
 * Falls back to rule-based coaching when API key isn't configured.
 */
class GeminiService {
  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY;
    this.modelName = process.env.GEMINI_MODEL || 'gemini-2.5-flash-preview-04-17';
    this.model = null;
    
    if (this.apiKey && this.apiKey !== 'your_gemini_api_key_here') {
      const genAI = new GoogleGenerativeAI(this.apiKey);
      this.model = genAI.getGenerativeModel({ model: this.modelName });
      console.log(`🤖 Gemini API initialized (model: ${this.modelName})`);
    } else {
      console.log('⚠️  No Gemini API key found. Using rule-based Socratic coaching fallback.');
    }
  }

  /**
   * Build the system prompt for Socratic coaching
   */
  buildSystemPrompt(blunderData) {
    return `You are an elite FIDE-rated chess coach working with young students (ages 8-14) at the Notion Chess Academy.
Your teaching method is STRICTLY Socratic — you guide through questions, never give answers directly.

ABSOLUTE RULES:
1. NEVER reveal the best move in your first two messages about a position.
2. Always praise effort before correcting ("Good thinking! But let's look closer...")
3. Use simple analogies kids understand ("The rook is like a laser beam", "The knight jumps like a horse over fences")
4. Ask ONE focused question at a time. Keep it short — max 2 sentences.
5. If the student is stuck after 3 hints, give a very strong hint but still frame it as a question.
6. When they find the answer, celebrate enthusiastically! 🎉
7. After resolution, briefly explain WHY the tactic works to reinforce learning.
8. Use chess notation sparingly — describe squares by their visual position when possible.
9. Use emoji occasionally to keep the tone fun and encouraging: 🤔 💡 ⚡ 🎯 👀

CONTEXT FOR THIS POSITION:
- Board state (FEN): ${blunderData.fen}
- The student was playing as ${blunderData.color === 'w' ? 'White' : 'Black'}
- Student played: ${blunderData.movePlayed}
- This was a ${blunderData.evalDrop > 3 ? 'serious blunder' : 'mistake'} (eval went from ${blunderData.evalBefore > 0 ? '+' : ''}${blunderData.evalBefore} to ${blunderData.evalAfter > 0 ? '+' : ''}${blunderData.evalAfter})
- The best move was: ${blunderData.bestMove}
- Key tactical theme: ${blunderData.tacticalTheme}

Begin by asking a guiding question about the position. Focus on what the student should NOTICE first — the vulnerable pieces, the open lines, the undefended squares.`;
  }

  /**
   * Get a Socratic coaching response from Gemini API
   */
  async getCoachingResponse(blunderData, chatHistory) {
    // If Gemini is available, use it
    if (this.model) {
      return this.getGeminiResponse(blunderData, chatHistory);
    }
    
    // Otherwise, use rule-based fallback
    return this.getFallbackResponse(blunderData, chatHistory);
  }

  /**
   * Real Gemini API call
   */
  async getGeminiResponse(blunderData, chatHistory) {
    try {
      const systemPrompt = this.buildSystemPrompt(blunderData);
      
      // Build conversation for Gemini
      const contents = [];
      
      // Add system prompt as first user message context
      contents.push({
        role: 'user',
        parts: [{ text: systemPrompt + '\n\nPlease start the coaching session.' }]
      });
      
      // Add chat history
      for (const msg of chatHistory) {
        contents.push({
          role: msg.role === 'coach' ? 'model' : 'user',
          parts: [{ text: msg.content }]
        });
      }
      
      // If there's no history yet, this is the first message
      if (chatHistory.length === 0) {
        const result = await this.model.generateContent(systemPrompt + '\n\nBegin the coaching session with your first guiding question.');
        return result.response.text();
      }
      
      // Continue the conversation
      const chat = this.model.startChat({
        history: contents.slice(0, -1)
      });
      
      const lastMessage = contents[contents.length - 1];
      const result = await chat.sendMessage(lastMessage.parts[0].text);
      return result.response.text();
      
    } catch (err) {
      console.error('Gemini API error:', err.message);
      return this.getFallbackResponse(blunderData, chatHistory);
    }
  }

  /**
   * Rule-based Socratic coaching fallback
   */
  getFallbackResponse(blunderData, chatHistory) {
    const hintCount = chatHistory.filter(m => m.role === 'coach').length;
    const { movePlayed, bestMove, tacticalTheme, color, evalDrop } = blunderData;
    const side = color === 'w' ? 'White' : 'Black';
    const opponent = color === 'w' ? 'Black' : 'White';
    
    // Progressive hints
    if (hintCount === 0) {
      // First message — broad observation question
      const openers = [
        `Hey! 👋 Let's look at this position together. You played **${movePlayed}** — it's a natural move, but there was something even stronger here! 🤔\n\nTake a close look at ${opponent}'s King. Do you notice anything about its defenses?`,
        `Nice game! 🎯 Let's review an interesting moment. You chose **${movePlayed}**, but the position had a hidden opportunity!\n\nLook at the board carefully — can you spot any pieces that aren't protected?`,
        `Great effort in this game! 💪 At this point, you played **${movePlayed}**. Good instinct, but there was a stronger idea.\n\nWhat do you notice about the diagonal lines and open files here? 👀`,
        `Let's look at this position! 🔍 You played **${movePlayed}**, which develops naturally, but there was a tactical shot hiding here!\n\nQuestion: Look at all your pieces. Which one isn't doing much right now? Could it do something more aggressive?`
      ];
      return openers[Math.floor(Math.random() * openers.length)];
    }
    
    if (hintCount === 1) {
      // Second message — more specific direction
      const hints = [
        `Good thinking! 🤔 Let me narrow it down. The key idea involves a **${tacticalTheme}**. Look at where your ${bestMove.charAt(0) === bestMove.charAt(0).toUpperCase() ? this.getPieceName(bestMove.charAt(0)) : 'pawn'} could go!\n\nWhat squares would put the most pressure on ${opponent}'s position?`,
        `You're on the right track! 💡 Think about **${tacticalTheme}**. There's a move that could seriously disrupt ${opponent}'s setup.\n\nHint: Check which ${opponent} pieces are overburdened — defending too many things at once!`,
        `Almost there! ⚡ The theme here is **${tacticalTheme}**. Look at the squares around ${opponent}'s King.\n\nIs there a forcing move — a check, capture, or threat — that your opponent MUST respond to?`
      ];
      return hints[Math.floor(Math.random() * hints.length)];
    }
    
    if (hintCount === 2) {
      // Third message — strong hint
      return `You're really close! 🎯 Let me give you a bigger hint: The best move starts with your **${this.getPieceName(bestMove.charAt(0))}**. It involves a **${tacticalTheme}** that ${opponent} can't easily defend against!\n\nTry looking at the move **${bestMove.substring(0, 2)}...**  — where should that piece go? 🤔`;
    }
    
    if (hintCount >= 3) {
      // Fourth+ message — reveal with explanation
      return `Great effort working through this! 🎉 The best move here was **${bestMove}**!\n\nHere's why it works: This move creates a **${tacticalTheme}** that ${opponent} can't defend properly. The evaluation swung by ${evalDrop.toFixed(1)} pawns — that's a huge difference!\n\n💡 **Takeaway:** In positions like this, always check for forcing moves (checks, captures, threats) before making a quiet move. The aggressive option isn't always the best, but it's always worth considering!\n\nLet's look at the next moment... 🚀`;
    }
    
    return `Let's keep going! What do you think about this position? 🤔`;
  }

  /**
   * Convert piece letter to full name
   */
  getPieceName(letter) {
    const names = { 'K': 'King', 'Q': 'Queen', 'R': 'Rook', 'B': 'Bishop', 'N': 'Knight' };
    return names[letter] || 'pawn';
  }
}

export default new GeminiService();

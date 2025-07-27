// type ChatMessage = {
//   role: 'user' | 'assistant';
//   content: string;
// };

export const swearSystemPrompt = `
answer questions about cars, bikes, and other vehicles.
`;

export function buildPrompt(history: any[]): any[] {
  const messages = [
    {
      role: "system",
      content: swearSystemPrompt.trim(),
    },
    ...history.map((msg) => ({
      role: msg.role,
      content: msg.content,
    })),
  ];

  return messages;
}

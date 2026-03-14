// type LlmClient = {
//   generate(input: {
//     prompt: string;
//     temperature?: number;
//     maxTokens?: number;
//   }): Promise<{ text: string }>;
// };

// type Answer = {
//   answer: string;          // the final answer to show users
//   citations: string[];     // extracted citations like ["[1]", "[2]"] (see format below)
//   warnings: string[];      // any safety/quality warnings you detect
// };

// export async function answerWithCitations(
//   client: LlmClient,
//   question: string,
//   sources: Array<{ id: string; content: string }>
// ): Promise<Answer> {
//   const response = await client.generate({
//     prompt: `Question: ${question}\nSources:\n${sources.map(s => `[${s.id}] ${s.content}`).join("\n")}\nAnswer:`,
//     temperature: 0.7,
//     maxTokens: 1024
//   });

//   const citations = response.text.match(/\[\d+\]/g) || [];
//   const warnings = response.text.match(/Warning: (.*?)(?=\n|$)/g) || [];

//   return {
//     answer: response.text,
//     citations,
//     warnings
//   };
// }

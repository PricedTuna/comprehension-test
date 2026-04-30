export interface SessionData {
  sessionNumber: number;
  questionKey: string;
  question: string;
  datasetAnswer: string;
  aiAnswer: string;
  sessionTokens: number;
  objectNotationName: string;
  datasetData: string;
  prompt: string;
  usageMetadata: any;
}

export function buildHeader(
  objectNotationName: string,
  datasetName: string,
  totalTokens: number,
  timestamp: string,
  modelName: string
): string {
  return `# Comprehension Test Results\n\n` +
         `**Model**: ${modelName}\n\n` +
         `**Object Notation**: ${objectNotationName}\n\n` +
         `**Dataset**: ${datasetName}\n\n` +
         `**Total Tokens Consumed**: ${totalTokens}\n\n` +
         `**Timestamp**: ${timestamp}\n\n` +
         `---\n\n`;
}

export function buildQuestionsAndAnswersSection(sessionDataArray: SessionData[]): string {
  let section = `## Questions and Answers\n\n`;

  for (const session of sessionDataArray) {
    section += `### ${session.sessionNumber}. ${session.questionKey}\n\n`;
    section += `**Question:**\n${session.question}\n\n`;
    section += `**AI Answer:**\n${session.aiAnswer}\n\n`;
    section += `**Dataset Answer:**\n${session.datasetAnswer}\n\n`;
    section += `**Tokens Used:** ${session.sessionTokens}\n\n`;
    section += `---\n\n`;
  }

  return section;
}

export function buildDetailsSection(sessionDataArray: SessionData[]): string {
  let section = `## Details\n\n`;

  for (const session of sessionDataArray) {
    section += `### Session ${session.sessionNumber}: ${session.questionKey}\n\n`;
    section += `#### Input Data (${session.objectNotationName})\n\`\`\`${session.objectNotationName.toLowerCase()}\n${session.datasetData}\n\`\`\`\n\n`;
    section += `#### Full Prompt Sent\n\`\`\`text\n${session.prompt}\n\`\`\`\n\n`;
    section += `#### Model Response\n${session.aiAnswer}\n\n`;

    if (session.usageMetadata) {
      section += `#### Usage Metadata\n\`\`\`json\n${JSON.stringify(session.usageMetadata, null, 2)}\n\`\`\`\n\n`;
    }

    section += `---\n\n`;
  }

  return section;
}

export function buildCompleteMarkdown(
  header: string,
  questionsAndAnswers: string,
  details: string
): string {
  return header + questionsAndAnswers + details;
}

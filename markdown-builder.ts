export function buildHeader(
  objectNotationName: string,
  datasetName: string,
  totalTokens: number,
  timestamp: string
): string {
  return `# Comprehension Test Results\n\n` +
         `**Object Notation**: ${objectNotationName}\n` +
         `**Dataset**: ${datasetName}\n` +
         `**Total Tokens Consumed**: ${totalTokens}\n` +
         `**Timestamp**: ${timestamp}\n\n` +
         `---\n\n`;
}

export function buildSuccessSession(
  sessionNumber: number,
  questionKey: string,
  question: string,
  objectNotationName: string,
  datasetData: string,
  prompt: string,
  textResponse: string,
  usageMetadata: any,
  sessionTokens: number
): string {
  let sessionLog = `## Session ${sessionNumber}: ${questionKey}\n\n`;
  sessionLog += `### Question\n${question}\n\n`;
  sessionLog += `### Input Data (${objectNotationName})\n\`\`\`${objectNotationName.toLowerCase()}\n${datasetData}\n\`\`\`\n\n`;
  sessionLog += `### Full Prompt Sent\n\`\`\`text\n${prompt}\n\`\`\`\n\n`;
  sessionLog += `### Model Response\n${textResponse}\n\n`;

  if (usageMetadata) {
    sessionLog += `### Usage Metadata\n\`\`\`json\n${JSON.stringify(usageMetadata, null, 2)}\n\`\`\`\n\n`;
    sessionLog += `**Session Tokens**: ${sessionTokens}\n\n`;
  }

  sessionLog += `---\n\n`;
  return sessionLog;
}

export function buildErrorSession(
  sessionNumber: number,
  questionKey: string,
  errorMessage: string
): string {
  let sessionLog = `## Session ${sessionNumber}: ${questionKey}\n\n`;
  sessionLog += `**ERROR**: ${errorMessage}\n\n`;
  sessionLog += `---\n\n`;
  return sessionLog;
}

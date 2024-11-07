import { Configuration, OpenAIApi } from 'openai';
import { encode } from '@dqbd/tiktoken';

export class AIService {
  private openai: OpenAIApi;

  constructor(apiKey: string) {
    const configuration = new Configuration({ apiKey });
    this.openai = new OpenAIApi(configuration);
  }

  async analyzeContent(text: string): Promise<string> {
    try {
      const response = await this.openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are a PDF content analyzer. Analyze the following text and provide insights.'
          },
          {
            role: 'user',
            content: text
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      });

      return response.data.choices[0].message?.content || 'No analysis available';
    } catch (error) {
      console.error('AI analysis failed:', error);
      throw new Error('Failed to analyze content');
    }
  }

  async suggestEdits(text: string): Promise<string> {
    try {
      const response = await this.openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'You are an editor. Suggest improvements for the following text.'
          },
          {
            role: 'user',
            content: text
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      });

      return response.data.choices[0].message?.content || 'No suggestions available';
    } catch (error) {
      console.error('AI suggestions failed:', error);
      throw new Error('Failed to generate suggestions');
    }
  }

  async summarizeContent(text: string): Promise<string> {
    try {
      const response = await this.openai.createChatCompletion({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: 'Create a concise summary of the following text.'
          },
          {
            role: 'user',
            content: text
          }
        ],
        temperature: 0.7,
        max_tokens: 250
      });

      return response.data.choices[0].message?.content || 'No summary available';
    } catch (error) {
      console.error('AI summarization failed:', error);
      throw new Error('Failed to summarize content');
    }
  }
}
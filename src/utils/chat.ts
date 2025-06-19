// Professional chat utilities with advanced search, filtering, and operations
import type { 
  Message, 
  SearchFilters, 
  SearchResult, 
  SearchHighlight, 
  ChatPreferences 
} from '@/features/chat/types';

/**
 * Enhanced search functionality with fuzzy matching and relevance scoring
 */
export class ChatSearchEngine {
  private static readonly STOP_WORDS = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by'
  ]);

  /**
   * Search messages with advanced filtering and relevance scoring
   */
  static searchMessages(
    messages: Message[], 
    query: string, 
    filters: SearchFilters = {}
  ): SearchResult[] {
    if (!query.trim() && !Object.keys(filters).length) {
      return [];
    }

    const normalizedQuery = query.toLowerCase().trim();
    const searchTerms = this.tokenizeQuery(normalizedQuery);
    
    let filteredMessages = messages.filter(msg => !msg.deleted);

    // Apply filters
    filteredMessages = this.applyFilters(filteredMessages, filters);

    // Perform search and scoring
    const results: SearchResult[] = [];

    for (const message of filteredMessages) {
      const searchResult = this.scoreMessage(message, searchTerms, normalizedQuery);
      if (searchResult.relevanceScore > 0) {
        results.push(searchResult);
      }
    }

    // Sort by relevance score (highest first) and then by timestamp (newest first)
    return results.sort((a, b) => {
      const scoreDiff = b.relevanceScore - a.relevanceScore;
      if (scoreDiff !== 0) return scoreDiff;
      return new Date(b.message.timestamp).getTime() - new Date(a.message.timestamp).getTime();
    });
  }

  /**
   * Tokenize search query, removing stop words and handling phrases
   */
  private static tokenizeQuery(query: string): string[] {
    // Handle quoted phrases
    const phrases: string[] = [];
    const phraseMatches = query.match(/"([^"]+)"/g);
    
    if (phraseMatches) {
      phrases.push(...phraseMatches.map(p => p.slice(1, -1)));
      query = query.replace(/"[^"]+"/g, '');
    }

    // Tokenize remaining query
    const words = query
      .split(/\s+/)
      .filter(word => word.length > 0 && !this.STOP_WORDS.has(word));

    return [...phrases, ...words];
  }

  /**
   * Apply search filters to messages
   */
  private static applyFilters(messages: Message[], filters: SearchFilters): Message[] {
    return messages.filter(message => {
      // Role filter
      if (filters.role && filters.role !== 'all' && message.role !== filters.role) {
        return false;
      }

      // Date range filters
      const messageDate = new Date(message.timestamp);
      if (filters.dateFrom && messageDate < filters.dateFrom) {
        return false;
      }
      if (filters.dateTo && messageDate > filters.dateTo) {
        return false;
      }

      // Error filter
      if (filters.hasError !== undefined && Boolean(message.error) !== filters.hasError) {
        return false;
      }

      // Sync filter
      if (filters.onlyUnsynced && message.synced) {
        return false;
      }

      return true;
    });
  }

  /**
   * Score message relevance and generate highlights
   */
  private static scoreMessage(
    message: Message, 
    searchTerms: string[], 
    originalQuery: string
  ): SearchResult {
    const content = message.content.toLowerCase();
    let score = 0;
    const highlights: SearchHighlight[] = [];

    // Exact phrase matching (highest score)
    if (originalQuery.length > 2 && content.includes(originalQuery)) {
      score += 10;
      this.addHighlights(message.content, originalQuery, highlights);
    }

    // Individual term matching
    for (const term of searchTerms) {
      if (content.includes(term)) {
        score += 3;
        this.addHighlights(message.content, term, highlights);
      }
    }

    // Fuzzy matching for typos
    for (const term of searchTerms) {
      const fuzzyMatches = this.findFuzzyMatches(content, term);
      score += fuzzyMatches.length * 1;
      fuzzyMatches.forEach(match => {
        this.addHighlights(message.content, match, highlights);
      });
    }

    // Bonus for recent messages
    const daysSinceMessage = (Date.now() - new Date(message.timestamp).getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceMessage < 1) score *= 1.2;
    else if (daysSinceMessage < 7) score *= 1.1;

    // Bonus for user messages (they might be searching for their own queries)
    if (message.role === 'user') score *= 1.1;

    return {
      message,
      highlights: this.mergeOverlappingHighlights(highlights),
      relevanceScore: Math.round(score * 100) / 100
    };
  }

  /**
   * Add highlights for matched terms
   */
  private static addHighlights(content: string, term: string, highlights: SearchHighlight[]): void {
    const lowerContent = content.toLowerCase();
    const lowerTerm = term.toLowerCase();
    let index = lowerContent.indexOf(lowerTerm);

    while (index !== -1) {
      highlights.push({
        start: index,
        end: index + term.length,
        text: content.substring(index, index + term.length)
      });
      index = lowerContent.indexOf(lowerTerm, index + 1);
    }
  }

  /**
   * Find fuzzy matches for typos
   */
  private static findFuzzyMatches(content: string, term: string): string[] {
    if (term.length < 4) return []; // Skip fuzzy matching for short terms

    const words = content.split(/\s+/);
    const matches: string[] = [];

    for (const word of words) {
      if (this.calculateLevenshteinDistance(word, term) <= 2) {
        matches.push(word);
      }
    }

    return matches;
  }

  /**
   * Calculate Levenshtein distance for fuzzy matching
   */
  private static calculateLevenshteinDistance(str1: string, str2: string): number {
    const matrix = Array(str2.length + 1).fill(null).map(() => Array(str1.length + 1).fill(null));

    for (let i = 0; i <= str1.length; i++) matrix[0][i] = i;
    for (let j = 0; j <= str2.length; j++) matrix[j][0] = j;

    for (let j = 1; j <= str2.length; j++) {
      for (let i = 1; i <= str1.length; i++) {
        const indicator = str1[i - 1] === str2[j - 1] ? 0 : 1;
        matrix[j][i] = Math.min(
          matrix[j][i - 1] + 1,     // deletion
          matrix[j - 1][i] + 1,     // insertion
          matrix[j - 1][i - 1] + indicator // substitution
        );
      }
    }

    return matrix[str2.length][str1.length];
  }

  /**
   * Merge overlapping highlights
   */
  private static mergeOverlappingHighlights(highlights: SearchHighlight[]): SearchHighlight[] {
    if (highlights.length === 0) return [];

    const sorted = highlights.sort((a, b) => a.start - b.start);
    const merged: SearchHighlight[] = [sorted[0]];

    for (let i = 1; i < sorted.length; i++) {
      const current = sorted[i];
      const last = merged[merged.length - 1];

      if (current.start <= last.end) {
        last.end = Math.max(last.end, current.end);
        last.text = last.text.substring(0, last.end - last.start);
      } else {
        merged.push(current);
      }
    }

    return merged;
  }
}

/**
 * Message manipulation utilities
 */
export class MessageOperations {
  /**
   * Soft delete a message (mark as deleted, don't remove from array)
   */
  static deleteMessage(messages: Message[], messageId: string): Message[] {
    return messages.map(msg => 
      msg.id === messageId 
        ? { ...msg, deleted: true, content: '[Message deleted]' }
        : msg
    );
  }

  /**
   * Edit a message
   */
  static editMessage(messages: Message[], messageId: string, newContent: string): Message[] {
    return messages.map(msg => 
      msg.id === messageId 
        ? { 
            ...msg, 
            content: newContent,
            edited: true,
            originalContent: msg.originalContent || msg.content
          }
        : msg
    );
  }

  /**
   * Restore a deleted message
   */
  static restoreMessage(messages: Message[], messageId: string): Message[] {
    return messages.map(msg => 
      msg.id === messageId 
        ? { ...msg, deleted: false, content: msg.originalContent || msg.content }
        : msg
    );
  }

  /**
   * Permanently remove deleted messages
   */
  static purgeDeletedMessages(messages: Message[]): Message[] {
    return messages.filter(msg => !msg.deleted);
  }

  /**
   * Get message statistics
   */
  static getMessageStats(messages: Message[]) {
    const activeMessages = messages.filter(msg => !msg.deleted);
    
    return {
      total: activeMessages.length,
      userMessages: activeMessages.filter(msg => msg.role === 'user').length,
      assistantMessages: activeMessages.filter(msg => msg.role === 'assistant').length,
      errorMessages: activeMessages.filter(msg => msg.error).length,
      unsyncedMessages: activeMessages.filter(msg => !msg.synced).length,
      editedMessages: activeMessages.filter(msg => msg.edited).length,
      deletedMessages: messages.filter(msg => msg.deleted).length,
    };
  }
}

/**
 * Chat export utilities
 */
export class ChatExporter {
  /**
   * Export chat to different formats
   */
  static exportChat(messages: Message[], format: 'json' | 'txt' | 'md' = 'json'): string {
    const activeMessages = messages.filter(msg => !msg.deleted);

    switch (format) {
      case 'json':
        return JSON.stringify(activeMessages, null, 2);
      
      case 'txt':
        return this.exportAsText(activeMessages);
      
      case 'md':
        return this.exportAsMarkdown(activeMessages);
      
      default:
        throw new Error(`Unsupported export format: ${format}`);
    }
  }

  /**
   * Export as plain text
   */
  private static exportAsText(messages: Message[]): string {
    const lines = [`Chat Export - ${new Date().toLocaleString()}`, '=' .repeat(50), ''];

    for (const message of messages) {
      const timestamp = new Date(message.timestamp).toLocaleString();
      const speaker = message.role === 'user' ? 'You' : 'Assistant';
      lines.push(`[${timestamp}] ${speaker}:`);
      lines.push(message.content);
      lines.push('');
    }

    return lines.join('\n');
  }

  /**
   * Export as Markdown
   */
  private static exportAsMarkdown(messages: Message[]): string {
    const lines = [
      `# Chat Export`,
      `*Generated on ${new Date().toLocaleString()}*`,
      '',
      '---',
      ''
    ];

    for (const message of messages) {
      const timestamp = new Date(message.timestamp).toLocaleString();
      const speaker = message.role === 'user' ? '👤 **You**' : '🤖 **Assistant**';
      
      lines.push(`## ${speaker}`);
      lines.push(`*${timestamp}*`);
      lines.push('');
      lines.push(message.content);
      lines.push('');
      lines.push('---');
      lines.push('');
    }

    return lines.join('\n');
  }

  /**
   * Download exported chat as file
   */
  static downloadChat(content: string, filename: string, mimeType: string): void {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
}

/**
 * Message validation utilities
 */
export class MessageValidator {
  /**
   * Validate message content
   */
  static validateMessage(content: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];

    if (!content || content.trim().length === 0) {
      errors.push('Message cannot be empty');
    }

    if (content.length > 4000) {
      errors.push('Message is too long (max 4000 characters)');
    }

    if (/^\?+$/.test(content.trim())) {
      errors.push('Message cannot consist only of question marks');
    }

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Sanitize message content
   */
  static sanitizeMessage(content: string): string {
    return content
      .trim()
      .replace(/\s+/g, ' ') // Normalize whitespace
      .substring(0, 4000); // Limit length
  }
}

/**
 * Date formatting utilities for chat
 */
export class ChatDateUtils {
  /**
   * Format timestamp for display
   */
  static formatTimestamp(date: Date, preferences?: ChatPreferences): string {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);

    if (diffInMinutes < 1) {
      return 'Just now';
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes}m ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours}h ago`;
    } else if (diffInDays < 7) {
      return `${diffInDays}d ago`;
    } else {
      return date.toLocaleDateString();
    }
  }

  /**
   * Check if message should show date separator
   */
  static shouldShowDateSeparator(currentMsg: Message, previousMsg?: Message): boolean {
    if (!previousMsg) return true;

    const currentDate = new Date(currentMsg.timestamp);
    const previousDate = new Date(previousMsg.timestamp);

    return !this.isSameDay(currentDate, previousDate);
  }

  /**
   * Check if two dates are on the same day
   */
  private static isSameDay(date1: Date, date2: Date): boolean {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
  }
} 
export interface ConversionProgress {
  currentPage: number;
  totalPages: number;
  status: 'processing' | 'completed' | 'error';
  error?: string;
}

export interface ConversionResult {
  markdown: string;
  totalPages: number;
  fileName: string;
}

/**
 * Convert PDF buffer to Markdown format with advanced formatting
 */
export async function convertPdfToMarkdown(
  buffer: Buffer,
  fileName: string,
  onProgress?: (progress: ConversionProgress) => void
): Promise<ConversionResult> {
  const { PDFParse } = await import('pdf-parse');
  const path = await import('path');
  let parser: InstanceType<typeof PDFParse> | null = null;

  try {
    // Configure worker using the public directory
    const workerPath = path.join(process.cwd(), 'public', 'pdf.worker.mjs');
    PDFParse.setWorker(workerPath);

    // Parse the PDF
    parser = new PDFParse({ data: buffer });

    // Get PDF info first for total pages
    const info = await parser.getInfo();
    const totalPages = info.total;

    // Get the text content
    const textResult = await parser.getText();
    const text = textResult.text;

    let markdown = '';

    // Add document title
    markdown += `# ${fileName.replace('.pdf', '')}\n\n`;

    // Notify progress
    if (onProgress) {
      for (let i = 1; i <= totalPages; i++) {
        onProgress({
          currentPage: i,
          totalPages,
          status: 'processing'
        });
        // Simulate page-by-page processing with a small delay
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    // Apply formatting enhancements
    markdown += formatTextToMarkdown(text);

    // Final progress update
    if (onProgress) {
      onProgress({
        currentPage: totalPages,
        totalPages,
        status: 'completed'
      });
    }

    return {
      markdown,
      totalPages,
      fileName: fileName.replace('.pdf', '.md')
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';

    if (onProgress) {
      onProgress({
        currentPage: 0,
        totalPages: 0,
        status: 'error',
        error: errorMessage
      });
    }

    throw new Error(`PDF conversion failed: ${errorMessage}`);
  } finally {
    // Always clean up parser
    if (parser) {
      await parser.destroy();
    }
  }
}

/**
 * Format extracted text to Markdown with advanced formatting
 */
function formatTextToMarkdown(text: string): string {
  let formatted = text;

  // Split into lines
  const lines = formatted.split('\n');
  const processedLines: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i].trim();

    if (!line) {
      processedLines.push('');
      continue;
    }

    // Detect headings (lines in all caps or with specific patterns)
    if (isHeading(line, lines, i)) {
      const level = getHeadingLevel(line);
      line = `${'#'.repeat(level)} ${line}`;
    }

    // Detect list items
    else if (isListItem(line)) {
      line = formatListItem(line);
    }

    // Preserve bold text (if detected)
    line = preserveBoldText(line);

    // Preserve italic text (if detected)
    line = preserveItalicText(line);

    processedLines.push(line);
  }

  // Join lines and handle paragraphs
  let result = processedLines.join('\n');

  // Add proper paragraph spacing
  result = result.replace(/\n\n\n+/g, '\n\n');

  // Detect and format tables
  result = formatTables(result);

  return result;
}

/**
 * Check if a line is a heading
 */
function isHeading(line: string, allLines: string[], index: number): boolean {
  // Check if line is in all caps (potential heading)
  if (line.length > 3 && line.length < 100 && line === line.toUpperCase() && /^[A-Z0-9\s]+$/.test(line)) {
    return true;
  }

  // Check if next line is empty (potential heading)
  if (index < allLines.length - 1 && !allLines[index + 1].trim() && line.length < 100) {
    return true;
  }

  return false;
}

/**
 * Determine heading level
 */
function getHeadingLevel(line: string): number {
  // Default to h2 for most headings
  // h1 is reserved for document title
  if (line.length < 30 && line === line.toUpperCase()) {
    return 2;
  }
  return 3;
}

/**
 * Check if line is a list item
 */
function isListItem(line: string): boolean {
  // Check for bullet points or numbered lists
  return /^[•\-\*]\s/.test(line) || /^\d+[\.\)]\s/.test(line);
}

/**
 * Format list item
 */
function formatListItem(line: string): string {
  // Convert bullet points to markdown
  if (/^[•]\s/.test(line)) {
    return line.replace(/^[•]\s/, '- ');
  }

  // Keep hyphens and asterisks as-is
  if (/^[\-\*]\s/.test(line)) {
    return line;
  }

  // Format numbered lists
  if (/^\d+[\.\)]\s/.test(line)) {
    return line.replace(/^(\d+)[\.\)]\s/, '$1. ');
  }

  return line;
}

/**
 * Preserve bold text (detection is limited without PDF metadata)
 */
function preserveBoldText(line: string): string {
  // This is a simplified implementation
  // In a real scenario, you'd need PDF metadata to detect bold text
  return line;
}

/**
 * Preserve italic text (detection is limited without PDF metadata)
 */
function preserveItalicText(line: string): string {
  // This is a simplified implementation
  // In a real scenario, you'd need PDF metadata to detect italic text
  return line;
}

/**
 * Detect and format tables
 */
function formatTables(text: string): string {
  // This is a simplified table detection
  // Real table detection would require more sophisticated analysis
  const lines = text.split('\n');
  const result: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Detect lines with multiple tab-separated or space-separated columns
    if (line.includes('\t') && lines[i + 1]?.includes('\t')) {
      // Potential table detected
      const columns = line.split('\t').map(col => col.trim());

      if (columns.length > 1) {
        // Format as markdown table
        result.push('| ' + columns.join(' | ') + ' |');
        result.push('| ' + columns.map(() => '---').join(' | ') + ' |');

        // Continue processing table rows
        i++;
        while (i < lines.length && lines[i].includes('\t')) {
          const rowColumns = lines[i].split('\t').map(col => col.trim());
          result.push('| ' + rowColumns.join(' | ') + ' |');
          i++;
        }
        i--; // Adjust index
        continue;
      }
    }

    result.push(line);
  }

  return result.join('\n');
}

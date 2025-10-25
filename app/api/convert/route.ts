import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { convertPdfToMarkdown } from '@/lib/pdf-to-markdown';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.name.endsWith('.pdf')) {
      return NextResponse.json(
        { error: 'Invalid file type. Only PDF files are allowed.' },
        { status: 400 }
      );
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      return NextResponse.json(
        { error: 'File too large. Maximum size is 10MB.' },
        { status: 400 }
      );
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Convert PDF to Markdown
    const result = await convertPdfToMarkdown(
      buffer,
      file.name
    );

    // Save to /completed folder
    const outputPath = join(process.cwd(), 'completed', result.fileName);
    await writeFile(outputPath, result.markdown, 'utf-8');

    return NextResponse.json({
      success: true,
      fileName: result.fileName,
      totalPages: result.totalPages,
      message: 'PDF converted successfully'
    });

  } catch (error) {
    console.error('Conversion error:', error);

    return NextResponse.json(
      {
        error: 'Failed to convert PDF',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

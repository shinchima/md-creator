# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

md-creator is a Next.js application that converts PDF files to Markdown format. The app provides a user interface for selecting PDFs, processing them with progress tracking (showing total pages and pages completed), and saving the converted Markdown files to a `/completed` folder.

## Architecture

### Core Functionality
- **PDF Selection**: User interface for selecting PDF files to convert
- **Conversion Engine**: PDF to Markdown conversion logic with page-by-page processing
- **Progress Tracking**: Real-time feedback showing total pages and conversion progress
- **Output Management**: Saves converted Markdown files to `/completed` folder

### Technology Stack
- Next.js (React framework)
- shadcn/ui components for UI elements
- PDF parsing library (to be determined - consider pdf-parse, pdf-lib, or pdfjs-dist)
- File system operations for saving converted files

### Design System
- **UI Components**: Use shadcn/ui component library
- **Color Scheme**: Black and white only
- **Buttons**: Black background with white text
- **Typography**: Typewriter-style font family (monospace)

## Development Commands

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint
```

## Key Implementation Considerations

1. **PDF Processing**: Need to select and integrate a robust PDF parsing library that can handle various PDF formats and extract text content reliably
2. **Progress Updates**: Implement real-time progress tracking, likely using React state management and potentially Server-Sent Events or polling for long conversions
3. **File Handling**: Ensure proper file system permissions for the `/completed` output directory
4. **Error Handling**: Handle corrupted PDFs, unsupported formats, and large file sizes gracefully
5. **Markdown Formatting**: Preserve document structure (headings, lists, tables) where possible during conversion

## Project Structure (Expected)

- `/app` or `/pages`: Next.js application routes and pages
- `/components`: React components for file selection, progress display, conversion trigger
- `/lib` or `/utils`: PDF conversion logic and file system utilities
- `/completed`: Output directory for converted Markdown files
- `/public`: Static assets

## Notes

- This is a new project - initial setup and architecture decisions need to be made
- Consider whether conversion should happen client-side (browser) or server-side (API routes)
- For large PDFs, consider implementing chunked processing to avoid timeout issues

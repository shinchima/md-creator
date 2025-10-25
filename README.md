# MD Creator

A Next.js application that converts PDF files to Markdown format with a clean, monochrome user interface.

## Features

- PDF to Markdown conversion with advanced formatting support
- Real-time progress tracking showing pages processed
- Support for headings, lists, tables, and text formatting
- Clean black and white UI with typewriter-style font
- File validation (max 10MB, PDF only)
- Download converted Markdown files
- Built with Next.js 15, TypeScript, and shadcn/ui

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **UI Components**: shadcn/ui
- **Styling**: Tailwind CSS (black/white theme)
- **PDF Processing**: pdf-parse
- **Font**: Monospace/Typewriter style

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd md-creator
```

2. Install dependencies (this will automatically copy the PDF worker file):
```bash
npm install
```

Note: The `postinstall` script automatically copies the pdf-parse worker file to the `public` directory.

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
npm run build
npm start
```

## Usage

1. Click "Choose PDF File" to select a PDF from your device
2. Verify the file details shown
3. Click "Convert to Markdown" to start the conversion
4. Watch the progress as pages are processed
5. Click "Download Markdown" to save the converted file
6. Click "Convert Another File" to start over

## File Structure

```
md-creator/
├── app/
│   ├── api/
│   │   ├── convert/          # PDF conversion endpoint
│   │   └── download/         # File download endpoint
│   ├── globals.css           # Global styles with black/white theme
│   ├── layout.tsx            # Root layout
│   └── page.tsx              # Main page with conversion flow
├── components/
│   ├── ui/                   # shadcn/ui components
│   ├── file-upload.tsx       # File selection component
│   ├── progress-display.tsx  # Progress tracking component
│   └── download-interface.tsx # Download component
├── lib/
│   ├── pdf-to-markdown.ts    # PDF conversion logic
│   └── utils.ts              # Utility functions
├── completed/                # Output directory for converted files
└── public/                   # Static assets
```

## Conversion Features

The PDF to Markdown conversion includes:

- **Headings**: Automatically detects and formats document headings
- **Lists**: Preserves bullet points and numbered lists
- **Tables**: Converts tabular data to Markdown table format
- **Text Formatting**: Attempts to preserve bold and italic text
- **Paragraphs**: Proper paragraph spacing and line breaks

## Limitations

- Maximum file size: 10MB
- Only PDF files are supported
- Images in PDFs are skipped (text-only conversion)
- Complex PDF layouts may not convert perfectly
- Text formatting detection is limited by PDF structure

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

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

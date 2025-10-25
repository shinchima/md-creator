'use client';

import { useState, useRef, ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface FileUploadProps {
  onFileSelect: (file: File) => void;
  disabled?: boolean;
}

export function FileUpload({ onFileSelect, disabled }: FileUploadProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setError(null);

    if (!file) {
      setSelectedFile(null);
      return;
    }

    // Validate file type
    if (!file.name.endsWith('.pdf')) {
      setError('Please select a PDF file');
      setSelectedFile(null);
      return;
    }

    // Validate file size (max 10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      setError('File too large. Maximum size is 10MB');
      setSelectedFile(null);
      return;
    }

    setSelectedFile(file);
  };

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleConvert = () => {
    if (selectedFile) {
      onFileSelect(selectedFile);
    }
  };

  return (
    <Card className="w-full max-w-2xl border-2 border-black">
      <CardHeader>
        <CardTitle className="text-2xl">Select PDF File</CardTitle>
        <CardDescription className="text-black/70">
          Choose a PDF file to convert to Markdown format
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex flex-col gap-4">
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            onChange={handleFileChange}
            className="hidden"
            disabled={disabled}
          />

          <Button
            onClick={handleButtonClick}
            disabled={disabled}
            variant="outline"
            className="w-full border-2 border-black hover:bg-black hover:text-white transition-colors"
          >
            Choose PDF File
          </Button>

          {selectedFile && (
            <div className="p-4 border-2 border-black bg-white">
              <p className="font-semibold">Selected File:</p>
              <p className="text-sm mt-1">{selectedFile.name}</p>
              <p className="text-sm text-black/70 mt-1">
                Size: {(selectedFile.size / 1024).toFixed(2)} KB
              </p>
            </div>
          )}

          {error && (
            <Alert className="border-2 border-black">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {selectedFile && !error && (
            <Button
              onClick={handleConvert}
              disabled={disabled}
              className="w-full bg-black text-white hover:bg-black/90"
            >
              Convert to Markdown
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

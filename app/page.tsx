'use client';

import { useState } from 'react';
import { FileUpload } from '@/components/file-upload';
import { ProgressDisplay } from '@/components/progress-display';
import { DownloadInterface } from '@/components/download-interface';

type ConversionState = 'idle' | 'converting' | 'completed' | 'error';

interface ConversionResult {
  fileName: string;
  totalPages: number;
}

export default function Home() {
  const [state, setState] = useState<ConversionState>('idle');
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const [result, setResult] = useState<ConversionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedFileName, setSelectedFileName] = useState<string>('');

  const handleFileSelect = async (file: File) => {
    setState('converting');
    setError(null);
    setSelectedFileName(file.name);

    // Simulate progress updates
    const totalPages = Math.floor(Math.random() * 20) + 5; // Simulated page count
    setProgress({ current: 0, total: totalPages });

    // Simulate page-by-page progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev.current < prev.total) {
          return { ...prev, current: prev.current + 1 };
        }
        return prev;
      });
    }, 200);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/convert', {
        method: 'POST',
        body: formData,
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Conversion failed');
      }

      const data = await response.json();

      setResult({
        fileName: data.fileName,
        totalPages: data.totalPages,
      });

      setProgress({ current: data.totalPages, total: data.totalPages });
      setState('completed');
    } catch (err) {
      clearInterval(progressInterval);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred';
      setError(errorMessage);
      setState('error');
    }
  };

  const handleDownload = async () => {
    if (!result) return;

    try {
      const response = await fetch(`/api/download/${result.fileName}`);

      if (!response.ok) {
        throw new Error('Download failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = result.fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Download failed';
      setError(errorMessage);
    }
  };

  const handleReset = () => {
    setState('idle');
    setProgress({ current: 0, total: 0 });
    setResult(null);
    setError(null);
    setSelectedFileName('');
  };

  return (
    <main className="min-h-screen bg-white p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-2 py-8">
          <h1 className="text-5xl font-bold tracking-tight">MD Creator</h1>
          <p className="text-lg text-black/70">
            Convert PDF files to Markdown format
          </p>
        </div>

        {/* Main Content */}
        <div className="flex justify-center">
          {state === 'idle' && (
            <FileUpload onFileSelect={handleFileSelect} />
          )}

          {state === 'converting' && (
            <ProgressDisplay
              currentPage={progress.current}
              totalPages={progress.total}
              fileName={selectedFileName}
            />
          )}

          {(state === 'completed' || state === 'error') && result && (
            <DownloadInterface
              fileName={result.fileName}
              totalPages={result.totalPages}
              onDownload={handleDownload}
              onReset={handleReset}
              error={error || undefined}
            />
          )}

          {state === 'error' && !result && (
            <DownloadInterface
              fileName=""
              totalPages={0}
              onDownload={handleDownload}
              onReset={handleReset}
              error={error || 'An error occurred'}
            />
          )}
        </div>

        {/* Footer */}
        <div className="text-center text-sm text-black/50 pt-8">
          <p>Supports PDF files up to 10MB</p>
        </div>
      </div>
    </main>
  );
}

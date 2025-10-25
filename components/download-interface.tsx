'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface DownloadInterfaceProps {
  fileName: string;
  totalPages: number;
  onDownload: () => void;
  onReset: () => void;
  error?: string;
}

export function DownloadInterface({
  fileName,
  totalPages,
  onDownload,
  onReset,
  error
}: DownloadInterfaceProps) {
  return (
    <Card className="w-full max-w-2xl border-2 border-black">
      <CardHeader>
        <CardTitle className="text-2xl">
          {error ? 'Conversion Failed' : 'Conversion Complete'}
        </CardTitle>
        <CardDescription className="text-black/70">
          {error
            ? 'An error occurred during conversion'
            : 'Your Markdown file is ready to download'}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {error ? (
          <Alert className="border-2 border-black">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : (
          <div className="p-4 border-2 border-black bg-white">
            <p className="font-semibold">File Details:</p>
            <p className="text-sm mt-1">Name: {fileName}</p>
            <p className="text-sm mt-1">Pages Processed: {totalPages}</p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3">
          {!error && (
            <Button
              onClick={onDownload}
              className="flex-1 bg-black text-white hover:bg-black/90"
            >
              Download Markdown
            </Button>
          )}

          <Button
            onClick={onReset}
            variant="outline"
            className="flex-1 border-2 border-black hover:bg-black hover:text-white transition-colors"
          >
            Convert Another File
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

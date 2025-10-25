'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface ProgressDisplayProps {
  currentPage: number;
  totalPages: number;
  fileName: string;
}

export function ProgressDisplay({ currentPage, totalPages, fileName }: ProgressDisplayProps) {
  const progress = totalPages > 0 ? (currentPage / totalPages) * 100 : 0;

  return (
    <Card className="w-full max-w-2xl border-2 border-black">
      <CardHeader>
        <CardTitle className="text-2xl">Converting PDF</CardTitle>
        <CardDescription className="text-black/70">
          Processing: {fileName}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span className="font-semibold">
              Page {currentPage} of {totalPages}
            </span>
          </div>
          <Progress value={progress} className="h-4 bg-white border-2 border-black" />
        </div>

        <div className="p-4 border-2 border-black bg-white">
          <p className="text-sm">
            {progress < 100
              ? 'Converting your PDF to Markdown format...'
              : 'Conversion complete!'}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

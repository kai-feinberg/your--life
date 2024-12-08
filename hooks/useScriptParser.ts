import { useState, useEffect } from 'react';

export function useScriptParser(script: string) {
  const [headers, setHeaders] = useState<string[]>([]);

  useEffect(() => {
    const parsedHeaders = script
      .split('\n')
      .filter(line => line.startsWith('#'))
      .map(header => header.replace('#', '').trim());
    setHeaders(parsedHeaders);
  }, [script]);

  return headers;
}


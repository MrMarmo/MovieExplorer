'use client';

import { ReactQueryProvider } from "./ReactQueryProvider";


export function Providers({ children }: { children: React.ReactNode; }) {
  return (
    <ReactQueryProvider>
      {children}
    </ReactQueryProvider>
  );
}

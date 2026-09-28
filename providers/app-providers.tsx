// Root provider tree — add every context provider here, in the correct nesting order
import { TooltipProvider } from "@/components/ui/tooltip";

import { QueryProvider } from "./query-provider";
import { ThemeProvider } from "./theme-provider";

export function AppProviders({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <QueryProvider>
        <TooltipProvider delayDuration={300}>{children}</TooltipProvider>
      </QueryProvider>
    </ThemeProvider>
  );
}

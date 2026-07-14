import { render, type RenderOptions } from "@testing-library/react";
import type { ReactElement } from "react";
import { Provider } from "@/components/ui/provider";

export function renderWithProviders(ui: ReactElement, options?: RenderOptions) {
  return render(ui, { wrapper: Provider, ...options });
}

export * from "@testing-library/react";

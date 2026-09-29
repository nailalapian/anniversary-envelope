import "@testing-library/jest-dom/vitest";
import { cleanup, configure } from "@testing-library/react";
import { afterEach } from "vitest";

// Generated components expose `data-ocid`, not the RTL default `data-testid`.
configure({ testIdAttribute: "data-ocid" });

// RTL's automatic cleanup hooks into the global `afterEach`, which Vitest only
// exposes when `globals` is enabled. Register it explicitly so each test starts
// from an empty document.
afterEach(() => {
  cleanup();
});

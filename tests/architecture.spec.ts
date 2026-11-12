import { execFileSync } from "node:child_process";
import { resolve } from "node:path";

it("keeps thin routes, public module boundaries, an acyclic runtime graph and server-only code outside client graphs", () => {
  expect(execFileSync(process.execPath, [resolve(__dirname, "../scripts/check-architecture.mjs")], { encoding: "utf8" })).toContain("Architecture PASS");
});

import { observerPerformance } from "@/common/observer";

export default function initFP(): void {
  observerPerformance({ type: "paint" }, (entry: PerformanceEntry) => {
    if (entry.name === "first-paint") {
      console.log(entry);
    }
  });
}

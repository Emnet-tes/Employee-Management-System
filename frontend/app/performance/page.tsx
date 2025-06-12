import { getAllPerformances } from "@/lib/sanity/utils/performance";
import PerformanceClient from "./performanceClient";

export default async function PerformancePage() {
  const performances = await getAllPerformances();

  return <PerformanceClient initialPerformances={performances} />;
}

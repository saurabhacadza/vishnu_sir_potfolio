import type { Metadata } from "next";
import DostClient from "./DostClient";

export const metadata: Metadata = {
  title: "Vidya Bhumi Dost",
  description: "Vidya Bhumi Dost iframe login wrapper",
};

export default function DostPage() {
  return <DostClient />;
}

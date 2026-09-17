import {
  Cloud,
  Code2,
  Database,
  LayoutGrid,
  Palette,
  Server,
  Terminal,
  Wrench,
  type LucideIcon,
} from "lucide-react";
import type { IconKey } from "../types";

export const iconMap: Record<IconKey, LucideIcon> = {
  code: Code2,
  server: Server,
  palette: Palette,
  database: Database,
  cloud: Cloud,
  wrench: Wrench,
  terminal: Terminal,
  layout: LayoutGrid,
};

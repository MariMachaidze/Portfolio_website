export function formatDateRange(start: string, end: string): string {
  const format = (value: string) => {
    if (value === "Present") return value;
    const [year, month] = value.split("-");
    const date = new Date(Number(year), Number(month) - 1);
    return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
  };
  return `${format(start)} – ${format(end)}`;
}

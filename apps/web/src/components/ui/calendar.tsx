import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import type { DayPickerProps } from "react-day-picker";

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: DayPickerProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={`p-3 ${className ?? ""}`}
      classNames={{
        months: "flex flex-col gap-4 sm:flex-row sm:gap-6",
        month: "space-y-4",
        caption: "relative flex items-center justify-center pt-1",
        caption_label: "text-sm font-medium text-slate-900 dark:text-slate-100",
        nav: "flex items-center gap-1",
        nav_button:
          "h-7 w-7 rounded-md border border-slate-200 bg-white p-0 text-slate-500 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300 dark:hover:bg-slate-800",
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell: "w-9 text-center text-xs font-medium text-slate-500 dark:text-slate-400",
        row: "mt-2 flex w-full",
        cell: "relative h-9 w-9 text-center text-sm",
        day: "h-9 w-9 rounded-md p-0 text-sm font-normal text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800",
        day_selected:
          "bg-[var(--dash-primary)] text-white hover:bg-[var(--dash-primary-strong)] dark:text-white",
        day_today: "bg-slate-100 text-slate-900 dark:bg-slate-800 dark:text-slate-100",
        day_outside: "text-slate-400 opacity-50 dark:text-slate-500",
        day_disabled: "text-slate-300 opacity-40 dark:text-slate-600",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: () => <ChevronLeft className="h-4 w-4" />,
        IconRight: () => <ChevronRight className="h-4 w-4" />,
      }}
      {...props}
    />
  );
}

export { Calendar };

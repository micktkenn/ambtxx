import type { ReactNode } from "react";

export type DataTableColumn<T> = {
  header: string;
  render: (row: T) => ReactNode;
};

export function DataTable<T extends { id?: string }>({ columns, data, emptyMessage = "No records found." }: { columns: DataTableColumn<T>[]; data: T[]; emptyMessage?: string }) {
  if (!data.length) {
    return <div className="rounded-card border border-amlbt-border bg-white p-8 text-center text-sm text-amlbt-text-muted">{emptyMessage}</div>;
  }

  return (
    <div className="overflow-hidden rounded-card border border-amlbt-border bg-white">
      <table className="hidden w-full border-collapse text-sm md:table">
        <thead>
          <tr className="bg-amlbt-muted">
            {columns.map((column) => (
              <th key={column.header} className="border-b border-amlbt-border-soft px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-amlbt-text-muted">
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={row.id ?? index} className="border-b border-amlbt-border-soft last:border-b-0">
              {columns.map((column) => (
                <td key={column.header} className="px-4 py-3 align-middle">
                  {column.render(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      <div className="divide-y divide-amlbt-border-soft md:hidden">
        {data.map((row, index) => (
          <div key={row.id ?? index} className="space-y-3 p-4">
            {columns.map((column) => (
              <div key={column.header} className="flex items-start justify-between gap-4 text-sm">
                <span className="text-amlbt-text-muted">{column.header}</span>
                <span className="text-right font-medium">{column.render(row)}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

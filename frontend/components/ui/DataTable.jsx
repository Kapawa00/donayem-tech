'use client';

import { ChevronLeft, ChevronRight, Inbox } from 'lucide-react';
import Loader from './Loader';
import { cn } from '@/lib/utils';

export default function DataTable({
  columns,
  data,
  loading = false,
  emptyMessage = 'Aucune donnée pour le moment.',
  onRowClick,
  keyField = 'id',
  pagination,
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left font-inter text-sm">
          <thead className="border-b border-border bg-surface">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted"
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-16 text-center">
                  <Loader size={32} className="mx-auto" />
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-4 py-16 text-center">
                  <div className="flex flex-col items-center gap-3 text-muted">
                    <Inbox size={36} className="text-border" />
                    <p>{emptyMessage}</p>
                  </div>
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr
                  key={row[keyField]}
                  onClick={onRowClick ? () => onRowClick(row) : undefined}
                  className={cn(onRowClick && 'cursor-pointer hover:bg-surface')}
                >
                  {columns.map((column) => (
                    <td key={column.key} className="whitespace-nowrap px-4 py-3 text-dark">
                      {column.render ? column.render(row) : row[column.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pagination && pagination.lastPage > 1 && (
        <div className="flex items-center justify-between border-t border-border px-4 py-3">
          <p className="font-inter text-xs text-muted">
            Page {pagination.currentPage} / {pagination.lastPage}
          </p>
          <div className="flex gap-2">
            <button
              type="button"
              disabled={pagination.currentPage <= 1}
              onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
              aria-label="Page précédente"
              className="flex h-8 w-8 items-center justify-center rounded-md border border-border text-muted
                         transition-colors hover:text-dark disabled:pointer-events-none disabled:opacity-40"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              type="button"
              disabled={pagination.currentPage >= pagination.lastPage}
              onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
              aria-label="Page suivante"
              className="flex h-8 w-8 items-center justify-center rounded-md border border-border text-muted
                         transition-colors hover:text-dark disabled:pointer-events-none disabled:opacity-40"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

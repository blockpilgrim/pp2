"use client";

import { Cross2Icon, FileIcon, DownloadIcon } from "@radix-ui/react-icons";
import { Table } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { DataTableViewOptions } from "./data-table-view-options";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
  filterableColumns?: {
    id: string;
    title: string;
    options: {
      label: string;
      value: string;
      icon?: React.ComponentType<{ className?: string }>;
    }[];
  }[];
  searchableColumns?: {
    id: string;
    title: string;
  }[];
  exportOptions?: {
    formats: Array<"csv" | "excel" | "pdf">;
    customExport?: (data: TData[], format: string) => void;
  };
}

export function DataTableToolbar<TData>({
  table,
  filterableColumns = [],
  searchableColumns = [],
  exportOptions,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;
  const hasSelectedRows = table.getState().rowSelection 
    && Object.values(table.getState().rowSelection).some(Boolean);

  // Default export function
  const handleExport = (format: string) => {
    if (exportOptions?.customExport) {
      const allRows = table.getFilteredRowModel().rows.map(row => row.original);
      exportOptions.customExport(allRows, format);
      return;
    }

    // Fallback export implementation
    const selectedRows = hasSelectedRows 
      ? table.getFilteredSelectedRowModel().rows.map(row => row.original)
      : table.getFilteredRowModel().rows.map(row => row.original);
    
    if (format === 'csv') {
      // Simple CSV export
      const headers = Object.keys(selectedRows[0] || {}).join(',');
      const csvData = selectedRows.map(row => 
        Object.values(row as Record<string, any>).join(',')
      ).join('\n');
      
      const csvContent = `${headers}\n${csvData}`;
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', 'export.csv');
      link.click();
    }
  };
  
  return (
    <div className="flex flex-wrap items-center justify-between gap-2">
      <div className="flex flex-1 items-center space-x-2">
        {/* Search inputs for searchable columns */}
        {searchableColumns.length > 0 && (
          <Input
            placeholder={`Search ${
              searchableColumns.length > 1 
                ? "..." 
                : searchableColumns[0]?.title?.toLowerCase()
            }`}
            value={(table.getColumn(searchableColumns[0]?.id)?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn(searchableColumns[0]?.id)?.setFilterValue(event.target.value)
            }
            className="h-8 w-[150px] lg:w-[250px]"
          />
        )}
        
        {/* Filters for filterable columns */}
        {filterableColumns.map(
          (column) =>
            table.getColumn(column.id) && (
              <DataTableFacetedFilter
                key={column.id}
                column={table.getColumn(column.id)}
                title={column.title}
                options={column.options}
              />
            )
        )}
        
        {/* Reset filters button */}
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => table.resetColumnFilters()}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
      
      <div className="flex items-center space-x-2">
        {/* Export options */}
        {exportOptions && (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-8">
                <DownloadIcon className="mr-2 h-4 w-4" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {hasSelectedRows && (
                <>
                  <DropdownMenuItem
                    onClick={() => handleExport('csv')}
                    className="cursor-pointer"
                  >
                    Export Selected as CSV
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                </>
              )}
              {exportOptions.formats.includes('csv') && (
                <DropdownMenuItem
                  onClick={() => handleExport('csv')}
                  className="cursor-pointer"
                >
                  <FileIcon className="mr-2 h-4 w-4" /> Export as CSV
                </DropdownMenuItem>
              )}
              {exportOptions.formats.includes('excel') && (
                <DropdownMenuItem
                  onClick={() => handleExport('excel')}
                  className="cursor-pointer"
                >
                  <FileIcon className="mr-2 h-4 w-4" /> Export as Excel
                </DropdownMenuItem>
              )}
              {exportOptions.formats.includes('pdf') && (
                <DropdownMenuItem
                  onClick={() => handleExport('pdf')}
                  className="cursor-pointer"
                >
                  <FileIcon className="mr-2 h-4 w-4" /> Export as PDF
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )}
        
        {/* Column visibility options */}
        <DataTableViewOptions table={table} />
      </div>
    </div>
  );
}
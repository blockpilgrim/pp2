"use client";

import React from 'react';
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { DotsHorizontalIcon, PlusCircledIcon, CheckCircledIcon, CircleIcon, CrossCircledIcon } from "@radix-ui/react-icons";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Progress } from '@/components/ui/progress';

import {
  DataTable,
  DataTableColumnHeader,
} from "@/components/ui/data-table";

// Define the data structure for leads
interface Lead {
  id: string;
  name: string;
  email: string;
  company: string;
  role: string;
  status: "active" | "pending" | "inactive";
  priority: "high" | "medium" | "low";
  date: string;
  progress: number;
  assignedTo?: string;
  notes?: string;
  lastContact?: string;
  tags: string[];
}

// Generate sample data
const leads: Lead[] = Array.from({ length: 50 }).map((_, i) => {
  const id = `LD-${1000 + i}`;
  const statuses = ["active", "pending", "inactive"] as const;
  const priorities = ["high", "medium", "low"] as const;
  const names = [
    "Emma Johnson", "Liam Smith", "Olivia Williams", "Noah Jones", "Charlotte Brown",
    "James Miller", "Sophia Davis", "Benjamin Wilson", "Amelia Taylor", "William Moore",
    "Isabella Anderson", "Mason Thomas", "Mia Jackson", "Ethan White", "Ava Harris"
  ];
  const companies = [
    "Acme Corporation", "Globex Inc.", "Soylent Corp", "Initech Industries", "Umbrella Corp",
    "Stark Industries", "Wayne Enterprises", "Cyberdyne Systems", "Massive Dynamic", "Oscorp",
    "Hooli", "Pied Piper", "Dunder Mifflin", "Wonka Industries", "InGen"
  ];
  const roles = [
    "CEO", "CTO", "CFO", "Marketing Director", "Sales Manager",
    "IT Manager", "HR Director", "Product Manager", "Operations Director", "Customer Success Manager"
  ];
  const tags = [
    "enterprise", "startup", "healthcare", "finance", "technology", 
    "education", "retail", "manufacturing", "government", "nonprofit",
    "prospect", "customer", "partner", "vendor", "influencer"
  ];

  // Get 1-3 random tags
  const randomTags = Array.from(
    { length: Math.floor(Math.random() * 3) + 1 },
    () => tags[Math.floor(Math.random() * tags.length)]
  ).filter((v, i, a) => a.indexOf(v) === i); // Remove duplicates

  return {
    id,
    name: names[Math.floor(Math.random() * names.length)],
    email: `example${i}@company.com`,
    company: companies[Math.floor(Math.random() * companies.length)],
    role: roles[Math.floor(Math.random() * roles.length)],
    status: statuses[Math.floor(Math.random() * statuses.length)],
    priority: priorities[Math.floor(Math.random() * priorities.length)],
    date: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    progress: Math.floor(Math.random() * 100),
    assignedTo: Math.random() > 0.3 ? names[Math.floor(Math.random() * names.length)] : undefined,
    lastContact: Math.random() > 0.5 
      ? new Date(Date.now() - Math.floor(Math.random() * 14) * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
      : undefined,
    notes: Math.random() > 0.7 ? "Some notes about this lead..." : undefined,
    tags: randomTags,
  };
});

export default function TablesPage() {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [selectedRows, setSelectedRows] = React.useState<Lead[]>([]);

  // Column definitions
  const columns: ColumnDef<Lead>[] = [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "id",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="ID" />
      ),
      cell: ({ row }) => <div className="w-[80px]">{row.getValue("id")}</div>,
      enableHiding: false,
      size: 80,
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Name" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex items-center">
            <Avatar className="h-8 w-8 mr-2">
              <AvatarFallback>
                {row.getValue<string>("name")
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <span className="font-medium">{row.getValue("name")}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "email",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Email" />
      ),
      cell: ({ row }) => <div>{row.getValue("email")}</div>,
    },
    {
      accessorKey: "company",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Company" />
      ),
      cell: ({ row }) => <div>{row.getValue("company")}</div>,
    },
    {
      accessorKey: "role",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Role" />
      ),
      cell: ({ row }) => <div>{row.getValue("role")}</div>,
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
      cell: ({ row }) => {
        const status = row.getValue("status") as string;
        return (
          <div className="flex w-[100px] items-center">
            {status === "active" ? (
              <Badge variant="success" className="capitalize">
                <CheckCircledIcon className="mr-1 h-3.5 w-3.5" />
                Active
              </Badge>
            ) : status === "pending" ? (
              <Badge variant="warning" className="capitalize">
                <CircleIcon className="mr-1 h-3.5 w-3.5" />
                Pending
              </Badge>
            ) : (
              <Badge variant="destructive" className="capitalize">
                <CrossCircledIcon className="mr-1 h-3.5 w-3.5" />
                Inactive
              </Badge>
            )}
          </div>
        );
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: "priority",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Priority" />
      ),
      cell: ({ row }) => {
        const priority = row.getValue("priority") as string;
        return (
          <div className="flex items-center">
            {priority === "high" ? (
              <Badge className="bg-red-500 hover:bg-red-700">High</Badge>
            ) : priority === "medium" ? (
              <Badge className="bg-yellow-500 hover:bg-yellow-700">Medium</Badge>
            ) : (
              <Badge className="bg-green-500 hover:bg-green-700">Low</Badge>
            )}
          </div>
        );
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id));
      },
    },
    {
      accessorKey: "date",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Date" />
      ),
      cell: ({ row }) => <div>{row.getValue("date")}</div>,
    },
    {
      accessorKey: "progress",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Progress" />
      ),
      cell: ({ row }) => {
        const progress = row.getValue("progress") as number;
        return (
          <div className="flex items-center gap-2">
            <Progress
              value={progress}
              className="h-2 w-[60px]"
              style={{
                // Conditional styling based on progress value
                background: progress < 30 ? 'var(--destructive)' : 
                            progress < 70 ? 'var(--warning)' : 
                            'var(--success)'
              }}
            />
            <span className="text-xs text-muted-foreground">{progress}%</span>
          </div>
        );
      },
    },
    {
      accessorKey: "tags",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Tags" />
      ),
      cell: ({ row }) => {
        const tags = row.getValue("tags") as string[];
        return (
          <div className="flex flex-wrap gap-1">
            {tags.map((tag) => (
              <Badge key={tag} variant="outline" className="capitalize">
                {tag}
              </Badge>
            ))}
          </div>
        );
      },
      filterFn: (row, id, value) => {
        const tags = row.getValue(id) as string[];
        return value.some((v: string) => tags.includes(v));
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const lead = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <DotsHorizontalIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(lead.id)}
              >
                Copy ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>View details</DropdownMenuItem>
              <DropdownMenuItem>Edit lead</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                Delete lead
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  // Handle row selection changes
  React.useEffect(() => {
    const selectedLeads = Object.keys(rowSelection).map(
      (key) => leads[parseInt(key)]
    );
    setSelectedRows(selectedLeads);
  }, [rowSelection]);

  // Process the selected rows
  const handleExportSelected = () => {
    console.log("Exporting selected leads:", selectedRows);
    // Implement export functionality here
  };

  const handleDeleteSelected = () => {
    console.log("Deleting selected leads:", selectedRows);
    // Implement delete functionality here
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Advanced Data Tables</h1>
      
      <div className="space-y-8">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle>Lead Management Table</CardTitle>
            <CardDescription>
              A comprehensive example of a data table with advanced features for managing leads.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable
              columns={columns}
              data={leads}
              enableRowSelection={true}
              onRowSelectionChange={setSelectedRows}
              filterableColumns={[
                {
                  id: "status",
                  title: "Status",
                  options: [
                    { label: "Active", value: "active", icon: CheckCircledIcon },
                    { label: "Pending", value: "pending", icon: CircleIcon },
                    { label: "Inactive", value: "inactive", icon: CrossCircledIcon },
                  ],
                },
                {
                  id: "priority",
                  title: "Priority",
                  options: [
                    { label: "High", value: "high" },
                    { label: "Medium", value: "medium" },
                    { label: "Low", value: "low" },
                  ],
                },
                {
                  id: "tags",
                  title: "Tags",
                  options: [
                    { label: "Enterprise", value: "enterprise" },
                    { label: "Startup", value: "startup" },
                    { label: "Healthcare", value: "healthcare" },
                    { label: "Finance", value: "finance" },
                    { label: "Technology", value: "technology" },
                    { label: "Prospect", value: "prospect" },
                    { label: "Customer", value: "customer" },
                    { label: "Partner", value: "partner" },
                  ],
                },
              ]}
              searchableColumns={[
                {
                  id: "name",
                  title: "Name",
                },
                {
                  id: "email",
                  title: "Email",
                },
                {
                  id: "company",
                  title: "Company",
                },
              ]}
              exportOptions={{
                formats: ["csv", "excel", "pdf"],
                customExport: (data, format) => {
                  console.log(`Exporting ${data.length} rows as ${format}`);
                  // Custom export logic here
                },
              }}
              pagination={{
                pageSize: 10,
                pageSizeOptions: [5, 10, 20, 50, 100],
              }}
            />
            
            {/* Bulk actions for selected rows */}
            {Object.keys(rowSelection).length > 0 && (
              <div className="flex items-center gap-2 mt-4 p-2 border rounded bg-muted">
                <span className="text-sm text-muted-foreground">
                  {Object.keys(rowSelection).length} row(s) selected
                </span>
                <div className="flex-1"></div>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleExportSelected}
                >
                  Export Selected
                </Button>
                <Button 
                  variant="destructive" 
                  size="sm"
                  onClick={handleDeleteSelected}
                >
                  Delete Selected
                </Button>
              </div>
            )}

            <div className="mt-6">
              <h3 className="text-lg font-medium">Table Features</h3>
              <ul className="list-disc pl-5 space-y-1 mt-2">
                <li>Row selection with bulk actions</li>
                <li>Column sorting (click on column headers)</li>
                <li>Column filters (Status, Priority, Tags)</li>
                <li>Searchable columns (Name, Email, Company)</li>
                <li>Column visibility toggle (View button)</li>
                <li>Pagination with custom page size</li>
                <li>Export functionality (CSV, Excel, PDF)</li>
                <li>Progress bar visualization</li>
                <li>Context menu with row actions</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
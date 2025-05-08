"use client";

import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { DataCard } from '@/components/custom/data-display/data-card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';

export default function DataDisplayPage() {
  const [progress, setProgress] = React.useState(13);

  React.useEffect(() => {
    const timer = setTimeout(() => setProgress(66), 500);
    return () => clearTimeout(timer);
  }, []);

  const leadData = [
    { id: "LD-5243", name: "Sarah Johnson", company: "Acme Corp", status: "active", progress: 75, date: "2025-04-15" },
    { id: "LD-3791", name: "Michael Chen", company: "Globex Inc", status: "pending", progress: 30, date: "2025-04-18" },
    { id: "LD-8912", name: "Emily Rodriguez", company: "Umbrella LLC", status: "inactive", progress: 0, date: "2025-04-10" },
    { id: "LD-6728", name: "David Kim", company: "Stark Industries", status: "active", progress: 50, date: "2025-04-22" },
    { id: "LD-4201", name: "Lisa Wang", company: "Cyberdyne Systems", status: "active", progress: 90, date: "2025-04-05" },
  ];

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Data Display Components</h1>
      <p className="text-muted-foreground mb-8">
        This page demonstrates various data display components for presenting information in different formats.
      </p>
      
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Data Cards</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <DataCard 
            title="Total Leads" 
            value="1,284" 
            description="Last 30 days" 
            trend={{ value: 12.5, direction: "up" }}
            variant="default"
          />
          <DataCard 
            title="Conversion Rate" 
            value="24.8%" 
            description="Vs. 18.2% last month" 
            trend={{ value: 6.6, direction: "up" }}
            variant="success"
          />
          <DataCard 
            title="Average Response Time" 
            value="3.6 hours" 
            description="Target: 2 hours" 
            trend={{ value: 10.2, direction: "down", label: "improvement" }}
            variant="info"
          />
          <DataCard 
            title="Pending Reviews" 
            value="42" 
            description="Needs attention" 
            trend={{ value: 15.3, direction: "up", label: "increase" }}
            variant="warning"
          />
        </div>
      </section>
      
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Status Badges</h2>
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-wrap gap-3">
              <Badge variant="default">Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="outline">Outline</Badge>
              <Badge variant="destructive">Destructive</Badge>
              <Badge variant="success">Success</Badge>
              <Badge variant="warning">Warning</Badge>
              <Badge variant="info">Info</Badge>
            </div>
          </CardContent>
        </Card>
      </section>
      
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Avatars</h2>
        <Card className="mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-wrap items-center gap-4">
              <Avatar>
                <AvatarImage src="/avatars/01.png" alt="Avatar" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <Avatar>
                <AvatarImage src="/avatars/02.png" alt="Avatar" />
                <AvatarFallback>AB</AvatarFallback>
              </Avatar>
              <Avatar className="h-14 w-14">
                <AvatarFallback className="bg-primary text-primary-foreground">MS</AvatarFallback>
              </Avatar>
              <Avatar className="h-8 w-8">
                <AvatarFallback className="bg-secondary text-secondary-foreground">ZY</AvatarFallback>
              </Avatar>
            </div>
          </CardContent>
        </Card>
      </section>
      
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Progress Bars</h2>
        <Card className="mb-6">
          <CardContent className="pt-6 space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Default Progress</span>
                <span className="text-sm font-medium">{progress}%</span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Low Progress</span>
                <span className="text-sm font-medium">25%</span>
              </div>
              <Progress value={25} className="w-full h-3" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">High Progress</span>
                <span className="text-sm font-medium">88%</span>
              </div>
              <Progress value={88} className="w-full h-3" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Custom Color</span>
                <span className="text-sm font-medium">50%</span>
              </div>
              <Progress value={50} className="w-full h-3 [&>div]:bg-blue-500" />
            </div>
          </CardContent>
        </Card>
      </section>
      
      <section className="mb-10">
        <h2 className="text-2xl font-semibold mb-4">Data Tables</h2>
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableCaption>A list of recent leads and their status.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Company</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead className="text-right">Date Added</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leadData.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell className="font-medium">{lead.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8">
                          <AvatarFallback>{lead.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        {lead.name}
                      </div>
                    </TableCell>
                    <TableCell>{lead.company}</TableCell>
                    <TableCell>
                      <Badge variant={
                        lead.status === 'active' ? 'success' : 
                        lead.status === 'pending' ? 'warning' : 
                        'destructive'
                      }>
                        {lead.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="w-full max-w-xs">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs">{lead.progress}%</span>
                        </div>
                        <Progress value={lead.progress} className="h-2" />
                      </div>
                    </TableCell>
                    <TableCell className="text-right">{lead.date}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
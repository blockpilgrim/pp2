import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

export default function StylingTestPage() {
  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Styling Test Page (shadcn/ui)</h1>

      <Card>
        <CardHeader>
          <CardTitle>Components</CardTitle>
          <CardDescription>Testing the imported shadcn/ui components.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-2">
             <Button>Default Button</Button>
             <Button variant="destructive">Destructive</Button>
             <Button variant="outline">Outline</Button>
             <Button variant="secondary">Secondary</Button>
             <Button variant="ghost">Ghost</Button>
             <Button variant="link">Link</Button>
          </div>
          <div>
            <Input type="email" placeholder="Email Input" />
          </div>
          <div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">Open Menu</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Billing</DropdownMenuItem>
                <DropdownMenuItem>Team</DropdownMenuItem>
                <DropdownMenuItem>Subscription</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardContent>
        <CardFooter>
          <p>Card Footer</p>
        </CardFooter>
      </Card>
    </div>
  );
}

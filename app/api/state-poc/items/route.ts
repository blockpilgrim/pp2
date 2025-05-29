import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';

// Zod schema for item validation
const itemSchema = z.object({
  id: z.string().optional(), // Optional for creation, required for update/delete
  text: z.string().min(1, 'Text cannot be empty'),
  completed: z.boolean().optional(),
});

export type Item = z.infer<typeof itemSchema>;

// In-memory store for items
let items: Item[] = [
  { id: '1', text: 'Learn TanStack Query', completed: true },
  { id: '2', text: 'Implement Optimistic Updates', completed: false },
  { id: '3', text: 'Showcase Zod Validation', completed: false },
];

// GET: Fetch all items
export async function GET(request: NextRequest) {
  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  return NextResponse.json(items);
}

// POST: Add a new item
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const newItemData = itemSchema.omit({ id: true }).parse(body);
    const newItem: Item = {
      id: String(Date.now()), // Simple ID generation
      ...newItemData,
      completed: newItemData.completed ?? false,
    };
    items.push(newItem);
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// PATCH: Update an existing item
export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, ...updateData } = itemSchema.partial().extend({ id: z.string() }).parse(body);

    if (!id) {
      return NextResponse.json({ error: 'Item ID is required for update' }, { status: 400 });
    }

    const itemIndex = items.findIndex(item => item.id === id);
    if (itemIndex === -1) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }

    items[itemIndex] = { ...items[itemIndex], ...updateData };
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return NextResponse.json(items[itemIndex]);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// DELETE: Delete an item
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Item ID is required for deletion' }, { status: 400 });
    }
    const itemSchemaIdOnly = z.object({ id: z.string() });
    itemSchemaIdOnly.parse({ id }); // Validate ID format

    const initialLength = items.length;
    items = items.filter(item => item.id !== id);

    if (items.length === initialLength) {
      return NextResponse.json({ error: 'Item not found' }, { status: 404 });
    }
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return NextResponse.json({ message: 'Item deleted successfully' }, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors }, { status: 400 });
    }
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

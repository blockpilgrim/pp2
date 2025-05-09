import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth'; // Corrected import path

// Mock data for demonstration - in a real scenario, this would interact with a database or service
interface Item {
  id: string;
  name: string;
  description: string;
  createdAt?: string;
  updatedAt?: string;
}

let mockItems: Item[] = [
  { id: '1', name: 'Item 1', description: 'This is the first mock item.', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '2', name: 'Item 2', description: 'This is the second mock item.', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
  { id: '3', name: 'Item 3', description: 'This is the third mock item.', createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() },
];

/**
 * Handles GET requests to /api/bff-poc/items
 * Retrieves a list of items.
 * Requires authentication.
 */
export async function GET(req: NextRequest) {
  const session = await auth();

  if (!session || !session.user) {
    return NextResponse.json({ message: 'Unauthorized: You must be logged in to view items.' }, { status: 401 });
  }

  try {
    // Simulate fetching data
    return NextResponse.json(mockItems, { status: 200 });
  } catch (error) {
    console.error('[BFF_ITEMS_GET] Error fetching items:', error);
    return NextResponse.json({ message: 'Internal Server Error: Could not retrieve items.' }, { status: 500 });
  }
}

/**
 * Handles POST requests to /api/bff-poc/items
 * Creates a new item.
 * Requires authentication.
 * Expects a JSON body with 'name' and 'description'.
 */
export async function POST(req: NextRequest) {
  const session = await auth();

  if (!session || !session.user) {
    return NextResponse.json({ message: 'Unauthorized: You must be logged in to create an item.' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, description } = body;

    // Basic validation (Zod would be used for more robust validation as per plan)
    if (!name || !description) {
      return NextResponse.json({ message: 'Bad Request: Name and description are required.' }, { status: 400 });
    }
    if (typeof name !== 'string' || typeof description !== 'string') {
        return NextResponse.json({ message: 'Bad Request: Name and description must be strings.' }, { status: 400 });
    }


    const newItem: Item = {
      id: String(Date.now()), // Simple ID generation for mock data
      name,
      description,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mockItems.push(newItem); // In-memory storage: will reset on server restart
    return NextResponse.json(newItem, { status: 201 });
  } catch (error) {
    console.error('[BFF_ITEMS_POST] Error creating item:', error);
    if (error instanceof SyntaxError) {
        return NextResponse.json({ message: 'Bad Request: Invalid JSON payload.' }, { status: 400 });
    }
    return NextResponse.json({ message: 'Internal Server Error: Could not create item.' }, { status: 500 });
  }
}

/**
 * Handles PATCH requests to /api/bff-poc/items
 * Updates an existing item by ID.
 * Requires authentication.
 * Expects an 'id' as a query parameter (e.g., /api/bff-poc/items?id=1)
 * Expects a JSON body with 'name' and/or 'description' to update.
 */
export async function PATCH(req: NextRequest) {
  const session = await auth();

  if (!session || !session.user) {
    return NextResponse.json({ message: 'Unauthorized: You must be logged in to update an item.' }, { status: 401 });
  }

  const itemId = req.nextUrl.searchParams.get('id');

  if (!itemId) {
    return NextResponse.json({ message: 'Bad Request: Item ID is required as a query parameter for PATCH request.' }, { status: 400 });
  }

  try {
    const body = await req.json();
    const { name, description } = body;

    // Basic validation
    if (!name && !description) {
      return NextResponse.json({ message: 'Bad Request: At least one field (name or description) must be provided for update.' }, { status: 400 });
    }

    const itemIndex = mockItems.findIndex(item => item.id === itemId);

    if (itemIndex === -1) {
      return NextResponse.json({ message: 'Not Found: Item with the provided ID does not exist.' }, { status: 404 });
    }

    const updatedItem = { ...mockItems[itemIndex] };
    if (name !== undefined) {
        if (typeof name !== 'string') return NextResponse.json({ message: 'Bad Request: Name must be a string.' }, { status: 400 });
        updatedItem.name = name;
    }
    if (description !== undefined) {
        if (typeof description !== 'string') return NextResponse.json({ message: 'Bad Request: Description must be a string.' }, { status: 400 });
        updatedItem.description = description;
    }
    updatedItem.updatedAt = new Date().toISOString();

    mockItems[itemIndex] = updatedItem;

    return NextResponse.json(updatedItem, { status: 200 });
  } catch (error) {
    console.error('[BFF_ITEMS_PATCH] Error updating item:', error);
    if (error instanceof SyntaxError) {
        return NextResponse.json({ message: 'Bad Request: Invalid JSON payload.' }, { status: 400 });
    }
    return NextResponse.json({ message: 'Internal Server Error: Could not update item.' }, { status: 500 });
  }
}

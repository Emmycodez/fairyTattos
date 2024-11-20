import fs from 'fs/promises';
import path from 'path';
import { NextResponse } from 'next/server';

export const POST = async (req) => {
  try {
    const { id, name } = await req.json();

    const metadataFilePath = path.join(process.cwd(), 'metadata.json');
    const metadataContent = await fs.readFile(metadataFilePath, 'utf-8');
    const metadata = JSON.parse(metadataContent);

    // Find and update the entry
    const entry = metadata.find((item) => item.id === id);
    if (!entry) {
      return new NextResponse(JSON.stringify({ error: 'Image not found' }), { status: 404 });
    }

    entry.name = name;

    // Save the updated metadata
    await fs.writeFile(metadataFilePath, JSON.stringify(metadata, null, 2));

    return new NextResponse(JSON.stringify({ message: 'Name updated successfully' }), { status: 200 });
  } catch (error) {
    console.error('Error updating name:', error);
    return new NextResponse(JSON.stringify({ error: 'Failed to update name' }), { status: 500 });
  }
};

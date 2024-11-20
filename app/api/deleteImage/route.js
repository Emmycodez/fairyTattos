import fs from 'fs/promises';
import path from 'path';
import { NextResponse } from 'next/server';

export const DELETE = async (req) => {
  try {
    const { imageName } = await req.json();

    const filePath = path.join(process.cwd(), 'public', 'uploads', imageName);
    const metadataFilePath = path.join(process.cwd(), 'metadata.json');

    // Check if file exists
    await fs.stat(filePath);

    // Delete the file from the uploads directory
    await fs.unlink(filePath);

    // Load the metadata file
    const metadataContent = await fs.readFile(metadataFilePath, 'utf-8');
    const metadata = JSON.parse(metadataContent);

    // Filter out the deleted image's metadata
    const updatedMetadata = metadata.filter((entry) => entry.image !== imageName);

    // Save the updated metadata
    await fs.writeFile(metadataFilePath, JSON.stringify(updatedMetadata, null, 2));

    return new NextResponse(JSON.stringify({ message: 'File deleted successfully' }), { status: 200 });
  } catch (error) {
    console.error('Error deleting file:', error);
    return new NextResponse(JSON.stringify({ error: 'Failed to delete file' }), { status: 500 });
  }
};

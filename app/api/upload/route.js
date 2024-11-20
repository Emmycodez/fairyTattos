import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export const POST = async (req) => {
  try {
    // Parse the form data
    const formData = await req.formData();
    const file = formData.get('image');
    const name = formData.get('name');

    if (!file || !name) {
      return NextResponse.json({ error: 'Image and name are required' }, { status: 400 });
    }

    // Read the file content
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Define the upload path
    const uploadDir = path.join(process.cwd(), 'public', 'uploads');
    const filePath = path.join(uploadDir, `${Date.now()}-${file.name}`);

    // Ensure the upload directory exists
    await fs.mkdir(uploadDir, { recursive: true });

    // Write the file to the upload directory
    await fs.writeFile(filePath, buffer);

    // Update metadata
    const metadataFilePath = path.join(process.cwd(), 'metadata.json');
    let metadata = [];

    try {
      const metadataContent = await fs.readFile(metadataFilePath, 'utf-8');
      metadata = JSON.parse(metadataContent);
    } catch (e) {
      console.error('Metadata file not found, creating a new one.');
    }

    const newEntry = {
      id: Date.now().toString(),
      image: path.basename(filePath),
      name,
    };
    metadata.push(newEntry);

    await fs.writeFile(metadataFilePath, JSON.stringify(metadata, null, 2));

    return NextResponse.json({ message: 'Image uploaded successfully', entry: newEntry }, { status: 200 });
  } catch (error) {
    console.error('Error processing upload:', error);
    return NextResponse.json({ error: 'Failed to upload image' }, { status: 500 });
  }
};

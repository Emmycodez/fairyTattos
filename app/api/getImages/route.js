import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export const GET = async () => {
  try {
    const metadataFilePath = path.join(process.cwd(), 'metadata.json');
    const metadataContent = await fs.readFile(metadataFilePath, 'utf-8');
    const metadata = JSON.parse(metadataContent);

    return NextResponse.json(metadata, { status: 200 });
  } catch (error) {
    console.error('Error reading metadata file:', error);
    return NextResponse.json({ error: 'Failed to fetch metadata' }, { status: 500 });
  }
};

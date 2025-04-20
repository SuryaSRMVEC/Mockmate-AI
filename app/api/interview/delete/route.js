import { NextResponse } from 'next/server';
import { db } from '../../../../utils/db';
import { MockInterview } from '../../../../utils/schema';
import { eq } from 'drizzle-orm';

export async function DELETE(req) {
  try {
    const body = await req.json(); // Parse the incoming JSON body
    const { mockId } = body;

    if (!mockId) {
      return NextResponse.json({ message: 'Mock ID is required' }, { status: 400 });
    }

    // Perform database deletion
    const result = await db.delete(MockInterview).where(eq(MockInterview.mockId, mockId));

    if (result.rowCount === 0) {
      return NextResponse.json({ message: 'Interview not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Interview deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting interview:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}
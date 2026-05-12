import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function POST() {
  try {
    const { stdout, stderr } = await execAsync('npx prisma db push --accept-data-loss', {
      timeout: 120000,
    });
    return NextResponse.json({ success: true, stdout, stderr });
  } catch (e: any) {
    return NextResponse.json(
      { success: false, error: e.message, stdout: e.stdout, stderr: e.stderr },
      { status: 500 },
    );
  }
}

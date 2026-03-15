import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    try {
        const { username, password } = await req.json();

        if (!username || !password) {
            return NextResponse.json({ error: 'Username and password required' }, { status: 400 });
        }

        const admin = await prisma.admin.findUnique({ where: { username } });

        if (!admin || admin.password !== password) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        // Return admin info (in production, use JWT / sessions)
        return NextResponse.json({
            id: admin.id,
            username: admin.username,
            role: admin.role,
            clubId: admin.clubId,
        });
    } catch (error) {
        console.error('Login error:', error);
        return NextResponse.json({ error: 'Server error' }, { status: 500 });
    }
}

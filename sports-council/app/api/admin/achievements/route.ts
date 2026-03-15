import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const a = await prisma.achievement.create({
            data: {
                title: body.title,
                description: body.description,
                photoUrl: body.photoUrl,
                date: new Date(body.date),
                sport: body.sport,
                category: body.category ?? 'TROPHY',
            }
        });
        return NextResponse.json(a, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to create achievement' }, { status: 500 });
    }
}

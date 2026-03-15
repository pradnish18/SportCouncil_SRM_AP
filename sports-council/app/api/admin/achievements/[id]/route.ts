import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
        const body = await req.json();
        const a = await prisma.achievement.update({
            where: { id: params.id },
            data: {
                title: body.title,
                description: body.description,
                photoUrl: body.photoUrl,
                date: new Date(body.date),
                sport: body.sport,
                category: body.category,
            }
        });
        return NextResponse.json(a);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to update achievement' }, { status: 500 });
    }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
    try {
        await prisma.achievement.delete({ where: { id: params.id } });
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to delete achievement' }, { status: 500 });
    }
}

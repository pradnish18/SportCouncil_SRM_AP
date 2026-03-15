import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
        const body = await req.json();
        const item = await prisma.news.update({
            where: { id: params.id },
            data: {
                headline: body.headline,
                imageUrl: body.imageUrl,
                order: body.order ?? 0,
            }
        });
        return NextResponse.json(item);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to update news' }, { status: 500 });
    }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
    try {
        await prisma.news.delete({ where: { id: params.id } });
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to delete news' }, { status: 500 });
    }
}

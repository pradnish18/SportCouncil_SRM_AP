import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const item = await prisma.news.create({
            data: {
                headline: body.headline,
                imageUrl: body.imageUrl,
                order: body.order ?? 0,
            }
        });
        return NextResponse.json(item, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to create news' }, { status: 500 });
    }
}

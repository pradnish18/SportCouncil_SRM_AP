import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
        const body = await req.json();
        const member = await prisma.councilMember.update({
            where: { id: params.id },
            data: {
                name: body.name,
                title: body.title,
                photoUrl: body.photoUrl,
                tier: body.tier,
                order: body.order ?? 0,
            }
        });
        return NextResponse.json(member);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to update council member' }, { status: 500 });
    }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
    try {
        await prisma.councilMember.delete({ where: { id: params.id } });
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to delete council member' }, { status: 500 });
    }
}

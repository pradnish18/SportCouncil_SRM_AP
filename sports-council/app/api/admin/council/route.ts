import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const member = await prisma.councilMember.create({
            data: {
                name: body.name,
                title: body.title,
                photoUrl: body.photoUrl,
                tier: body.tier ?? 'STUDENT_BODY',
                order: body.order ?? 0,
            }
        });
        return NextResponse.json(member, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to create council member' }, { status: 500 });
    }
}

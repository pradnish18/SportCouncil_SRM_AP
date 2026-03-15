import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// PUT /api/admin/clubs/[id] → update a club
export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
        const body = await req.json();
        const club = await prisma.club.update({
            where: { id: params.id },
            data: {
                name: body.name,
                description: body.description,
                logoUrl: body.logoUrl,
                bgImageUrl: body.bgImageUrl,
                convenorName: body.convenor?.name,
                convenorRole: body.convenor?.role,
                convenorDetails: body.convenor?.details,
                coConvenorName: body.coConvenor?.name,
                coConvenorRole: body.coConvenor?.role,
                coConvenorDetails: body.coConvenor?.details,
                achievementsList: body.achievements ? JSON.stringify(body.achievements) : undefined,
                order: body.order ?? 0,
                ...(body.gallery && {
                    gallery: {
                        deleteMany: {},
                        create: body.gallery.map((g: any) => ({ url: g.url }))
                    }
                })
            }
        });
        return NextResponse.json(club);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to update club' }, { status: 500 });
    }
}

// DELETE /api/admin/clubs/[id] → delete a club
export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
    try {
        await prisma.club.delete({ where: { id: params.id } });
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to delete club' }, { status: 500 });
    }
}

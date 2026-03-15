import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// POST /api/admin/clubs → create a new club
export async function POST(req: Request) {
    try {
        const body = await req.json();
        const club = await prisma.club.create({
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
                ...(body.gallery && body.gallery.length > 0 && {
                    gallery: {
                        create: body.gallery.map((g: any) => ({ url: g.url }))
                    }
                })
            }
        });
        return NextResponse.json(club, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to create club' }, { status: 500 });
    }
}

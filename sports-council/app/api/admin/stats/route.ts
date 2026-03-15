import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// PUT /api/admin/stats → upsert the global stats record
export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const stats = await prisma.stats.upsert({
            where: { id: 'global-stats' },
            update: {
                totalTeams: body.totalTeams ?? 0,
                totalMembers: body.totalMembers ?? 0,
            },
            create: {
                id: 'global-stats',
                totalTeams: body.totalTeams ?? 0,
                totalMembers: body.totalMembers ?? 0,
            }
        });
        return NextResponse.json(stats);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to update stats' }, { status: 500 });
    }
}

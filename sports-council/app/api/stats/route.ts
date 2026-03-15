import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const stats = await prisma.stats.findUnique({
            where: { id: "global-stats" }
        });

        // If stats don't exist yet, return defaults
        if (!stats) {
            return NextResponse.json({ totalTeams: 15, totalMembers: 500 });
        }

        return NextResponse.json(stats);
    } catch (error) {
        console.error("Error fetching stats:", error);
        return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
    }
}

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const clubs = await prisma.club.findMany({
            orderBy: { order: 'asc' },
            include: {
                players: true,
                gallery: true,
                events: true, // Bringing in events in case we want to show related data
            }
        });

        return NextResponse.json(clubs);
    } catch (error) {
        console.error("Error fetching clubs:", error);
        return NextResponse.json({ error: "Failed to fetch clubs" }, { status: 500 });
    }
}

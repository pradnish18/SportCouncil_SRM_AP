import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const events = await prisma.event.findMany({
            orderBy: { date: 'asc' },
            include: {
                club: {
                    select: {
                        name: true,
                        logoUrl: true
                    }
                }
            }
        });

        return NextResponse.json(events);
    } catch (error) {
        console.error("Error fetching events:", error);
        return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
    }
}

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const event = await prisma.event.create({
            data: {
                title: body.title,
                sport: body.sport,
                venue: body.venue,
                date: new Date(body.date),
                time: body.time,
                description: body.description,
                category: body.category,
                stage: body.stage ?? 'PLANNED',
                team1: body.team1,
                team2: body.team2,
                score1: body.score1,
                score2: body.score2,
                liveUpdates: body.liveUpdates,
                winner1st: body.winner1st,
                winner2nd: body.winner2nd,
                matchDetails: body.matchDetails,
                clubId: body.clubId,
            }
        });
        return NextResponse.json(event, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to create event' }, { status: 500 });
    }
}

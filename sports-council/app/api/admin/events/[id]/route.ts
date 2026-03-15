import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
        const body = await req.json();
        const event = await prisma.event.update({
            where: { id: params.id },
            data: {
                title: body.title,
                sport: body.sport,
                venue: body.venue,
                date: new Date(body.date),
                time: body.time,
                description: body.description,
                category: body.category,
                stage: body.stage,
                team1: body.team1,
                team2: body.team2,
                score1: body.score1,
                score2: body.score2,
                liveUpdates: body.liveUpdates,
                winner1st: body.winner1st,
                winner2nd: body.winner2nd,
                matchDetails: body.matchDetails,
            }
        });
        return NextResponse.json(event);
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to update event' }, { status: 500 });
    }
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
    try {
        await prisma.event.delete({ where: { id: params.id } });
        return NextResponse.json({ success: true });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: 'Failed to delete event' }, { status: 500 });
    }
}

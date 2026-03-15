import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
    try {
        const members = await prisma.councilMember.findMany({
            orderBy: { order: 'asc' },
        });

        // Group members by their tier
        const groupedMembers = {
            DIRECTOR: members.filter(m => m.tier === 'DIRECTOR'),
            CONVENOR: members.filter(m => m.tier === 'CONVENOR'),
            COACH: members.filter(m => m.tier === 'COACH'),
            STUDENT_BODY: members.filter(m => m.tier === 'STUDENT_BODY')
        };

        return NextResponse.json(groupedMembers);
    } catch (error) {
        console.error("Error fetching council members:", error);
        return NextResponse.json({ error: "Failed to fetch council members" }, { status: 500 });
    }
}

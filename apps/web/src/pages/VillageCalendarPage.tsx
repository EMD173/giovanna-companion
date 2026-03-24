/**
 * Village Command Center (Calendar) — Sanctuary Theme
 */

import { useState } from 'react';
import {
    ChevronLeft, ChevronRight, Plus, Users, Briefcase, UserPlus
} from 'lucide-react';
import { InviteMemberModal } from '../components/village/InviteMemberModal';
import { BatSignal } from '../components/village/BatSignal';
import { sanctuary, typography } from '../shared/theme';
import { useFamily } from '../contexts/FamilyContext';
import { showToast } from '../components/Toast';
import type { FamilyRole } from '../types/family';

type ViewMode = 'village' | 'work';

interface CalendarEvent {
    id: string;
    title: string;
    time: string;
    type: 'village' | 'work';
    category: 'school' | 'medical' | 'home' | 'work';
}

// Mock Data for MVP
const MOCK_EVENTS: Record<number, CalendarEvent[]> = {
    12: [
        { id: '1', title: 'IEP Review', time: '10:00 AM', type: 'village', category: 'school' },
        { id: '2', title: 'Dr. Robinson', time: '2:30 PM', type: 'village', category: 'medical' }
    ],
    15: [
        { id: '3', title: 'Team Sync', time: '11:00 AM', type: 'work', category: 'work' },
        { id: '4', title: 'Sensory Break', time: '4:00 PM', type: 'village', category: 'home' }
    ],
    18: [
        { id: '5', title: 'Grandma Visit', time: '5:00 PM', type: 'village', category: 'home' }
    ]
};

export function VillageCalendarPage() {
    const { inviteMember } = useFamily();
    const [viewMode, setViewMode] = useState<ViewMode>('village');
    const [currentDate] = useState(new Date());
    const [isInviteOpen, setIsInviteOpen] = useState(false);

    const handleInvite = async (email: string, role: FamilyRole, name: string) => {
        await inviteMember(email, role, name);
        showToast('Invitation sent successfully!', 'success');
    };

    // Generate calendar grid days
    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

    const days = [];
    // Add empty placeholders for start of month
    for (let i = 0; i < firstDayOfMonth; i++) {
        days.push(null);
    }
    // Add actual days
    for (let i = 1; i <= daysInMonth; i++) {
        days.push(i);
    }

    const monthName = currentDate.toLocaleString('default', { month: 'long' });
    const year = currentDate.getFullYear();

    return (
        <div style={{ background: sanctuary.bg, minHeight: '100vh', paddingBottom: '128px' }}>
        <div style={{ padding: '32px 24px', maxWidth: '800px', margin: '0 auto' }}>

            {/* Header Area */}
            <header style={{ marginBottom: '32px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                    <div>
                        <h1 style={{
                            fontFamily: typography.heading,
                            fontSize: '2.2rem',
                            fontWeight: 700,
                            color: sanctuary.text,
                            letterSpacing: '-0.02em',
                            margin: 0
                        }}>
                            The Village
                        </h1>
                        <p style={{
                            fontFamily: typography.body,
                            color: sanctuary.textMuted,
                            margin: '4px 0 0 0'
                        }}>
                            Command Center
                        </p>
                        {viewMode === 'village' && (
                            <button
                                onClick={() => setIsInviteOpen(true)}
                                style={{
                                    background: 'none', border: 'none', cursor: 'pointer',
                                    color: sanctuary.purple, fontWeight: 700,
                                    fontSize: '0.82rem', marginTop: '8px',
                                    display: 'flex', alignItems: 'center', gap: '4px',
                                    fontFamily: typography.body,
                                }}
                            >
                                <UserPlus size={14} /> Invite Kin
                            </button>
                        )}
                    </div>

                    {/* Mode Toggle - Glass Pill */}
                    <div style={{
                        display: 'flex',
                        background: sanctuary.bgCard,
                        border: `1px solid ${sanctuary.border}`,
                        borderRadius: '100px',
                        padding: '4px',
                        gap: '4px'
                    }}>
                        <button
                            onClick={() => setViewMode('village')}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '8px 16px',
                                borderRadius: '100px',
                                border: 'none',
                                background: viewMode === 'village' ? sanctuary.purple : 'transparent',
                                color: viewMode === 'village' ? 'white' : sanctuary.textMuted,
                                fontFamily: typography.body,
                                fontWeight: 600,
                                cursor: 'pointer',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            <Users size={16} />
                            Village
                        </button>
                        <button
                            onClick={() => setViewMode('work')}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                padding: '8px 16px',
                                borderRadius: '100px',
                                border: 'none',
                                background: viewMode === 'work' ? sanctuary.text : 'transparent',
                                color: viewMode === 'work' ? 'white' : sanctuary.textMuted,
                                fontFamily: typography.body,
                                fontWeight: 600,
                                cursor: 'pointer',
                                transition: 'all 0.2s ease'
                            }}
                        >
                            <Briefcase size={16} />
                            Work
                        </button>
                    </div>
                </div>

                {/* Date Navigation */}
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <button style={navButtonStyle}>
                        <ChevronLeft size={20} />
                    </button>
                    <h2 style={{
                        fontFamily: typography.heading,
                        fontSize: '1.5rem',
                        fontWeight: 600,
                        color: sanctuary.text,
                        margin: 0
                    }}>
                        {monthName} {year}
                    </h2>
                    <button style={navButtonStyle}>
                        <ChevronRight size={20} />
                    </button>
                </div>
            </header>

            {/* Weekday Headers */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(7, 1fr)',
                marginBottom: '12px',
                textAlign: 'center'
            }}>
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, i) => (
                    <div key={i} style={{
                        fontFamily: typography.body,
                        fontWeight: 700,
                        color: sanctuary.textMuted,
                        fontSize: '0.9rem'
                    }}>
                        {day}
                    </div>
                ))}
            </div>

            {/* Calendar Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(7, 1fr)',
                gap: '8px',
                marginBottom: '80px' // Space for floating button
            }}>
                {days.map((day, i) => {
                    if (day === null) return <div key={`empty-${i}`} />;

                    const events = MOCK_EVENTS[day] || [];
                    const filteredEvents = events.filter(e => e.type === viewMode);
                    const isToday = day === new Date().getDate();

                    return (
                        <div key={day} style={{
                            minHeight: '80px',
                            background: isToday ? sanctuary.goldBg : sanctuary.bgCard,
                            border: isToday ? `1px solid ${sanctuary.goldBorder}` : `1px solid ${sanctuary.border}`,
                            borderRadius: '12px',
                            padding: '6px',
                            cursor: 'pointer',
                            transition: 'transform 0.2s ease'
                        }}

                        >
                            <span style={{
                                display: 'block',
                                fontFamily: typography.body,
                                fontWeight: 700,
                                fontSize: '0.9rem',
                                color: isToday ? sanctuary.gold : sanctuary.textMuted,
                                marginBottom: '4px',
                                textAlign: 'center'
                            }}>
                                {day}
                            </span>

                            {/* Event Chips */}
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                {filteredEvents.map(event => (
                                    <div key={event.id} style={{
                                        width: '6px',
                                        height: '6px',
                                        borderRadius: '50%',
                                        background: getCategoryColor(event.category),
                                        margin: '0 auto'
                                    }} />
                                ))}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Quick Add Floating Button */}
            <button style={{
                position: 'fixed',
                bottom: '100px', // Above nav bar
                right: '24px',
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #6B4C9A 0%, #8B6BB8 100%)',
                color: 'white',
                border: 'none',
                boxShadow: '0 8px 32px rgba(107, 76, 154, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                zIndex: 40
            }}>
                <Plus size={28} />
            </button>

            <InviteMemberModal
                isOpen={isInviteOpen}
                onClose={() => setIsInviteOpen(false)}
                onInvite={handleInvite}
            />
            
            <BatSignal />
        </div>
        </div>
    );
}

const navButtonStyle = {
    background: 'white',
    border: '1px solid #E8E2DA',
    borderRadius: '50%',
    width: '36px',
    height: '36px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    color: '#6B6560'
};

function getCategoryColor(category: string): string {
    switch (category) {
        case 'school': return '#F59E0B'; // Amber
        case 'medical': return '#EF4444'; // Red
        case 'work': return '#3D3832'; // Charcoal
        default: return '#6B4C9A'; // Purple
    }
}

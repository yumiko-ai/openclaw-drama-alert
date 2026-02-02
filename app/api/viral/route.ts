import { NextRequest, NextResponse } from 'next/server';
import { getServerSupabase } from '@/lib/supabase';

export async function GET(request: NextRequest) {
    try {
        const supabase = getServerSupabase();
        if (!supabase) {
            return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 });
        }

        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status') || 'pending';

        const { data: queue, error } = await supabase
            .from('viral_queue')
            .select(`
                *,
                tweets (
                    id,
                    author,
                    text,
                    timestamp,
                    url
                )
            `)
            .eq('status', status)
            .order('created_at', { ascending: false });

        if (error) {
            return NextResponse.json({ error: error.message }, { status: 500 });
        }

        return NextResponse.json({ queue: queue || [] });
    } catch (error) {
        console.error('Error fetching viral queue:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { action, tweet_id, author, text, url, timestamp, metrics, velocity, status } = body;

        const supabase = getServerSupabase();
        if (!supabase) {
            return NextResponse.json({ error: 'Supabase not configured' }, { status: 500 });
        }

        // Handle different actions
        switch (action) {
            case 'push': {
                // Push a new viral tweet to the queue
                // First, ensure tweet exists in tweets table
                const { error: tweetError } = await supabase
                    .from('tweets')
                    .upsert({
                        id: tweet_id,
                        author: author,
                        text: text,
                        timestamp: timestamp,
                        url: url,
                        is_active: true
                    }, { onConflict: 'id' });

                if (tweetError) {
                    return NextResponse.json({ error: tweetError.message }, { status: 500 });
                }

                // Check if already in queue
                const { data: existing } = await supabase
                    .from('viral_queue')
                    .select('id')
                    .eq('tweet_id', tweet_id)
                    .in('status', ['pending', 'pushed'])
                    .single();

                if (existing) {
                    return NextResponse.json({ message: 'Tweet already in queue', queue_id: existing.id });
                }

                // Add to viral queue
                const { data: queueItem, error: queueError } = await supabase
                    .from('viral_queue')
                    .insert({
                        tweet_id: tweet_id,
                        velocity: velocity || 0,
                        impressions_at_detection: metrics?.impressions || 0,
                        status: 'pending'
                    })
                    .select()
                    .single();

                if (queueError) {
                    return NextResponse.json({ error: queueError.message }, { status: 500 });
                }

                // Also create an alert for the dashboard
                await supabase
                    .from('alerts')
                    .insert({
                        type: 'viral_tweet',
                        title: `🚨 Viral Tweet from @${author}`,
                        description: text.substring(0, 200) + (text.length > 200 ? '...' : ''),
                        priority: 'high'
                    });

                return NextResponse.json({ 
                    message: 'Tweet added to viral queue', 
                    queue_item: queueItem 
                });
            }

            case 'update_status': {
                // Update status of a queue item
                const updates: { status: string; pushed_at?: string; dismissed_at?: string } = { 
                    status: status || 'pending' 
                };

                if (status === 'pushed') {
                    updates.pushed_at = new Date().toISOString();
                } else if (status === 'dismissed') {
                    updates.dismissed_at = new Date().toISOString();
                }

                const { error: updateError } = await supabase
                    .from('viral_queue')
                    .update(updates)
                    .eq('id', tweet_id);

                if (updateError) {
                    return NextResponse.json({ error: updateError.message }, { status: 500 });
                }

                return NextResponse.json({ message: 'Status updated' });
            }

            case 'clear_queue': {
                // Clear all pending items
                const { error: clearError } = await supabase
                    .from('viral_queue')
                    .delete()
                    .eq('status', 'pending');

                if (clearError) {
                    return NextResponse.json({ error: clearError.message }, { status: 500 });
                }

                return NextResponse.json({ message: 'Queue cleared' });
            }

            case 'push_to_live': {
                // Push all pending items to "live" status
                const { error: pushError } = await supabase
                    .from('viral_queue')
                    .update({
                        status: 'pushed',
                        pushed_at: new Date().toISOString()
                    })
                    .eq('status', 'pending');

                if (pushError) {
                    return NextResponse.json({ error: pushError.message }, { status: 500 });
                }

                // Create a summary alert
                await supabase
                    .from('alerts')
                    .insert({
                        type: 'viral_batch',
                        title: '📢 Viral Queue Pushed to Live',
                        description: 'All pending viral tweets have been pushed live',
                        priority: 'medium'
                    });

                return NextResponse.json({ message: 'Queue pushed to live' });
            }

            case 'dismiss': {
                // Dismiss a single item
                const { error: dismissError } = await supabase
                    .from('viral_queue')
                    .update({
                        status: 'dismissed',
                        dismissed_at: new Date().toISOString()
                    })
                    .eq('id', tweet_id);

                if (dismissError) {
                    return NextResponse.json({ error: dismissError.message }, { status: 500 });
                }

                return NextResponse.json({ message: 'Tweet dismissed' });
            }

            case 'delete': {
                // Delete a queue item entirely
                const { error: deleteError } = await supabase
                    .from('viral_queue')
                    .delete()
                    .eq('id', tweet_id);

                if (deleteError) {
                    return NextResponse.json({ error: deleteError.message }, { status: 500 });
                }

                return NextResponse.json({ message: 'Queue item deleted' });
            }

            default:
                return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
        }
    } catch (error) {
        console.error('Error in viral API:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}

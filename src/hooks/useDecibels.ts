/**
 * WhatsSound — useDecibels Hook
 * Sistema de decibelios: gana dB escuchando, da dB a DJs
 * Reemplaza el sistema de propinas con dinero
 */

import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../stores/authStore';

export interface DecibelState {
  available: number;
  totalEarned: number;
  totalGiven: number;
}

interface UseDecibelsReturn {
  state: DecibelState;
  loading: boolean;
  earnDecibels: (sessionId: string, amount: number) => Promise<void>;
  giveDecibels: (toUserId: string, sessionId: string, amount: number) => Promise<boolean>;
  getSessionTotal: (sessionId: string) => Promise<number>;
}

export function useDecibels(): UseDecibelsReturn {
  const { user } = useAuthStore();
  const [state, setState] = useState<DecibelState>({
    available: 0,
    totalEarned: 0,
    totalGiven: 0,
  });
  const [loading, setLoading] = useState(true);

  // Load user's decibel balance
  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }

    (async () => {
      const { data, error } = await supabase
        .from('ws_user_decibels')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (data) {
        setState({
          available: data.available || 0,
          totalEarned: data.total_earned || 0,
          totalGiven: data.total_given || 0,
        });
      } else if (error?.code === 'PGRST116') {
        // No record exists, create one
        await supabase
          .from('ws_user_decibels')
          .insert({
            user_id: user.id,
            available: 10, // Start with 10 dB
            total_earned: 10,
            total_given: 0,
          });
        setState({ available: 10, totalEarned: 10, totalGiven: 0 });
      }
      setLoading(false);
    })();
  }, [user?.id]);

  // Earn decibels by listening
  const earnDecibels = useCallback(async (sessionId: string, amount: number) => {
    if (!user?.id || amount <= 0) return;

    // Record the earning
    await supabase.from('ws_decibels').insert({
      user_id: user.id,
      session_id: sessionId,
      amount,
    });

    // Update user balance
    const { data } = await supabase
      .from('ws_user_decibels')
      .select('available, total_earned')
      .eq('user_id', user.id)
      .single();

    if (data) {
      const newAvailable = (data.available || 0) + amount;
      const newTotalEarned = (data.total_earned || 0) + amount;

      await supabase
        .from('ws_user_decibels')
        .update({
          available: newAvailable,
          total_earned: newTotalEarned,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.id);

      setState(prev => ({
        ...prev,
        available: newAvailable,
        totalEarned: newTotalEarned,
      }));
    }

    // console.log(`[Decibels] Earned ${amount} dB in session ${sessionId}`);
  }, [user?.id]);

  // Give decibels to a DJ
  const giveDecibels = useCallback(async (
    toUserId: string,
    sessionId: string,
    amount: number
  ): Promise<boolean> => {
    if (!user?.id || amount <= 0) return false;
    if (state.available < amount) {
      // console.log('[Decibels] Not enough dB available');
      return false;
    }

    // Record the gift
    const { error: insertError } = await supabase.from('ws_decibels').insert({
      user_id: user.id,
      to_user_id: toUserId,
      session_id: sessionId,
      amount,
    });

    if (insertError) {
      console.error('[Decibels] Error giving dB:', insertError);
      return false;
    }

    // Update sender balance
    const newAvailable = state.available - amount;
    const newTotalGiven = state.totalGiven + amount;

    await supabase
      .from('ws_user_decibels')
      .update({
        available: newAvailable,
        total_given: newTotalGiven,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', user.id);

    // Update receiver balance
    const { data: receiverData } = await supabase
      .from('ws_user_decibels')
      .select('available, total_earned')
      .eq('user_id', toUserId)
      .single();

    if (receiverData) {
      await supabase
        .from('ws_user_decibels')
        .update({
          available: (receiverData.available || 0) + amount,
          total_earned: (receiverData.total_earned || 0) + amount,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', toUserId);
    } else {
      // Create record for receiver
      await supabase.from('ws_user_decibels').insert({
        user_id: toUserId,
        available: amount,
        total_earned: amount,
        total_given: 0,
      });
    }

    setState(prev => ({
      ...prev,
      available: newAvailable,
      totalGiven: newTotalGiven,
    }));

    // console.log(`[Decibels] Gave ${amount} dB to ${toUserId}`);
    return true;
  }, [user?.id, state.available, state.totalGiven]);

  // Get total decibels received in a session
  const getSessionTotal = useCallback(async (sessionId: string): Promise<number> => {
    const { data } = await supabase
      .from('ws_decibels')
      .select('amount')
      .eq('session_id', sessionId)
      .not('to_user_id', 'is', null);

    if (data) {
      return data.reduce((sum, row) => sum + (row.amount || 0), 0);
    }
    return 0;
  }, []);

  return {
    state,
    loading,
    earnDecibels,
    giveDecibels,
    getSessionTotal,
  };
}

export default useDecibels;

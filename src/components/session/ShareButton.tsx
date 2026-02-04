/**
 * WhatsSound — ShareButton
 * Compartir "Estoy escuchando X en WhatsSound"
 */

import React from 'react';
import { TouchableOpacity, Share, Alert, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/colors';
import { spacing, borderRadius } from '../../theme/spacing';

interface Props {
  sessionId: string;
  sessionName: string;
  djName?: string;
  currentSong?: string;
  currentArtist?: string;
  size?: number;
  style?: object;
}

export function ShareButton({ 
  sessionId, 
  sessionName, 
  djName,
  currentSong, 
  currentArtist,
  size = 24,
  style,
}: Props) {
  
  const handleShare = async () => {
    const baseUrl = 'https://whatssound-app.vercel.app';
    const sessionUrl = `${baseUrl}/join/${sessionId}`;
    
    let message: string;
    
    if (currentSong && currentArtist) {
      message = `🎧 Escuchando "${currentSong}" de ${currentArtist} en ${sessionName}`;
    } else if (currentSong) {
      message = `🎧 Escuchando "${currentSong}" en ${sessionName}`;
    } else if (djName) {
      message = `🎧 En la sesión de ${djName}: ${sessionName}`;
    } else {
      message = `🎧 Escuchando música en ${sessionName}`;
    }
    
    message += `\n\n¡Únete! ${sessionUrl}`;
    message += '\n\n— WhatsSound';

    try {
      const result = await Share.share({
        message,
        url: sessionUrl, // iOS usa esto para preview
        title: `WhatsSound - ${sessionName}`,
      });
      
      if (result.action === Share.sharedAction) {
        console.log('[Share] Compartido correctamente');
      }
    } catch (error) {
      console.error('[Share] Error:', error);
      Alert.alert('Error', 'No se pudo compartir');
    }
  };

  return (
    <TouchableOpacity 
      onPress={handleShare} 
      style={[styles.button, style]}
      activeOpacity={0.7}
    >
      <Ionicons name="share-outline" size={size} color={colors.textPrimary} />
    </TouchableOpacity>
  );
}

/**
 * Versión con fondo para usar en cards
 */
export function ShareButtonFilled(props: Props) {
  return (
    <TouchableOpacity style={styles.filledButton} activeOpacity={0.7}>
      <ShareButton {...props} size={18} style={{ padding: 0 }} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: spacing.xs,
  },
  filledButton: {
    backgroundColor: colors.surface,
    padding: spacing.sm,
    borderRadius: borderRadius.lg,
  },
});

export default ShareButton;

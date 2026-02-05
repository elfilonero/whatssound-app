/**
 * WhatsSound — ShareBoost
 * Componente para compartir Golden Boost en redes sociales
 */

import React from 'react';
import { View, Text, StyleSheet, Pressable, Share, Platform } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';
import { typography } from '../theme/typography';

interface ShareBoostProps {
  djName: string;
  sessionName?: string;
  totalBoosts: number;
  onShare?: () => void;
}

export function ShareBoost({ djName, sessionName, totalBoosts, onShare }: ShareBoostProps) {
  const shareMessage = sessionName
    ? `¡Le di mi Golden Boost a ${djName} en "${sessionName}"! 🏆⭐ Ya tiene ${totalBoosts} boosts. Únete a WhatsSound y apoya a tus DJs favoritos.`
    : `¡Le di mi Golden Boost a ${djName}! 🏆⭐ Ya tiene ${totalBoosts} boosts. Únete a WhatsSound y apoya a tus DJs favoritos.`;

  const shareUrl = 'https://whatssound-app.vercel.app';

  const handleShare = async () => {
    try {
      if (Platform.OS === 'web') {
        // Web Share API
        if (navigator.share) {
          await navigator.share({
            title: `Golden Boost para ${djName}`,
            text: shareMessage,
            url: shareUrl,
          });
        } else {
          // Fallback: copiar al clipboard
          await navigator.clipboard.writeText(`${shareMessage}\n${shareUrl}`);
          alert('¡Copiado al portapapeles!');
        }
      } else {
        // React Native Share
        await Share.share({
          message: `${shareMessage}\n${shareUrl}`,
          title: `Golden Boost para ${djName}`,
        });
      }
      onShare?.();
    } catch (error) {
      // console.log('Share cancelled or failed');
    }
  };

  const handleShareTwitter = () => {
    const text = encodeURIComponent(shareMessage);
    const url = encodeURIComponent(shareUrl);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
    onShare?.();
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(`${shareMessage}\n${shareUrl}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
    onShare?.();
  };

  const handleShareInstagram = () => {
    // Instagram no tiene share directo, copiamos al clipboard
    navigator.clipboard.writeText(`${shareMessage}\n${shareUrl}`);
    alert('Texto copiado. Pégalo en tu historia de Instagram.');
    onShare?.();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>¡Comparte tu apoyo! 🎉</Text>
      
      <View style={styles.preview}>
        <Text style={styles.previewText}>{shareMessage}</Text>
      </View>

      {/* Share buttons */}
      <View style={styles.buttons}>
        <Pressable style={styles.shareButton} onPress={handleShare}>
          <Ionicons name="share-outline" size={24} color="#FFF" />
          <Text style={styles.shareButtonText}>Compartir</Text>
        </Pressable>

        {Platform.OS === 'web' && (
          <View style={styles.socialButtons}>
            <Pressable 
              style={[styles.socialButton, { backgroundColor: '#1DA1F2' }]}
              onPress={handleShareTwitter}
            >
              <Ionicons name="logo-twitter" size={20} color="#FFF" />
            </Pressable>
            <Pressable 
              style={[styles.socialButton, { backgroundColor: '#25D366' }]}
              onPress={handleShareWhatsApp}
            >
              <Ionicons name="logo-whatsapp" size={20} color="#FFF" />
            </Pressable>
            <Pressable 
              style={[styles.socialButton, { backgroundColor: '#E4405F' }]}
              onPress={handleShareInstagram}
            >
              <Ionicons name="logo-instagram" size={20} color="#FFF" />
            </Pressable>
          </View>
        )}
      </View>
    </View>
  );
}

/**
 * Botón de compartir compacto
 */
export function ShareBoostButton({ 
  djName, 
  totalBoosts,
  size = 'medium' 
}: { 
  djName: string; 
  totalBoosts: number;
  size?: 'small' | 'medium';
}) {
  const handleShare = async () => {
    const message = `¡Le di mi Golden Boost a ${djName}! 🏆⭐ Únete a WhatsSound.`;
    const url = 'https://whatssound-app.vercel.app';

    try {
      if (Platform.OS === 'web' && navigator.share) {
        await navigator.share({ title: 'WhatsSound', text: message, url });
      } else if (Platform.OS !== 'web') {
        await Share.share({ message: `${message}\n${url}` });
      }
    } catch (e) {
      // Cancelled
    }
  };

  const iconSize = size === 'small' ? 16 : 20;

  return (
    <Pressable style={styles.compactButton} onPress={handleShare}>
      <Ionicons name="share-social-outline" size={iconSize} color={colors.primary} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.md,
  },
  title: {
    ...typography.h3,
    color: colors.textPrimary,
    textAlign: 'center',
    marginBottom: spacing.md,
  },
  preview: {
    backgroundColor: colors.surfaceLight,
    borderRadius: 12,
    padding: spacing.md,
    marginBottom: spacing.md,
  },
  previewText: {
    ...typography.body,
    color: colors.textSecondary,
    fontStyle: 'italic',
  },
  buttons: {
    gap: spacing.md,
  },
  shareButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.primary,
    paddingVertical: spacing.md,
    borderRadius: 12,
  },
  shareButtonText: {
    ...typography.button,
    color: '#FFF',
  },
  socialButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: spacing.md,
  },
  socialButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
  compactButton: {
    padding: spacing.sm,
  },
});

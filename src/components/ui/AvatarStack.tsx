/**
 * WhatsSound — AvatarStack
 * Avatares apilados con efecto de superposición
 */

import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { colors } from '../../theme/colors';

interface User {
  id: string;
  name: string;
  avatar: string | null;
}

interface Props {
  users: User[];
  maxVisible?: number;
  size?: number;
  borderColor?: string;
}

export function AvatarStack({ 
  users, 
  maxVisible = 5, 
  size = 32,
  borderColor = colors.surface 
}: Props) {
  const visibleUsers = users.slice(0, maxVisible);
  const extraCount = Math.max(0, users.length - maxVisible);
  const overlap = size / 4;

  if (users.length === 0) {
    return (
      <View style={[styles.emptyAvatar, { width: size, height: size, borderRadius: size / 2 }]}>
        <Text style={[styles.emptyIcon, { fontSize: size / 2 }]}>👤</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {visibleUsers.map((user, index) => (
        <View
          key={user.id}
          style={[
            styles.avatarWrapper,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              marginLeft: index > 0 ? -overlap : 0,
              zIndex: maxVisible - index,
              borderColor,
            },
          ]}
        >
          {user.avatar ? (
            // Si es emoji o URL
            user.avatar.startsWith('http') ? (
              <Image 
                source={{ uri: user.avatar }} 
                style={[styles.avatarImage, { width: size - 4, height: size - 4, borderRadius: (size - 4) / 2 }]} 
              />
            ) : (
              <Text style={[styles.avatarEmoji, { fontSize: size / 2 }]}>{user.avatar}</Text>
            )
          ) : (
            <Text style={[styles.avatarInitial, { fontSize: size / 2.5 }]}>
              {user.name.charAt(0).toUpperCase()}
            </Text>
          )}
        </View>
      ))}
      
      {extraCount > 0 && (
        <View
          style={[
            styles.avatarWrapper,
            styles.extraBadge,
            {
              width: size,
              height: size,
              borderRadius: size / 2,
              marginLeft: -overlap,
              borderColor,
            },
          ]}
        >
          <Text style={[styles.extraText, { fontSize: size / 3 }]}>+{extraCount}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarWrapper: {
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
  },
  avatarImage: {
    resizeMode: 'cover',
  },
  avatarEmoji: {
    textAlign: 'center',
  },
  avatarInitial: {
    color: '#fff',
    fontWeight: '600',
  },
  extraBadge: {
    backgroundColor: colors.surfaceDark || '#2a2a2a',
  },
  extraText: {
    color: colors.textMuted,
    fontWeight: '600',
  },
  emptyAvatar: {
    backgroundColor: colors.surfaceDark || '#2a2a2a',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyIcon: {
    opacity: 0.5,
  },
});

export default AvatarStack;

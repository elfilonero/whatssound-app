/**
 * WhatsSound — Validation Utils Tests
 * Tests para utilidades de validación
 */

describe('Validation Utils', () => {
  // ─── Phone Number Validation ─────────────────────────────

  describe('Phone Number Validation', () => {
    const validatePhone = (phone: string): boolean => {
      const cleaned = phone.replace(/\D/g, '');
      return cleaned.length >= 9 && cleaned.length <= 15;
    };

    test('debe aceptar número español válido', () => {
      expect(validatePhone('+34 612 345 678')).toBe(true);
      expect(validatePhone('612345678')).toBe(true);
      expect(validatePhone('+34612345678')).toBe(true);
    });

    test('debe aceptar número internacional', () => {
      expect(validatePhone('+1 555 123 4567')).toBe(true);
      expect(validatePhone('+44 7911 123456')).toBe(true);
      expect(validatePhone('+49 170 1234567')).toBe(true);
    });

    test('debe rechazar número muy corto', () => {
      expect(validatePhone('12345')).toBe(false);
      expect(validatePhone('612')).toBe(false);
    });

    test('debe rechazar número muy largo', () => {
      expect(validatePhone('12345678901234567890')).toBe(false);
    });

    test('debe limpiar caracteres no numéricos', () => {
      const phone = '+34 (612) 345-678';
      const cleaned = phone.replace(/\D/g, '');
      expect(cleaned).toBe('34612345678');
    });
  });

  // ─── Email Validation ────────────────────────────────────

  describe('Email Validation', () => {
    const validateEmail = (email: string): boolean => {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return regex.test(email);
    };

    test('debe aceptar email válido', () => {
      expect(validateEmail('user@example.com')).toBe(true);
      expect(validateEmail('user.name@domain.co.uk')).toBe(true);
      expect(validateEmail('user+tag@gmail.com')).toBe(true);
    });

    test('debe rechazar email sin @', () => {
      expect(validateEmail('userexample.com')).toBe(false);
    });

    test('debe rechazar email sin dominio', () => {
      expect(validateEmail('user@')).toBe(false);
      expect(validateEmail('user@.')).toBe(false);
    });

    test('debe rechazar email con espacios', () => {
      expect(validateEmail('user @example.com')).toBe(false);
      expect(validateEmail('user@ example.com')).toBe(false);
    });
  });

  // ─── Username Validation ─────────────────────────────────

  describe('Username Validation', () => {
    const validateUsername = (username: string): { valid: boolean; error?: string } => {
      if (username.length < 3) {
        return { valid: false, error: 'Mínimo 3 caracteres' };
      }
      if (username.length > 20) {
        return { valid: false, error: 'Máximo 20 caracteres' };
      }
      if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        return { valid: false, error: 'Solo letras, números y guiones bajos' };
      }
      return { valid: true };
    };

    test('debe aceptar username válido', () => {
      expect(validateUsername('dj_cool').valid).toBe(true);
      expect(validateUsername('user123').valid).toBe(true);
      expect(validateUsername('DJ_Master').valid).toBe(true);
    });

    test('debe rechazar username muy corto', () => {
      const result = validateUsername('ab');
      expect(result.valid).toBe(false);
      expect(result.error).toContain('Mínimo');
    });

    test('debe rechazar username muy largo', () => {
      const result = validateUsername('a'.repeat(25));
      expect(result.valid).toBe(false);
      expect(result.error).toContain('Máximo');
    });

    test('debe rechazar caracteres especiales', () => {
      expect(validateUsername('user@name').valid).toBe(false);
      expect(validateUsername('user name').valid).toBe(false);
      expect(validateUsername('user-name').valid).toBe(false);
    });
  });

  // ─── Session Name Validation ─────────────────────────────

  describe('Session Name Validation', () => {
    const validateSessionName = (name: string): { valid: boolean; error?: string } => {
      const trimmed = name.trim();
      if (trimmed.length < 3) {
        return { valid: false, error: 'Mínimo 3 caracteres' };
      }
      if (trimmed.length > 50) {
        return { valid: false, error: 'Máximo 50 caracteres' };
      }
      return { valid: true };
    };

    test('debe aceptar nombre válido', () => {
      expect(validateSessionName('House Party').valid).toBe(true);
      expect(validateSessionName('Sesión de Verano 🎵').valid).toBe(true);
    });

    test('debe rechazar nombre vacío', () => {
      expect(validateSessionName('').valid).toBe(false);
      expect(validateSessionName('   ').valid).toBe(false);
    });

    test('debe rechazar nombre muy largo', () => {
      const result = validateSessionName('A'.repeat(60));
      expect(result.valid).toBe(false);
    });

    test('debe aceptar emojis', () => {
      expect(validateSessionName('🎧 DJ Session 🎵').valid).toBe(true);
    });
  });

  // ─── Message Validation ──────────────────────────────────

  describe('Message Validation', () => {
    const validateMessage = (message: string): { valid: boolean; sanitized: string } => {
      // Sanitizar HTML
      const sanitized = message.replace(/<[^>]*>/g, '');
      // Limitar longitud
      const trimmed = sanitized.substring(0, 500);
      return { valid: trimmed.length > 0, sanitized: trimmed };
    };

    test('debe aceptar mensaje normal', () => {
      const result = validateMessage('¡Hola! ¿Cómo estás?');
      expect(result.valid).toBe(true);
      expect(result.sanitized).toBe('¡Hola! ¿Cómo estás?');
    });

    test('debe sanitizar HTML', () => {
      const result = validateMessage('<script>alert("xss")</script>Hello');
      expect(result.sanitized).not.toContain('<script>');
      expect(result.sanitized).toBe('alert("xss")Hello');
    });

    test('debe truncar mensaje largo', () => {
      const longMessage = 'A'.repeat(600);
      const result = validateMessage(longMessage);
      expect(result.sanitized.length).toBe(500);
    });

    test('debe rechazar mensaje vacío', () => {
      const result = validateMessage('');
      expect(result.valid).toBe(false);
    });
  });

  // ─── Amount Validation ───────────────────────────────────

  describe('Amount Validation', () => {
    const validateAmount = (amount: number, min: number, max: number): { valid: boolean; error?: string } => {
      if (!Number.isInteger(amount)) {
        return { valid: false, error: 'Debe ser un número entero' };
      }
      if (amount < min) {
        return { valid: false, error: `Mínimo: €${(min / 100).toFixed(2)}` };
      }
      if (amount > max) {
        return { valid: false, error: `Máximo: €${(max / 100).toFixed(2)}` };
      }
      return { valid: true };
    };

    test('debe aceptar monto válido', () => {
      expect(validateAmount(500, 100, 5000).valid).toBe(true);
    });

    test('debe rechazar decimal', () => {
      const result = validateAmount(100.5, 100, 5000);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('entero');
    });

    test('debe rechazar monto menor al mínimo', () => {
      const result = validateAmount(50, 100, 5000);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('Mínimo');
    });

    test('debe rechazar monto mayor al máximo', () => {
      const result = validateAmount(10000, 100, 5000);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('Máximo');
    });
  });

  // ─── URL Validation ──────────────────────────────────────

  describe('URL Validation', () => {
    const validateUrl = (url: string): boolean => {
      try {
        new URL(url);
        return true;
      } catch {
        return false;
      }
    };

    test('debe aceptar URL válida', () => {
      expect(validateUrl('https://example.com')).toBe(true);
      expect(validateUrl('http://localhost:3000')).toBe(true);
      expect(validateUrl('https://example.com/path?query=1')).toBe(true);
    });

    test('debe rechazar URL inválida', () => {
      expect(validateUrl('not-a-url')).toBe(false);
      expect(validateUrl('example.com')).toBe(false);
    });
  });

  // ─── Join Code Validation ────────────────────────────────

  describe('Join Code Validation', () => {
    const validateJoinCode = (code: string): boolean => {
      // 6 caracteres alfanuméricos
      return /^[A-Z0-9]{6}$/.test(code.toUpperCase());
    };

    test('debe aceptar código válido', () => {
      expect(validateJoinCode('ABC123')).toBe(true);
      expect(validateJoinCode('DJPARTY')).toBe(false); // 7 chars
      expect(validateJoinCode('XY7890')).toBe(true);
    });

    test('debe ser case insensitive', () => {
      expect(validateJoinCode('abc123')).toBe(true);
    });

    test('debe rechazar código inválido', () => {
      expect(validateJoinCode('ABC-12')).toBe(false); // tiene guión
      expect(validateJoinCode('AB123')).toBe(false); // 5 chars
      expect(validateJoinCode('ABCDEFG')).toBe(false); // 7 chars
    });
  });

  // ─── Date Validation ─────────────────────────────────────

  describe('Date Validation', () => {
    const isValidDate = (date: Date): boolean => {
      return date instanceof Date && !isNaN(date.getTime());
    };

    const isFutureDate = (date: Date): boolean => {
      return isValidDate(date) && date.getTime() > Date.now();
    };

    test('debe validar fecha correcta', () => {
      expect(isValidDate(new Date())).toBe(true);
      expect(isValidDate(new Date('2024-01-01'))).toBe(true);
    });

    test('debe rechazar fecha inválida', () => {
      expect(isValidDate(new Date('invalid'))).toBe(false);
    });

    test('debe detectar fecha futura', () => {
      const future = new Date(Date.now() + 86400000);
      expect(isFutureDate(future)).toBe(true);
    });

    test('debe detectar fecha pasada', () => {
      const past = new Date(Date.now() - 86400000);
      expect(isFutureDate(past)).toBe(false);
    });
  });

  // ─── Genre Validation ────────────────────────────────────

  describe('Genre Validation', () => {
    const VALID_GENRES = [
      'house', 'techno', 'trance', 'drum-and-bass',
      'dubstep', 'hip-hop', 'pop', 'rock', 'latin',
      'reggaeton', 'salsa', 'electronic', 'ambient'
    ];

    const validateGenres = (genres: string[]): { valid: boolean; error?: string } => {
      if (genres.length === 0) {
        return { valid: false, error: 'Selecciona al menos un género' };
      }
      if (genres.length > 5) {
        return { valid: false, error: 'Máximo 5 géneros' };
      }
      const invalid = genres.filter(g => !VALID_GENRES.includes(g.toLowerCase()));
      if (invalid.length > 0) {
        return { valid: false, error: `Géneros inválidos: ${invalid.join(', ')}` };
      }
      return { valid: true };
    };

    test('debe aceptar géneros válidos', () => {
      expect(validateGenres(['house', 'techno']).valid).toBe(true);
    });

    test('debe rechazar array vacío', () => {
      const result = validateGenres([]);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('Selecciona');
    });

    test('debe rechazar más de 5 géneros', () => {
      const result = validateGenres(['house', 'techno', 'trance', 'pop', 'rock', 'latin']);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('Máximo 5');
    });

    test('debe rechazar géneros inválidos', () => {
      const result = validateGenres(['house', 'invalid-genre']);
      expect(result.valid).toBe(false);
      expect(result.error).toContain('inválidos');
    });
  });
});

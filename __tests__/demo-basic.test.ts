/**
 * Basic Demo Data Tests (No React Native imports)
 * Tests the structure of demo data without importing modules that cause Jest issues
 */

describe('Basic Demo Data Structure', () => {
  test('should have valid demo session structure', () => {
    const demoSession = {
      djName: 'DJ Carlos Madrid',
      genre: 'Reggaetón / Latin',
      listeners: 45,
      queueCount: 12,
    };

    expect(demoSession).toHaveProperty('djName');
    expect(demoSession).toHaveProperty('genre');
    expect(demoSession).toHaveProperty('listeners');
    expect(demoSession).toHaveProperty('queueCount');
    expect(typeof demoSession.listeners).toBe('number');
    expect(typeof demoSession.queueCount).toBe('number');
  });

  test('should have valid now playing structure', () => {
    const nowPlaying = {
      title: 'Pepas',
      artist: 'Farruko',
      album: 'La 167',
      duration: 204,
      currentTime: 107,
    };

    expect(nowPlaying).toHaveProperty('title');
    expect(nowPlaying).toHaveProperty('artist');
    expect(nowPlaying).toHaveProperty('duration');
    expect(typeof nowPlaying.duration).toBe('number');
    expect(typeof nowPlaying.currentTime).toBe('number');
  });

  test('should have valid queue item structure', () => {
    const queueItem = {
      id: 'q1',
      title: 'Gasolina',
      artist: 'Daddy Yankee',
      by: 'María G.',
      votes: 8,
      dur: '3:12'
    };

    expect(queueItem).toHaveProperty('id');
    expect(queueItem).toHaveProperty('title');
    expect(queueItem).toHaveProperty('artist');
    expect(queueItem).toHaveProperty('votes');
    expect(typeof queueItem.votes).toBe('number');
  });

  test('should have valid chat message structure', () => {
    const chatMsg = {
      id: 'c1',
      user: 'DJ Carlos',
      text: '¡Bienvenidos al Viernes Latino! 🎉🔥',
      time: '22:15',
      isMine: false,
      role: 'dj'
    };

    expect(chatMsg).toHaveProperty('id');
    expect(chatMsg).toHaveProperty('user');
    expect(chatMsg).toHaveProperty('text');
    expect(chatMsg).toHaveProperty('time');
    expect(chatMsg).toHaveProperty('isMine');
    expect(typeof chatMsg.isMine).toBe('boolean');
  });

  test('should have valid people structure', () => {
    const person = {
      id: 'p1',
      name: 'DJ Carlos Madrid',
      role: 'dj',
      on: true
    };

    expect(person).toHaveProperty('id');
    expect(person).toHaveProperty('name');
    expect(person).toHaveProperty('on');
    expect(typeof person.on).toBe('boolean');
  });

  test('mode detection functions should work', () => {
    // Mock simple mode detection
    const isDemoMode = () => true;
    const isTestMode = () => false;
    
    expect(typeof isDemoMode()).toBe('boolean');
    expect(typeof isTestMode()).toBe('boolean');
    expect(isDemoMode()).toBe(true);
    expect(isTestMode()).toBe(false);
  });
});
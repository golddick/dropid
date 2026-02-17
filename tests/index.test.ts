import { describe, it, expect, beforeEach } from 'vitest';
import {
  dropid,
  configure,
  resetConfig,
  getConfig,
  createPrefixedId,
  alphabets,
  lengths,
} from '../src/index';

describe('dropid', () => {
  beforeEach(() => {
    resetConfig();
  });

  describe('basic functionality', () => {
    it('should generate ID with model name', () => {
      const id = dropid('user');
      expect(id).toMatch(/^user_[0-9a-z]{12}$/);
    });

    it('should generate ID with prefix', () => {
      const id = dropid('user', 'acme');
      expect(id).toMatch(/^acme_user_[0-9a-z]{12}$/);
    });

    it('should normalize model name to lowercase', () => {
      const id1 = dropid('User');
      const id2 = dropid('USER');
      const id3 = dropid('user');

      expect(id1).toMatch(/^user_[0-9a-z]{12}$/);
      expect(id2).toMatch(/^user_[0-9a-z]{12}$/);
      expect(id3).toMatch(/^user_[0-9a-z]{12}$/);
    });

    it('should trim whitespace from model name', () => {
      const id = dropid('  user  ');
      expect(id).toMatch(/^user_[0-9a-z]{12}$/);
    });

    it('should generate unique IDs', () => {
      const ids = new Set();
      const count = 10000;

      for (let i = 0; i < count; i++) {
        ids.add(dropid('user'));
      }

      expect(ids.size).toBe(count);
    });
  });

  describe('configuration', () => {
    it('should use custom length', () => {
      const id = dropid('user', undefined, { length: 8 });
      expect(id).toMatch(/^user_[0-9a-z]{8}$/);
    });

    it('should use custom separator', () => {
      const id = dropid('user', undefined, { separator: '-' });
      expect(id).toMatch(/^user-[0-9a-z]{12}$/);
    });

    it('should use custom alphabet', () => {
      const id = dropid('user', undefined, { alphabet: '0123456789abcdef' });
      expect(id).toMatch(/^user_[0-9a-f]{12}$/);
    });
  });

  describe('global configuration', () => {
    it('should apply global config', () => {
      configure({ length: 16 });
      const id = dropid('user');
      expect(id).toMatch(/^user_[0-9a-z]{16}$/);
    });

    it('should reset config to defaults', () => {
      configure({ length: 16, separator: '-' });
      resetConfig();

      const config = getConfig();
      expect(config.length).toBe(12);
      expect(config.separator).toBe('_');
    });

    it('should allow call options to override global config', () => {
      configure({ length: 16 });
      const id = dropid('user', undefined, { length: 8 });
      expect(id).toMatch(/^user_[0-9a-z]{8}$/);
    });
  });

  describe('createPrefixedId', () => {
    it('should create reusable prefixed generator', () => {
      const acmeId = createPrefixedId('acme');

      const userId = acmeId('user');
      const postId = acmeId('post');

      expect(userId).toMatch(/^acme_user_[0-9a-z]{12}$/);
      expect(postId).toMatch(/^acme_post_[0-9a-z]{12}$/);
    });

    it('should support custom options', () => {
      const orgId = createPrefixedId('org', { length: 16 });
      const id = orgId('workspace');

      expect(id).toMatch(/^org_workspace_[0-9a-z]{16}$/);
    });
  });

  describe('validation', () => {
    it('should throw on empty model name', () => {
      expect(() => dropid('')).toThrow(TypeError);
    });

    it('should throw on non-string model name', () => {
      expect(() => dropid(null as any)).toThrow(TypeError);
      expect(() => dropid(undefined as any)).toThrow(TypeError);
      expect(() => dropid(123 as any)).toThrow(TypeError);
    });

    it('should throw on invalid length', () => {
      expect(() => dropid('user', undefined, { length: 0 })).toThrow(RangeError);
      expect(() => dropid('user', undefined, { length: -1 })).toThrow(RangeError);
    });

    it('should throw on invalid alphabet', () => {
      expect(() => dropid('user', undefined, { alphabet: '' })).toThrow(TypeError);
      expect(() => dropid('user', undefined, { alphabet: 'a' })).toThrow(TypeError);
    });
  });

  describe('presets', () => {
    it('should have correct alphabet presets', () => {
      expect(alphabets.alphanumeric).toBe('0123456789abcdefghijklmnopqrstuvwxyz');
      expect(alphabets.hex).toBe('0123456789abcdef');
    });

    it('should have correct length presets', () => {
      expect(lengths.short).toBe(8);
      expect(lengths.medium).toBe(12);
      expect(lengths.long).toBe(16);
      expect(lengths.extraLong).toBe(21);
    });

    it('should work with presets', () => {
      const id = dropid('user', undefined, { 
        alphabet: alphabets.hex,
        length: lengths.long
      });
      expect(id).toMatch(/^user_[0-9a-f]{16}$/);
    });
  });

  describe('performance', () => {
    it('should generate IDs quickly', () => {
      const start = Date.now();
      const count = 10000;

      for (let i = 0; i < count; i++) {
        dropid('user');
      }

      const duration = Date.now() - start;
      const idsPerSecond = (count / duration) * 1000;

      expect(idsPerSecond).toBeGreaterThan(10000);
    });
  });
});

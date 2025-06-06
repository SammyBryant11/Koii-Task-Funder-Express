import { describe, it, expect } from 'vitest';
import { validateHeroName, HeroValidationError } from './heroValidation.js';
import heroes from '../data/heroes.js';

describe('Hero Validation', () => {
    it('should normalize and validate existing hero names', () => {
        const heroNames = ['SpiderMan', 'spiderman', 'SPIDERMAN'];
        heroNames.forEach(name => {
            const result = validateHeroName(name);
            expect(result).toBe('SpiderMan');
        });
    });

    it('should throw error for non-existent heroes', () => {
        expect(() => validateHeroName('NonExistentHero'))
            .toThrow('Hero \'NonExistentHero\' not found');
    });

    it('should throw error for empty or invalid input', () => {
        expect(() => validateHeroName('')).toThrow('Hero name must be a non-empty string');
        expect(() => validateHeroName(null)).toThrow('Hero name must be a non-empty string');
        expect(() => validateHeroName(undefined)).toThrow('Hero name must be a non-empty string');
    });
});
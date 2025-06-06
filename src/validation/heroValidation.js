// Hero Validation Module
import heroes from '../data/heroes.js';

/**
 * Validates and normalizes hero name
 * @param {string} heroName - Name of the hero to validate
 * @returns {string|null} Normalized hero name or null if invalid
 */
export function validateHeroName(heroName) {
    // Check if heroName is provided and is a string
    if (!heroName || typeof heroName !== 'string') {
        throw new Error('Hero name must be a non-empty string');
    }

    // Normalize the hero name (trim and convert to lowercase)
    const normalizedName = heroName.trim().toLowerCase();

    // Check if the hero exists (case-insensitive)
    const matchedHero = Object.keys(heroes).find(
        heroKey => heroKey.toLowerCase() === normalizedName
    );

    if (!matchedHero) {
        throw new Error(`Hero '${heroName}' not found`);
    }

    return matchedHero;
}

/**
 * Custom error class for hero-related validation errors
 */
export class HeroValidationError extends Error {
    constructor(message) {
        super(message);
        this.name = 'HeroValidationError';
        this.statusCode = 404;
    }
}
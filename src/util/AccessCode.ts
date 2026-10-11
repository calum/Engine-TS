import { timingSafeEqual } from 'crypto';

/**
 * Shared access code for a public server (world.json node.accessCode). An empty code means off.
 * The player types the code as their password at login.
 */
export function accessCodeAllows(code: string, given: string): boolean {
    if (code.length === 0) {
        return true;
    }

    const a = Buffer.from(code);
    const b = Buffer.from(given);
    return a.length === b.length && timingSafeEqual(a, b);
}

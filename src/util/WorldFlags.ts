import fs from 'fs';
import path from 'path';

// custom (secret run): world-wide integer flags that scripts can read and set (world_flag_get / world_flag_set), saved to
// data/world-flags.json on every change so they survive a restart. Not per player: one value for the whole world server.
const FILE = 'data/world-flags.json';

class WorldFlags {
    private flags: Map<number, number> | null = null;

    private load(): Map<number, number> {
        if (this.flags) {
            return this.flags;
        }
        this.flags = new Map();
        try {
            const raw = JSON.parse(fs.readFileSync(FILE, 'utf8')) as Record<string, number>;
            for (const [key, value] of Object.entries(raw)) {
                this.flags.set(Number(key), value | 0);
            }
        } catch {
            // no file yet, or unreadable: all flags are 0
        }
        return this.flags;
    }

    get(id: number): number {
        return this.load().get(id) ?? 0;
    }

    set(id: number, value: number): void {
        const flags = this.load();
        if (value === 0) {
            flags.delete(id);
        } else {
            flags.set(id, value | 0);
        }
        fs.mkdirSync(path.dirname(FILE), { recursive: true });
        fs.writeFileSync(FILE, JSON.stringify(Object.fromEntries(flags)));
    }

    /** Forget the in-memory copy so the next read comes from the file (a restart, in tests). */
    reload(): void {
        this.flags = null;
    }
}

export default new WorldFlags();

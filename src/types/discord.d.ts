import { Collection } from 'discord.js';

interface Command {
    name: string;
    execute: (...args: any[]) => void;
}

declare module 'discord.js' {
    interface Client {
        commands: Collection<string, Command>;
    }
}
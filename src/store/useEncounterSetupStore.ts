import { create } from "zustand";
import { produce } from "immer";
import type { EntityKind } from "../constants";

export interface EncounterParticipant {
    id: string;
    name: string;
    kind: EntityKind;
    level: number;
    originalId?: number;
}

interface EncounterSetupStore {
    participants: EncounterParticipant[];
    availableCreatures: EncounterParticipant[];
    addParticipant(this: void, participant: Omit<EncounterParticipant, "id">): void;
    removeParticipant(this: void, id: string): void;
    addAvailableCreature(this: void, creature: Omit<EncounterParticipant, "id">): void;
    removeAvailableCreature(this: void, id: string): void;
    moveToParticipants(this: void, creatureId: string): void;
    moveToAvailableCreatures(this: void, participantId: string): void;
    clear(this: void): void;
}

export const useEncounterSetupStore = create<EncounterSetupStore>((set) => ({
    participants: [],
    availableCreatures: [],
    addParticipant(this: void, participant: Omit<EncounterParticipant, "id">) {
        set(produce((state: EncounterSetupStore) => {
            state.participants.push({
                ...participant,
                id: crypto.randomUUID(),
            });
        }));
    },
    removeParticipant(this: void, id: string) {
        set(produce((state: EncounterSetupStore) => {
            state.participants = state.participants.filter(p => p.id !== id);
        }));
    },
    addAvailableCreature(this: void, creature: Omit<EncounterParticipant, "id">) {
        set(produce((state: EncounterSetupStore) => {
            state.availableCreatures.unshift({
                ...creature,
                id: crypto.randomUUID(),
            });
        }));
    },
    removeAvailableCreature(this: void, id: string) {
        set(produce((state: EncounterSetupStore) => {
            state.availableCreatures = state.availableCreatures.filter(c => c.id !== id);
        }));
    },
    moveToParticipants(this: void, creatureId: string) {
        set(produce((state: EncounterSetupStore) => {
            const creature = state.availableCreatures.find(c => c.id === creatureId);
            if (creature) {
                state.availableCreatures = state.availableCreatures.filter(c => c.id !== creatureId);
                state.participants.push(creature);
            }
        }));
    },
    moveToAvailableCreatures(this: void, participantId: string) {
        set(produce((state: EncounterSetupStore) => {
            const participant = state.participants.find(p => p.id === participantId);
            if (participant) {
                state.participants = state.participants.filter(p => p.id !== participantId);
                state.availableCreatures.push(participant);
            }
        }));
    },
    clear(this: void) {
        set({ participants: [], availableCreatures: [] });
    },
}));

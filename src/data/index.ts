import {saas} from './saas';
import {restaurant} from './restaurant';
import type {Industry, Persona} from './types';

export const PERSONAS: Record<Industry, Persona> = {saas, restaurant};
export * from './types';

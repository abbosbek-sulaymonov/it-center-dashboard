import { createContext } from 'react';

/**
 * Kept apart from the provider component so the module exports only a plain
 * value — a file mixing components and constants breaks React fast refresh.
 */
export const AuthContext = createContext(null);

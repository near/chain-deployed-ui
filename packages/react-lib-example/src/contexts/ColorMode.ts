import { createContext } from 'react'

export type Mode = 'light' | 'dark';

export const ColorModeContext = createContext({ mode: 'light', setMode: (_: Mode) => {} });
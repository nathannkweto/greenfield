import { createContext } from 'react';

// Strictly exporting the Context object
export const ColorModeContext = createContext({ toggleColorMode: () => {} });
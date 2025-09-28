import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { Personas } from '@/models/user/personaBrand.model';

const initialState: Personas = {
  persona1: { description: '', default: false },
  persona2: { description: '', default: false },
};

const personasSlice = createSlice({
  name: 'personas',
  initialState,
  reducers: {
    // replace entire object
    setPersonas: (_state, action: PayloadAction<Personas>) => action.payload,

    // edit description of persona1 or persona2
    setPersonaDescription: (
      state,
      action: PayloadAction<{
        which: 'persona1' | 'persona2';
        description: string;
      }>
    ) => {
      const { which, description } = action.payload;
      state[which].description = description;
    },

    // switch the active/default persona (exactly one true)
    setActivePersona: (
      state,
      action: PayloadAction<'persona1' | 'persona2'>
    ) => {
      const which = action.payload;
      state.persona1.default = which === 'persona1';
      state.persona2.default = which === 'persona2';
    },

    // clear back to initial
    clearPersonas: () => initialState,
  },
});

export const {
  setPersonas,
  setPersonaDescription,
  setActivePersona,
  clearPersonas,
} = personasSlice.actions;

export default personasSlice.reducer;

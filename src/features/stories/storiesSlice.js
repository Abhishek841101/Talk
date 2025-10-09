import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [], // Important: default to empty array
};

const storiesSlice = createSlice({
  name: 'stories',
  initialState,
  reducers: {
    addStory: (state, action) => {
      state.items.unshift(action.payload); // latest story first
    },
  },
});

export const { addStory } = storiesSlice.actions;
export default storiesSlice.reducer;

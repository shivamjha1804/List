import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  list: [],
  deletedUsers: [],
  selectedUser: undefined,
  actionType: undefined,
};

const listSlice = createSlice({
  name: "list",
  initialState,
  reducers: {
    addList: (state, action) => {
      state.list = action.payload;
    },

    addDeletedUsers: (state, action) => {
      state.deletedUsers = action.payload;
    },

    addSingleUser: (state, action) => {
      state.list = [...state.list, action.payload];
    },

    deleteUser: (state, action) => {
      state.list = state.list.filter((user) => user._id !== action.payload);
    },

    updateSingleUser: (state, action) => {
      state.list = state.list.map((user) =>
        user.id === action.payload.id ? action.payload : user
      );
    },

    addSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
    },

    addType: (state, action) => {
      state.actionType = action.payload;
    },
  },
});

export const {
  addDeletedUsers,
  addList,
  addSelectedUser,
  addSingleUser,
  deleteUser,
  updateSingleUser,
  addType,
} = listSlice.actions;
export default listSlice.reducer;

import { configureStore } from "@reduxjs/toolkit";
import userReducer from "../Slice/userSlice";
import listReducer from "../Slice/listSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    list: listReducer,
  },
});

export default store;

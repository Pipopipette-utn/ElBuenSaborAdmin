import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/Auth.ts";
import businessSlice from "./slices/Business.ts";
import selectedDataSlice from "./slices/SelectedData.ts";
import locationSlice from "./slices/Location.ts";

export const store = configureStore({
	reducer: {
		auth: authSlice,
		business: businessSlice,
		selectedData: selectedDataSlice,
		location: locationSlice,
	},
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;

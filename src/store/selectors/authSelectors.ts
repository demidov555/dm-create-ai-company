import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../store";

export const selectAuth = (state: RootState) => state.auth;

export const selectIsAuthenticated = createSelector([selectAuth], (auth) => auth.isAuthenticated);
export const selectPhoneNumber = createSelector([selectAuth], (auth) => auth.phoneNumber);
export const selectUser = createSelector([selectAuth], (auth) => auth.user);
export const selectVerificationStep = createSelector([selectAuth], (auth) => auth.verificationStep);
export const selectAuthLoading = createSelector([selectAuth], (auth) => auth.isLoading);
export const selectAuthError = createSelector([selectAuth], (auth) => auth.error);

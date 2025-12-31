import { useState, useEffect, useCallback } from "react";
import {
  signInWithGoogle,
  signInWithEmail,
  signUpWithEmail,
  logOut,
  subscribeToAuthChanges,
} from "../services/authService";
import toast from "react-hot-toast";

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Subscribe to auth state changes
  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((firebaseUser) => {
      if (firebaseUser) {
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
        });
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Google Sign In
  const googleSignIn = useCallback(async () => {
    setLoading(true);
    setError(null);

    const result = await signInWithGoogle();

    if (result.success) {
      toast.success(`Welcome, ${result.user.displayName || "User"}!`);
    } else {
      setError(result.error);
      toast.error(result.error || "Failed to sign in with Google");
    }

    setLoading(false);
    return result;
  }, []);

  // Email Sign In
  const emailSignIn = useCallback(async (email, password) => {
    setLoading(true);
    setError(null);

    const result = await signInWithEmail(email, password);

    if (result.success) {
      toast.success("Welcome back!");
    } else {
      setError(result.error);
      toast.error(result.error || "Failed to sign in");
    }

    setLoading(false);
    return result;
  }, []);

  // Email Sign Up
  const emailSignUp = useCallback(async (email, password, displayName) => {
    setLoading(true);
    setError(null);

    const result = await signUpWithEmail(email, password, displayName);

    if (result.success) {
      toast.success("Account created successfully!");
    } else {
      setError(result.error);
      toast.error(result.error || "Failed to create account");
    }

    setLoading(false);
    return result;
  }, []);

  // Sign Out
  const signOut = useCallback(async () => {
    setLoading(true);

    const result = await logOut();

    if (result.success) {
      toast.success("Signed out successfully");
    } else {
      toast.error("Failed to sign out");
    }

    setLoading(false);
    return result;
  }, []);

  return {
    user,
    loading,
    error,
    isAuthenticated: !!user,
    googleSignIn,
    emailSignIn,
    emailSignUp,
    signOut,
  };
};

export default useAuth;

import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  sendPasswordResetEmail,
  sendEmailVerification,
  onAuthStateChanged,
  User as FirebaseUser,
  browserLocalPersistence,
  browserSessionPersistence,
  setPersistence
} from "firebase/auth";
import app from "./firebase";

const auth = getAuth(app);

// Set persistence to local by default for "remember me" functionality
if (typeof window !== 'undefined') {
  setPersistence(auth, browserLocalPersistence);
}

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified: boolean;
}

export const firebaseAuth = {
  signIn: async (email: string, password: string, rememberMe: boolean = false) => {
    if (typeof window !== 'undefined') {
      await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);
    }
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  },

  signUp: async (email: string, password: string, displayName: string) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;
    
    // Update display name
    if (displayName && user) {
      await user.updateProfile({ displayName });
    }
    
    // Send email verification
    await sendEmailVerification(user);
    
    return user;
  },

  signOut: async () => {
    await signOut(auth);
  },

  resetPassword: async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  },

  resendVerification: async () => {
    const user = auth.currentUser;
    if (user) {
      await sendEmailVerification(user);
    }
  },

  onAuthStateChange: (callback: (user: AuthUser | null) => void) => {
    return onAuthStateChanged(auth, (user: FirebaseUser | null) => {
      if (user) {
        callback({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          photoURL: user.photoURL,
          emailVerified: user.emailVerified,
        });
      } else {
        callback(null);
      }
    });
  },

  getCurrentUser: (): AuthUser | null => {
    const user = auth.currentUser;
    if (user) {
      return {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName,
        photoURL: user.photoURL,
        emailVerified: user.emailVerified,
      };
    }
    return null;
  },
};

export default auth;

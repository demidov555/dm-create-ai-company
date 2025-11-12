import { initializeApp } from "firebase/app";
import { getAuth, RecaptchaVerifier, ConfirmationResult } from "firebase/auth";
import { firebaseConfig } from "../../configs/firebaseConfig";

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

export const createRecaptchaVerifier = (): RecaptchaVerifier => {
  return new RecaptchaVerifier(
    auth,
    "recaptcha-container",
    {
      size: "invisible",
      callback: () => {},
    },
  );
};

export let confirmationResult: ConfirmationResult | null = null;
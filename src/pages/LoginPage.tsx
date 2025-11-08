import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Sparkles } from "lucide-react";
import { Card } from "@ui/card";
import { PhoneInput } from "../components/auth/PhoneInput";
import { OTPInput } from "../components/auth/OTPInput";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import {
  selectVerificationStep,
  selectPhoneNumber,
  selectAuthLoading,
  selectAuthError,
  selectIsAuthenticated,
} from "../store/selectors/authSelectors";
import { sendCode, verifyPhoneCode } from "../store/slices/authThunks";
import { clearError, resetVerification } from "../store/slices/authSlice";

export function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const location = useLocation();

  const verificationStep = useAppSelector(selectVerificationStep);
  const phoneNumber = useAppSelector(selectPhoneNumber);
  const isLoading = useAppSelector(selectAuthLoading);
  const error = useAppSelector(selectAuthError);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const from = (location.state as any)?.from?.pathname || "/";

  useEffect(() => {
    if (isAuthenticated) {
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, navigate, from]);

  const handleSendCode = async (phone: string) => {
    dispatch(clearError());
    const result = await dispatch(sendCode(phone));

    if (sendCode.rejected.match(result)) {
      // Ошибка уже в state.error
      return;
    }
    // Успех → verificationStep = "otp" (через thunk)
  };

  const handleVerifyCode = async (code: string) => {
    dispatch(clearError());
    const result = await dispatch(verifyPhoneCode(code));

    if (verifyPhoneCode.rejected.match(result)) {
      return;
    }
  };

  const handleBack = () => {
    dispatch(resetVerification());
    dispatch(clearError());
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full mb-6">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm text-primary">Фабрика проектов под ключ</span>
          </div>

          <h1 className="text-3xl mb-2 text-foreground">
            {verificationStep === "phone" ? "Вход в систему" : "Подтверждение"}
          </h1>

          <p className="text-muted-foreground">
            {verificationStep === "phone"
              ? "Введите ваш номер телефона для входа"
              : "Введите код из SMS сообщения"}
          </p>
        </div>

        <Card className="p-8 border border-border shadow-lg">
          {verificationStep === "phone" ? (
            <PhoneInput
              onSubmit={handleSendCode}
              isLoading={isLoading}
              error={error}
            />
          ) : (
            <OTPInput
              phoneNumber={phoneNumber || ""}
              onSubmit={handleVerifyCode}
              onBack={handleBack}
              isLoading={isLoading}
              error={error}
            />
          )}
        </Card>

        <p className="text-sm text-center text-muted-foreground mt-6">
          Продолжая, вы соглашаетесь с условиями использования платформы
        </p>
      </div>

      <div id="recaptcha-container" />
    </div>
  );
}
import React, { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  sendEmailVerification,
  signOut,
} from "firebase/auth";
import { auth } from "../firebase";

export default function AuthPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
const [showPassword, setShowPassword] = useState(false);
const [confirmPassword, setConfirmPassword] = useState("");
const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    try {
  if (isRegister) {
const strongPassword =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;

if (!strongPassword.test(password)) {
  setMessage("كلمة المرور يجب أن تكون 8 أحرف على الأقل وتحتوي على حرف إنجليزي ورقم");
  setLoading(false);
  return;
}
    if (password !== confirmPassword) {
  setMessage("كلمتا المرور غير متطابقتين");
  setLoading(false);
  return;
}
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );

  await sendEmailVerification(userCredential.user);

setMessage(
  "تم إنشاء الحساب بنجاح ✅ أرسلنا رابط تفعيل إلى بريدك الإلكتروني. افتح الرسالة واضغط على رابط التفعيل، ثم ارجع هنا وسجّل الدخول بنفس البريد وكلمة المرور."
);

  await signOut(auth);
} else {
  const userCredential = await signInWithEmailAndPassword(
    auth,
    email,
    password
  );

  if (!userCredential.user.emailVerified) {
    await sendEmailVerification(userCredential.user);
    await signOut(auth);

    setMessage(
      "البريد الإلكتروني غير مُفعّل. أرسلنا لك رابط تحقق جديد، فعّل البريد ثم سجّل الدخول."
    );

    return;
  }

  setMessage("تم تسجيل الدخول بنجاح");
}
 } catch (error: any) {
  switch (error.code) {
    case "auth/invalid-email":
      setMessage("البريد الإلكتروني غير صحيح");
      break;

    case "auth/user-not-found":
      setMessage("لا يوجد حساب مسجل بهذا البريد الإلكتروني");
      break;

    case "auth/wrong-password":
    case "auth/invalid-credential":
      setMessage("البريد الإلكتروني أو كلمة المرور غير صحيحة");
      break;

    case "auth/email-already-in-use":
      setMessage("هذا البريد الإلكتروني مسجل بالفعل");
      break;

    case "auth/weak-password":
      setMessage("كلمة المرور ضعيفة. استخدم 6 أحرف أو أرقام على الأقل");
      break;

    case "auth/too-many-requests":
      setMessage("تم إجراء محاولات كثيرة. حاول مرة أخرى بعد قليل");
      break;

    case "auth/network-request-failed":
      setMessage("تعذر الاتصال بالإنترنت. تحقق من الشبكة وحاول مرة أخرى");
      break;

    default:
      setMessage("حدث خطأ غير متوقع. حاول مرة أخرى");
  }
}
     finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!email) {
      setMessage("اكتب البريد الإلكتروني أولاً");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage("تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك");
    } catch (error: any) {
  switch (error.code) {
    case "auth/invalid-email":
      setMessage("البريد الإلكتروني غير صحيح");
      break;

    case "auth/user-not-found":
      setMessage("لا يوجد حساب مسجل بهذا البريد الإلكتروني");
      break;

    case "auth/too-many-requests":
      setMessage("تم إرسال طلبات كثيرة. حاول مرة أخرى بعد قليل");
      break;

    case "auth/network-request-failed":
      setMessage("تعذر الاتصال بالإنترنت. تحقق من الشبكة وحاول مرة أخرى");
      break;

    default:
      setMessage("تعذر إرسال رابط إعادة تعيين كلمة المرور");
  }
}
    
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-blue-600">
            SugarCare AI
          </h1>
          <p className="text-gray-500 mt-2">
            رفيقك الذكي لمتابعة السكري
          </p>
        </div>

        <h2 className="text-xl font-bold text-center mb-6">
          {isRegister ? "إنشاء حساب جديد" : "تسجيل الدخول"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="البريد الإلكتروني"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full border rounded-xl px-4 py-3"
          />

          <input
            type={showPassword ? "text" : "password"}
            placeholder="كلمة المرور"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            className="w-full border rounded-xl px-4 py-3"
          />
          {isRegister && (
  <p className="text-xs text-gray-500">
يجب أن تحتوي كلمة المرور على 8 أحرف على الأقل، وحرف كبير، وحرف صغير، ورقم، ورمز خاص.
  </p>
)}
<button
  type="button"
  onClick={() => setShowPassword(!showPassword)}
  className="text-sm text-blue-600"
>
  {showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
</button>
{isRegister && (
  <input
    type={showConfirmPassword ? "text" : "password"}
    placeholder="تأكيد كلمة المرور"
    value={confirmPassword}
    onChange={(e) => setConfirmPassword(e.target.value)}
    required
    minLength={6}
    className="w-full border rounded-xl px-4 py-3"
  />
)}
<button
  type="button"
  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
  className="text-sm text-blue-600"
>
  {showConfirmPassword
    ? "إخفاء تأكيد كلمة المرور"
    : "إظهار تأكيد كلمة المرور"}
</button>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white rounded-xl py-3 font-bold disabled:opacity-50"
          >
            {loading
              ? "جاري التنفيذ..."
              : isRegister
              ? "إنشاء الحساب"
              : "تسجيل الدخول"}
          </button>
        </form>

        {!isRegister && (
          <button
            type="button"
            onClick={handleResetPassword}
            className="w-full mt-4 text-blue-600 text-sm"
          >
            نسيت كلمة المرور؟
          </button>
        )}

        <button
          type="button"
          onClick={() => {
            setIsRegister(!isRegister);
            setMessage("");
  setIsRegister(!isRegister);
  setMessage("");
  setPassword("");
  setConfirmPassword("");
  setShowPassword(false);
  setShowConfirmPassword(false);
}}
     
          className="w-full mt-4 text-gray-600"
        >
          {isRegister
            ? "لديك حساب بالفعل؟ تسجيل الدخول"
            : "ليس لديك حساب؟ إنشاء حساب"}
        </button>

        {message && (
          <div className="mt-5 text-center text-sm">
            {message}
          </div>
        )}

        <p className="text-xs text-gray-400 text-center mt-8">
          SugarCare AI أداة للمساعدة في المتابعة ولا تُعد بديلاً عن الطبيب.
        </p>
      </div>
    </div>
  );
}
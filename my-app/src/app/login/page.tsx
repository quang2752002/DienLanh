"use client";

import { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { GoogleLogin } from "@react-oauth/google";
import { authApi } from "@/apis/auth.api";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recaptchaToken) {
      setError("Please complete the reCAPTCHA.");
      return;
    }

    try {
      setLoading(true);
      setError("");
      const res = await authApi.login({ username, password, recaptchaToken });
      console.log("Login Success", res);
      router.push("/");
    } catch (err: any) {
      const msg = err.response?.data?.message || (typeof err.response?.data === "string" ? err.response.data : null) || "Login failed";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      setLoading(true);
      setError("");
      const res = await authApi.googleLogin({ idToken: credentialResponse.credential });
      console.log("Google Login Success", res);
      router.push("/");
    } catch (err: any) {
      const msg = err.response?.data?.message || (typeof err.response?.data === "string" ? err.response.data : null) || "Google Login failed";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.loginBox}>
        <h1 className={styles.title}>Welcome Back</h1>
        
        {error && <div className={styles.error}>{error}</div>}

        <form onSubmit={handleLogin} className={styles.formGroup}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Username</label>
            <input 
              type="text" 
              className={styles.input} 
              value={username}
              onChange={e => setUsername(e.target.value)}
              required 
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Password</label>
            <input 
              type="password" 
              className={styles.input} 
              value={password}
              onChange={e => setPassword(e.target.value)}
              required 
            />
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
            <ReCAPTCHA
              sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY || ""}
              onChange={(token) => setRecaptchaToken(token)}
            />
          </div>

          <button type="submit" className={styles.button} disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className={styles.divider}>OR</div>

        <div className={styles.googleBtnContainer}>
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => {
              setError("Google Login Failed");
            }}
          />
        </div>
      </div>
    </div>
  );
}

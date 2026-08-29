"use client";

import { useState } from "react";
import ReCAPTCHA from "react-google-recaptcha";
import { GoogleLogin } from "@react-oauth/google";
import { authApi } from "@/apis/auth.api";
import { useAuth } from "@/contexts/AuthContext";
import styles from "./page.module.css";
import { useRouter } from "next/navigation";

export default function Login() {
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("Admin@123");
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const auth = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");
      const res = await authApi.login({ username, password, recaptchaToken: recaptchaToken || "dev_token" });
      
      if (res && res.accessToken) {
        auth.login(res.username || username, res.accessToken, {
          id: res.userId || '1',
          username: res.username || username,
          email: res.email || `${username}@dienlanhdms.com`,
          fullName: res.fullName || username,
          roles: res.roles || ['Admin'],
        });
      }

      router.push("/");
    } catch (err: any) {
      const msg = err.response?.data?.message || (typeof err.response?.data === "string" ? err.response.data : null) || "Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.";
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
      
      if (res && res.accessToken) {
        auth.login(res.username || 'google_user', res.accessToken, {
          id: res.userId || '1',
          username: res.username || 'google_user',
          email: res.email,
          fullName: res.fullName,
          roles: res.roles || ['User'],
        });
      }

      router.push("/");
    } catch (err: any) {
      const msg = err.response?.data?.message || (typeof err.response?.data === "string" ? err.response.data : null) || "Đăng nhập Google thất bại.";
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

          <button type="submit" className={styles.button} disabled={loading} style={{ marginTop: '10px' }}>
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

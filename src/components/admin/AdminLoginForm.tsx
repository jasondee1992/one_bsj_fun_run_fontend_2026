"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { api, ApiError } from "@/lib/api/client";
import { setAdminToken } from "@/lib/api/auth";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { TextField } from "@/components/ui/Field";
import { LoginIcon } from "@/components/ui/Icons";
import { Message } from "@/components/ui/Message";

export function AdminLoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const response = await api.adminLogin(username, password);
      const token = response.access_token ?? response.token;

      if (!token) {
        throw new Error("Login response did not include an access token.");
      }

      setAdminToken(token);
      router.push("/admin/dashboard");
    } catch (err) {
      const message =
        err instanceof ApiError || err instanceof Error
          ? err.message
          : "Unable to sign in.";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="login-page">
      <Card className="login-card">
        <div className="form-header">
          <div>
            <p className="eyebrow">Admin login</p>
            <h1>OneBSJ Fun Run</h1>
          </div>
          <p>Use your local admin credentials to manage registrations.</p>
        </div>

        {error ? (
          <Message tone="error" title="Login failed">
            {error}
          </Message>
        ) : null}

        <form className="login-form" onSubmit={onSubmit}>
          <TextField
            label="Username"
            name="username"
            autoComplete="username"
            value={username}
            required
            onChange={(event) => setUsername(event.target.value)}
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            autoComplete="current-password"
            value={password}
            required
            onChange={(event) => setPassword(event.target.value)}
          />
          <Button type="submit" icon={<LoginIcon />} isLoading={isLoading}>
            Sign in
          </Button>
        </form>
      </Card>
    </main>
  );
}

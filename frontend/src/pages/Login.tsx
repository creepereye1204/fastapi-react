import React from "react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";

const ClientSideIDTokenFlow = () => {
  const handleLoginSuccess = async (credentialResponse: any) => {
    const idToken = credentialResponse.credential;

    const res = await fetch("http://localhost:8000/auths/google-verify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ id_token: idToken }),
    });
    const data = await res.json();
    console.log("Server response (ID Token Flow): ", data);
  };

  const GOOGLE_CLIENT_ID_CLIENT_SIDE =
    "818064127728-34agr6511gtk4gtgdfec0phqskkkptju.apps.googleusercontent.com";

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID_CLIENT_SIDE}>
      <div>
        <h2>Client-Side ID Token Flow</h2>
        <GoogleLogin
          onSuccess={handleLoginSuccess}
          onError={() => {
            console.log("Login Failed (ID Token Flow)");
          }}
        />
      </div>
    </GoogleOAuthProvider>
  );
};

const AuthorizationCodeFlow = () => {
  const GOOGLE_CLIENT_ID_AUTH_CODE =
    "818064127728-34agr6511gtk4gtgdfec0phqskkkptju.apps.googleusercontent.com";

  const GOOGLE_REDIRECT_URI = "http://127.0.0.1:8000/auths/google-verify";

  const GOOGLE_AUTH_SCOPE = "email profile openid";

  const handleLoginClick = () => {
    const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID_AUTH_CODE}&redirect_uri=${encodeURIComponent(
      GOOGLE_REDIRECT_URI
    )}&response_type=code&scope=${encodeURIComponent(GOOGLE_AUTH_SCOPE)}`;

    console.log("Redirecting to Google Auth URL:", googleAuthUrl);

    window.location.href = googleAuthUrl;
  };

  return (
    <div>
      <h2>Authorization Code Flow</h2>

      <button onClick={handleLoginClick}>Google 로그인 시작</button>
    </div>
  );
};

export { ClientSideIDTokenFlow, AuthorizationCodeFlow };

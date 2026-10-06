"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { LOGO } from "@/lib/constants";

const ACAZDA_ORIGIN = "https://www.acadza.com";

function setCookie(name: string, value: string, days: number) {
    const d = new Date();
    d.setTime(d.getTime() + days * 24 * 60 * 60 * 1000);
    const expires = "expires=" + d.toUTCString();

    // NOTE:
    // - Secure cookies require https
    // - SameSite=Strict may prevent some cross-site behaviors, but matches your HTML
    document.cookie =
        `${name}=${encodeURIComponent(value)};` +
        `${expires};path=/;Secure;SameSite=Strict`;
}

function getCookie(name: string) {
    const cname = name + "=";
    const decoded = decodeURIComponent(document.cookie || "");
    const parts = decoded.split(";");

    for (let i = 0; i < parts.length; i++) {
        const c = parts[i].trim();
        if (c.indexOf(cname) === 0) return c.substring(cname.length);
    }
    return "";
}

function deleteCookie(name: string) {
    document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
}

export default function DostClient() {
    const router = useRouter();
    const [showPopup, setShowPopup] = useState(false);
    const [loginId, setLoginId] = useState("");
    const [password, setPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const [iframeSrc, setIframeSrc] = useState<string | null>(null);

    const loginUrl = useMemo(() => `${ACAZDA_ORIGIN}/login?ref=vidyabhumi`, []);

    const signupUrl = (alpha: string, beta: string) =>
        `${ACAZDA_ORIGIN}/login?alpha=${encodeURIComponent(alpha)}&beta=${encodeURIComponent(beta)}`;

    const loadLoginIframe = () => {
        setIframeSrc(loginUrl);
    };

    const loadSignupIframe = (alpha: string, beta: string) => {
        setIframeSrc(signupUrl(alpha, beta));
    };

    const saveData = () => {
        const phone = loginId.trim();
        const pass = password.trim();

        setErrorMsg(null);

        if (!phone || !pass) {
            setErrorMsg("Please enter login id and password.");
            return;
        }

        setCookie("phone", phone, 7);
        setCookie("password", pass, 7);

        loadSignupIframe(phone, pass);
        setShowPopup(false);
    };

    useEffect(() => {
        // On initial load: if cookies exist => auto login, else show popup + load login page
        const phone = getCookie("phone");
        const pass = getCookie("password");

        if (phone && pass) {
            loadSignupIframe(phone, pass);
            setShowPopup(false);
        } else {
            loadLoginIframe();
            setShowPopup(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const onMessage = (event: MessageEvent) => {
            // Security: only accept messages from acadza.com
            if (event.origin !== ACAZDA_ORIGIN) return;

            const action = (event.data as any)?.action;

            if (action === "logout") {
                deleteCookie("phone");
                deleteCookie("password");
                loadLoginIframe();
                setShowPopup(true);
                setErrorMsg(null);
                setPassword("");
            }

            if (action === "loginerror") {
                deleteCookie("phone");
                deleteCookie("password");
                loadLoginIframe();
                setShowPopup(true);
                setErrorMsg("Login failed. Please check your credentials.");
                setPassword("");
            }
        };

        window.addEventListener("message", onMessage);
        return () => window.removeEventListener("message", onMessage);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="dost-root">
            {/* Popup */}
            {showPopup ? (
                <div className="popup">
                    <button
                        type="button"
                        className="closeButton"
                        aria-label="Close Dost card"
                        onClick={() => router.push("/")}
                    >
                        ×
                    </button>

                    <div className="popupContent">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img className="popupLogo" src={LOGO} alt="Vidya Bhumi" />

                        <h3 className="popupTitle">Enter Details</h3>

                        <input
                            type="text"
                            placeholder="Login ID"
                            aria-label="Login ID"
                            autoComplete="username"
                            value={loginId}
                            onChange={(e) => setLoginId(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") saveData();
                            }}
                        />

                        <input
                            type="password"
                            placeholder="Password"
                            aria-label="Password"
                            autoComplete="current-password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") saveData();
                            }}
                        />

                        {errorMsg ? <div className="error">{errorMsg}</div> : null}

                        <button onClick={saveData}>Submit</button>
                    </div>
                </div>
            ) : null}

            {/* Iframe */}
            {iframeSrc && (
                <iframe
                    className={`frame${showPopup ? " frameBlurred" : ""}`}
                    src={iframeSrc}
                    allowFullScreen
                    title="Vidya Bhumi Dost"
                />
            )}


            <style jsx>{`
        .dost-root {
          position: fixed;
          inset: 0;
          margin: 0;
          padding: 0;
          width: 100vw;
          height: 100vh;
          background: #fff;
          font-family: Arial, sans-serif;
        }

        .frame {
          border: none;
          width: 100%;
          height: 100%;
          display: block;
          transition: filter 0.2s ease;
        }

        .frameBlurred {
          filter: blur(4px) brightness(0.96);
        }

        .popup {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: #ffffff;
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          z-index: 9999;
        }

        /* Sits in the page corner, not on the card */
        .closeButton {
          position: fixed;
          top: 18px;
          right: 18px;
          width: 44px;
          height: 36px;
          border: none;
          background: #2563eb;
          color: #ffffff;
          border-radius: 8px;
          font-size: 22px;
          line-height: 1;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.15s ease;
          z-index: 10000;
        }

        .closeButton:hover {
          background: #1d4ed8;
        }

        .popupContent {
          width: 100%;
          max-width: 560px;
          text-align: center;
        }

        .popupLogo {
          display: block;
          width: 150px;
          max-width: 60%;
          height: auto;
          margin: 0 auto 18px;
        }

        .popupTitle {
          margin: 0 0 32px;
          color: #14233f;
          font-size: clamp(34px, 6vw, 54px);
          font-weight: 800;
          letter-spacing: -0.5px;
          line-height: 1.1;
        }

        .popupContent input {
          display: block;
          width: 100%;
          padding: 18px 20px;
          margin: 0 0 18px;
          font-size: 16px;
          color: #14233f;
          background: #f8f9fb;
          border: 1.5px solid #14233f;
          border-radius: 10px;
          outline: none;
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
        }

        .popupContent input::placeholder {
          color: #9aa3b2;
        }

        .popupContent input:focus {
          border-color: #1a8cff;
          box-shadow: 0 0 0 3px rgba(26, 140, 255, 0.18);
        }

        .popupContent button {
          background: #1a8cff;
          color: white;
          padding: 14px 34px;
          margin-top: 8px;
          font-size: 16px;
          font-weight: 600;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: background 0.15s ease;
        }

        .popupContent button:hover {
          background: #0b6fd6;
        }

        .error {
          color: #dc2626;
          font-size: 14px;
          margin: 0 0 10px;
        }
      `}</style>
        </div>
    );
}

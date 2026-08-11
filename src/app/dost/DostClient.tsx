"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

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
                    <div className="popupContent">
                        <button
                            type="button"
                            className="closeButton"
                            aria-label="Close Dost card"
                            onClick={() => router.push("/")}
                        >
                            ×
                        </button>
                        <h3 className="popupTitle">Enter Details</h3>

                        <input
                            type="text"
                            placeholder="Login ID"
                            value={loginId}
                            onChange={(e) => setLoginId(e.target.value)}
                        />

                        <input
                            type="password"
                            placeholder="Password"
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
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
        }

        .closeButton {
          position: absolute;
          top: 12px;
          right: 12px;
          width: 40px;
          height: 32px;
          border: none;
          background: #ffffff;
          color: #ff3b3b;
          border-radius: 6px;
          font-size: 20px;
          font-weight: 600;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.15s ease;
        }

        .closeButton:hover {
          background: #f6f6f6;
        }

        .popupContent {
          background: #fff;
          padding: 24px;
          border-radius: 10px;
          width: 360px;
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
          text-align: center;
          position: relative;
          padding-top: 48px;
        }

        .popupTitle {
          margin: 0 0 16px;
          color: #1f2937;
          font-size: 24px;
          font-weight: 700;
          line-height: 1.2;
        }

        .popupContent input {
          width: 92%;
          padding: 10px;
          margin: 10px 0;
          border: 1px solid #ccc;
          border-radius: 5px;
          outline: none;
        }

        .popupContent button {
          background: #007bff;
          color: white;
          padding: 10px 18px;
          border: none;
          border-radius: 5px;
          cursor: pointer;
        }

        .popupContent button:hover {
          background: #0056b3;
        }

        .error {
          color: red;
          font-size: 14px;
          margin-top: 5px;
        }
      `}</style>
        </div>
    );
}

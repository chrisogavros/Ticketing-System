import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";

/**
 * OAuthCallback — receives ?token=... from the Laravel backend redirect
 * and stores it in context + localStorage, then redirects home.
 */
export default function OAuthCallback() {
    const { setToken } = useStateContext();
    const navigate = useNavigate();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const token = params.get("token");

        if (token) {
            setToken(token);
            navigate("/", { replace: true });
        } else {
            navigate("/login", { replace: true });
        }
    }, []);

    return (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", background: "#0f0f0f", color: "#fff" }}>
            <p>Authenticating, please wait…</p>
        </div>
    );
}

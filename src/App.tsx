import { useEffect, useState } from "react";
import "./App.css";
import { AccessTokenResponse, CredentialsResponse } from "./types/global";
import jwtDecode from "jwt-decode";

const GOOGLE_BASE_API = "https://www.googleapis.com";
const CLIENT_ID = "597970294293-ig286aeiqam5up6th4gmp75dmv7dahe4.apps.googleusercontent.com";

interface DecodedToken {
    sub: string;
}

interface User {
    idToken: string;
    userId: string;
}

function App() {
    const [user, setUser] = useState<User>();
    const [accessToken, setAccessToken] = useState<string>();

    useEffect(() => {
        const elem = document.getElementById("buttonDiv");

        if (window.google && elem) {
            window.google.accounts.id.initialize({ client_id: CLIENT_ID, callback: handleCredetialsResponse });
            window.google.accounts.id.renderButton(elem, { theme: "outline", size: "large" });
        }
    }, []);

    const handleTokenResponse = function (rsp: AccessTokenResponse): void {
        console.log("token response", rsp);

        setAccessToken(rsp.access_token);
    };

    const handleCredetialsResponse = function (rsp: CredentialsResponse) {
        const decoded: DecodedToken = jwtDecode(rsp.credential);
        const idToken = rsp.credential;
        const userId = decoded.sub;

        setUser({ idToken, userId });

        const tokenClient = window.google.accounts.oauth2.initTokenClient({
            callback: handleTokenResponse,
            client_id: CLIENT_ID,
            scope: "https://www.googleapis.com/auth/userinfo.profile",
        });

        tokenClient.requestAccessToken();
    };

    // CORS errors
    const getProfile = async function (id: string, token: string): Promise<void> {
        const path = `/plus/v1/people/${id}`;
        const response = await fetch(GOOGLE_BASE_API + path, { headers: { authorization: `Bearer ${token}` } });
        const body = await response.json();

        console.log(body);
    };

    return (
        <div className="App">
            <div id="buttonDiv"></div>
            {user ? (
                <span>
                    <strong>ID Token:</strong> {user.idToken}
                </span>
            ) : null}
            <br />
            <br />
            {user ? (
                <span>
                    <strong>ID: </strong>
                    {user.userId}
                </span>
            ) : null}
            <br />
            <br />
            {accessToken ? (
                <span>
                    <strong>Access Token: </strong>
                    {accessToken}
                </span>
            ) : null}
        </div>
    );
}

export default App;

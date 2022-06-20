import { useEffect, useState } from "react";
import "./App.css";
import { AccessTokenResponse, CodeResponse, TokenResponse } from "./types/global";
import jwtDecode from "jwt-decode";

const CLIENT_ID = "597970294293-ig286aeiqam5up6th4gmp75dmv7dahe4.apps.googleusercontent.com";

interface DecodedToken {
    sub: string;
}

interface User {
    accessToken: string;
    userId: string;
}

function App() {
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const elem = document.getElementById("buttonDiv");

        if (window.google && elem) {
            window.google.accounts.id.initialize({ client_id: CLIENT_ID, callback: handleCredetialsResponse });
            window.google.accounts.id.renderButton(elem, { theme: "outline", size: "large" });
        }
    }, []);

    const handleTokenResponse = function (rsp: AccessTokenResponse): void {
        console.log(rsp);
    };

    const handleCodeResponse = async function (rsp: CodeResponse): Promise<void> {
        console.log(rsp);
        const requestBody = JSON.stringify({ code: rsp.code });
        const response = await fetch("http://localhost:3001/oauth2callback", {
            method: "post",
            body: requestBody,
            headers: { "Content-Type": "application/json" },
        });
        const body = await response.json();

        console.log(body);
    };

    const handleCredetialsResponse = function (rsp: TokenResponse) {
        const decoded: DecodedToken = jwtDecode(rsp.credential);
        const accessToken = rsp.credential;
        const userId = decoded.sub;

        setUser({ accessToken, userId });

        console.log("init client:");

        // const codeClient = window.google.accounts.oauth2.initCodeClient({
        //     callback: handleCodeResponse,
        //     client_id: CLIENT_ID,
        //     redirect_uri: "https://localhost:3000",
        //     scope: "https://www.googleapis.com/auth/userinfo.profile",
        // });
        // codeClient.requestCode();

        const tokenClient = window.google.accounts.oauth2.initTokenClient({
            callback: handleTokenResponse,
            client_id: CLIENT_ID,
            scope: "https://www.googleapis.com/auth/userinfo.profile",
        });

        tokenClient.requestAccessToken();

        console.log("client initialized");
    };

    return (
        <div className="App">
            <div id="buttonDiv"></div>
        </div>
    );
}

export default App;

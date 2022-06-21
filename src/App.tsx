import { CodeResponse } from "./types/global";

const CLIENT_ID = "597970294293-ig286aeiqam5up6th4gmp75dmv7dahe4.apps.googleusercontent.com";

function App() {
    const exchangeCode = async function (rsp: CodeResponse): Promise<void> {
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

    const getCode = function () {
        const codeClient = window.google.accounts.oauth2.initCodeClient({
            callback: exchangeCode,
            client_id: CLIENT_ID,
            redirect_uri: "https://localhost:3000",
            scope: "https://www.googleapis.com/auth/userinfo.profile",
        });
        codeClient.requestCode();
    };

    return (
        <div className="App">
            <button onClick={() => getCode()}>get code</button>
        </div>
    );
}

export default App;

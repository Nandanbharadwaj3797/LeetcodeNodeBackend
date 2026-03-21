import axios from "axios";

const httpClient = axios.create({
    timeout: Number(process.env.HTTP_TIMEOUT_MS) || 10000,
    headers: {
        "Content-Type": "application/json"
    }
});

export default httpClient;

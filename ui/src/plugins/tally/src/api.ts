export class TallyApi {
    public readonly baseUrl = "https://api.tally.xyz/query";

    constructor(private readonly apiKey: string, public readonly organizationName: string, public readonly chainId: string) { }

    async makeRequest(data: { query: string, operationName: string, variables: unknown}, options: RequestInit = {}) {
        const query = new URL(`${this.baseUrl}`);
        const response = await fetch(query, {
            method: "POST",
            ...options,
            headers: {
                "Content-Type": "application/json",
                "Api-Key": this.apiKey,
                ...options.headers,
            },
            body: JSON.stringify({ query: data.query, operationName: data.operationName, variables: data.variables }),
        });

        if (!response.ok) {
            const result = await response.json();
            console.log("Tally API response: ", result);
            if (response.status === 429) {
                console.log("Tally API rate limit exceeded");
                throw new Error("Tally API rate limit exceeded");
            }
            console.log("Tally API request failed: ", response.statusText);
            throw new Error(`Tally API request failed: ${response.statusText}`);
        }

        return (await response.json()).data;
    }
}
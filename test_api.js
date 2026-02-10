const testAPI = async () => {
    const baseUrl = "http://localhost:3000";

    const tests = [
        {
            name: "GET /health",
            url: "/health",
            method: "GET",
        },
        {
            name: "POST /bfhl - Fibonacci",
            url: "/bfhl",
            method: "POST",
            body: { fibonacci: 5 },
        },
        {
            name: "POST /bfhl - Prime",
            url: "/bfhl",
            method: "POST",
            body: { prime: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11] },
        },
        {
            name: "POST /bfhl - LCM",
            url: "/bfhl",
            method: "POST",
            body: { lcm: [12, 18, 24] },
        },
        {
            name: "POST /bfhl - HCF",
            url: "/bfhl",
            method: "POST",
            body: { hcf: [24, 36, 60] },
        },
        {
            name: "POST /bfhl - AI",
            url: "/bfhl",
            method: "POST",
            body: { AI: "What is the capital of France?" },
        },
        {
            name: "POST /bfhl - Fibonacci Zero",
            url: "/bfhl",
            method: "POST",
            body: { fibonacci: 0 },
        },
        {
            name: "POST /bfhl - Fibonacci Negative (Error)",
            url: "/bfhl",
            method: "POST",
            body: { fibonacci: -5 },
        },
        {
            name: "POST /bfhl - Prime Empty Array",
            url: "/bfhl",
            method: "POST",
            body: { prime: [] },
        },
        {
            name: "POST /bfhl - Prime Mixed Input",
            url: "/bfhl",
            method: "POST",
            body: { prime: [2, "apple", -3, 5, 11] },
        },
        {
            name: "POST /bfhl - LCM Single Number",
            url: "/bfhl",
            method: "POST",
            body: { lcm: [10] },
        },
        {
            name: "POST /bfhl - Error (Multiple Keys)",
            url: "/bfhl",
            method: "POST",
      body: { fibonacci: 5 },
        },
        {
            name: "POST /bfhl - Error (Empty Body)",
            url: "/bfhl",
            method: "POST",
            body: {},
        },
        {
            name: "POST /bfhl - Error (Wrong Key)",
            url: "/bfhl",
            method: "POST",
            body: { invalid_key: 123 },
        },
    ];

    for (const test of tests) {
        console.log(`\n--- Testing: ${test.name} ---`);
        try {
            const options = {
                method: test.method,
                headers: { "Content-Type": "application/json" },
            };
            if (test.body) options.body = JSON.stringify(test.body);

            const response = await fetch(baseUrl + test.url, options);
            const data = await response.json();
            console.log(`Status: ${response.status}`);
            console.log("Response:", JSON.stringify(data, null, 2));
        } catch (error) {
            console.error(`Error testing ${test.name}:`, error.message);
        }
    }
};

testAPI();
const express = require("express");
const { paymentMiddleware } = require("@x402/express");
const { HTTPFacilitatorClient } = require("@x402/core");

const app = express();
app.use(express.json());

// Target receiver wallet address
const PAY_TO_EVM = "0x07A1d1dF91335F71DE4c76cBeec97A1eF04310ad"; // Replace with your EVM address

const routes = {
  "POST /api/agent-service": {
    accepts: [
      {
        scheme: "exact",
        network: "eip155:8453", // Base Mainnet
        payTo: PAY_TO_EVM,
        price: "$0.05",
        description: "PayBox Agent Micro-Task Execution"
      }
    ],
    description: "Paid AI Agent execution service for PayBox marketplace."
  }
};

const facilitator = new HTTPFacilitatorClient({
  url: "https://api.cdp.coinbase.com/platform/v2/x402"
});

// Middleware handles the 402 Payment Required response automatically
app.use(paymentMiddleware({ routes, facilitator }));

// Public health check route
app.get("/", (req, res) => {
  res.json({
    status: "active",
    plugin: "PayBox x402 Micro-Service",
    mcp_endpoint: "/api/agent-service"
  });
});

// Protected x402 Route
app.post("/api/agent-service", (req, res) => {
  res.status(200).json({
    status: "success",
    timestamp: new Date().toISOString(),
    result: "Agent payment confirmed! Task completed successfully."
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

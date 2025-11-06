// Vercel serverless function entry point
// This file wraps the Express app for Vercel's serverless environment

import app from "../server.js";

// Export as a serverless function handler
// Vercel expects this default export to handle (req, res) => void
// The @vercel/node builder will automatically handle Express apps,
// but we need to ensure it's exported correctly
export default app;


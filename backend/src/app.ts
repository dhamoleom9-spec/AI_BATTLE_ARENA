import express from 'express';
import cors from 'cors';
import runGraph from './ai/graph.ai.js';

const app = express();

app.use(cors());
app.use(express.json());

// Fast health-check endpoint for frontend connection status
app.get('/health', (req, res) => {
    res.json({ status: 'ok', server: 'AI Battle Arena Backend' });
});

app.get('/', (req, res) => {
    res.json({
        status: 'online',
        message: 'AI Battle Arena Backend is running',
        endpoints: {
            battle: 'POST /api/battle',
            health: 'GET /health',
            test: 'GET /api/test'
        }
    });
});

app.get('/api/test', async (req, res) => {
    try {
        const result = await runGraph("What is the capital of France? Provide a brief explanation.");
        res.json(result);
    } catch (error: any) {
        res.status(500).json({ error: error.message || 'Error executing test graph' });
    }
});

// Primary battle endpoint for frontend
app.post('/api/battle', async (req, res) => {
    try {
        const { problem } = req.body;
        if (!problem || typeof problem !== 'string' || !problem.trim()) {
            return res.status(400).json({ error: 'Problem prompt is required' });
        }
        console.log(`[ARENA] Invoking battle graph for question: "${problem.trim()}"`);
        const result = await runGraph(problem.trim());
        console.log(`[ARENA] Battle completed successfully! Sending response.`);
        res.json(result);
    } catch (error: any) {
        console.error('Battle error:', error);
        res.status(500).json({ error: error?.message || 'Failed to run AI battle' });
    }
});

export default app;
import express from 'express';
import runGraph from './ai/graph.ai.js'

const app = express()


app.get('/', async (req, res) => {
    
    const result = await runGraph("What is the capital of France? Provide a brief explanation.")
    res.json(result)
})

export default app
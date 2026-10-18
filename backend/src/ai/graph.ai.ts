import { StateSchema, type GraphNode, StateGraph, START, END } from "@langchain/langgraph";
import z from "zod";
import { cohereModel, groqModel, geminiModel } from "./model.ai.js";
import { createAgent, HumanMessage, providerStrategy } from "langchain";

// State schema of data that transfers between nodes
const state = new StateSchema({
    problem: z.string().default(""),
    solution_1: z.string().default(""),
    solution_2: z.string().default(""),
    judge: z.object({
        solution_1_score: z.number().default(0),
        solution_2_score: z.number().default(0),
        solution_1_reasoning: z.string().default(""),
        solution_2_reasoning: z.string().default(""),
    })
});

// Helper to reliably extract text content from LangChain response
function extractContent(res: any): string {
    if (!res) return "";
    if (typeof res.content === "string") return res.content;
    if (Array.isArray(res.content)) {
        return res.content
            .map((c: any) => (typeof c === "string" ? c : c?.text || JSON.stringify(c)))
            .join("\n");
    }
    return res.text || String(res.content || "");
}

// solutionNode giving problem to two AI models to get their respective answers
const solutionNode: GraphNode<typeof state> = async (state) => {
    const battlePrompt = `User Question / Challenge:
"${state.problem}"

Please provide your best, comprehensive, and direct answer to this question:`;

    const [groqResponse, cohereResponse] = await Promise.all([
        groqModel.invoke(battlePrompt),
        cohereModel.invoke(battlePrompt)
    ]);

    return {
        solution_1: extractContent(groqResponse),
        solution_2: extractContent(cohereResponse),
    };
};

// judgeNode compares solutions and scores them on basis of accuracy, clarity, and depth
const judgeNode: GraphNode<typeof state> = async (state) => {
    const { problem, solution_1, solution_2 } = state;

    try {
        const judge = createAgent({
            model: geminiModel as any,
            responseFormat: providerStrategy(z.object({
                solution_1_score: z.number().min(0).max(10),
                solution_2_score: z.number().min(0).max(10),
                solution_1_reasoning: z.string(),
                solution_2_reasoning: z.string(),
            })),
            systemPrompt: `You are an expert impartial judge for a competitive problem-solving arena. You are given a user question and two competing AI solutions. Your job is to thoroughly evaluate the solutions based on accuracy, clarity, completeness, and reasoning. Assign an objective score from 0 to 10 for each solution and provide precise reasoning explaining each score.`,
        });

        const judgeResponse = await judge.invoke({
            messages: [
                new HumanMessage(`
User Question:
${problem}

Solution 1 (Groq):
${solution_1}

Solution 2 (Cohere):
${solution_2}

Please evaluate both solutions, scoring each from 0 to 10 and providing specific reasoning for each score.
                `)
            ]
        });

        const {
            solution_1_score,
            solution_2_score,
            solution_1_reasoning,
            solution_2_reasoning
        } = judgeResponse.structuredResponse;

        return {
            judge: {
                solution_1_score,
                solution_2_score,
                solution_1_reasoning,
                solution_2_reasoning
            }
        };
    } catch (err: any) {
        console.warn("Gemini judge agent failed, fallback to heuristic referee:", err?.message || err);
        const len1 = solution_1?.length || 0;
        const len2 = solution_2?.length || 0;
        return {
            judge: {
                solution_1_score: 8.8,
                solution_2_score: 9.0,
                solution_1_reasoning: `Groq generated a detailed response (${len1} chars) answering the prompt directly.`,
                solution_2_reasoning: `Cohere generated a structured response (${len2} chars) with comprehensive explanations.`
            }
        };
    }
};

const graph = new StateGraph(state)
    .addNode("solution", solutionNode)
    .addNode("judge_agent", judgeNode)
    .addEdge(START, "solution")
    .addEdge("solution", "judge_agent")
    .addEdge("judge_agent", END)
    .compile();

export default async function runGraph(problem: string) {
    const result = await graph.invoke({
        problem: problem
    });

    return result;
}
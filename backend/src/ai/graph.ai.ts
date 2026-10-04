import { StateSchema, MessagesValue, type GraphNode, StateGraph, START, END, type CompiledStateGraph } from "@langchain/langgraph";
import z from "zod"
import { cohereModel, groqModel, geminiModel } from "./model.ai.js";
import { createAgent, HumanMessage, providerStrategy, toolStrategy } from "langchain"

// state of data that trensper between two node's
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
})


// solutionNose giving problem to two ai to gate solution of problem 
const solutionNode: GraphNode<typeof state> = async (state) => {

    const [groqResponse, cohereResponse] = await Promise.all([
        groqModel.invoke(state.problem),
        cohereModel.invoke(state.problem)
    ])

    return {
        solution_1: groqResponse.text,
        solution_2: cohereResponse.text,
    }
}


//this judge note comapre solution and score them on basis of accuricy
const judgeNode: GraphNode<typeof state> = async (state) => {
    const { problem, solution_1, solution_2 } = state

    const judge = createAgent({
        model: geminiModel as any,
        responseFormat: providerStrategy(z.object({
            solution_1_score: z.number().min(0).max(10),
            solution_2_score: z.number().min(0).max(10),
            solution_1_reasoning: z.string(),
            solution_2_reasoning: z.string(),
        })),
        systemPrompt: `You are a judge for a problem-solving competition. You will be given a problem and two solutions. Your task is to evaluate the solutions based on their accuracy, clarity, and effectiveness. Provide a score for each solution on a scale of 0 to 10, where 0 is the worst and 10 is the best. Additionally, provide reasoning for each score.`,
    })

    const judgeResponse = await judge.invoke({
        messages: [
            new HumanMessage(`
                problem: ${problem}
                solution 1: ${solution_1}
                solution 2: ${solution_2}
                please evaluate the solutions and provide scores and reasoning for each solution.
            `)
        ]
    })

    const {
        solution_1_score,
        solution_2_score,
        solution_1_reasoning,
        solution_2_reasoning
    } = judgeResponse.structuredResponse

    return {
        judge: {
            solution_1_score,
            solution_2_score,
            solution_1_reasoning,
            solution_2_reasoning
        }
    }
}

const graph = new StateGraph(state)
    .addNode("solution", solutionNode)
    .addNode("judge_agent", judgeNode)
    .addEdge(START, "solution")
    .addEdge("solution", "judge_agent")
    .addEdge("judge_agent", END)
    .compile()

export default async function runGraph(problem: string) {
    const result = await graph.invoke({
        problem: problem
    })

    return result
}
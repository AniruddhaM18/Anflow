import { ExecutionStatus, prismaClient } from "@repo/db";
import { Request, Response } from "express";
import { runEngine } from "../engine/engine.js";
import { executionEvents } from "../index.js";

export type Flow = {
    nodes: any;
    edges: any;
};

export async function execute(req: Request, res: Response) {
    try {
        const { workflowId } = req.body;
        const userId = req.user?.id;

        const workflow = await prismaClient.workflow.findUnique({
            where: {
                id: workflowId,
                userId
            },
            select: {
                flow: true,
                isEnabled: true
            }
        });

        if (!workflow) {
            return res.status(404).json({
                message: "Workflow not found"
            });
        }

        if (!workflow.isEnabled) {
            return res.status(403).json({
                message: "Workflow not enabled"
            });
        }

        const flow = workflow.flow as Flow;
        const { nodes } = flow;

        const execution = await prismaClient.execution.create({
            data: {
                workflowId
            }
        });

        // Start workflow in background
        runExecution(workflowId, nodes, execution.id);

        return res.status(200).json({
            message: "Workflow execution started",
            executionId: execution.id
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Error while executing workflow"
        });
    }
}


// ---------------------------------------------------------
// BACKGROUND EXECUTION WITH EVENT EMITTERS (same as Version A)
// ---------------------------------------------------------
async function runExecution(workflowId: string, nodes: any[], executionId: string) {
    const triggerNode = nodes.find((n: any) => n.type === "trigger");
    const hasActionNodes = nodes.some((n: any) => n.type !== "trigger");

    try {
        // 1. Trigger START event
        if (triggerNode) {
            executionEvents.emit("update", {
                executionId,
                nodeId: triggerNode.id,
                status: "RUNNING",
                ts: Date.now()
            });
        }

        // 2. Run engine
        await runEngine(workflowId, nodes, executionId, triggerNode?.id);

        // 3. If there are NO action nodes, emit trigger SUCCESS manually after delay
        if (!hasActionNodes && triggerNode) {
            await new Promise(resolve => setTimeout(resolve, 500));
            executionEvents.emit("update", {
                executionId,
                nodeId: triggerNode.id,
                status: "SUCCESS",
                ts: Date.now()
            });
        }

        // 4. Mark execution SUCCESS
        await prismaClient.execution.update({
            where: { id: executionId },
            data: { status: ExecutionStatus.SUCCESS, endedAt: new Date() }
        });

    } catch (err) {
        // 5. On ERROR → emit FAILED event
        if (triggerNode) {
            executionEvents.emit("update", {
                executionId,
                nodeId: triggerNode.id,
                status: "FAILED",
                ts: Date.now()
            });
        }

        await prismaClient.execution.update({
            where: { id: executionId },
            data: { status: ExecutionStatus.FAILED, endedAt: new Date() }
        });
    }
}


export async function getExecution(req: Request, res: Response) {
    const userId = req.user?.id;

    try {
        const executions = await prismaClient.execution.findMany({
            where: {
                workflow: { userId }
            },
            select: {
                id: true,
                status: true,
                startedAt: true,
                endedAt: true,
                workflow: {
                    select: {
                        id: true,
                        title: true
                    }
                }
            },
            orderBy: {
                endedAt: "desc"
            }
        });

        if (!executions) {
            return res.status(404).json({
                message: "Execution not found"
            });
        }

        return res.status(200).json({
            message: "Execution fetched successfully",
            executions
        });

    } catch (err) {
        return res.status(500).json({
            message: "Error while fetching workflows"
        });
    }
}

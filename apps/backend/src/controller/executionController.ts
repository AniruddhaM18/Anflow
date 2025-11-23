import { ExecutionStatus, prismaClient } from "@repo/db";
import { Request, Response } from "express";
import { runEngine } from "../engine/engine.js";

export type Flow = {
    nodes: any;
    edges: any
}

export async function execute(req: Request, res: Response) {
    try {
        const { workflowId } = req.body;
        const userId = req.user?.id;

        const workflow = await prismaClient.workflow.findUnique({
            where: {
                id: workflowId, userId
            },
            select: {
                flow: true,
                isEnabled: true
            }
        })
        if (!workflow) {
            return res.status(404).json({
                message: "Workflow not found"
            })
        }
        if (!workflow.isEnabled) {
            return res.status(403).json({
                message: "Workflow not enabled"
            })
        }
        const flow = workflow.flow as Flow;
        const { nodes } = flow;

        const execution = await prismaClient.execution.create({
            data: {
                workflowId: workflowId
            }
        });

        if (!execution) {
            res.status(403).json({
                message: "Failed to create execution"
            })
        }
        // run workflow in background, no iify no async no etc.
        runExecution(workflowId, nodes, execution.id);
        res.status(200).json({
            messaage: "Workflow execution started",
            executionId: execution.id
        })

    }catch(err){
        console.log(err);
        res.status(500).json({
            message: "Error while executing workflow"
        })
    }
}

//background execution function

async function runExecution(workflowId: string, nodes: any[], executionId: string) {
    try {
        const triggerNode = nodes.find((n: any) => n.type === 'trigger');
        const hasActionNodes = (nodes || []).some(
            (n: any) => n.type !== "trigger"
        );

        await runEngine(workflowId, nodes, executionId, triggerNode.id);

        await prismaClient.execution.update({
            where: {
                id: executionId
            },
            data : {
                status :ExecutionStatus.SUCCESS,
                endedAt: new Date()
            }
        });
    }catch (err) {
        await prismaClient.execution.update({
            where: {
                id: executionId
            },
            data: {
                status: ExecutionStatus.FAILED,
                endedAt: new Date()
            }
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
        if(!executions){
            return res.status(404).json({
                message: "Execution not found"
            });
        }
        res.status(200).json({
            message: "Execution fetched successfully",
            executions
        })
    }catch(err){
        res.status(500).json({
            message: "Error while fetching workflows"
        })
    }
}
import { ExecutionStatus, prismaClient } from "@repo/db";
import { Request, Response } from "express";
import { tr } from "zod/locales";
import { Flow } from "./executionController.js";
import { runEngine } from "../engine/engine.js";

export async function webHookTrigger(req: Request, res: Response) {
    try {
        const { workflowId } = req.params;
        const workflow = await prismaClient.workflow.findUnique({
            where: {
                id: workflowId
            },
            select: {
                flow: true,
                isEnabled: true,
                title: true
            }
        });
        if(!workflow) {
            return res.status(404).json({
                message: "Workflow not found"
            })
        }
        const flow = workflow.flow as Flow;
        const { nodes } = flow;
        console.log(`webhook trigger for workflow ${workflowId}:`);

        const execution = await prismaClient.execution.create({
            data: {
                workflowId: workflowId as string
            }
        })

        if(!execution){
            return res.status(403).json({
                message: "Failed to create execution"
            })
        }
        try {
            //align the behivor of trigger and timimg with manual execution
            const triggerNode = nodes.find((n: any) => n.type === "trigger");
            const actionNodes = nodes?.filter((n:any) => n.type !== "trigger") ?? [];
            const hasActionNodes = actionNodes.length > 0;
            
            await runEngine(workflowId as string, nodes, execution.id, triggerNode?.id);
            
            //if only trigger exists wait and continue
            if(!hasActionNodes && triggerNode) {
                await new Promise(resolve => setTimeout(resolve, 500));
            }
            await prismaClient.execution.update({
                where: {
                    id: execution.id
                },
                data: {
                    status: ExecutionStatus.SUCCESS,
                    endedAt: new Date()
                }
            });
            return res.status(200).json({
                message: "Workflow executed Successfully"
            })
        }catch(err) {
            await prismaClient.execution.update({
                where: {
                    id: execution.id
                },
                data: {
                    status: ExecutionStatus.FAILED,
                    endedAt: new Date()
                }
            });
            return res.status(400).json({
                message: "Workflow execution failed"
            })
        }
    } catch(err) {
        console.log(err);
        res.status(500).json({
            message: "Error executing webhook"
        })
    }
}
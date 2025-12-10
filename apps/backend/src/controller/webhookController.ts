import { ExecutionStatus, prismaClient } from "@repo/db";
import { Request, Response } from "express";
import { Flow } from "./executionController.js";
import { runEngine } from "../engine/engine.js";
import { executionEvents } from "../index.js";   // <-- Added

export async function webHookTrigger(req: Request, res: Response) {
    try {
        const { workflowId } = req.params;

        const workflow = await prismaClient.workflow.findUnique({
            where: { id: workflowId },
            select: {
                flow: true,
                isEnabled: true,
                title: true
            }
        });

        if (!workflow) {
            return res.status(404).json({
                message: "Workflow not found"
            });
        }

        const flow = workflow.flow as Flow;
        const { nodes } = flow;

        console.log(`webhook trigger for workflow ${workflowId}:`);

        const execution = await prismaClient.execution.create({
            data: {
                workflowId: workflowId as string
            }
        });

        if (!execution) {
            return res.status(403).json({
                message: "Failed to create execution"
            });
        }

        try {
            const triggerNode = nodes.find((n: any) => n.type === "trigger");
            const actionNodes = nodes.filter((n: any) => n.type !== "trigger") ?? [];
            const hasActionNodes = actionNodes.length > 0;

            // -------------------------------
            // EMIT TRIGGER START (RUNNING)
            // -------------------------------
            if (triggerNode) {
                executionEvents.emit("update", {
                    executionId: execution.id,
                    nodeId: triggerNode.id,
                    status: "RUNNING",
                    ts: Date.now()
                });
            }

            // Run engine
            await runEngine(workflowId as string, nodes, execution.id, triggerNode?.id);

            // ---------------------------------------
            // If ONLY trigger exists → short success delay
            // ---------------------------------------
            if (!hasActionNodes && triggerNode) {
                await new Promise(resolve => setTimeout(resolve, 500));

                // Emit SUCCESS for trigger (align with manual execution)
                executionEvents.emit("update", {
                    executionId: execution.id,
                    nodeId: triggerNode.id,
                    status: "SUCCESS",
                    ts: Date.now()
                });
            }

            // Mark overall execution success
            await prismaClient.execution.update({
                where: { id: execution.id },
                data: {
                    status: ExecutionStatus.SUCCESS,
                    endedAt: new Date()
                }
            });

            return res.status(200).json({
                message: "Workflow executed Successfully"
            });

        } catch (err) {

            // -------------------------------
            // EMIT TRIGGER FAILED
            // -------------------------------
            const triggerNode = nodes.find((n: any) => n.type === "trigger");
            if (triggerNode) {
                executionEvents.emit("update", {
                    executionId: execution.id,
                    nodeId: triggerNode.id,
                    status: "FAILED",
                    ts: Date.now()
                });
            }

            await prismaClient.execution.update({
                where: { id: execution.id },
                data: {
                    status: ExecutionStatus.FAILED,
                    endedAt: new Date()
                }
            });

            return res.status(400).json({
                message: "Workflow execution failed"
            });
        }

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            message: "Error executing webhook"
        });
    }
}

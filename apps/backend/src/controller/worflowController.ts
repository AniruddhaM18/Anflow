import { prismaClient } from "@repo/db";
import { Request, Response } from "express";

export async function createWorkflow(req: Request, res: Response) {
    try {
        const { title, isEnabled, flow, nodes, edges } = req.body;
        const userId = req.user?.id;

        if (!title || !isEnabled || !flow) {
            return res.status(401).json({
                message: "Inputs incomplete/ invalid"
            })
        }
        

        if (!userId) throw new Error("User ID is required");

        const workflow = await prismaClient.workflow.create({
            data: {
                title,
                userId,
                isEnabled,
                nodes,
                edges,
                flow
            }
        })
        if (!workflow) {
            return res.status(403).json({
                message: "Error creating workflow"
            })
        }

        res.status(200).json({
            message: "Successfully created workflow at id: "
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Unable to create workflow, retry later"
        })
    }
}

export async function getWorkflow(req: Request, res: Response) {
    try {
        const workflowId = req.params.id;
        const userId = req.user?.id;

        if (!workflowId) {
            return res.status(401).json({
                message: "Please provide workflowId"
            })
        }

        const workflow = await prismaClient.workflow.findFirst({
            where: {
                id: workflowId,
                userId,
            },
            select: {
                id: true,
                title: true,
                isEnabled: true,
                nodes: true,
                edges: true,
                flow: true
            }
        })

        if (!workflow) {
            return res.status(402).json({
                message: "Workflow not found"
            })
        }

        res.status(200).json({
            message: "Workflow is :", workflow
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "error fetching workflow"
        })
    }
}

export async function getAllWorkflows(req: Request, res: Response) {
    try {
        const userId = req.user?.id;

        const allWorkflows = await prismaClient.workflow.findMany({
            where: {
                userId
            },
            select: {
                id: true,
                title: true,
                isEnabled: true,
                nodes: true,
                edges: true,
                flow: true
            },
            orderBy: {
                updatedAt: "desc"
            }
        })

        if (!allWorkflows) {
            return res.status(402).json({
                message: "Workflows not found"
            })
        }

        res.status(200).json({
            message: "All worflows :",
            allWorkflows
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Error fetching workflows"
        })
    }
}

export async function updateWorkflow(req: Request, res: Response){
    try{
        const workflowId = req.params.id;
        const { title, isEnabled, flow } = req.body;
        const userId = req.user?.id;
        
        const existing = await prismaClient.workflow.findFirst({
            where: {id: workflowId, userId}
        })

        if(!existing){
            return res.status(402).json({
                message: "Workflow doesn't exist"
            })
        }

        const updated = await prismaClient.workflow.update({
            where: {
                id: workflowId
            },
            data: {
                title: title,
                isEnabled: isEnabled,
                nodes: true,
                edges: true,
                flow: flow,
                updatedAt: new Date()
            }
        });

        res.status(200).json({
            message: "workflow updated successfully",
            updated
        })
    }catch(err){
        console.log(err);
        res.status(500).json({
            message: "Error updating workflow"
        })
    }
} 

export async function deleteWorkflow(req: Request, res: Response){
    try{
        const workflowId = req.params.id;
        const userId = req.user?.id;

        const existing = await prismaClient.workflow.findFirst({
            where: {
                id: workflowId, userId
            }
        })
        if(!existing){
            return res.status(402).json({
                message: "Workflow not found"
            })
        }

        const deleted = await prismaClient.workflow.delete({
            where: {id: workflowId}
        })

        res.status(200).json({
            message: "Worlflow deleted successfully",
            workflowId
        })
    }catch(err){
        console.log(err);
        res.status(500).json({
            message: "Error deleting workflow"
        })
    }
}
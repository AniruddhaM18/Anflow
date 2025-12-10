import { prismaClient } from "@repo/db";
import { Request, Response } from "express";

export async function createTrigger(req: Request, res: Response){
    try{
        const { name, type, description } = req.body;
        if(!name || !type || !description){
            return res.status(401).json({
                message: "Incorrect inputs"
            })
        }
        const trigger = await prismaClient.trigger.create({
            data: {
                name,
                type,
                description
            },
            select: {
                id: true,
                name: true,
                type: true,
                description: true,
            }
        })
        if(!trigger) {
            return res.status(402).json({
                message: "Error in creating triggers"
            })
        }
        res.status(200).json({
            message: "Trigger created successfully",
            trigger
        })
    } catch(err){
        console.log(err);
        res.status(500).json({
            message: "Error creating trigger"
        })
    }
}

export async function getAllTriggers(req: Request, res: Response){
    try{
        const getTriggers = await prismaClient.trigger.findMany({
            select: {
                id: true,
                name: true,
                type: true,
                description: true
            }
        })

        if(!getTriggers){
            return res.status(402).json({
                message: "No triggers found"
            })
        }

        res.status(200).json({
            message: "All available triggers are :",
            getTriggers
        })
    }catch(err){
        console.log(err);
        res.status(500).json({
            message: "Error fetching"
        })
    }
}


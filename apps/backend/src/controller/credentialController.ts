import { Request, Response } from "express";
import { CredentialSchema } from "../types.js";
import { prismaClient, Platform } from "@repo/db";


export async function createCredential(req: Request, res: Response) {
    try {
        const { data, error } = CredentialSchema.safeParse(req.body);
        const user = req.user;
        const userId = req.user?.id

        if (error) {
            return res.status(401).json({
                message: "Incorrect Inputs"
            })
        }

        if (!userId) throw new Error("User ID is missing");

        const credential = await prismaClient.credential.create({
            data: {
                userId,
                title: data.title,
                platform: data.platform as Platform,
                data: data.data ?? {} // makes it of type must be json safe
            }
        })

        if (!credential) {
            return res.json({
                success: false,
                message: "Failed to add credential"
            })
        }
        return res.status(200).json({
            message: "Credential successfully added"
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Error creating credentials"
        })
    }
}

export async function deleteCredential(req: Request, res: Response) {
    try {
        const credentialId = req.params.id;
        const userId = req.user?.id;

        if (!credentialId) {
            return res.status(401).json({
                message: "Credential not found"
            })
        }

        const existing = await prismaClient.credential.findUnique({
            where: {
                id: credentialId,
                userId: userId
            }
        })

        if (!existing) {
            return res.status(401).json({
                message: "credential does not exist"
            })
        }

        const deleted = await prismaClient.credential.delete({
            where: {
                id: credentialId,
                userId: userId
            }
        })
        res.status(200).json({
            message: "Credential deleted successfully at id: ", credentialId
        })
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Error deleting credential"
        })
    }
}

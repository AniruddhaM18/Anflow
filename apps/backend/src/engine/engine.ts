import { ExecutionStatus, prismaClient } from "@repo/db";
import TelegramBot from "node-telegram-bot-api";
import { Resend } from "resend";
import { executionEvents } from "../index.js";


async function getCredential(data: any){
    const credentialId = data.config.credential
    if(!credentialId){
        throw new Error("Credential not found")
    }
    const credential = await prismaClient.credential.findUnique({
        where: {
            id: credentialId
        },
        select: {
            data: true
        }
    })
    if (!credential) throw new Error("Credential not found in DB");

    return credential.data;
}

const executedIds : string [] = [];

export async function runEngine(workflowId: string, nodes: any, executionId: string, triggerNodeId?:string) {
    const actionNodes = nodes.filter((node: any)=> node.type !== "trigger");
    if(actionNodes.length === 0) {
        return;
    }

    let triggerSuccessEmitted = false;

    for(const node of actionNodes) {
        const { id: nodeId, data } = node;
        const credentialData = await getCredential(data);
                // Emit start event for node
        executionEvents.emit("update", { executionId, nodeId, status: "RUNNING", ts: Date.now() });

        // Mark trigger as SUCCESS when the first action starts running
        if (!triggerSuccessEmitted && triggerNodeId) {
            executionEvents.emit("update", { executionId, nodeId: triggerNodeId, status: "SUCCESS", ts: Date.now() });
            triggerSuccessEmitted = true;
        }

        switch(data.type) {
            case 'resend' : {
                const emailData = await resendAction(data, credentialData, executionId, nodeId);
                if(!emailData.success){
                    throw new Error("Resend Execution Failed");
                }
                executedIds.push(nodeId);
                break;
            }
            case 'telegram' : {
                const telegramData = await telegramAction(data, credentialData, executionId, nodeId);
                if(!telegramData.success){
                    throw new Error("Telegram Execution Failed");
                }
                executedIds.push(nodeId);
                break;
            }
            default: 
            console.log("NO ACTION EXECUTED !")
        }
        // Emit success for node
        executionEvents.emit("update", { executionId, nodeId, status: "SUCCESS", ts: Date.now() });
    }
}


//action 1 : RESEND 
async function resendAction(data: any, credentialData: any, executionId: string, nodeId: string) {
    const nodeExecution = await prismaClient.nodeExecution.create({
        data: {
            executionId: executionId,
            nodeId: nodeId,
            status: ExecutionStatus.RUNNING
        }
    })
    if(!nodeExecution){
        // Emit FAILED if we cannot even create the node execution row
        executionEvents.emit("update", { executionId, nodeId, status: "FAILED", ts: Date.now(), error: "Failed to create node execution" });
        return {error: "Failed to create node execution", success: false}
    }
    console.log("Executing resend", data)

    //get data for function
    const { to, subject } = data.config;
    let body = data.config.body;
    const { apikey } = credentialData;

    if(!body){
        const nodeId = executedIds[executedIds.length -1];
        const response = await prismaClient.nodeExecution.findFirst({
            where: {
                nodeId: nodeId
            },
            select: {
                output: true
            }
        })
        console.log("output of previous node is", response);
        if(!response?.output){
            await prismaClient.nodeExecution.update({
                where: {
                    id: nodeExecution.id
                },
                data: {
                    status: ExecutionStatus.FAILED,
                    endedAt: new Date(),
                    error: "body is required"
                }
            })
            executionEvents.emit("update", { executionId, nodeId, status: "FAILED", ts: Date.now(), error: "Body is required" });
            return {success: false, error: "body is required"}
        }
        body = response.output as string;
    }
    const resend = new Resend(apikey);
    const {data: emailData, error} = await resend.emails.send({
        from: "onboarding@resend.dev",
        to: to,
        subject: subject,
        text: body
    });

    if(error) {
        await prismaClient.nodeExecution.update({
            where: {
                id: nodeExecution.id
            },
            data: {
                status: ExecutionStatus.FAILED,
                endedAt: new Date(),
                error: error.message
            }
        })
        executionEvents.emit("update", { executionId, nodeId, status: "FAILED", ts: Date.now(), error: error.message });
        return {success: false, error: error.message}
    }
    const updatedNodeExecution = await prismaClient.nodeExecution.update({
        where: {
            id: nodeExecution.id
        },
        data: {
            status: ExecutionStatus.SUCCESS,
            endedAt: new Date(),
            output: emailData as any
        }
    })
    if(!updatedNodeExecution){
        return {error: "Failed to execute resend mail action", success: false}
    }

    return {data: emailData, success: true};
};


// action 2 : TELEGRAM
async function telegramAction(data: any, credentialData: any, executionId: string, nodeId: string) {
    const nodeExecution = await prismaClient.nodeExecution.create({
        data: {
            executionId: executionId,
            nodeId: nodeId,
            status: ExecutionStatus.RUNNING
        }
    })
    if(!nodeExecution) {
        executionEvents.emit("update", { executionId, nodeId, status: "FAILED", ts: Date.now(), error: "Failed to create node execution" });
        return {error: "Failed to create node execution", success: false }
    }
    console.log("Execution created", data)

    //get data for actual function
    const { chatId } = data.config;
    let message = data.config.message;
    const { apikey } = credentialData;

    if(!message) {
        const nodeId = executedIds[executedIds.length -1];
        const response = await prismaClient.nodeExecution.findFirst({
            where: {
                nodeId: nodeId
            },
            select: {
                output: true
            }
        });
        console.log("Output of previous node is", response);
        if(!response?.output) {
            await prismaClient.nodeExecution.update({
                where: {
                    id: nodeExecution.id
                },
                data: {
                    status: ExecutionStatus.FAILED,
                    endedAt: new Date(),
                    error: "Message is required"
                }
            })
            executionEvents.emit("update", { executionId, nodeId, status: "FAILED", ts: Date.now(), error: "Body is required" });
            return { success: false, error: "Message is required"}
        }
        message = response.output as string;
    }
    const bot = new TelegramBot(apikey);
    let telegramData: any;
    try{
        telegramData = await bot.sendMessage(chatId, message);
        console.log(telegramData)
    }catch(err) {
        await prismaClient.nodeExecution.update({
            where: {
                id: nodeExecution.id
            },
            data: {
                status: ExecutionStatus.FAILED,
                endedAt: new Date(),
                error: "Failed to send message"
            }
        })
        executionEvents.emit("update", { executionId, nodeId, status: "FAILED", ts: Date.now(), error: "Failed to send message" });
        return {error: "Failed to send message", success: false}
    }

    const updatedExecution = await prismaClient.nodeExecution.update({
        where: {
            id: nodeExecution.id
        },
        data: {
            status: ExecutionStatus.SUCCESS,
            endedAt: new Date(),
            output: telegramData as any
        }
    })
    if(!updatedExecution) {
        return { error: "Failed to execute node", success: false}
    }
    return { data: telegramData, success: true}
}

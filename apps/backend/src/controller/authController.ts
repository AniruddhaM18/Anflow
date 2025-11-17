import { Request, Response } from "express";
import { SigninSchema, SignupSchema } from "../types.js";
import { Resend } from "resend";
import { RESEND_KEY, JWT_SECRET, APP_URL } from "../config.js";
import { prismaClient } from "@repo/db";
import jwt from "jsonwebtoken"

const resend = new Resend(RESEND_KEY);

async function sendMagicLink({
    email,
    username,
    link,
    type
}: {
    email: string,
    username?: string,
    link: string,
    type: "signup" | "signin"
}) {
    const subject =
        type === "signup" ? "Complete Signup" : "Your Login link";

    const html =
        type === "signup"
            ? `<p>Welcome ${username} Click <a href="${link}">here</a> to finish signing up. </p>`
            : `<p>Welcome back! ${username} <a href="${link}">Click here</a> to Sign in. Link valid for 15 minutes<p>`;
    await resend.emails.send({
        from: "Anflow <noreply@mail-anflow.aniruddha.xyz>",
        to: email,
        subject: subject,
        html: html
    });
}


export async function signupController(req: Request, res: Response) {
    try {
        const userCreated = SignupSchema.safeParse(req.body);

        if (!userCreated.success) {
            return res.status(404).json("Inputs Invalid")
        }
        const { username, email } = userCreated.data;
        const existingUser = await prismaClient.user.findUnique({
            where: {
                email
            }
        })
        if (existingUser) {
            return res.status(400).json({
                message: "User already exists, kindly signin"
            })
        }
        const token = jwt.sign({ type: "signup", email, username }, JWT_SECRET, {
            expiresIn: "15m"
        });
        const link = `${APP_URL}/auth/callback?token=${token}`;
        await sendMagicLink({ email, username, link, type: "signup" });
        res.status(200).json({
            message: "Magiclink send on mail"
        })

    } catch (err) {
        console.log(err);
        res.status(500).json("Error in signup/Failed to send magiclink")
    }
}

export async function signinController(req: Request, res: Response) {
    try {
        const getUser = SigninSchema.safeParse(req.body);
        if (!getUser.success) {
            return res.status(401).json({
                message: "Invalid Inputs"
            })
        }
        const { email } = getUser.data

        const existingUser = await prismaClient.user.findUnique({
            where: {
                email
            }
        });
        if (!existingUser) {
            return res.status(404).json({
                message: "User not found please signup"
            })
        }
        const token = jwt.sign({ type: "signin", email }, JWT_SECRET, {
            expiresIn: "15m"
        });

        const link = `${APP_URL}/auth/callback?token=${token}`;
        await sendMagicLink({ type: "signin", link, email });
        res.status(200).json({
            message: "Magiclink sent successfully"
        })

    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Unable to signin"
        });
    }
}

export async function callback(req: Request, res: Response) {
    const token = req.query.token;
    if (!token) {
        return res.status(400).json({
            message: "missing token"
        })
    }
    try {
        const payload = jwt.verify(token as any, JWT_SECRET);
        const { type, email, username } = payload as any;
        let userId: string;

        if (type === "signup") {
            const existingUser = await prismaClient.user.findUnique({
                where: {
                    email
                }
            })
            if (!existingUser) {
                const newUser = await prismaClient.user.create({
                    data: {
                        username,
                        email
                    }
                });
                userId = newUser.id;
                console.log("New signup", newUser)
            } else {
                userId = existingUser.id
            }
        } else if (type === "signin") {
            const existingUser = await prismaClient.user.findUnique({
                where: {
                    email
                }
            })
            if (!existingUser) {
                return res.status(404).json({
                    message: "User not found, Please signup first"
                })
            }
            userId = existingUser.id;
            console.log("Signed in", email);
        } else {
            return res.status(404).json({
                message: "Invalid token type"
            });
        }

        //creating a session token
        const sessionToken = jwt.sign({ email, userId, type: "session" }, JWT_SECRET, {
            expiresIn: "7d"
        });

        //setting http only cookie
        res.cookie('sessionToken', sessionToken, {
            httpOnly: true,
            secure: true,
            maxAge: 7 * 24 * 60 * 60 * 1000 //7days
        });

        //redirecting to dashobard or send token
        res.json({
            message: type === "signup" ? "Signed up Successfully" : "Signed in Successfully",
            token: sessionToken,
            userId: userId
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            message: "Error, Invalid/Expired token"
        });
    }
}

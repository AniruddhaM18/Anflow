import { Request, Response } from "express";
import { SigninSchema, SignupSchema } from "../types.js";
import { Resend } from "resend";
import { RESEND_KEY, JWT_SECRET, APP_URL, BACKEND_URL, } from "../config.js";
import { prismaClient } from "@repo/db";
import jwt from "jsonwebtoken";


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
            : `<p>Welcome back! ${username} <a href="${link}">Click here</a> to Sign in. Link valid for 15 minutes</p>`;
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
        const token = jwt.sign({ type: "signup", email, username }, JWT_SECRET!, {
            expiresIn: "15m"
        });
        const link = `${BACKEND_URL}/api/auth/callback?token=${token}`;
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
        const token = jwt.sign({ type: "signin", email }, JWT_SECRET!, {
            expiresIn: "15m"
        });

        const link = `${BACKEND_URL}/api/auth/callback?token=${token}`;
        await sendMagicLink({
            type: "signin", 
            link, 
            email,
            username: existingUser.username });
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
        return res.status(400).json({ message: "missing token" });
    }

    try {
        const payload = jwt.verify(token as string, JWT_SECRET!) as any;
        const { type, email, username } = payload;

        // Check user
        let user = await prismaClient.user.findUnique({ where: { email } });

        // If signup flow, auto-create user
        if (type === "signup" && !user) {
            user = await prismaClient.user.create({
                data: { username, email }
            });
        }

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // ---- Create session token ----
        const sessionToken = jwt.sign(
            { userId: user.id, email, type: "session" },
            JWT_SECRET!,
            { expiresIn: "7d" }
        );

        // ---- Set cookie ----
// ---- Set cookie ----
res.cookie("sessionToken", sessionToken, {
    httpOnly: true,
    secure: true,             
    sameSite: "none",         
    domain: ".aniruddha.xyz", 
    path: "/",
    maxAge: 7 * 24 * 60 * 60 * 1000
});


        // ---- Redirect directly to dashboard ----
        return res.redirect(`${APP_URL}/auth/success`);

    } catch (err) {
        console.log(err);
        return res.status(400).json({ message: "Invalid or expired token" });
    }
}



export async function getMe(req: Request, res: Response) {
    try {
        const token = req.cookies.sessionToken;
        if (!token) {
            return res.status(401).json({ message: "Not authenticated" });
        }

        // Correctly type the JWT payload
        const payload = jwt.verify(token, JWT_SECRET!) as jwt.JwtPayload & {
            userId: string;
            email: string;
        };

        const user = await prismaClient.user.findUnique({
            where: { id: payload.userId }, 
            select: { id: true, email: true, username: true },
        });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(user);

    } catch (err) {
        console.log(err);
        res.status(401).json({ message: "Invalid token" });
    }
}

export async function logout(req: Request, res: Response) {
    const isProd = process.env.NODE_ENV === "production";

    res.clearCookie("sessionToken", {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? "none" : "lax",
        domain: isProd ? ".aniruddha.xyz" : undefined,
        path: "/",
    });

    res.json({ message: "user logged out" });
}

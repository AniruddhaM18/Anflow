import {
    CalendarIcon,
    MailIcon,
} from "lucide-react";

import { cn } from "../lib/utils";
import { buttonVariants } from "./ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "./ui/tooltip";
import { Dock, DockIcon } from "./ui/dock";

export function DockDemo() {

    const Icons = {
        calendar: (props:any) => <CalendarIcon {...props} />,
        email: (props:any) => <MailIcon {...props} />,
        linkedin: (props:any) => (
            <svg viewBox="0 0 24 24" {...props}>
                <path
                    fill="currentColor"
                    d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 
            0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 
            1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 
            7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 
            2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 
            2.065zm1.782 13.019H3.555V9h3.564v11.452z"
                />
            </svg>
        ),
        x: (props:any) => (
            <svg viewBox="0 0 24 24" {...props}>
                <path
                    fill="currentColor"
                    d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 
            7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932Z"
                />
            </svg>
        ),
        youtube: (props:any) => (
            <svg viewBox="0 0 32 32" {...props}>
                <path d="M29.41,9.26a3.5,3.5,0,0,0-2.47-2.47C24.76,6.2,16,6.2,16,6.2s-8.76,
        0-10.94.59A3.5,3.5,0,0,0,2.59,9.26,36.13,36.13,0,0,0,2,16a36.13,36.13,
        0,0,0,.59,6.74,3.5,3.5,0,0,0,2.47,2.47C7.24,25.8,16,25.8,16,25.8s8.76,
        0,10.94-.59a3.5,3.5,0,0,0,2.47-2.47A36.13,36.13,0,0,0,30,16,36.13,
        36.13,0,0,0,29.41,9.26ZM13.2,20.2V11.8L20.47,16Z" />
            </svg>
        ),
        github: (props:any) => (
            <svg viewBox="0 0 24 24" {...props}>
                <path
                    fill="currentColor"
                    d="M12 .5A12 12 0 0 0 0 12.6c0 5.3 3.4 9.8 8.2 11.4.6.1.8-.3.8-.6v-2c-3.3.7-4-1.6-4-1.6-.5-1.3-1.2-1.7-1.2-1.7-1-.7.1-.7.1-.7 1.2.1 1.8 1.3 1.8 1.3 1 1.8 2.6 1.3 3.2 1 .1-.8.4-1.3.7-1.6-2.6-.3-5.3-1.4-5.3-6a4.6 4.6 0 0 1 1.2-3.2c-.1-.3-.5-1.5.1-3.2 0 0 1-.3 3.3 1.2a11 11 0 0 1 6 0c2.3-1.5 3.3-1.2 3.3-1.2.6 1.7.2 2.9.1 3.2a4.6 4.6 0 0 1 1.2 3.2c0 4.6-2.7 5.7-5.3 6 .4.3.8 1 .8 2v3c0 .3.2.7.8.6A12.3 12.3 0 0 0 24 12.6 12 12 0 0 0 12 .5Z"
                />
            </svg>
        )
    };

    const SOCIAL = { 
        GitHub: { name: "GitHub", url: "https://github.com/AniruddhaM18", icon: Icons.github },
        LinkedIn: { name: "LinkedIn", url: "https://www.linkedin.com/in/aniruddha-m18/", icon: Icons.linkedin },
        X: { name: "X", url: "https://x.com/Aniruddha18M", icon: Icons.x },
        Email: { name: "Email", url: "mailto:aniruddhamaradwar9@gmail.com", icon: Icons.email },
    };

    return (
        <div className="flex flex-col items-center justify-center">
            <TooltipProvider>
                <Dock direction="middle">

                    {/* Social Icons Only */}
                    {Object.entries(SOCIAL).map(([name, social]) => (
                        <DockIcon key={name}>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <a
                                        href={social.url}
                                        aria-label={social.name}
                                        className={cn(
                                            buttonVariants({ variant: "ghost", size: "icon" }),
                                            "size-12 rounded-full"
                                        )}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <social.icon className="size-4" />
                                    </a>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>{name}</p>
                                </TooltipContent>
                            </Tooltip>
                        </DockIcon>
                    ))}

                </Dock>
            </TooltipProvider>
        </div>
    );
}

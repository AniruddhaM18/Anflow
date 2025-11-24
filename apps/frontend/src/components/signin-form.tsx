import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import finalLogo from "../assets/finalLogo.png";


export function SigninForm() {
  return (
    <div className="flex flex-col gap-6">
      <form>
        <FieldGroup>

          <div className="flex flex-col items-center gap-2 text-center">
                        <a
              href=""
              className="flex flex-col items-center gap-2 font-medium">
              <div className="flex items-center justify-center">
                <img
                  src={finalLogo}
                  alt="AnFlow Logo"
                  className="w-28 h-14 object-contain"
                />
              </div>
              <span className="sr-only">AnFlow</span>
            </a>
            <h1 className="text-xl font-bold">Welcome Back</h1>
            <p className="text-sm text-neutral-400">
              Sign in to your account
            </p>
          </div>

          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input id="email" type="email" className="bg-neutral-500/40" placeholder="m@example.com" required />
          </Field>

          <Field>
            <Button type="submit" variant="outline"  className="bg-gradient-to-r from-violet-500 to-indigo-600/75 text-white hover:text-white">Sign In</Button>
          </Field>
        </FieldGroup>
      </form>
    </div>
  );
}

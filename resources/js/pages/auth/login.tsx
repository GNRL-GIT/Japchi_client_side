import { Form, Head, Link } from "@inertiajs/react";
import InputError from "@/components/input-error";
import PasswordInput from "@/components/password-input";
import TextLink from "@/components/text-link";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { Mail, Lock, ShoppingBag, CheckCircle2 } from "lucide-react";
/* @chisel-registration */
import { register } from "@/routes";
/* @end-chisel-registration */
import { store } from "@/routes/login";
import { request } from "@/routes/password";
/* @chisel-passkeys */
import PasskeyVerify from "@/components/passkey-verify";
/* @end-chisel-passkeys */

type Props = {
    status?: string;
    canResetPassword: boolean;
};

export default function Login({ status, canResetPassword }: Props) {
    return (
        <>
            <Head title="Log in - Japchi" />

            {/* @chisel-passkeys */}
            <PasskeyVerify />
            {/* @end-chisel-passkeys */}

            <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center  px-6 py-12 bg-transparent">
                <Card className="w-full max-w-md p-4">
                    <CardHeader className="px-0 py-0 text-center">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-600 mb-4">
                            <ShoppingBag className="h-6 w-6" />
                        </div>
                        <CardTitle className="text-3xl font-bold tracking-tight">
                            Welcome back
                        </CardTitle>
                        <CardDescription>
                            Sign in to your account to continue shopping.
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="px-0 py-0">
                        <Form
                            {...store.form()}
                            resetOnSuccess={["password"]}
                            className="space-y-4"
                        >
                            {({ processing, errors }) => (
                                <>
                                    {status && (
                                        <div className="flex items-center gap-2 rounded-lg bg-green-50 p-3 text-green-700 text-sm border border-green-100">
                                            <CheckCircle2 className="h-4 w-4" />
                                            {status}
                                        </div>
                                    )}

                                    <div className="grid gap-2">
                                        <Label htmlFor="email">
                                            Email address
                                        </Label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="email"
                                                type="email"
                                                name="email"
                                                required
                                                autoFocus
                                                autoComplete="email"
                                                placeholder="email@example.com"
                                                className="pl-10"
                                            />
                                        </div>
                                        <InputError message={errors.email} />
                                    </div>

                                    <div className="grid gap-2">
                                        <div className="flex items-center justify-between">
                                            <Label htmlFor="password">
                                                Password
                                            </Label>
                                            {canResetPassword && (
                                                <TextLink
                                                    href={request()}
                                                    className="text-xs text-green-600 hover:text-green-700 transition-colors"
                                                >
                                                    Forgot your password?
                                                </TextLink>
                                            )}
                                        </div>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <PasswordInput
                                                id="password"
                                                name="password"
                                                required
                                                autoComplete="current-password"
                                                placeholder="Password"
                                                className="pl-10"
                                            />
                                        </div>
                                        <InputError message={errors.password} />
                                    </div>

                                    <div className="flex items-center space-x-2">
                                        <Checkbox
                                            id="remember"
                                            name="remember"
                                        />
                                        <Label
                                            htmlFor="remember"
                                            className="text-sm text-muted-foreground"
                                        >
                                            Remember me
                                        </Label>
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full py-3 text-lg font-medium bg-green-600 text-white shadow-lg shadow-green-500/25 hover:bg-green-700 transition-colors disabled:opacity-70"
                                        disabled={processing}
                                        data-test="login-button"
                                    >
                                        {processing && (
                                            <Spinner className="mr-2 h-4 w-4" />
                                        )}
                                        Log in
                                    </Button>
                                </>
                            )}
                        </Form>
                    </CardContent>

                    <CardFooter className="px-0 py-0 border-t-0">
                        <div className="text-center text-sm text-muted-foreground mt-6">
                            Don't have an account?{" "}
                            <TextLink
                                href={register()}
                                className="font-medium text-green-600 hover:text-green-700"
                            >
                                Sign up
                            </TextLink>
                        </div>
                    </CardFooter>
                </Card>
            </div>
        </>
    );
}

Login.layout = {
    title: "Log in to your account",
    description: "Enter your email and password below to log in",
};

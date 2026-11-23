import { Form, Head, Link } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { Mail, Lock, ShoppingBag, CheckCircle2 } from 'lucide-react';
/* @chisel-registration */
import { register } from '@/routes';
/* @end-chisel-registration */
import { store } from '@/routes/login';

type Props = {
    status?: string;
};

export default function Login({ status }: Props) {
    return (
        <>
            <Head title="Log in - Japchi" />

            <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-transparent px-6 py-12">
                <Card className="w-full max-w-md p-4">
                    <CardHeader className="px-0 py-0 text-center">
                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-600">
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
                            resetOnSuccess={['password']}
                            className="space-y-4"
                        >
                            {({ processing, errors }) => (
                                <>
                                    {status && (
                                        <div className="flex items-center gap-2 rounded-lg border border-green-100 bg-green-50 p-3 text-sm text-green-700">
                                            <CheckCircle2 className="h-4 w-4" />
                                            {status}
                                        </div>
                                    )}

                                    <div className="grid gap-2">
                                        <Label htmlFor="email">
                                            Email address
                                        </Label>
                                        <div className="relative">
                                            <Mail className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
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
                                        </div>
                                        <div className="relative">
                                            <Lock className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
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
                                        className="w-full bg-green-600 py-3 text-lg font-medium text-white shadow-lg shadow-green-500/25 transition-colors hover:bg-green-700 disabled:opacity-70"
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

                    <CardFooter className="border-t-0 px-0 py-0">
                        <div className="mt-6 text-center text-sm text-muted-foreground">
                            Don't have an account?{' '}
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
    title: 'Log in to your account',
    description: 'Enter your email and password below to log in',
};

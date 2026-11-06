import { Form, Head, Link } from '@inertiajs/react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import {
    User,
    Mail,
    Lock,
    ShoppingBag,
    CheckCircle2,
} from 'lucide-react';
import { login } from '@/routes';
import { store } from '@/routes/register';

type Props = {
    passwordRules: string;
};

export default function Register({ passwordRules }: Props) {
    return (
        <>
            <Head title="Create account - FreshMart" />

            <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-muted/50 px-6 py-12  ">
                <Card className="w-full max-w-md p-4">
                    <CardHeader className="px-0 py-0 text-center">
                        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-600 mb-4">
                            <ShoppingBag className="h-6 w-6" />
                        </div>
                        <CardTitle className="text-3xl font-bold tracking-tight">Create an account</CardTitle>
                        <CardDescription>
                            Join FreshMart and start shopping for fresh produce today.
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="px-0 py-0">
                        <Form
                            {...store.form()}
                            resetOnSuccess={['password', 'password_confirmation']}
                            disableWhileProcessing
                            className="space-y-4"
                        >
                            {({ processing, errors }) => (
                                <>
                                    <div className="grid gap-2">
                                        <Label htmlFor="name">Full name</Label>
                                        <div className="relative">
                                            <User
                                                className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
                                            />
                                            <Input
                                                id="name"
                                                type="text"
                                                required
                                                autoFocus
                                                autoComplete="name"
                                                name="name"
                                                placeholder="Full name"
                                                className="pl-10"
                                            />
                                        </div>
                                        <InputError
                                            message={errors.name}
                                            className="mt-2"
                                        />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="email">Email address</Label>
                                        <div className="relative">
                                            <Mail
                                                className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
                                            />
                                            <Input
                                                id="email"
                                                type="email"
                                                required
                                                autoComplete="email"
                                                name="email"
                                                placeholder="email@example.com"
                                                className="pl-10"
                                            />
                                        </div>
                                        <InputError message={errors.email} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="password">Password</Label>
                                        <div className="relative">
                                            <Lock
                                                className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
                                            />
                                            <PasswordInput
                                                id="password"
                                                required
                                                autoComplete="new-password"
                                                name="password"
                                                placeholder="Password"
                                                passwordrules={passwordRules}
                                                className="pl-10"
                                            />
                                        </div>
                                        <InputError message={errors.password} />
                                    </div>

                                    <div className="grid gap-2">
                                        <Label htmlFor="password_confirmation">
                                            Confirm password
                                        </Label>
                                        <div className="relative">
                                            <Lock
                                                className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
                                            />
                                            <PasswordInput
                                                id="password_confirmation"
                                                required
                                                autoComplete="new-password"
                                                name="password_confirmation"
                                                placeholder="Confirm password"
                                                passwordrules={passwordRules}
                                                className="pl-10"
                                            />
                                        </div>
                                        <InputError
                                            message={errors.password_confirmation}
                                        />
                                    </div>

                                    <Button
                                        type="submit"
                                        className="w-full py-3 text-lg font-medium bg-green-600 text-white shadow-lg shadow-green-500/25 hover:bg-green-700 transition-colors disabled:opacity-70"
                                        data-test="register-user-button"
                                    >
                                        {processing && <Spinner className="mr-2 h-4 w-4" />}
                                        Create account
                                    </Button>
                                </>
                            )}
                        </Form>
                    </CardContent>

                    <CardFooter className="px-0 py-0 border-t-0">
                        <div className="text-center text-sm text-muted-foreground mt-6">
                            Already have an account?{' '}
                            <TextLink href={login()} className="font-medium text-green-600 hover:text-green-700">
                                Log in
                            </TextLink>
                        </div>
                    </CardFooter>
                </Card>
            </div>
        </>
    );
}

Register.layout = {
    title: 'Create an account',
    description: 'Enter your details below to create your account',
};

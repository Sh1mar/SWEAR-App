import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "../ui/label"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import logo1 from "@/components/images/logo-1.jpeg"
import Image from "next/image"
import { CreateNewUser } from "@/functions/auth"

type LoginFormProps = {
  changeEmail: (value : string) => void;
  changePassword: (value : string) => void;
  push : (value : string) => void;
  email : string;
  password : string;
};

export default function SignupForm({ changeEmail, changePassword, email, password, push }: LoginFormProps){
    return(
        <div className="flex justify-center">
        <Card
            className="
                border
                border-0
                w-full max-w-md
                m-2
            "
        >
            <Image 
            alt="logo-1"
            src={logo1}
            width={100}
            height={100}
            className="rounded-full border-2 border-white shadow-lg object-cover ml-4"
            >
            </Image>
            <CardHeader>
            <CardTitle className="text-white"><p className="text-3xl">Get Started Now</p></CardTitle>
            <CardDescription className="text-white">
                Enter your credentials to create your account
            </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
            <div>
                <Label htmlFor="email" className="text-white my-2">Email</Label>
                <Input onChange={(e) => changeEmail(e.target.value)} id="email" type="email" 
                className="bg-white text-black rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
            </div>
            <div>
                <Label htmlFor="password" className="text-white my-2">Password</Label>
                <Input onChange={(e) => changePassword(e.target.value)} id="email" type="password" 
                className="bg-white text-black rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
            </div>
            </CardContent>
            <CardFooter className="flex flex-col">
                <Button onClick={() => CreateNewUser(email, password).then(() => push("/auth/verify-email"))} className="w-full text-white bg-white/10">Create Account</Button>
                <a href="/auth/login" className="w-full text-sm flex flex-row gap-2 mt-2"><p>Already have an account?</p><p className="font-bold">Login</p></a>
            </CardFooter>
        </Card>
        </div>
    )
}
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

export default function LoginForm(){
    return(
        <div className="flex justify-center">
        <Card
            className="
                border
                border-0
                w-full max-w-md
                m-10
            "
        >
            <CardHeader>
            <CardTitle className="text-white">Welcome Back!</CardTitle>
            <CardDescription className="text-white">
                Enter your credentials to access your account
            </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
            <div>
                <Label htmlFor="email" className="text-white my-2">Email</Label>
                <Input id="email" type="email" 
                className="bg-white text-black rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
            </div>
            <div>
                <Label htmlFor="password" className="text-white my-2">Password</Label>
                <Input id="email" type="email" 
                className="bg-white text-black rounded-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
            </div>
            </CardContent>
            <CardFooter>
            <Button className="w-full text-white bg-white/10">Login</Button>
            </CardFooter>
        </Card>
        </div>
    )
}
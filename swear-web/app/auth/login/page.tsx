"use client"

import LoginForm from "@/components/forms/login";
import { SignInUser } from "@/functions/auth";
import { setUserEmail, setUserPassword } from "@/redux/auth/auth";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { useRouter } from "next/navigation";

export default function Page() {

  const router = useRouter();

  const dispatch = useAppDispatch();
  const userEmail = useAppSelector((state) => state.auth.userEmail);
  const userPassword = useAppSelector((state) => state.auth.userPassword);

  return (
    <LoginForm changeEmail={(e) => dispatch(setUserEmail(e))} changePassword={(e) => dispatch(setUserPassword(e))} email={userEmail} password={userPassword} push={(e) => router.push(e)}></LoginForm>
  );
}

import { Metadata } from "next"

import LoginTemplate from "@modules/account/templates/login-template"

export const metadata: Metadata = {
  title: "Giriş yap",
  description: "Modanın kalbine giriş yapın.",
}

export default function Login() {
  return <LoginTemplate />
}

"use client"

import type React from "react"

import { useState } from "react"
import { authAPI } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, User, Mail, Lock } from "lucide-react"
import Link from "next/link"

export default function AuthPage() {
  const [activeTab, setActiveTab] = useState("login")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState<"success" | "error" | "">("")

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setMessage("") // Clear previous messages
    
    const formData = new FormData(e.currentTarget)
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    if (!email || !password) {
      setMessage("Please fill in all fields")
      setMessageType("error")
      return
    }

    try {
      const response = await authAPI.login({ email, password })
      const { access_token, user } = response.data
      
      // Store token and user info
      localStorage.setItem('token', access_token)
      localStorage.setItem('currentUser', JSON.stringify(user))
      
      setMessage("Login successful! Redirecting to dashboard...")
      setMessageType("success")
      setTimeout(() => {
        window.location.href = "/dashboard"
      }, 1500)
    } catch (error: any) {
      console.error('Login error:', error)
      const errorMessage = error.response?.data?.message || "Invalid email or password"
      setMessage(errorMessage)
      setMessageType("error")
      
      // Clear error message after 5 seconds
      setTimeout(() => {
        setMessage("")
        setMessageType("")
      }, 5000)
    }
  }

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const name = formData.get("name") as string
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const confirmPassword = formData.get("confirmPassword") as string

    if (!name || !email || !password || !confirmPassword) {
      setMessage("Please fill in all fields")
      setMessageType("error")
      return
    }

    if (password !== confirmPassword) {
      setMessage("Passwords do not match")
      setMessageType("error")
      return
    }

    try {
      const response = await authAPI.register({ username: name, email, password })
      
      setMessage("Registration successful! Please login to continue...")
      setMessageType("success")
      
      // Clear form and switch to login tab after 3 seconds
      setTimeout(() => {
        setMessage("")
        setMessageType("")
        setActiveTab("login")
        ;(e.target as HTMLFormElement).reset()
      }, 3000)
    } catch (error: any) {
      setMessage(error.response?.data?.message || "Registration failed. Please try again.")
      setMessageType("error")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Authentication</h1>
          <p className="text-gray-600">Login or create a new account</p>
        </div>

        {message && (
          <Alert
            className={`mb-4 ${messageType === "success" ? "border-green-500 bg-green-50" : "border-red-500 bg-red-50"}`}
          >
            <AlertDescription className={messageType === "success" ? "text-green-700" : "text-red-700"}>
              {message}
            </AlertDescription>
          </Alert>
        )}

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="register">Register</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Login
                </CardTitle>
                <CardDescription>Enter your credentials to access your account</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email" className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email
                    </Label>
                    <Input id="login-email" name="email" type="email" placeholder="Enter your email" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password" className="flex items-center gap-2">
                      <Lock className="h-4 w-4" />
                      Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="login-password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Enter your password"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  <Button type="submit" className="w-full">
                    Login
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="register">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Register
                </CardTitle>
                <CardDescription>Create a new account to get started</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-name" className="flex items-center gap-2">
                      <User className="h-4 w-4" />
                      Full Name
                    </Label>
                    <Input id="register-name" name="name" type="text" placeholder="Enter your full name" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-email" className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      Email
                    </Label>
                    <Input id="register-email" name="email" type="email" placeholder="Enter your email" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-password" className="flex items-center gap-2">
                      <Lock className="h-4 w-4" />
                      Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="register-password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a password"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-confirm-password" className="flex items-center gap-2">
                      <Lock className="h-4 w-4" />
                      Confirm Password
                    </Label>
                    <div className="relative">
                      <Input
                        id="register-confirm-password"
                        name="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your password"
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      >
                        {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  <Button type="submit" className="w-full">
                    Register
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="text-center mt-6">
          <Link href="/" className="text-sm text-gray-600 hover:text-gray-900">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}

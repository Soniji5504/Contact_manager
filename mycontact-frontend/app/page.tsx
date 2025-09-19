"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Moon, Sun, Users, Shield, Zap, Heart } from "lucide-react"

export default function HomePage() {
  const [isDarkMode, setIsDarkMode] = useState(false)

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle("dark")
  }

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${isDarkMode ? "dark bg-gray-900" : "bg-gradient-to-br from-blue-50 to-indigo-100"}`}
    >
      {/* Header with Theme Toggle */}
      <header className="absolute top-0 right-0 p-6">
        <Button
          variant="outline"
          size="sm"
          onClick={toggleTheme}
          className="flex items-center gap-2 bg-white/80 backdrop-blur-sm dark:bg-gray-800/80"
        >
          {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          {isDarkMode ? "Light" : "Dark"}
        </Button>
      </header>

      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="max-w-4xl w-full space-y-12">
          {/* Hero Section */}
          <div className="text-center space-y-6">
            <div className="flex justify-center mb-6">
              <div className="p-4 bg-blue-600 rounded-full">
                <Users className="h-12 w-12 text-white" />
              </div>
            </div>
            <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">Contact Manager</h1>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Organize, manage, and stay connected with your contacts in one beautiful, simple platform.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="text-center hover:shadow-lg transition-shadow dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <div className="flex justify-center mb-2">
                  <Shield className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="dark:text-white">Secure & Private</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="dark:text-gray-300">
                  Your contacts are stored securely with end-to-end encryption
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <div className="flex justify-center mb-2">
                  <Zap className="h-8 w-8 text-yellow-600" />
                </div>
                <CardTitle className="dark:text-white">Lightning Fast</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="dark:text-gray-300">
                  Quick search and instant access to all your contacts
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center hover:shadow-lg transition-shadow dark:bg-gray-800 dark:border-gray-700">
              <CardHeader>
                <div className="flex justify-center mb-2">
                  <Heart className="h-8 w-8 text-red-600" />
                </div>
                <CardTitle className="dark:text-white">Easy to Use</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="dark:text-gray-300">
                  Intuitive interface designed for effortless contact management
                </CardDescription>
              </CardContent>
            </Card>
          </div>

          {/* Action Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl mx-auto">
            <Card className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 dark:bg-gray-800 dark:border-gray-700">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl dark:text-white">Get Started</CardTitle>
                <CardDescription className="dark:text-gray-300">
                  Create an account or sign in to manage your contacts
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Link href="/auth" className="block">
                  <Button className="w-full text-lg py-6 bg-blue-600 hover:bg-blue-700">Login / Register</Button>
                </Link>
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
                  Join thousands of users managing their contacts efficiently
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 dark:bg-gray-800 dark:border-gray-700">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl dark:text-white">Quick Demo</CardTitle>
                <CardDescription className="dark:text-gray-300">
                  See what you can do with Contact Manager
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm dark:text-gray-300">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    Add & organize contacts
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    Search instantly
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    Edit & update easily
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    Secure & private
                  </div>
                </div>
                <Button
                  variant="outline"
                  className="w-full dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700 bg-transparent"
                >
                  Learn More
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Footer */}
          <div className="text-center text-gray-500 dark:text-gray-400">
            <p>© 2024 Contact Manager. Built with ❤️ for better connections.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

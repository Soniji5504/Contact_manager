"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { contactsAPI, authAPI } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Plus, Edit, Trash2, User, Phone, Mail, Users, LogOut, Search, Moon, Sun } from "lucide-react"
import Link from "next/link"

interface Contact {
  _id: string
  name: string
  email: string
  phone: string
  user_id: string
}

export default function ContactManagementPage() {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [currentUser, setCurrentUser] = useState({ name: "User", email: "" })
  const [contacts, setContacts] = useState<Contact[]>([])
  const [filteredContacts, setFilteredContacts] = useState<Contact[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [editingContact, setEditingContact] = useState<Contact | null>(null)
  const [deletingContact, setDeletingContact] = useState<Contact | null>(null)
  const [message, setMessage] = useState("")
  const [messageType, setMessageType] = useState<"success" | "error" | "">("")

  // Load user data and check authentication
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      window.location.href = '/auth'
      return
    }
    
    const loadUserData = async () => {
      try {
        const response = await authAPI.getCurrentUser()
        setCurrentUser({ name: response.data.username, email: response.data.email })
      } catch (error) {
        localStorage.removeItem('token')
        localStorage.removeItem('currentUser')
        window.location.href = '/auth'
      }
    }
    
    loadUserData()
  }, [])

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode)
    document.documentElement.classList.toggle("dark")
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('currentUser')
    window.location.href = '/auth'
  }

  // Load contacts from backend
  useEffect(() => {
    const loadContacts = async () => {
      try {
        const response = await contactsAPI.getAll()
        setContacts(response.data)
        setFilteredContacts(response.data)
      } catch (error: any) {
        showMessage('Failed to load contacts', 'error')
      }
    }
    
    const token = localStorage.getItem('token')
    if (token) {
      loadContacts()
    }
  }, [])

  // Filter contacts based on search term
  useEffect(() => {
    if (searchTerm === "") {
      setFilteredContacts(contacts)
    } else {
      const filtered = contacts.filter(
        (contact) =>
          contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          contact.phone.includes(searchTerm),
      )
      setFilteredContacts(filtered)
    }
  }, [searchTerm, contacts])

  const showMessage = (msg: string, type: "success" | "error") => {
    setMessage(msg)
    setMessageType(type)
    setTimeout(() => {
      setMessage("")
      setMessageType("")
    }, 3000)
  }

  const handleCreateContact = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const firstName = formData.get("firstName") as string
    const lastName = formData.get("lastName") as string
    const contactData = {
      name: `${firstName} ${lastName}`,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
    }

    try {
      const response = await contactsAPI.create(contactData)
      setContacts([...contacts, response.data])
      setIsCreateOpen(false)
      showMessage("Contact created successfully!", "success")
      ;(e.target as HTMLFormElement).reset()
    } catch (error: any) {
      showMessage(error.response?.data?.message || 'Failed to create contact', 'error')
    }
  }

  const handleEditContact = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!editingContact) return

    const formData = new FormData(e.currentTarget)
    const firstName = formData.get("firstName") as string
    const lastName = formData.get("lastName") as string
    const contactData = {
      name: `${firstName} ${lastName}`,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
    }

    try {
      const response = await contactsAPI.update(editingContact._id, contactData)
      setContacts(contacts.map((contact) => (contact._id === editingContact._id ? response.data : contact)))
      setIsEditOpen(false)
      setEditingContact(null)
      showMessage("Contact updated successfully!", "success")
    } catch (error: any) {
      showMessage(error.response?.data?.message || 'Failed to update contact', 'error')
    }
  }

  const handleDeleteContact = async () => {
    if (!deletingContact) return
    
    try {
      await contactsAPI.delete(deletingContact._id)
      setContacts(contacts.filter((contact) => contact._id !== deletingContact._id))
      showMessage(`Contact ${deletingContact.name} deleted successfully!`, "success")
      setIsDeleteOpen(false)
      setDeletingContact(null)
    } catch (error: any) {
      showMessage(error.response?.data?.message || 'Failed to delete contact', 'error')
    }
  }

  const openDeleteDialog = (contact: Contact) => {
    setDeletingContact(contact)
    setIsDeleteOpen(true)
  }

  const openEditDialog = (contact: Contact) => {
    setEditingContact(contact)
    setIsEditOpen(true)
  }

  return (
    <div className={`min-h-screen transition-colors ${isDarkMode ? "dark bg-gray-900" : "bg-gray-50"}`}>
      {/* Header */}
      <header
        className={`shadow-sm border-b transition-colors ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white"}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className={`text-2xl font-bold ${isDarkMode ? "text-white" : "text-gray-900"}`}>Contact Manager</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="outline"
                size="sm"
                onClick={toggleTheme}
                className="flex items-center gap-2 bg-transparent"
              >
                {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                {isDarkMode ? "Light" : "Dark"}
              </Button>
              <Badge variant="outline" className="flex items-center gap-1">
                <User className="h-3 w-3" />
                {currentUser.name}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center gap-2 bg-transparent"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Alert Messages */}
        {message && (
          <Alert
            className={`mb-6 ${messageType === "success" ? "border-green-500 bg-green-50" : "border-red-500 bg-red-50"}`}
          >
            <AlertDescription className={messageType === "success" ? "text-green-700" : "text-red-700"}>
              {message}
            </AlertDescription>
          </Alert>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Contacts</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{contacts.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">With Email</CardTitle>
              <Mail className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{contacts.filter((contact) => contact.email).length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">With Phone</CardTitle>
              <Phone className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{contacts.filter((contact) => contact.phone).length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search contacts..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Create Dialog */}
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Add New Contact
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Create New Contact</DialogTitle>
                <DialogDescription>Add a new contact to your address book.</DialogDescription>
              </DialogHeader>
              <form onSubmit={handleCreateContact}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="create-firstName">First Name</Label>
                      <Input id="create-firstName" name="firstName" placeholder="John" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="create-lastName">Last Name</Label>
                      <Input id="create-lastName" name="lastName" placeholder="Doe" required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="create-email">Email</Label>
                    <Input id="create-email" name="email" type="email" placeholder="john@example.com" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="create-phone">Phone</Label>
                    <Input id="create-phone" name="phone" placeholder="+1 (555) 123-4567" required />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsCreateOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Create Contact</Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Contacts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredContacts.map((contact) => (
            <Card key={contact.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <CardTitle className="text-lg flex items-center gap-2">
                      <User className="h-5 w-5 text-blue-600" />
                      {contact.name}
                    </CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="h-4 w-4" />
                    <span className="truncate">{contact.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Phone className="h-4 w-4" />
                    <span>{contact.phone}</span>
                  </div>
                </div>
                <div className="flex gap-2 mt-4 pt-4 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditDialog(contact)}
                    className="flex items-center gap-1 flex-1"
                  >
                    <Edit className="h-3 w-3" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => openDeleteDialog(contact)}
                    className="flex items-center gap-1 flex-1"
                  >
                    <Trash2 className="h-3 w-3" />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredContacts.length === 0 && contacts.length > 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No contacts found</h3>
              <p className="text-muted-foreground mb-4">Try adjusting your search terms</p>
              <Button variant="outline" onClick={() => setSearchTerm("")}>
                Clear Search
              </Button>
            </CardContent>
          </Card>
        )}

        {contacts.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">No contacts yet</h3>
              <p className="text-muted-foreground mb-4">Get started by adding your first contact</p>
              <Button onClick={() => setIsCreateOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add New Contact
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Delete Confirmation Dialog */}
        <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Delete Contact</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete <strong>{deletingContact?.name}</strong>? This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDeleteOpen(false)}>
                Cancel
              </Button>
              <Button type="button" variant="destructive" onClick={handleDeleteContact}>
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Contact
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Dialog */}
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Edit Contact</DialogTitle>
              <DialogDescription>Update the contact information below.</DialogDescription>
            </DialogHeader>
            {editingContact && (
              <form onSubmit={handleEditContact}>
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="edit-firstName">First Name</Label>
                      <Input id="edit-firstName" name="firstName" defaultValue={editingContact.name.split(' ')[0]} required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="edit-lastName">Last Name</Label>
                      <Input id="edit-lastName" name="lastName" defaultValue={editingContact.name.split(' ').slice(1).join(' ')} required />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-email">Email</Label>
                    <Input id="edit-email" name="email" type="email" defaultValue={editingContact.email} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="edit-phone">Phone</Label>
                    <Input id="edit-phone" name="phone" defaultValue={editingContact.phone} required />
                  </div>
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit">Update Contact</Button>
                </DialogFooter>
              </form>
            )}
          </DialogContent>
        </Dialog>

        <div className="text-center mt-8">
          <Link href="/" className="text-sm text-gray-600 hover:text-gray-900">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  )
}

"use client";
import { useState,useEffect } from "react"
import axios from "axios";
import { User, Bell, LogOut, ChevronRight, Trash2, Plus, Globe, TrendingUp, CircleAlert as AlertCircle, Check, Eye, EyeOff, Settings, Shield, Copy, Clock } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@repo/ui/avatar"
import { Badge } from "@repo/ui/badge"
import { Button } from "@repo/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@repo/ui/card"
import { InputForm } from "@repo/ui/input"
import { Label } from "@repo/ui/label"
import { Separator } from "@repo/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@repo/ui/tabs"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@repo/ui/drop-down"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from "@repo/ui/alert-dialog"
import { ModeToggle } from "@repo/ui/mode-toggle"

type User = {
  name: string;
  email: string;
  avatar?: string;
};


async function getUserProfile(){
  const email = localStorage.getItem("rememberEmail");
  if(!email){
    alert("Cannot get user details ! please signin");
    location.href="/home";
    return null;
  }
  try{
    const res = await axios.get("/api/user-profile",{
      params: {email}
    });

    return res?.data;
  }catch (err: any) {
      console.error(err);
      alert("Failed to get user profile !");
      localStorage.removeItem("rememberEmail");
      location.href="/home";
      return null;
    }
}

const MOCK_MONITORED_SITES = [
  {
    id: "1",
    name: "api.example.com",
    status: "up",
    latency: "142ms",
    uptime: "99.98%",
    checks: 12450,
    added: "2024-01-20",
  },
  {
    id: "2",
    name: "app.mybrand.io",
    status: "up",
    latency: "88ms",
    uptime: "100%",
    checks: 18920,
    added: "2024-02-03",
  },
  {
    id: "3",
    name: "checkout.store.dev",
    status: "down",
    latency: "—",
    uptime: "98.41%",
    checks: 11320,
    added: "2024-01-30",
  },
]

const MOCK_NOTIFICATIONS = [
  {
    id: "1",
    type: "alert" as const,
    site: "checkout.store.dev",
    message: "Site went down",
    time: "2 hours ago",
    read: false,
  },
  {
    id: "2",
    type: "recovery" as const,
    site: "api.example.com",
    message: "Service recovered",
    time: "5 hours ago",
    read: false,
  },
  {
    id: "3",
    type: "info" as const,
    site: "app.mybrand.io",
    message: "Response time degradation detected",
    time: "1 day ago",
    read: true,
  },
]

const MOCK_ACTIVITY = [
  { id: "1", action: "Added monitoring", site: "docs.myproject.co", time: "3 days ago" },
  { id: "2", action: "Updated alert settings", site: "api.example.com", time: "1 week ago" },
  { id: "3", action: "Upgraded to Pro", site: "—", time: "2 weeks ago" },
]

function StatusDot({ status }: Readonly<{ status: "up" | "down" }>) {
  return (
    <span
      className={`inline-flex size-2 rounded-full ${
        status === "up" ? "bg-emerald-500" : "bg-destructive"
      }`}
    />
  )
}

function NotificationIcon({ type }: Readonly<{ type: "alert" | "recovery" | "info" }>) {
  switch (type) {
    case "alert":
      return <AlertCircle className="size-4 text-destructive" />
    case "recovery":
      return <Check className="size-4 text-emerald-500" />
    case "info":
      return <Bell className="size-4 text-blue-500" />
  }
}

export default function DashboardPage() {
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [userDetails,setUserDetails] = useState<User>();

  useEffect(() => {
    getUserProfile().then(setUserDetails);
  },[])

  if (!userDetails) {
    return <div>Loading...</div>;
  }
  return (
    
    <div className="min-h-svh bg-background text-foreground">
      {/* Header */}
      <header className="border-b border-border bg-card sticky top-0 z-40">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary">
              <Globe className="size-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold tracking-tight">Better Uptime</span>
          </div>
          <div className="flex items-center gap-3">
            <ModeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar size="sm">
                    <AvatarImage src={userDetails.avatar} alt={userDetails.name} />
                    <AvatarFallback>{userDetails.name}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="px-2 py-1.5">
                  <p className="text-sm font-semibold">{userDetails.name}</p>
                  <p className="text-xs text-muted-foreground">{userDetails.email}</p>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <User className="size-4 mr-2" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Settings className="size-4 mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-destructive" onClick={() => {
                  localStorage.removeItem("rememberEmail");
                  location.href = "/home";
                }}>
                  <LogOut className="size-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="scroll-m-20 text-3xl font-extrabold tracking-tight">
            Welcome back, {userDetails.name.split(" ")[0]}
          </h1>
          <p className="mt-2 text-muted-foreground">
            Manage your account, monitored sites, and notifications all in one place.
          </p>
        </div>

        {/* Quick Stats */}
        <div className="mb-8 grid gap-4 sm:grid-cols-4">
          {[
            { icon: Globe, label: "Active Monitors", value: "3" },
            { icon: Clock, label: "Avg Response", value: "138ms" },
            { icon: TrendingUp, label: "Uptime", value: "99.46%" },
            { icon: Bell, label: "Unread Alerts", value: "2" },
          ].map(({ icon: Icon, label, value }) => (
            <Card key={label}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-xs text-muted-foreground">{label}</p>
                    <p className="mt-1 text-2xl font-bold">{value}</p>
                  </div>
                  <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                    <Icon className="size-5 text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Tabs Section */}
        <Tabs defaultValue="sites" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="sites">Sites</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="notifications">Notifications</TabsTrigger>
            <TabsTrigger value="activity">Activity</TabsTrigger>
          </TabsList>

          {/* Sites Tab */}
          <TabsContent value="sites" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                  Monitored Sites
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Manage the websites you&apos;re monitoring
                </p>
              </div>
              <Button>
                <Plus className="size-4"/>
                Add Site
              </Button>
            </div>

            <div className="space-y-3">
              {MOCK_MONITORED_SITES.map((site) => (
                <Card key={site.id} className="overflow-hidden">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between gap-4 sm:items-center">
                      <div className="flex items-start gap-3 flex-1 sm:items-center">
                        <StatusDot status={site.status as "up" | "down"} />
                        <div className="flex-1 min-w-0">
                          <p className="font-semibold truncate">{site.name}</p>
                          <div className="mt-1 flex flex-col gap-1 text-xs text-muted-foreground sm:flex-row sm:gap-3">
                            <span>Added {site.added}</span>
                            <span className="hidden sm:inline">•</span>
                            <span>{site.checks.toLocaleString()} checks</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 sm:gap-4">
                        <div className="hidden text-right sm:block">
                          <p className="text-xs text-muted-foreground">Latency</p>
                          <p className="font-mono text-sm font-medium">{site.latency}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">Uptime</p>
                          <p className="font-mono text-sm font-medium">{site.uptime}</p>
                        </div>
                        <Badge
                          variant={site.status === "up" ? "outline" : "destructive"}
                          className={
                            site.status === "up"
                              ? "border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                              : ""
                          }
                        >
                          {site.status === "up" ? "Up" : "Down"}
                        </Badge>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="size-8">
                              <ChevronRight className="size-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Edit Settings</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => setDeleteConfirm(site.id)}
                            >
                              <Trash2 className="size-4 mr-2" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Plan Info */}
            <Card className="bg-muted/30">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between sm:items-center">
                  <div>
                    <p className="font-semibold">You&apos;re on the <b>pro</b> plan</p>
                    <p className="mt-1 text-sm text-muted-foreground">
                      50 monitored URLs • 1-minute checks • 30-day history
                    </p>
                  </div>
                  <Button variant="outline">Upgrade</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Account Tab */}
          <TabsContent value="account" className="space-y-6">
            <div>
              <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                Account Settings
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Manage your account information and preferences
              </p>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              {/* Profile Card */}
              <Card className="lg:col-span-1">
                <CardHeader>
                  <CardTitle className="text-base">Profile</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Avatar size="lg">
                      <AvatarImage src={userDetails.avatar} alt={userDetails.name} />
                      <AvatarFallback>{userDetails.name}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{userDetails.name}</p>
                      <p className="text-sm text-muted-foreground">Joined 16-09-2004</p>
                    </div>
                  </div>
                  <Button variant="outline" className="w-full">
                    Change Avatar
                  </Button>
                </CardContent>
              </Card>

              {/* Account Info Card */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="text-base">Account Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Full Name</Label>
                    <InputForm defaultValue={userDetails.name} />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-xs text-muted-foreground">Email Address</Label>
                    <InputForm type="email" defaultValue={userDetails.email} />
                  </div>
                  <Button>Save Changes</Button>
                </CardContent>
              </Card>
            </div>

            {/* Danger Zone */}
            <Card className="border-destructive/50">
              <CardHeader>
                <CardTitle className="text-base text-destructive">Danger Zone</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  Permanently delete your account and all associated data.
                </p>
                <Button variant="destructive">Delete Account</Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notifications Tab */}
          <TabsContent value="notifications" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                  Notifications
                </h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  Recent alerts and updates
                </p>
              </div>
              <Button variant="outline" size="sm">
                Mark all as read
              </Button>
            </div>

            <div className="space-y-3">
              {MOCK_NOTIFICATIONS.map((notif) => (
                <Card
                  key={notif.id}
                  className={notif.read ? "opacity-60" : "border-primary/50 bg-primary/5"}
                >
                  <CardContent className="pt-6">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded border bg-background">
                        <NotificationIcon type={notif.type} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="font-semibold text-sm">
                              <span className="text-muted-foreground">
                                {notif.site}
                              </span>{" "}
                              {notif.message}
                            </p>
                            <p className="mt-1 text-xs text-muted-foreground">{notif.time}</p>
                          </div>
                          {!notif.read && (
                            <Badge className="mt-1 h-fit">{notif.read ? "" : "New"}</Badge>
                          )}
                        </div>
                      </div>
                      <Button variant="ghost" size="icon" className="size-8 shrink-0">
                        <ChevronRight className="size-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Activity Tab */}
          <TabsContent value="activity" className="space-y-6">
            <div>
              <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                Account Activity
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Recent changes and events
              </p>
            </div>

            <div className="space-y-0 border rounded-lg overflow-hidden">
              {MOCK_ACTIVITY.map((item, i) => (
                <div key={item.id}>
                  <div className="flex items-center justify-between px-4 py-3 sm:px-6">
                    <div>
                      <p className="font-semibold text-sm">{item.action}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {item.site !== "—" ? `Site: ${item.site}` : "Account-wide"}
                      </p>
                    </div>
                    <p className="text-sm text-muted-foreground">{item.time}</p>
                  </div>
                  {i < MOCK_ACTIVITY.length - 1 && <Separator />}
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteConfirm} onOpenChange={() => setDeleteConfirm(null)}>
        <AlertDialogContent>
          <AlertDialogTitle>Remove Site</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to remove this site from monitoring? This action cannot be undone.
          </AlertDialogDescription>
          <div className="flex justify-end gap-3">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction className="bg-destructive hover:bg-destructive/90">
              Remove
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

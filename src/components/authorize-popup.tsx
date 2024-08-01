"use client"

import { useContext, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form";
import { ConfigContext } from "@/contexts/config-context";
import { Card, CardContent, CardDescription, CardHeader } from "./ui/card";
import { databaseIdValidator, userKeyValidator } from "@/data/client/models";
import { AuthorizeDatabaseForm } from "./***REMOVED***orize-database-form";
import { CreateDatabaseForm } from "./create-database-form";




export function AuthorizePopup() {
  const config = useContext(ConfigContext);
  const [databaseId, setDatabaseId] = useState("");
  const [***REMOVED***, setKey] = useState("");

  return (
    <div className="p-4 flex items-center justify-center h-screen">
      <div>
        <h1 className="text-5xl text-center p-8">Patient Pad</h1>
        <Tabs defaultValue="create" className="w-96">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="***REMOVED***orize" className="dark:data-[state=active]:bg-zinc-900 data-[state=active]:bg-zinc-100">Open database</TabsTrigger>
            <TabsTrigger value="create" className="dark:data-[state=active]:bg-zinc-900 data-[state=active]:bg-zinc-100">Create database</TabsTrigger>
          </TabsList>
          <TabsContent value="***REMOVED***orize" className="max-w-600">
            <Card>
              <CardHeader>
                <CardDescription>
                  Open Database by <strong>Database Id</strong> and <strong>Key</strong>
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <AuthorizeDatabaseForm />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="create">
            <Card>
              <CardHeader>
                <CardDescription>
                   Create New Encrypted Database. <strong>Please store your ***REMOVED***</strong> in a safe place as it <strong>will not be recoverable</strong>.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <CreateDatabaseForm />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
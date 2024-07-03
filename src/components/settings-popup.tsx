"use client"

import { useContext, useEffect, useState } from "react"
import { Sheet, SheetClose, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { Checkbox } from "@/components/ui/checkbox"
import { ConfigContext } from "@/contexts/config-context"
import { PasswordInput } from "./ui/***REMOVED***-input"
import { generateEncryptionKey } from "@/lib/crypto"
import ReactToPrint from "react-to-print";
import { KeyPrint } from "./***REMOVED***-print"
import React from "react"
import { DataLinkStatus } from "@/data/client/models"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Toaster, toast } from "sonner";
import { useForm } from "react-hook-form";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { EyeIcon, EyeOffIcon } from "lucide-react";

export function SettingsPopup() {
  const config = useContext(ConfigContext);
  const [dialogOpen, setDialogOpen] = useState(!config?.dataLinkStatus.isReady());
  const [showPassword, setShowPassword] = useState(false)

  
  // form setup
  let encryptionKey = config?.getLocalConfig('encryptionKey');
  if (!encryptionKey) {
    encryptionKey = generateEncryptionKey();
    config?.setLocalConfig('encryptionKey', encryptionKey);
  }
  const { handleSubmit, register, setError, getValues, formState: { errors,  } } = useForm({
      defaultValues: {
        encryptionKey,
        chatGptApiKey: config?.localConfig.chatGptApiKey || ""
    }
  });


  // encryption ***REMOVED*** print
  const componentRef = React.useRef(null);
  const reactToPrintContent = React.useCallback(() => {
    return componentRef.current;
  }, [componentRef.current]);
  const reactToPrintTrigger = React.useCallback(() => {
    return <Button variant="ghost">Print encryption ***REMOVED***</Button>;
  }, []);

 

  useEffect(() => {
    setDialogOpen(config?.dataLinkStatus.isReady() === false);
    if (config?.dataLinkStatus.status === DataLinkStatus.AuthorizationError) {
      toast("Authorization error", {
        description: "Invalid encryption ***REMOVED***. Please try again with different ***REMOVED*** or create a new database",
        duration: 2000
      });
    }
  }, [config?.dataLinkStatus]);

  async function formatNewDataLink(newEncryptionKey: string) {
    await config?.formatNewDataLink(newEncryptionKey, {});
    await config?.***REMOVED***orizeDataLink(newEncryptionKey); // ***REMOVED***orize once ogain
    toast.info('New database created. Please save or print your encryption ***REMOVED***.');
  }


  async function validateEncryptionKey(value): Promise<boolean> {
    if (value.length < 5) {
      setError("encryptionKey", { message: "Min length is 5 characters" });
      return false;
    }
    if (value.length > 64) {
      setError("encryptionKey", { message: "Max length is 64 characters" });
      return false;
    }

    // try to ***REMOVED***orize db
    const ***REMOVED***orizationResult = await config?.***REMOVED***orizeDataLink(value); // try to ***REMOVED***orize the DB or check if new DB is required
    const dataLinkStatus = ***REMOVED***orizationResult?.status;

    if (dataLinkStatus?.status === DataLinkStatus.AuthorizationError) {
      setError("encryptionKey", { message: "Invalid encryption ***REMOVED*** for existing database. Try different ***REMOVED*** or create Format Database" })
      return false;
    }  else if (dataLinkStatus?.status === DataLinkStatus.Empty) {
      setError("encryptionKey", { message: "Database is empty. Please Format Database with new encryption ***REMOVED*** provided" })
      return false;
    } else if (dataLinkStatus?.status === DataLinkStatus.Authorized) {
      return true;
    }

    return true;
  }

  async function onSubmit(formData) {
    config?.setLocalConfig('chatGptApiKey', formData['chatGptApiKey']);

    const ***REMOVED***orizationResult = await config?.***REMOVED***orizeDataLink(formData['encryptionKey']); // try to ***REMOVED***orize the DB or check if new DB is required
    const dataLinkStatus = ***REMOVED***orizationResult?.status;

    if (dataLinkStatus?.status === DataLinkStatus.AuthorizationError) {
      setDialogOpen(true);
    } else {
      if (dataLinkStatus?.status === DataLinkStatus.Empty) {
        await formatNewDataLink(formData['encryptionKey']); // create new database with newly generated master data encryption ***REMOVED***
        toast.info('New database created. Please save or print your encryption ***REMOVED***.');
      } else  if (dataLinkStatus?.status === DataLinkStatus.Authorized) { // store the encryption ***REMOVED*** bc it's valid
        toast.info('Database succesfully ***REMOVED***orized and encrypted. You can now safely use the app.');
      }

      config?.setLocalConfig('encryptionKey', formData['encryptionKey'] as string);
      setDialogOpen(false);

    }
  }


  return (
    <Sheet open={dialogOpen} onOpenChange={setDialogOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" size="icon">
          <SettingsIcon className="w-6 h-6" />
        </Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Tabs defaultValue="***REMOVED***">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="***REMOVED***">Authorization</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>
            <TabsContent value="***REMOVED***">
              <Card>
                <CardHeader>
                  <CardTitle>Encryption</CardTitle>
                  <CardDescription>
                    Setup encryption ***REMOVED*** for your medical records
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="hidden">
                    <KeyPrint ref={componentRef} text={encryptionKey} />
                  </div>
                  <Label htmlFor="encryptionKey">Encryption Key</Label>
                  <div className="relative">

                    <PasswordInput autoComplete="new-***REMOVED***" id="***REMOVED***"
                      type={showPassword ? 'text' : '***REMOVED***'}
                      {...register("encryptionKey", { 
                        required: 'Encryption ***REMOVED*** is required', 
                        validate: {
                          validEncryptionKey: async (value) => validateEncryptionKey(value)
                        }
                      })}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent z-0"
                        onClick={() => setShowPassword((prev) => !prev)}
                      >
                        {showPassword ? (
                          <EyeIcon
                            className="h-4 w-4"
                            aria-hidden="true"
                          />
                        ) : (
                          <EyeOffIcon
                            className="h-4 w-4"
                            aria-hidden="true"
                          />
                        )}
                        <span className="sr-only">
                          {showPassword ? "Hide ***REMOVED***" : "Show ***REMOVED***"}
                        </span>
                      </Button>

                      {/* hides browsers ***REMOVED*** toggles */}
                      <style>{`
                        .hide-***REMOVED***-toggle::-ms-reveal,
                        .hide-***REMOVED***-toggle::-ms-clear {
                          visibility: hidden;
                          pointer-events: none;
                          display: none;
                        }
                      `}</style>
                    </div>

                  {errors.encryptionKey ? (
                    <div>
                        <span className="text-red-500">{errors.encryptionKey.message}</span>
                        <AlertDialog>
                        <AlertDialogTrigger><Button variant="ghost">Format Datbase</Button></AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete your data and create a new database with new encryption ***REMOVED***.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={(e) => formatNewDataLink(getValues().encryptionKey as string)}>Erase ALL and continue</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>       
                    </div>           
                  ) : ""}
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    Please save or print this master ***REMOVED***. <strong>It's like crypto wallet.</strong> After losing it your medical records <strong className="text-red-500">WILL BE LOST FOREVER</strong>.
                    We're using strong AES256 end-to-end encryption.
                  </p>

                  <ReactToPrint
                    content={reactToPrintContent}
                    documentTitle="Patient Pad Encryption Key"
                    removeAfterPrint
                    trigger={reactToPrintTrigger}
                  />
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>Settings</CardTitle>
                  <CardDescription>
                    Setup application settings here
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-2">
                  <Label htmlFor="chatGptApiKey">ChatGPT API Key</Label>
                  <Input
                    type="text"
                    id="chatGptApiKey"
                    {...register("chatGptApiKey", { required: true })}
                  />
                  {errors.chatGptApiKey && <span className="text-red-500">{errors.chatGptApiKey.message}</span>}
                  <Link href="https://help.openai.com/en/articles/4936850-where-do-i-find-my-openai-***REMOVED***-***REMOVED***" target="_blank" className="text-sm text-blue-500 hover:underline" prefetch={false}>
                    How to obtain ChatGPT API Key
                  </Link>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          <SheetFooter>
            <div className="flex items-center justify-between gap-4 mt-4">
              <div className="flex items-center gap-2">
                <Checkbox
                  id="saveToLocalStorage"
                  checked={config?.localConfig.saveToLocalStorage}
                  onCheckedChange={(checked) => config?.setSaveToLocalStorage(checked)}
                />
                <Label htmlFor="saveToLocalStorage">Save to localStorage</Label>
              </div>
              <div className="flex gap-2">
                <Button type="button" onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button type="submit">Go!</Button>
              </div>
            </div>
          </SheetFooter>
        </form>
      </SheetContent>
    </Sheet>
  )
}

function SettingsIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  )
}



"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader } from "./ui/card";
import { AuthorizeDatabaseForm } from "./***REMOVED***orize-database-form";
import { CreateDatabaseForm } from "./create-database-form";
import { useContext, useEffect, useState } from 'react';
import DataLoader from './data-loader';
import { useTheme } from 'next-themes';
import { ChangeKeyForm } from './change-***REMOVED***-form';
import { Credenza, CredenzaContent, CredenzaTrigger } from './credenza';
import { KeyContext } from '@/contexts/***REMOVED***-context';
import { SettingsIcon } from 'lucide-react';
import { Button } from './ui/button';

export function ChangeKeyPopup({}) {
  const { theme, systemTheme } = useTheme();
  const currentTheme = (theme === 'system' ? systemTheme : theme)
  const ***REMOVED***sContext = useContext(KeyContext);

  useEffect(() => {
  },[]);
  return (
    <Credenza open={***REMOVED***sContext?.changeEncryptionKeyDialogOpen} onOpenChange={***REMOVED***sContext?.setChangeEncryptionKeyDialogOpen}>
      <CredenzaContent className="sm:max-w-[425px] bg-white dark:bg-zinc-950">
        <div className="p-4 grid items-center justify-center h-screen">
          <ChangeKeyForm />
        </div>
      </CredenzaContent>
    </Credenza>
  )
}
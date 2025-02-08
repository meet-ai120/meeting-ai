import * as React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function SettingsPage() {
  return (
    <div className="container max-w-2xl py-10">
      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
          <CardDescription>
            Application settings and preferences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex min-h-[200px] items-center justify-center text-muted-foreground">
            Settings page coming soon...
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

'use client';

import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  CardFooter,
  Card,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { AvatarImage, AvatarFallback, Avatar } from '@/components/ui/avatar';
import {
  DialogTrigger,
  DialogTitle,
  DialogDescription,
  DialogHeader,
  DialogFooter,
  DialogContent,
  Dialog,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

export const OnboardingDialog: React.FC = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-100 dark:bg-gray-900">
      <Card className="mx-auto w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center">
            Welcome to our platform!
          </CardTitle>
          <CardDescription className="text-center">
            Let's get started by setting up your profile and organization.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="first-name">First name</Label>
            <Input id="first-name" placeholder="John" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="last-name">Last name</Label>
            <Input id="last-name" placeholder="Doe" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="org-name">Organization Name</Label>
            <Input id="org-name" placeholder="Acme Inc." required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="org-slug">Organization Slug</Label>
            <Input id="org-slug" placeholder="acme-inc" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="org-avatar">Organization Avatar</Label>
            <div className="flex items-center gap-3">
              <Avatar className="h-9 w-9">
                <AvatarImage
                  alt="Organization Avatar"
                  src="/placeholder.svg?height=36&width=36"
                />
                <AvatarFallback>AI</AvatarFallback>
              </Avatar>
              <Button variant="outline">
                <Dialog>
                  <DialogTrigger asChild>Upload Avatar</DialogTrigger>
                  <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                      <DialogTitle>Upload Avatar</DialogTitle>
                      <DialogDescription>
                        Select an image file for your organization's avatar.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="grid gap-4 py-4">
                      <div className="grid grid-cols-4 items-center gap-4">
                        <Label className="text-right" htmlFor="avatar">
                          Avatar
                        </Label>
                        <Input className="col-span-3" id="avatar" type="file" />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button type="submit">Upload</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full">Continue</Button>
        </CardFooter>
      </Card>
    </div>
  );
};

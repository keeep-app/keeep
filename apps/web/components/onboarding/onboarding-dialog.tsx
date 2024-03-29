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
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
} from '../ui/form';
import { useTranslations } from 'next-intl';
import { useEffect, useState } from 'react';
import { useSupabase } from '@/lib/provider/supabase';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import Spinner from '../spinner';
import { useToast } from '../ui/use-toast';
import slugify from 'slugify';

const MAX_FILE_SIZE = 1024 * 1024 * 1;
const ACCEPTED_IMAGE_MIME_TYPES = [
  'image/jpeg',
  'image/jpg',
  'image/png',
  'image/webp',
  'image/svg+xml',
];

export const OnboardingDialog: React.FC = () => {
  const t = useTranslations('OnboardingDialog');

  const formTranslations = useTranslations('OnboardingDialog.form');

  const formSchema = z.object({
    firstName: z.string(),
    lastName: z.string(),
    orgName: z.string(),
    orgSlug: z.string(),
    orgAvatar: z
      .custom<FileList>()
      .refine(
        fileList => fileList.length === 1,
        t('form.error.fileNotSelected')
      )
      //.transform(file => file[0] as File)
      .refine(file => {
        return file[0] && file[0].size <= MAX_FILE_SIZE;
      }, t('form.error.fileTooLarge'))
      .refine(
        file => file[0] && ACCEPTED_IMAGE_MIME_TYPES.includes(file[0].type),
        t('form.error.fileTypeNotSupported')
      )
      .optional(),
  });

  type FormValues = z.infer<typeof formSchema>;

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    shouldFocusError: true,
    mode: 'onBlur',
    reValidateMode: 'onChange',
  });

  const {
    formState: { errors },
    handleSubmit,
    trigger,
    getValues,
    watch,
    setValue,
    resetField,
    control,
  } = form;

  const [avatarPath, setAvatarPath] = useState<string | null>(null);
  const [avatarPublicUrl, setAvatarPublicUrl] = useState<string | null>(null);
  const [avatarDialogOpen, setAvatarDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const { toast } = useToast();

  const router = useRouter();

  const { supabase, user } = useSupabase();

  const onFileUpload = async () => {
    const avatarFile = getValues('orgAvatar')?.[0];
    const avatarFileExtension = avatarFile?.name?.split('.').pop();

    if (!avatarFile || !supabase || !user || !avatarFileExtension) return;

    const { data, error } = await supabase.storage
      .from('org-avatars')
      .upload(`/${user.id}/org-avatar.${avatarFileExtension}`, avatarFile, {
        cacheControl: '3600',
        upsert: true,
      });

    if (error || !data.path) {
      console.log(error);
      return;
    }
    const {
      data: { publicUrl },
    } = supabase.storage
      .from('org-avatars')
      .getPublicUrl(`/${user.id}/org-avatar.${avatarFileExtension}`);

    setAvatarPath(data.path);
    setAvatarPublicUrl(publicUrl);
    setAvatarDialogOpen(false);
  };

  const onSubmit = async (values: FormValues) => {
    setLoading(true);
    const findOrgRes = await fetch(
      '/api/organization/find?org=' + values.orgSlug
    );
    if (findOrgRes.status === 200) {
      form.setError('orgSlug', {
        type: 'manual',
        message: t('form.error.organizationSlug'),
      });
      setLoading(false);
      return;
    }

    const createOrgRes = await fetch('/api/organization/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: values.orgName,
        slug: values.orgSlug,
        avatar: avatarPath,
      }),
    });

    if (createOrgRes.status !== 201) {
      toast({
        title: t('form.error.createOrganization.title'),
        description: t('form.error.createOrganization.description'),
      });
      setLoading(false);
      return;
    }

    const updateProfileRes = await fetch('/api/profile/update', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        firstName: values.firstName,
        lastName: values.lastName,
      }),
    });

    if (updateProfileRes.status !== 200) {
      toast({
        title: t('form.error.updateProfile.title'),
        description: t('form.error.updateProfile.description'),
      });
      setLoading(false);
      return;
    }

    toast({
      title: t('form.success.title'),
      description: t('form.success.description'),
    });

    setLoading(false);
    return router.push(`/dashboard/${values.orgSlug}`);
  };

  const orgName = watch('orgName');

  useEffect(() => {
    if (!orgName) {
      resetField('orgSlug');
      return;
    }
    setValue(
      'orgSlug',
      slugify(orgName, {
        lower: true,
        strict: true,
      })
    );
  }, [orgName]);

  return (
    <div className="flex min-h-full flex-col items-center justify-center bg-white sm:bg-gray-100">
      <Card className="mx-auto w-full border-none shadow-none sm:max-w-md sm:border sm:shadow-sm">
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <CardHeader>
              <CardTitle className="text-center">{t('title')}</CardTitle>
              <CardDescription className="text-center">
                {t('description')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <FormField
                  control={control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {formTranslations('firstName.label')}
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder={formTranslations(
                            'firstName.placeholder'
                          )}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {formTranslations('lastName.label')}
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder={formTranslations('lastName.placeholder')}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="orgName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {formTranslations('organization.label')}
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder={formTranslations(
                            'organization.placeholder'
                          )}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="orgSlug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {formTranslations('organizationSlug.label')}
                      </FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          onChange={e => {
                            const value = e.target.value;
                            field.onChange(value.toLowerCase());
                          }}
                          placeholder={formTranslations(
                            'organizationSlug.placeholder'
                          )}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={control}
                  name="orgAvatar"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        {formTranslations('organizationAvatar.label')}
                      </FormLabel>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9">
                          <AvatarImage
                            alt="Organization Avatar"
                            src={
                              avatarPublicUrl ||
                              `https://avatar.vercel.sh/${getValues(
                                'orgSlug'
                              )}.svg`
                            }
                          />
                          <AvatarFallback>MK</AvatarFallback>
                        </Avatar>
                        <Dialog
                          open={avatarDialogOpen}
                          onOpenChange={setAvatarDialogOpen}
                        >
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              onClick={() => setAvatarDialogOpen(true)}
                            >
                              {formTranslations('organizationAvatar.upload')}
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                              <DialogTitle>
                                {formTranslations(
                                  'organizationAvatar.dialog.title'
                                )}
                              </DialogTitle>
                              <DialogDescription>
                                {formTranslations(
                                  'organizationAvatar.dialog.description'
                                )}
                              </DialogDescription>
                            </DialogHeader>
                            <div className="mt-4 flex flex-col gap-4">
                              <div className="flex flex-col gap-2">
                                <Label htmlFor="orgAvatar">Avatar</Label>
                                <FormControl>
                                  <Input
                                    accept={ACCEPTED_IMAGE_MIME_TYPES.join(
                                      ', '
                                    )}
                                    ref={field.ref}
                                    onChange={e => {
                                      field.onChange(e.target.files);
                                      trigger('orgAvatar');
                                    }}
                                    id="orgAvatar"
                                    type="file"
                                  />
                                </FormControl>
                              </div>
                              <FormMessage />
                              <p className="text-sm">
                                {formTranslations(
                                  'organizationAvatar.dialog.hint'
                                )}
                              </p>
                            </div>
                            <DialogFooter>
                              <Button
                                type="button"
                                disabled={
                                  !!errors.orgAvatar || !getValues('orgAvatar')
                                }
                                onClick={onFileUpload}
                              >
                                {formTranslations(
                                  'organizationAvatar.dialog.submit'
                                )}
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button disabled={loading} className="relative w-full">
                <span
                  className={cn({
                    'opacity-0': loading,
                    'opacity-100': !loading,
                  })}
                >
                  {t('continue')}
                </span>
                {loading && <Spinner className="absolute inset-0" />}
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>
    </div>
  );
};

'use client';

import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ExclamationTriangleIcon } from '@radix-ui/react-icons';
import { PlusIcon } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import Papa, { ParseResult } from 'papaparse';
import { LinkedInImportContact } from '@/lib/types/import-contacts';
import { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import Link from 'next/link';
import { importContacts } from '@/app/actions';
import * as Sentry from '@sentry/nextjs';

interface ImportContactsModalProps {
  organization: string;
  list: string;
}

export const ImportContactsModal = ({
  organization,
  list,
}: ImportContactsModalProps) => {
  const [importedContacts, setImportedContacts] = useState<
    LinkedInImportContact[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const { toast } = useToast();

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'text/csv': [],
    },
    onDropAccepted: acceptedFiles => {
      const file = acceptedFiles[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onabort = () => {
        Sentry.captureMessage(
          'file reading was aborted when importing contacts'
        );
        toast({
          title: 'File reading aborted',
        });
      };
      reader.onerror = () => {
        Sentry.captureMessage(
          'file reading has failed when importing contacts'
        );
        toast({
          title: 'File reading failed',
          description:
            'Please try again. If the issue persists, please contact the support.',
        });
      };
      reader.onload = () => {
        try {
          // Get the binary string
          const binaryStr = reader.result;
          // Convert to text
          const parsedText = new TextDecoder().decode(binaryStr as ArrayBuffer);
          // Parse the CSV
          Papa.parse(parsedText, {
            header: true,
            skipEmptyLines: true,
            complete: function (results: ParseResult<LinkedInImportContact>) {
              setImportedContacts(results.data);
            },
          });
        } catch (error) {
          Sentry.captureException(error);
          toast({
            title: 'Could not parse the file',
            description:
              'An error occurred while parsing the file. Make sure the format is correct and try again.',
          });
        }
      };
      reader.readAsArrayBuffer(file);
    },
    onDropRejected: () => {
      toast({
        title: 'Invalid file type',
        description: 'Please upload a .csv file',
      });
    },
    maxFiles: 1,
  });

  const importUploadedContacts = async () => {
    try {
      setLoading(true);
      const { error } = await importContacts(
        importedContacts,
        organization,
        list
      );
      if (error) {
        throw new Error(error.message);
      }
      setImportedContacts([]);
      setLoading(false);
      setModalOpen(false);
      toast({
        title: 'Contacts imported',
        description: 'The contacts were successfully imported',
      });
    } catch (error) {
      console.error(error);
      setLoading(false);
      toast({
        title: 'Could not import contacts',
        description: 'An error occurred while importing the contacts',
      });
    }
  };

  return (
    <Dialog open={modalOpen} onOpenChange={open => setModalOpen(open)}>
      <DialogTrigger asChild>
        <Button size="xs" variant="outline" className="text-sm">
          <PlusIcon className="mr-2 h-4 w-4" />
          Import Contacts
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upload Contacts</DialogTitle>
          <DialogDescription>
            Import your existing contacts by providing your LinkedIn CSV Export.
            <br />
            <strong>Hint:</strong> You can export your LinkedIn contacts{' '}
            <Link
              className="underline underline-offset-2"
              href="https://www.linkedin.com/mypreferences/d/download-my-data"
              target="_blank"
              rel="noopener noreferrer"
            >
              here
            </Link>
          </DialogDescription>
        </DialogHeader>
        {importedContacts.length > 0 && (
          <>
            <h2 className="font-bold">Found Contacts:</h2>
            <div className="max-h-48 !overflow-y-auto truncate rounded-lg bg-gray-50 p-2.5">
              <ul className="flex flex-col gap-1">
                {importedContacts.map((contact, index) => (
                  <li key={index}>
                    {contact['First Name']} {contact['Last Name']}
                  </li>
                ))}
              </ul>
            </div>
          </>
        )}
        {!importedContacts.length && (
          <>
            <div
              {...getRootProps()}
              className="flex h-48 w-full flex-col items-center justify-center rounded-md border-2 border-dashed border-gray-300 p-6 text-center"
            >
              <input {...getInputProps()} />
              {isDragActive ? (
                <p>Drop the files here ...</p>
              ) : (
                <p>Drag 'n' drop a .csv file here, or click to select files</p>
              )}
            </div>
            <Alert variant="warning">
              <ExclamationTriangleIcon className="h-4 w-4" />
              <AlertTitle>Heads up!</AlertTitle>
              <AlertDescription>
                Before you import your contacts CSV file, make sure to clean it
                up and remove the two note rows at the top of the file.
                Otherwise, the import will fail.
              </AlertDescription>
            </Alert>
          </>
        )}
        <DialogFooter>
          {importedContacts.length > 0 && (
            <Button
              variant="outline"
              onClick={() => setImportedContacts([])}
              disabled={loading}
            >
              Clear
            </Button>
          )}
          <Button
            type="submit"
            disabled={!importedContacts.length || loading}
            onClick={importUploadedContacts}
          >
            Import
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

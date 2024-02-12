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

export const ImportContactsModal = () => {
  const [importedContacts, setImportedContacts] = useState<
    LinkedInImportContact[]
  >([]);
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'text/csv': [],
    },
    onDropAccepted: acceptedFiles => {
      const file = acceptedFiles[0];
      if (!file) return;
      console.log(acceptedFiles);
      const reader = new FileReader();
      reader.onabort = () => console.log('file reading was aborted');
      reader.onerror = () => console.log('file reading has failed');
      reader.onload = () => {
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
      };
      reader.readAsArrayBuffer(file);
    },
    maxFiles: 1,
  });
  return (
    <Dialog>
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
          </DialogDescription>
        </DialogHeader>
        {importedContacts.length > 0 && (
          <div className="max-h-48 !overflow-y-auto truncate">
            <h2>Imported Contacts</h2>
            <ul>
              {importedContacts.map((contact, index) => (
                <li key={index}>
                  {contact['First Name']} {contact['Last Name']}
                </li>
              ))}
            </ul>
          </div>
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

            <Alert>
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
            <Button variant="outline" onClick={() => setImportedContacts([])}>
              Clear
            </Button>
          )}
          <Button type="submit" disabled={!importedContacts.length}>
            Import
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

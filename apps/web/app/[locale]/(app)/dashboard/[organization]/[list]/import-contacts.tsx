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
import { PlusIcon } from 'lucide-react';
import { useDropzone } from 'react-dropzone';

export const ImportContactsModal = () => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'text/csv': [],
    },
    onDropAccepted: acceptedFiles => {
      console.log(acceptedFiles);
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
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

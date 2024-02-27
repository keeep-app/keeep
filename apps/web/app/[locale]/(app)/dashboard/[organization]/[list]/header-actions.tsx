import { ImportContactsModal } from './import-contacts';

interface HeaderActionsProps {
  organization: string;
  list: string;
}

export const HeaderActions = ({ organization, list }: HeaderActionsProps) => {
  return (
    <div className="flex flex-row items-center gap-4">
      <ImportContactsModal organization={organization} list={list} />
    </div>
  );
};

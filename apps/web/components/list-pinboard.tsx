import { prisma } from '@/lib/server/prisma';
import { Button } from './ui/button';
import { Count } from './ui/count';

export async function ListPinboard({ orgId }: { orgId: number }) {
  const result = await prisma.organization.findUnique({
    where: { id: orgId },
    include: { lists: true, _count: { select: { contacts: true } } },
  });

  return (
    <div className="pb-12">
      <div className="space-y-4 py-4">
        <div>
          <h2 className="font-accent mb-4 flex items-center justify-between text-lg font-semibold">
            People
            <Count count={result?._count.contacts} />
          </h2>
          {result?.lists.map(list => {
            return (
              <div className="space-y-1">
                <Button variant="ghost" className="w-full justify-start">
                  {list.icon}
                  {list.name}
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

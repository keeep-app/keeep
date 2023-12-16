import { ListPinboard } from '@/components/list-pinboard';
import OrganizationSwitcher from '@/components/organization-switcher';
import { prisma } from '@/lib/server/prisma';
import { getSupabaseServerComponentClient } from '@/lib/server/supabase';
import { redirect } from 'next/navigation';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = await getSupabaseServerComponentClient();
  if (!user) return redirect('/login');

  const profile = await prisma.profile.findFirst({
    where: { supabaseId: user.id },
    include: { organizations: true },
  });

  const selectedOrg = profile?.organizations[0];

  // TODO - handle case where user has no profiles
  if (!profile || !selectedOrg) return null;

  return (
    <div>
      <div>
        {/* <MobileSidebarPane open={sidebarOpen} setOpen={setSidebarOpen} /> */}
        <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-72 lg:flex-col">
          <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r border-gray-100 bg-white pb-4">
            <div className="flex h-16 shrink-0 items-center">
              <OrganizationSwitcher
                orgs={profile.organizations}
                selectedOrg={selectedOrg.id}
              />
            </div>
            <nav className="flex flex-1 flex-col px-6">
              <ListPinboard orgId={selectedOrg.id} />
            </nav>
          </div>
        </div>
      </div>
      <div className="lg:pl-72">
        <SidebarHeader closeSidebar={() => false} />
        <main className="py-10">
          <div className="px-4 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>
    </div>
  );
}

// function MobileSidebarPane({
//   open,
//   setOpen,
// }: {
//   open: boolean;
//   setOpen: (value: boolean) => void;
// }) {
//   return (
//     <Transition.Root show={open} as={Fragment}>
//       <Dialog as="div" className="relative z-50 lg:hidden" onClose={setOpen}>
//         <Transition.Child
//           as={Fragment}
//           enter="transition-opacity ease-linear duration-300"
//           enterFrom="opacity-0"
//           enterTo="opacity-100"
//           leave="transition-opacity ease-linear duration-300"
//           leaveFrom="opacity-100"
//           leaveTo="opacity-0"
//         >
//           <div className="fixed inset-0 bg-gray-900/80" />
//         </Transition.Child>

//         <div className="fixed inset-0 flex">
//           <Transition.Child
//             as={Fragment}
//             enter="transition ease-in-out duration-300 transform"
//             enterFrom="-translate-x-full"
//             enterTo="translate-x-0"
//             leave="transition ease-in-out duration-300 transform"
//             leaveFrom="translate-x-0"
//             leaveTo="-translate-x-full"
//           >
//             <Dialog.Panel className="relative mr-16 flex w-full max-w-xs flex-1">
//               <Transition.Child
//                 as={Fragment}
//                 enter="ease-in-out duration-300"
//                 enterFrom="opacity-0"
//                 enterTo="opacity-100"
//                 leave="ease-in-out duration-300"
//                 leaveFrom="opacity-100"
//                 leaveTo="opacity-0"
//               >
//                 <div className="absolute left-full top-0 flex w-16 justify-center pt-5">
//                   <button
//                     type="button"
//                     className="-m-2.5 p-2.5"
//                     onClick={() => setOpen(false)}
//                   >
//                     <span className="sr-only">Close sidebar</span>
//                     <XIcon className="h-6 w-6 text-white" aria-hidden="true" />
//                   </button>
//                 </div>
//               </Transition.Child>
//               <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white px-6 pb-4">
//                 <div className="flex w-full shrink-0 items-center">
//                   <OrganizationSwitcher />
//                 </div>
//                 <nav className="flex flex-1 flex-col"></nav>
//               </div>
//             </Dialog.Panel>
//           </Transition.Child>
//         </div>
//       </Dialog>
//     </Transition.Root>
//   );
// }

function SidebarHeader({ closeSidebar }: { closeSidebar: () => void }) {
  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-100 bg-white px-4 sm:gap-x-6 sm:px-6 lg:px-8">
      {/* <button
        type="button"
        className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
        onClick={closeSidebar}
      >
        <span className="sr-only">Open sidebar</span>
        <ChevronLeft className="h-6 w-6" aria-hidden="true" />
      </button> */}

      <div className="h-6 w-px bg-gray-100 lg:hidden" aria-hidden="true" />

      <div className="flex flex-1 gap-x-4 self-stretch lg:gap-x-6">
        <div className="flex items-center gap-x-4 lg:gap-x-6"></div>
      </div>
    </header>
  );
}

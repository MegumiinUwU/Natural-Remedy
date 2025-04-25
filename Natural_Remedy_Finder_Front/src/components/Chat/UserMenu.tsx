import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { LogOut, User, ChevronDown } from 'lucide-react';

const UserMenu: React.FC = () => {
  return (
    <Menu as="div" className="relative inline-block text-left z-50 ">
      <Menu.Button className="flex items-center gap-2 p-2 rounded-full hover:bg-green-50 transition-colors">
        <div className="h-8 w-8 rounded-full bg-green-700 flex items-center justify-center text-white">
          <User size={20} />
        </div>
        <ChevronDown size={16} className="text-green-700" />
      </Menu.Button>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 mt-2 w-48 origin-top-right divide-y divide-green-100 rounded-lg bg-white shadow-lg  ring-opacity-5 focus:outline-none">
          <div className="px-1 py-1">
            <Menu.Item>
              {({ active }) => (
                <button
                  className={`${
                    active ? 'bg-green-50 text-green-900' : 'text-green-700'
                  } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                >
                  <User className="mr-2 h-5 w-5" aria-hidden="true" />
                  Profile
                </button>
              )}
            </Menu.Item>
          </div>
          <div className="px-1 py-1">
            <Menu.Item>
              {({ active }) => (
                <button
                  className={`${
                    active ? 'bg-red-50 text-red-700' : 'text-red-600'
                  } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                >
                  <LogOut className="mr-2 h-5 w-5" aria-hidden="true" />
                  Logout
                </button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default UserMenu
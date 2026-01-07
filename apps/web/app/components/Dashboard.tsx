import {
  LayoutDashboard,
  Folder,
  Users,
  Settings,
  CheckSquare,
  ChevronRight,
  Search,
  Moon,
  Plus,
  Bell
} from "lucide-react";

export default function Dashboard() {
  return (
    <div className="flex min-h-screen bg-gray-50 font-sans text-gray-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col fixed h-full">
        {/* User/Org Info */}
        <div className="p-6 flex items-center gap-3 border-b border-gray-100">
          <div className="w-10 h-10 bg-gray-200 rounded-md overflow-hidden">
            {/* Placeholder for User Avatar */}
            <div className="w-full h-full bg-gray-300"></div>
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-sm leading-tight text-gray-900">测试组织1</h3>
            <p className="text-xs text-gray-500">1 workspace</p>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400 rotate-90" />
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          <NavItem icon={<LayoutDashboard size={20} />} label="Dashboard" active />
          <NavItem icon={<Folder size={20} />} label="Projects" />
          <NavItem icon={<Users size={20} />} label="Team" />
          <NavItem icon={<Settings size={20} />} label="Settings" />

          <div className="pt-8">
            <NavItem icon={<CheckSquare size={20} />} label="My Tasks" badge="0" hasSubmenu />
          </div>

          <div className="pt-4">
            <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">PROJECTS</div>
            <div className="px-3 py-2 text-sm text-gray-500 flex items-center justify-between cursor-pointer hover:bg-gray-50 rounded-md">
              <span className="opacity-0">Placeholder</span>
              <ChevronRight className="w-4 h-4" />
            </div>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-8">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search projects, tasks..."
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white"
            />
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg">
              <Moon className="w-5 h-5" />
            </button>
            <div className="w-8 h-8 rounded-full bg-gray-400"></div>
          </div>
        </header>

        {/* Content Body */}
        <div className="space-y-8">
          {/* Welcome Section */}
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Welcome back, Ji Li</h1>
              <p className="text-gray-500 mt-1">Here's what's happening with your projects today</p>
            </div>
            <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 font-medium transition-colors">
              <Plus className="w-4 h-4" />
              New Project
            </button>
          </div>

          {/* Content Placeholders */}
          <div className="grid grid-cols-4 gap-6">
            <StatCard
              label="Total Projects"
              value="0"
              subtext="projects in 测试组织1"
              iconColor="bg-blue-50 text-blue-600"
              icon={<Folder className="w-5 h-5" />}
            />
            <StatCard
              label="Completed Projects"
              value="0"
              subtext="of 0 total"
              iconColor="bg-emerald-50 text-emerald-600"
              icon={<CheckSquare className="w-5 h-5" />}
            />
            <StatCard
              label="My Tasks"
              value="0"
              subtext="assigned to me"
              iconColor="bg-purple-50 text-purple-600"
              icon={<Users className="w-5 h-5" />}
            />
            <StatCard
              label="Overdue"
              value="0"
              subtext="need attention"
              iconColor="bg-orange-50 text-orange-600"
              icon={<Bell className="w-5 h-5" />}
            />
          </div>

          <div className="grid grid-cols-3 gap-8">
            {/* Project Overview */}
            <div className="col-span-2 bg-white rounded-xl border border-gray-200 p-6 h-[400px]">
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-semibold text-lg">Project Overview</h2>
                <button className="text-sm text-gray-500 flex items-center gap-1 hover:text-gray-700">
                  View all <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              <div className="h-full flex flex-col items-center justify-center text-center pb-10">
                <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                  <Folder className="w-8 h-8 text-gray-300" />
                </div>
                <h3 className="text-gray-900 font-medium mb-1">No projects yet</h3>
                <button className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700">
                  Create your First Project
                </button>
              </div>
            </div>

            {/* Right Column Tasks */}
            <div className="space-y-6">
              <TaskGroup
                title="My Tasks"
                count={0}
                emptyText="No my tasks"
                icon={<Users className="w-4 h-4 text-gray-600" />}
              />
              <TaskGroup
                title="Overdue"
                count={0}
                emptyText="No overdue"
                isWarning
                icon={<Bell className="w-4 h-4 text-orange-600" />}
              />
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

function NavItem({ icon, label, active = false, badge, hasSubmenu }: { icon: React.ReactNode, label: string, active?: boolean, badge?: string, hasSubmenu?: boolean }) {
  return (
    <div className={`
      flex items-center justify-between px-3 py-2 rounded-lg cursor-pointer transition-colors group
      ${active ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
    `}>
      <div className="flex items-center gap-3">
        {icon}
        <span className="font-medium text-sm">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        {badge && <span className="bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded-full font-medium">{badge}</span>}
        {hasSubmenu && <ChevronRight className="w-4 h-4 text-gray-400" />}
      </div>
    </div>
  )
}

function StatCard({ label, value, subtext, iconColor, icon }: { label: string, value: string, subtext: string, iconColor: string, icon: React.ReactNode }) {
  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div className="text-sm text-gray-500 font-medium">{label}</div>
        <div className={`w-10 h-10 rounded-lg ${iconColor} flex items-center justify-center`}>
          {icon}
        </div>
      </div>
      <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>
      <div className="text-xs text-gray-400">{subtext}</div>
    </div>
  )
}

function TaskGroup({ title, count, emptyText, isWarning = false, icon }: { title: string, count: number, emptyText: string, isWarning?: boolean, icon: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 h-[240px] flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-lg ${isWarning ? 'bg-orange-50' : 'bg-gray-50'}`}>
            {icon}
          </div>
          <span className="font-semibold text-gray-900">{title}</span>
        </div>
        <span className={`px-2 py-0.5 rounded text-xs font-medium ${isWarning ? 'bg-red-50 text-red-600' : 'bg-green-50 text-green-600'}`}>
          {count}
        </span>
      </div>
      <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
        {emptyText}
      </div>
    </div>
  )
}

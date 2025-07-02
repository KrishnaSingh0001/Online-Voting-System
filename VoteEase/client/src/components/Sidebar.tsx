import { NavLink, useLocation } from "react-router-dom"
import { Home, Vote, BarChart3, Settings, Users } from "lucide-react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/contexts/AuthContext"

const navigation = [
  { name: 'Dashboard', href: '/', icon: Home },
  { name: 'Vote', href: '/vote', icon: Vote },
  { name: 'Results', href: '/results', icon: BarChart3 },
]

const adminNavigation = [
  { name: 'Admin Panel', href: '/admin', icon: Settings },
]

export function Sidebar() {
  const location = useLocation()
  const { user } = useAuth()

  console.log('Sidebar: Current user role:', user?.role)

  // Check if user has admin role, default to false if user is undefined
  const isAdmin = user?.role === 'admin'

  return (
    <div className="fixed left-0 top-16 h-[calc(100vh-4rem)] w-64 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-r border-gray-200/50 dark:border-gray-700/50">
      <nav className="flex flex-col h-full p-4">
        <div className="space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.href

            return (
              <NavLink
                key={item.name}
                to={item.href}
                className={cn(
                  "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 hover:scale-105",
                  isActive
                    ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                )}
              >
                <Icon className="mr-3 h-5 w-5" />
                {item.name}
              </NavLink>
            )
          })}
        </div>

        {isAdmin && (
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
            <div className="space-y-2">
              {adminNavigation.map((item) => {
                const Icon = item.icon
                const isActive = location.pathname === item.href

                return (
                  <NavLink
                    key={item.name}
                    to={item.href}
                    className={cn(
                      "flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 hover:scale-105",
                      isActive
                        ? "bg-gradient-to-r from-red-500 to-pink-600 text-white shadow-lg"
                        : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    )}
                  >
                    <Icon className="mr-3 h-5 w-5" />
                    {item.name}
                  </NavLink>
                )
              })}
            </div>
          </div>
        )}
      </nav>
    </div>
  )
}
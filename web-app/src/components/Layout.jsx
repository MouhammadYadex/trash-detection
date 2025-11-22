import { Link, useLocation } from 'react-router-dom'
import { Home, Upload, Video, History, BarChart3, Info, Trash2 } from 'lucide-react'

const Layout = ({ children }) => {
  const location = useLocation()
  
  const navItems = [
    { path: '/', icon: Home, label: 'Accueil' },
    { path: '/upload', icon: Upload, label: 'Images' },
    { path: '/video', icon: Video, label: 'Vidéos' },
    { path: '/history', icon: History, label: 'Historique' },
    { path: '/stats', icon: BarChart3, label: 'Statistiques' },
    { path: '/about', icon: Info, label: 'À propos' },
  ]
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-3 hover:opacity-80 transition-opacity">
              <div className="bg-gradient-to-br from-primary-500 to-primary-700 p-2 rounded-xl">
                <Trash2 className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
                  Trash Detection AI
                </h1>
                <p className="text-xs text-gray-500">Smart Waste Management</p>
              </div>
            </Link>
            
            <nav className="hidden md:flex space-x-1">
              {navItems.map(({ path, icon: Icon, label }) => (
                <Link
                  key={path}
                  to={path}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    location.pathname === path
                      ? 'bg-primary-100 text-primary-700 font-semibold'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span>{label}</span>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
      
      {/* Mobile Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg">
        <div className="flex justify-around items-center py-2">
          {navItems.map(({ path, icon: Icon, label }) => (
            <Link
              key={path}
              to={path}
              className={`flex flex-col items-center px-3 py-2 rounded-lg transition-all ${
                location.pathname === path
                  ? 'text-primary-600'
                  : 'text-gray-400'
              }`}
            >
              <Icon className="w-6 h-6" />
              <span className="text-xs mt-1">{label}</span>
            </Link>
          ))}
        </div>
      </nav>
      
      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16 pb-20 md:pb-0">
        <div className="container mx-auto px-4 py-6 text-center text-gray-600 text-sm">
          <p>© 2025 Trash Detection AI - Powered by YOLOv8 | Master 2 SI/IA</p>
          <p className="mt-1 text-xs">Détection intelligente pour une gestion optimale des déchets</p>
        </div>
      </footer>
    </div>
  )
}

export default Layout

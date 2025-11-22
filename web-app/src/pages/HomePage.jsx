import { Link } from 'react-router-dom'
import { Upload, TrendingUp, Clock, CheckCircle, ArrowRight, Video, Image } from 'lucide-react'
import { motion } from 'framer-motion'

const HomePage = () => {
  const features = [
    {
      icon: Image,
      title: 'Détection sur Images',
      description: 'Uploadez une image et obtenez une analyse en temps réel',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: Video,
      title: 'Traitement Vidéo',
      description: 'Analysez des vidéos frame par frame avec annotations',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: TrendingUp,
      title: 'Précision 67.1%',
      description: 'Modèle YOLOv8n entraîné sur 395 images',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: Clock,
      title: 'Rapide (65ms)',
      description: 'Inférence ultra-rapide pour un traitement efficace',
      color: 'from-orange-500 to-orange-600'
    }
  ]
  
  const stats = [
    { label: 'Détections', value: '1,247', change: '+12%' },
    { label: 'Poubelles Pleines', value: '423', change: '+8%' },
    { label: 'Précision Moyenne', value: '89.3%', change: '+2%' },
    { label: 'Temps Moyen', value: '68ms', change: '-5%' }
  ]
  
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center space-y-6"
      >
        <h1 className="text-5xl md:text-6xl font-bold">
          <span className="bg-gradient-to-r from-primary-600 via-primary-500 to-green-600 bg-clip-text text-transparent">
            Détection Intelligente
          </span>
          <br />
          <span className="text-gray-700">de Poubelles</span>
        </h1>
        
        <p className="text-xl text-gray-600 max-w-2xl mx-auto">
          Optimisez la gestion des déchets avec l'intelligence artificielle. 
          Notre système détecte automatiquement l'état de remplissage des poubelles.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Link to="/upload" className="btn-primary flex items-center space-x-2">
            <Image className="w-5 h-5" />
            <span>Détecter une Image</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
          <Link to="/video" className="bg-gradient-to-r from-purple-600 to-purple-700 text-white px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 flex items-center space-x-2">
            <Video className="w-5 h-5" />
            <span>Analyser une Vidéo</span>
          </Link>
          <Link to="/about" className="btn-secondary">
            En savoir plus
          </Link>
        </div>
      </motion.div>
      
      {/* Stats */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4"
      >
        {stats.map((stat, index) => (
          <div key={index} className="card text-center">
            <p className="text-3xl font-bold text-primary-600">{stat.value}</p>
            <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
            <p className="text-xs text-green-600 mt-1 font-semibold">{stat.change}</p>
          </div>
        ))}
      </motion.div>
      
      {/* Features */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.6 }}
        className="grid md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {features.map((feature, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.05 }}
            className="card group cursor-pointer"
          >
            <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform`}>
              <feature.icon className="w-8 h-8 text-white" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">{feature.title}</h3>
            <p className="text-gray-600 text-sm">{feature.description}</p>
          </motion.div>
        ))}
      </motion.div>
      
      {/* Demo Section */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.7, duration: 0.6 }}
        className="card bg-gradient-to-br from-primary-50 to-green-50"
      >
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-gray-800">
              Comment ça fonctionne ?
            </h2>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold flex-shrink-0">1</div>
                <div>
                  <h3 className="font-semibold text-gray-800">Uploadez une image ou vidéo</h3>
                  <p className="text-sm text-gray-600">Prenez une photo ou uploadez une vidéo de poubelle</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold flex-shrink-0">2</div>
                <div>
                  <h3 className="font-semibold text-gray-800">Analyse IA en temps réel</h3>
                  <p className="text-sm text-gray-600">Notre modèle YOLOv8 traite les images (65ms) ou vidéos frame par frame</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold flex-shrink-0">3</div>
                <div>
                  <h3 className="font-semibold text-gray-800">Résultats détaillés</h3>
                  <p className="text-sm text-gray-600">Obtenez le statut, niveau de confiance et téléchargez les annotations</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="relative">
            <div className="aspect-video bg-gradient-to-br from-gray-200 to-gray-300 rounded-xl flex items-center justify-center">
              <div className="text-center text-gray-500">
                <Upload className="w-16 h-16 mx-auto mb-2 opacity-50" />
                <p>Aperçu de détection</p>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default HomePage

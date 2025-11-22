import { Code, Cpu, Database, Zap, Github, BookOpen, Video, Image as ImageIcon } from 'lucide-react'

const AboutPage = () => {
  const technologies = [
    { name: 'YOLOv8n', description: 'Modèle de détection d\'objets', icon: Zap },
    { name: 'PyTorch', description: 'Framework deep learning', icon: Cpu },
    { name: 'FastAPI', description: 'Backend API REST', icon: Code },
    { name: 'React', description: 'Frontend moderne', icon: Code },
    { name: 'OpenCV', description: 'Traitement vidéo', icon: Video },
    { name: 'Roboflow', description: 'Gestion dataset', icon: Database },
  ]
  
  const metrics = [
    { label: 'mAP50', value: '67.1%', description: 'Précision moyenne IoU 0.5' },
    { label: 'mAP50-95', value: '41.1%', description: 'Précision multi-IoU' },
    { label: 'Précision', value: '65.2%', description: 'Taux vrais positifs' },
    { label: 'Rappel', value: '74.8%', description: 'Taux de détection' },
  ]
  
  return (
    <div className="max-w-6xl mx-auto space-y-12">
      {/* Hero */}
      <div className="text-center space-y-4">
        <h1 className="text-5xl font-bold bg-gradient-to-r from-primary-600 to-green-600 bg-clip-text text-transparent">
          Trash Detection AI
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Système intelligent de détection du niveau de remplissage des poubelles 
          basé sur l'intelligence artificielle et le deep learning
        </p>
      </div>
      
      {/* Projet */}
      <div className="card">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Le Projet</h2>
        <div className="space-y-4 text-gray-600">
          <p>
            <strong className="text-gray-800">Trash Detection AI</strong> est un projet académique 
            développé dans le cadre d'un Master 2 en Systèmes Intelligents et Intelligence Artificielle.
          </p>
          <p>
            L'objectif est d'optimiser la gestion des déchets urbains en détectant automatiquement 
            l'état de remplissage des poubelles (pleine/vide) à partir d'images et de vidéos.
          </p>
          <p>
            Le système utilise <strong className="text-gray-800">YOLOv8n</strong>, un modèle de 
            détection d'objets state-of-the-art, entraîné sur un dataset de 395 images annotées.
            Il supporte l'analyse en temps réel d'images individuelles et le traitement frame par frame de vidéos.
          </p>
        </div>
      </div>
      
      {/* Technologies */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-800">Technologies Utilisées</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {technologies.map((tech, index) => (
            <div key={index} className="card group hover:shadow-xl transition-all">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <tech.icon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">{tech.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{tech.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      {/* Performances */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-gray-800">Performances du Modèle</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((metric, index) => (
            <div key={index} className="card text-center">
              <p className="text-4xl font-bold text-primary-600">{metric.value}</p>
              <p className="font-semibold text-gray-800 mt-2">{metric.label}</p>
              <p className="text-xs text-gray-500 mt-1">{metric.description}</p>
            </div>
          ))}
        </div>
      </div>
      
      {/* Architecture */}
      <div className="card bg-gradient-to-br from-gray-50 to-gray-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Architecture du Système</h2>
        <div className="space-y-4">
          <div className="flex items-start space-x-4">
            <div className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold flex-shrink-0">
              1
            </div>
            <div>
              <h3 className="font-bold text-gray-800">Frontend React</h3>
              <p className="text-sm text-gray-600 mt-1">
                Interface utilisateur moderne avec React, Tailwind CSS et Framer Motion
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-4">
            <div className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold flex-shrink-0">
              2
            </div>
            <div>
              <h3 className="font-bold text-gray-800">API FastAPI</h3>
              <p className="text-sm text-gray-600 mt-1">
                Backend performant avec endpoints pour images et vidéos
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-4">
            <div className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold flex-shrink-0">
              3
            </div>
            <div>
              <h3 className="font-bold text-gray-800">Modèle YOLOv8n + OpenCV</h3>
              <p className="text-sm text-gray-600 mt-1">
                Détection temps réel sur images (65ms) et traitement vidéo frame par frame
              </p>
            </div>
          </div>
          
          <div className="flex items-start space-x-4">
            <div className="w-8 h-8 rounded-full bg-primary-600 text-white flex items-center justify-center font-bold flex-shrink-0">
              4
            </div>
            <div>
              <h3 className="font-bold text-gray-800">Export ONNX</h3>
              <p className="text-sm text-gray-600 mt-1">
                Format multiplateforme pour déploiement flexible (mobile, edge, cloud)
              </p>
            </div>
          </div>
        </div>
      </div>
      
      {/* Applications */}
      <div className="card bg-gradient-to-br from-primary-50 to-green-50">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Applications Pratiques</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">🚛 Optimisation des Tournées</h3>
            <p className="text-sm text-gray-600">
              Collecte ciblée des poubelles pleines, réduction de 20-30% des trajets
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">📹 Surveillance Vidéo</h3>
            <p className="text-sm text-gray-600">
              Analyse vidéo en temps réel pour monitoring automatique des zones de collecte
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">🏙️ Smart Cities</h3>
            <p className="text-sm text-gray-600">
              Intégration dans systèmes IoT urbains avec caméras de surveillance
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">💰 Réduction des Coûts</h3>
            <p className="text-sm text-gray-600">
              Moins de passages inutiles, économies de carburant et maintenance
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">🌍 Impact Environnemental</h3>
            <p className="text-sm text-gray-600">
              Réduction de l'empreinte carbone, villes plus propres et durables
            </p>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 mb-2">🎥 Archives Vidéo</h3>
            <p className="text-sm text-gray-600">
              Analyse de vidéos enregistrées pour études de patterns et statistiques
            </p>
          </div>
        </div>
      </div>
      
      {/* Liens */}
      <div className="card">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Ressources</h2>
        <div className="space-y-3">
          <a
            href="https://docs.ultralytics.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-3 text-primary-600 hover:text-primary-700 transition-colors"
          >
            <BookOpen className="w-5 h-5" />
            <span>Documentation Ultralytics YOLO</span>
          </a>
          <a
            href="https://github.com"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-3 text-primary-600 hover:text-primary-700 transition-colors"
          >
            <Github className="w-5 h-5" />
            <span>Code Source (GitHub)</span>
          </a>
          <a
            href="https://roboflow.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center space-x-3 text-primary-600 hover:text-primary-700 transition-colors"
          >
            <Database className="w-5 h-5" />
            <span>Dataset Roboflow</span>
          </a>
        </div>
      </div>
      
      {/* Crédits */}
      <div className="card bg-gray-50 text-center">
        <p className="text-gray-600">
          <strong className="text-gray-800">Projet Académique</strong> - Master 2 SI/IA
        </p>
        <p className="text-sm text-gray-500 mt-2">
          Janvier 2025 | Powered by YOLOv8, FastAPI & React
        </p>
      </div>
    </div>
  )
}

export default AboutPage

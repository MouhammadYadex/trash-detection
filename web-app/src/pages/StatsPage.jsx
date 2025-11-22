import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { TrendingUp, Target, Clock, CheckCircle } from 'lucide-react'

const StatsPage = () => {
  // Données de démonstration
  const performanceData = [
    { name: 'Lun', detections: 45, pleines: 18, vides: 27 },
    { name: 'Mar', detections: 52, pleines: 23, vides: 29 },
    { name: 'Mer', detections: 48, pleines: 19, vides: 29 },
    { name: 'Jeu', detections: 61, pleines: 28, vides: 33 },
    { name: 'Ven', detections: 55, pleines: 22, vides: 33 },
    { name: 'Sam', detections: 38, pleines: 15, vides: 23 },
    { name: 'Dim', detections: 42, pleines: 17, vides: 25 },
  ]
  
  const distributionData = [
    { name: 'Poubelles Pleines', value: 423, color: '#ef4444' },
    { name: 'Poubelles Vides', value: 824, color: '#22c55e' },
  ]
  
  const accuracyData = [
    { threshold: '0.5', accuracy: 85 },
    { threshold: '0.6', accuracy: 88 },
    { threshold: '0.7', accuracy: 91 },
    { threshold: '0.8', accuracy: 89 },
    { threshold: '0.9', accuracy: 87 },
  ]
  
  const metrics = [
    {
      icon: Target,
      label: 'Précision Globale',
      value: '67.1%',
      change: '+2.3%',
      color: 'primary'
    },
    {
      icon: CheckCircle,
      label: 'Rappel',
      value: '74.8%',
      change: '+1.8%',
      color: 'green'
    },
    {
      icon: Clock,
      label: 'Temps Moyen',
      value: '68ms',
      change: '-5ms',
      color: 'blue'
    },
    {
      icon: TrendingUp,
      label: 'Total Détections',
      value: '1,247',
      change: '+124',
      color: 'purple'
    }
  ]
  
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-4xl font-bold text-gray-800">Statistiques</h1>
        <p className="text-gray-600 mt-2">Analyse des performances du modèle</p>
      </div>
      
      {/* Métriques principales */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {metrics.map((metric, index) => (
          <div key={index} className="card">
            <div className={`w-12 h-12 rounded-xl bg-${metric.color}-100 flex items-center justify-center mb-3`}>
              <metric.icon className={`w-6 h-6 text-${metric.color}-600`} />
            </div>
            <p className="text-2xl font-bold text-gray-800">{metric.value}</p>
            <p className="text-sm text-gray-600 mt-1">{metric.label}</p>
            <p className="text-xs text-green-600 font-semibold mt-1">{metric.change}</p>
          </div>
        ))}
      </div>
      
      {/* Graphiques */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Détections par jour */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Détections Hebdomadaires</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="detections" stroke="#8b5cf6" strokeWidth={2} name="Total" />
              <Line type="monotone" dataKey="pleines" stroke="#ef4444" strokeWidth={2} name="Pleines" />
              <Line type="monotone" dataKey="vides" stroke="#22c55e" strokeWidth={2} name="Vides" />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
        {/* Distribution */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Distribution des États</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={distributionData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {distributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
        
        {/* Précision par seuil */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Précision par Seuil de Confiance</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={accuracyData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="threshold" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="accuracy" fill="#22c55e" name="Précision (%)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        {/* Comparaison Pleine/Vide */}
        <div className="card">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Comparaison Détections</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="pleines" fill="#ef4444" name="Pleines" />
              <Bar dataKey="vides" fill="#22c55e" name="Vides" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
      
      {/* Informations du modèle */}
      <div className="card bg-gradient-to-br from-primary-50 to-green-50">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Informations du Modèle</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <div>
            <p className="text-sm text-gray-600 mb-1">Architecture</p>
            <p className="font-semibold text-gray-800">YOLOv8n</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Paramètres</p>
            <p className="font-semibold text-gray-800">3,011,238</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Dataset</p>
            <p className="font-semibold text-gray-800">395 images</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">mAP50</p>
            <p className="font-semibold text-gray-800">67.1%</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">mAP50-95</p>
            <p className="font-semibold text-gray-800">41.1%</p>
          </div>
          <div>
            <p className="text-sm text-gray-600 mb-1">Taille modèle</p>
            <p className="font-semibold text-gray-800">6.0 MB</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default StatsPage

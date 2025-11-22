import { useState, useEffect } from 'react'
import { Trash2, Calendar, Download, Eye } from 'lucide-react'
import { motion } from 'framer-motion'

const HistoryPage = () => {
  const [history, setHistory] = useState([])
  const [selectedItem, setSelectedItem] = useState(null)
  
  useEffect(() => {
    const loadHistory = () => {
      const saved = localStorage.getItem('detectionHistory')
      if (saved) {
        setHistory(JSON.parse(saved))
      }
    }
    loadHistory()
  }, [])
  
  const clearHistory = () => {
    if (window.confirm('Êtes-vous sûr de vouloir effacer tout l\'historique ?')) {
      localStorage.removeItem('detectionHistory')
      setHistory([])
    }
  }
  
  const getStatusColor = (label) => {
    if (label?.toLowerCase().includes('pleine')) return 'text-danger-600'
    if (label?.toLowerCase().includes('vide')) return 'text-primary-600'
    return 'text-yellow-600'
  }
  
  const getStatusBg = (label) => {
    if (label?.toLowerCase().includes('pleine')) return 'bg-danger-100'
    if (label?.toLowerCase().includes('vide')) return 'bg-primary-100'
    return 'bg-yellow-100'
  }
  
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-800">Historique</h1>
          <p className="text-gray-600 mt-2">{history.length} détection(s) enregistrée(s)</p>
        </div>
        {history.length > 0 && (
          <button
            onClick={clearHistory}
            className="px-4 py-2 bg-danger-100 text-danger-700 rounded-lg hover:bg-danger-200 transition-colors flex items-center space-x-2"
          >
            <Trash2 className="w-4 h-4" />
            <span>Effacer tout</span>
          </button>
        )}
      </div>
      
      {history.length === 0 ? (
        <div className="card text-center py-16">
          <Calendar className="w-16 h-16 mx-auto text-gray-300 mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">
            Aucun historique
          </h3>
          <p className="text-gray-600">
            Les détections apparaîtront ici après votre première analyse
          </p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {history.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="card hover:shadow-xl transition-shadow cursor-pointer"
              onClick={() => setSelectedItem(item)}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 truncate">
                      {item.filename}
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(item.timestamp).toLocaleString('fr-FR')}
                    </p>
                  </div>
                  <Eye className="w-5 h-5 text-gray-400" />
                </div>
                
                {item.result?.detections && item.result.detections.length > 0 ? (
                  <div className="space-y-2">
                    {item.result.detections.map((detection, idx) => (
                      <div key={idx} className={`${getStatusBg(detection.label)} rounded-lg p-2`}>
                        <div className="flex items-center justify-between">
                          <span className={`font-medium text-sm ${getStatusColor(detection.label)}`}>
                            {detection.label.replace('_', ' ')}
                          </span>
                          <span className="text-xs font-semibold text-gray-700">
                            {(detection.confidence * 100).toFixed(1)}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-gray-500 italic">Aucune détection</p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
      
      {/* Modal de détail */}
      {selectedItem && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedItem(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">
                    {selectedItem.filename}
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    {new Date(selectedItem.timestamp).toLocaleString('fr-FR')}
                  </p>
                </div>
                <button
                  onClick={() => setSelectedItem(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
              
              {selectedItem.result?.annotated_image && (
                <img
                  src={`data:image/jpeg;base64,${selectedItem.result.annotated_image}`}
                  alt="Detection result"
                  className="w-full rounded-lg"
                />
              )}
              
              {selectedItem.result?.detections && (
                <div className="space-y-2">
                  <h3 className="font-semibold text-gray-800">Détections</h3>
                  {selectedItem.result.detections.map((detection, idx) => (
                    <div key={idx} className="border border-gray-200 rounded-lg p-3">
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{detection.label}</span>
                        <span className="text-sm font-semibold">
                          {(detection.confidence * 100).toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </div>
  )
}

export default HistoryPage

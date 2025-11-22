import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, Image as ImageIcon, Loader2, CheckCircle, AlertCircle, Download } from 'lucide-react'
import axios from 'axios'
import { motion, AnimatePresence } from 'framer-motion'

const UploadPage = () => {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  
  const onDrop = useCallback((acceptedFiles) => {
    const selectedFile = acceptedFiles[0]
    if (selectedFile) {
      setFile(selectedFile)
      setPreview(URL.createObjectURL(selectedFile))
      setResult(null)
      setError(null)
    }
  }, [])
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpg', '.jpeg', '.png']
    },
    multiple: false
  })
  
  const handleDetect = async () => {
    if (!file) return
    
    setLoading(true)
    setError(null)
    
    try {
      const formData = new FormData()
      formData.append('file', file)
      
      const response = await axios.post('/api/predict/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      
      setResult(response.data)
      
      // Sauvegarder dans l'historique local
      const history = JSON.parse(localStorage.getItem('detectionHistory') || '[]')
      history.unshift({
        id: Date.now(),
        timestamp: new Date().toISOString(),
        filename: file.name,
        result: response.data
      })
      localStorage.setItem('detectionHistory', JSON.stringify(history.slice(0, 50)))
      
    } catch (err) {
      setError(err.response?.data?.detail || 'Erreur lors de la détection. Vérifiez que le serveur API est démarré.')
      console.error('Erreur détection:', err)
    } finally {
      setLoading(false)
    }
  }
  
  const getStatusColor = (label) => {
    if (label.toLowerCase().includes('pleine')) return 'danger'
    if (label.toLowerCase().includes('vide')) return 'success'
    return 'warning'
  }
  
  const getStatusIcon = (label) => {
    if (label.toLowerCase().includes('pleine')) return '🔴'
    if (label.toLowerCase().includes('vide')) return '🟢'
    return '🟡'
  }
  
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold text-gray-800">Détection de Poubelles</h1>
        <p className="text-gray-600">Uploadez une image pour analyser l'état de remplissage</p>
      </div>
      
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Upload Zone */}
        <div className="card space-y-4">
          <h2 className="text-xl font-bold text-gray-800 flex items-center space-x-2">
            <ImageIcon className="w-6 h-6" />
            <span>Image Source</span>
          </h2>
          
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all ${
              isDragActive
                ? 'border-primary-500 bg-primary-50'
                : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="w-16 h-16 mx-auto text-gray-400 mb-4" />
            {isDragActive ? (
              <p className="text-primary-600 font-semibold">Déposez l'image ici...</p>
            ) : (
              <div>
                <p className="text-gray-700 font-semibold mb-2">
                  Cliquez ou glissez une image ici
                </p>
                <p className="text-sm text-gray-500">
                  JPG, JPEG, PNG (max 10MB)
                </p>
              </div>
            )}
          </div>
          
          {preview && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-4"
            >
              <img
                src={preview}
                alt="Preview"
                className="w-full h-64 object-cover rounded-xl"
              />
              <button
                onClick={handleDetect}
                disabled={loading}
                className="btn-primary w-full flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Analyse en cours...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    <span>Détecter</span>
                  </>
                )}
              </button>
            </motion.div>
          )}
        </div>
        
        {/* Results */}
        <div className="card space-y-4">
          <h2 className="text-xl font-bold text-gray-800 flex items-center space-x-2">
            <CheckCircle className="w-6 h-6" />
            <span>Résultats</span>
          </h2>
          
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-danger-50 border border-danger-200 rounded-lg p-4 flex items-start space-x-3"
              >
                <AlertCircle className="w-6 h-6 text-danger-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-danger-800">Erreur</h3>
                  <p className="text-sm text-danger-700 mt-1">{error}</p>
                </div>
              </motion.div>
            )}
            
            {!result && !error && !loading && (
              <div className="text-center py-12 text-gray-400">
                <ImageIcon className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Les résultats de détection apparaîtront ici</p>
              </div>
            )}
            
            {loading && (
              <div className="text-center py-12">
                <Loader2 className="w-16 h-16 mx-auto text-primary-600 animate-spin mb-4" />
                <p className="text-gray-600">Analyse de l'image en cours...</p>
                <p className="text-sm text-gray-500 mt-2">Temps moyen : ~65ms</p>
              </div>
            )}
            
            {result && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                {result.detections && result.detections.length > 0 ? (
                  <>
                    {/* Image annotée */}
                    {result.annotated_image && (
                      <div className="relative">
                        <img
                          src={`data:image/jpeg;base64,${result.annotated_image}`}
                          alt="Annotated"
                          className="w-full h-64 object-cover rounded-xl"
                        />
                        <button
                          onClick={() => {
                            const link = document.createElement('a')
                            link.href = `data:image/jpeg;base64,${result.annotated_image}`
                            link.download = `detection_${Date.now()}.jpg`
                            link.click()
                          }}
                          className="absolute top-4 right-4 bg-white/90 backdrop-blur p-2 rounded-lg hover:bg-white transition-colors"
                        >
                          <Download className="w-5 h-5" />
                        </button>
                      </div>
                    )}
                    
                    {/* Détections */}
                    <div className="space-y-3">
                      <h3 className="font-semibold text-gray-800">
                        {result.detections.length} détection(s) trouvée(s)
                      </h3>
                      
                      {result.detections.map((detection, index) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              <span className="text-2xl">{getStatusIcon(detection.label)}</span>
                              <span className="font-semibold text-gray-800 capitalize">
                                {detection.label.replace('_', ' ')}
                              </span>
                            </div>
                            <span className={`badge badge-${getStatusColor(detection.label)}`}>
                              {(detection.confidence * 100).toFixed(1)}%
                            </span>
                          </div>
                          
                          {/* Barre de progression */}
                          <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                            <motion.div
                              initial={{ width: 0 }}
                              animate={{ width: `${detection.confidence * 100}%` }}
                              transition={{ duration: 0.8, ease: "easeOut" }}
                              className={`h-2 rounded-full ${
                                getStatusColor(detection.label) === 'danger' 
                                  ? 'bg-danger-500'
                                  : 'bg-primary-500'
                              }`}
                            />
                          </div>
                          
                          {/* Coordonnées bbox */}
                          <details className="text-xs text-gray-500 mt-2">
                            <summary className="cursor-pointer hover:text-gray-700">
                              Coordonnées (bbox)
                            </summary>
                            <pre className="mt-2 bg-gray-50 p-2 rounded">
                              {JSON.stringify(detection.bbox, null, 2)}
                            </pre>
                          </details>
                        </div>
                      ))}
                    </div>
                    
                    {/* Métriques */}
                    <div className="bg-gray-50 rounded-lg p-4 grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs text-gray-500">Temps d'inférence</p>
                        <p className="text-lg font-bold text-gray-800">
                          {result.inference_time ? `${result.inference_time.toFixed(1)}ms` : 'N/A'}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Confiance moyenne</p>
                        <p className="text-lg font-bold text-gray-800">
                          {(result.detections.reduce((acc, d) => acc + d.confidence, 0) / result.detections.length * 100).toFixed(1)}%
                        </p>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <AlertCircle className="w-12 h-12 mx-auto text-yellow-600 mb-2" />
                    <p className="text-yellow-800 font-semibold">Aucune poubelle détectée</p>
                    <p className="text-sm text-yellow-700 mt-1">
                      Essayez avec une autre image
                    </p>
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}

export default UploadPage

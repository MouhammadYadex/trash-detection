import { useState } from 'react'
import { motion } from 'framer-motion'
import { useDropzone } from 'react-dropzone'
import { Video, Upload, Loader2, Download, CheckCircle, AlertCircle } from 'lucide-react'
import axios from 'axios'

const VideoPage = () => {
  const [file, setFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [progress, setProgress] = useState(0)

  const onDrop = (acceptedFiles) => {
    if (acceptedFiles.length > 0) {
      const videoFile = acceptedFiles[0]
      setFile(videoFile)
      setPreview(URL.createObjectURL(videoFile))
      setResult(null)
      setError(null)
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'video/mp4': ['.mp4'],
      'video/avi': ['.avi'],
      'video/quicktime': ['.mov']
    },
    maxFiles: 1,
    maxSize: 100 * 1024 * 1024 // 100 MB
  })

  const handleDetect = async () => {
    if (!file) return

    setLoading(true)
    setError(null)
    setProgress(0)

    const formData = new FormData()
    formData.append('file', file)

    try {
      // Simuler progression (car traitement vidéo est long)
      const progressInterval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return prev
          }
          return prev + 10
        })
      }, 2000)

      const response = await axios.post('/api/predict/video', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        timeout: 300000 // 5 minutes timeout
      })

      clearInterval(progressInterval)
      setProgress(100)

      if (response.data.success) {
        setResult(response.data)
        
        // Sauvegarder dans historique
        const history = JSON.parse(localStorage.getItem('videoHistory') || '[]')
        history.unshift({
          id: Date.now(),
          filename: file.name,
          timestamp: new Date().toISOString(),
          stats: response.data.stats,
          detections_summary: response.data.stats.detection_summary
        })
        localStorage.setItem('videoHistory', JSON.stringify(history.slice(0, 20)))
      }
    } catch (err) {
      console.error('Erreur détection vidéo:', err)
      setError(
        err.response?.data?.detail || 
        'Erreur lors du traitement de la vidéo. Vérifiez que le serveur API est démarré et que la vidéo est valide.'
      )
    } finally {
      setLoading(false)
    }
  }

  const downloadVideo = () => {
    if (!result?.video_base64) return

    const blob = base64ToBlob(result.video_base64, 'video/mp4')
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `annotated_${file.name}`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const base64ToBlob = (base64, mimeType) => {
    const byteCharacters = atob(base64)
    const byteNumbers = new Array(byteCharacters.length)
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i)
    }
    const byteArray = new Uint8Array(byteNumbers)
    return new Blob([byteArray], { type: mimeType })
  }

  return (
    <div className="max-w-7xl mx-auto">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8"
      >
        <div className="flex items-center justify-center gap-3 mb-4">
          <Video className="w-12 h-12 text-primary-500" />
          <h1 className="text-4xl font-bold text-gray-800">Détection sur Vidéo</h1>
        </div>
        <p className="text-gray-600 text-lg">
          Uploadez une vidéo pour détecter l'état des poubelles frame par frame
        </p>
        <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-yellow-50 text-yellow-800 rounded-lg border border-yellow-200">
          <AlertCircle className="w-5 h-5" />
          <span className="text-sm">
            Formats acceptés: MP4, AVI, MOV • Taille max: 100 MB
          </span>
        </div>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Upload Section */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <div className="card">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <Upload className="w-6 h-6 text-primary-500" />
              Upload Vidéo
            </h2>

            {/* Dropzone */}
            <div
              {...getRootProps()}
              className={`
                border-2 border-dashed rounded-xl p-8 text-center cursor-pointer
                transition-all duration-300
                ${isDragActive 
                  ? 'border-primary-500 bg-primary-50' 
                  : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
                }
              `}
            >
              <input {...getInputProps()} />
              <Video className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              {isDragActive ? (
                <p className="text-lg text-primary-600 font-medium">
                  Déposez la vidéo ici...
                </p>
              ) : (
                <>
                  <p className="text-lg text-gray-700 mb-2">
                    Glissez-déposez une vidéo ici
                  </p>
                  <p className="text-sm text-gray-500">
                    ou cliquez pour sélectionner
                  </p>
                </>
              )}
            </div>

            {/* Preview */}
            {preview && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-4"
              >
                <video
                  src={preview}
                  controls
                  className="w-full rounded-lg shadow-md"
                  style={{ maxHeight: '300px' }}
                />
                <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600">
                    <strong>Fichier:</strong> {file.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    <strong>Taille:</strong> {(file.size / (1024 * 1024)).toFixed(2)} MB
                  </p>
                </div>

                <button
                  onClick={handleDetect}
                  disabled={loading}
                  className="btn-primary w-full mt-4"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      Traitement en cours... {progress}%
                    </>
                  ) : (
                    <>
                      <Video className="w-5 h-5" />
                      Détecter sur Vidéo
                    </>
                  )}
                </button>
              </motion.div>
            )}

            {/* Progress Bar */}
            {loading && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-4"
              >
                <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.5 }}
                    className="bg-gradient-to-r from-primary-500 to-primary-600 h-full rounded-full"
                  />
                </div>
                <p className="text-sm text-gray-600 text-center mt-2">
                  Traitement des frames... Cela peut prendre quelques minutes.
                </p>
              </motion.div>
            )}

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg"
              >
                <p className="text-red-800 text-sm">{error}</p>
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Results Section */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="card">
            <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <CheckCircle className="w-6 h-6 text-green-500" />
              Résultats
            </h2>

            {result ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-4"
              >
                {/* Vidéo Annotée */}
                <div>
                  <h3 className="font-semibold text-gray-700 mb-2">Vidéo Annotée</h3>
                  <video
                    src={`data:video/mp4;base64,${result.video_base64}`}
                    controls
                    className="w-full rounded-lg shadow-md"
                    style={{ maxHeight: '300px' }}
                  />
                  <button
                    onClick={downloadVideo}
                    className="btn-primary w-full mt-3"
                  >
                    <Download className="w-5 h-5" />
                    Télécharger Vidéo Annotée
                  </button>
                </div>

                {/* Statistiques */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm text-blue-600 font-medium">Frames</p>
                    <p className="text-2xl font-bold text-blue-700">
                      {result.stats.total_frames}
                    </p>
                  </div>
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-600 font-medium">FPS</p>
                    <p className="text-2xl font-bold text-green-700">
                      {result.stats.fps}
                    </p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <p className="text-sm text-purple-600 font-medium">Durée</p>
                    <p className="text-2xl font-bold text-purple-700">
                      {result.stats.duration_sec}s
                    </p>
                  </div>
                  <div className="p-3 bg-orange-50 rounded-lg">
                    <p className="text-sm text-orange-600 font-medium">Traitement</p>
                    <p className="text-2xl font-bold text-orange-700">
                      {result.stats.processing_time_sec}s
                    </p>
                  </div>
                </div>

                {/* Détections Summary */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-700 mb-2">
                    Résumé des détections ({result.stats.detections_count} total)
                  </h3>
                  <div className="space-y-2">
                    {Object.entries(result.stats.detection_summary).map(([label, count]) => (
                      <div key={label} className="flex items-center justify-between">
                        <span className={`badge ${label.includes('pleine') ? 'badge-danger' : 'badge-success'}`}>
                          {label}
                        </span>
                        <span className="font-bold text-gray-700">{count} frames</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="text-center py-12 text-gray-400">
                <Video className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p>Les résultats apparaîtront ici après traitement</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default VideoPage

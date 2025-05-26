"use client"

import { useState } from "react"
import { Upload, Play, FileVideo, Loader2 } from "lucide-react"

interface ComparisonResult {
  added_in_video2: string[]
  removed_in_video2: string[]
}

export default function VideoComparison() {
  const [video1, setVideo1] = useState<File | null>(null)
  const [video2, setVideo2] = useState<File | null>(null)
  const [result, setResult] = useState<ComparisonResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleFileUpload = (file: File, videoNumber: 1 | 2) => {
    if (videoNumber === 1) {
      setVideo1(file)
    } else {
      setVideo2(file)
    }
    setError(null)
    setResult(null)
  }

  const compareVideos = async () => {
    if (!video1 || !video2) {
      setError("Please upload both videos before comparing")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("video1", video1)
      formData.append("video2", video2)

      const response = await fetch("https://syed-yousaf-fyp-backend.hf.space/compare-videos", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data: ComparisonResult = await response.json()
      setResult(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred while comparing videos")
    } finally {
      setLoading(false)
    }
  }

  const resetComparison = () => {
    setVideo1(null)
    setVideo2(null)
    setResult(null)
    setError(null)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
            Video Comparison Tool
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Upload two videos to analyze the differences in detected objects between them
          </p>
        </div>

        {/* Upload Section */}
        <div className="grid md:grid-cols-2 gap-8 mb-8">
          {/* Video 1 Upload */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <FileVideo className="w-6 h-6 text-green-400" />
              Video 1
            </h3>
            <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-green-400 transition-colors">
              <input
                type="file"
                accept="video/*"
                onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 1)}
                className="hidden"
                id="video1-upload"
              />
              <label htmlFor="video1-upload" className="cursor-pointer">
                <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-lg mb-2">{video1 ? video1.name : "Click to upload video 1"}</p>
                <p className="text-sm text-gray-400">MP4, AVI, MOV supported</p>
              </label>
            </div>
          </div>

          {/* Video 2 Upload */}
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <h3 className="text-2xl font-semibold mb-4 flex items-center gap-2">
              <FileVideo className="w-6 h-6 text-blue-400" />
              Video 2
            </h3>
            <div className="border-2 border-dashed border-gray-600 rounded-lg p-8 text-center hover:border-blue-400 transition-colors">
              <input
                type="file"
                accept="video/*"
                onChange={(e) => e.target.files?.[0] && handleFileUpload(e.target.files[0], 2)}
                className="hidden"
                id="video2-upload"
              />
              <label htmlFor="video2-upload" className="cursor-pointer">
                <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p className="text-lg mb-2">{video2 ? video2.name : "Click to upload video 2"}</p>
                <p className="text-sm text-gray-400">MP4, AVI, MOV supported</p>
              </label>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="text-center mb-8">
          <button
            onClick={compareVideos}
            disabled={loading || !video1 || !video2}
            className="btn-grad mr-4 disabled:opacity-50 disabled:cursor-not-allowed inline-flex items-center gap-2 !py-1"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Comparing Videos...
              </>
            ) : (
              <>
                <Play className="w-5 h-5" />
                Compare Videos
              </>
            )}
          </button>

          <button
            onClick={resetComparison}
            className="bg-gray-700 hover:bg-gray-600 text-white px-8 py-3 rounded-lg transition-colors"
          >
            Reset
          </button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-900/50 border border-red-500 rounded-lg p-4 mb-8 text-center">
            <p className="text-red-200">{error}</p>
          </div>
        )}

        {/* Results Section */}
        {result && (
          <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-6 border border-gray-700">
            <h3 className="text-2xl font-semibold mb-6 text-center">Comparison Results</h3>

            <div className="grid md:grid-cols-2 gap-6">
              {/* Added Objects */}
              <div className="bg-green-900/30 border border-green-500/50 rounded-lg p-4">
                <h4 className="text-lg font-semibold mb-3 text-green-400 flex items-center gap-2">
                  <span className="w-3 h-3 bg-green-400 rounded-full"></span>
                  Added in Video 2
                </h4>
                {result.added_in_video2.length > 0 ? (
                  <ul className="space-y-2">
                    {result.added_in_video2.map((item, index) => (
                      <li key={index} className="bg-green-800/30 px-3 py-2 rounded capitalize">
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-400 italic">No new objects detected</p>
                )}
              </div>

              {/* Removed Objects */}
              <div className="bg-red-900/30 border border-red-500/50 rounded-lg p-4">
                <h4 className="text-lg font-semibold mb-3 text-red-400 flex items-center gap-2">
                  <span className="w-3 h-3 bg-red-400 rounded-full"></span>
                  Removed in Video 2
                </h4>
                {result.removed_in_video2.length > 0 ? (
                  <ul className="space-y-2">
                    {result.removed_in_video2.map((item, index) => (
                      <li key={index} className="bg-red-800/30 px-3 py-2 rounded capitalize">
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-400 italic">No objects were removed</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center mt-12 text-gray-400">
          <p>Powered by AI Video Analysis • Built for Final Year Project</p>
        </div>
      </div>
    </div>
  )
}

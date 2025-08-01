import React, { useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Settings } from 'lucide-react';

interface VideoPlayerProps {
  videoUrl: string;
  title: string;
  description?: string;
  onProgress?: (progress: number) => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoUrl,
  title,
  description,
  onProgress
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    // In a real implementation, this would control the actual video
    // For demo purposes, we'll just toggle the state
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Mock video progress for demonstration
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="card">
      <div className="relative bg-black rounded-lg overflow-hidden mb-4">
        {/* Video placeholder - in production this would be a video element */}
        <div className="aspect-video bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center">
          <div className="text-center text-white">
            <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center mb-4 mx-auto">
              {isPlaying ? (
                <Pause className="h-12 w-12" />
              ) : (
                <Play className="h-12 w-12 ml-2" />
              )}
            </div>
            <p className="text-lg font-medium">{title}</p>
            <p className="text-sm opacity-75">Click to {isPlaying ? 'pause' : 'play'}</p>
          </div>
        </div>

        {/* Video Controls Overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
          {/* Progress Bar */}
          <div className="mb-3">
            <div className="w-full bg-white bg-opacity-30 rounded-full h-1">
              <div 
                className="bg-primary-500 h-1 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-between text-white">
            <div className="flex items-center space-x-3">
              <button
                onClick={togglePlay}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
              >
                {isPlaying ? (
                  <Pause className="h-5 w-5" />
                ) : (
                  <Play className="h-5 w-5" />
                )}
              </button>

              <button
                onClick={toggleMute}
                className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors"
              >
                {isMuted ? (
                  <VolumeX className="h-5 w-5" />
                ) : (
                  <Volume2 className="h-5 w-5" />
                )}
              </button>

              <div className="text-sm">
                {formatTime(currentTime)} / {formatTime(duration || 1200)}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors">
                <Settings className="h-5 w-5" />
              </button>
              <button className="p-2 hover:bg-white hover:bg-opacity-20 rounded-full transition-colors">
                <Maximize className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Video Info */}
      <div>
        <h3 className="text-xl font-bold text-secondary-900 mb-2">{title}</h3>
        {description && (
          <p className="text-secondary-600 mb-4">{description}</p>
        )}
        
        <div className="flex items-center justify-between text-sm text-secondary-500">
          <span>Progress: {Math.round(progress)}%</span>
          <span>Duration: {formatTime(duration || 1200)}</span>
        </div>
      </div>
    </div>
  );
};
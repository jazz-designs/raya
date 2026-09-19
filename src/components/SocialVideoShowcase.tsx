import { useState, useRef, useEffect, type MouseEvent, type FC } from 'react';
import { 
  Instagram, Volume2, VolumeX, Play, Pause, 
  ExternalLink, X, Sparkles, ChevronRight 
} from 'lucide-react';
import { 
  SocialVideoItem, 
  INSTAGRAM_HANDLE, 
  INSTAGRAM_URL, 
  getProductSocialVideos 
} from '../services/socialVideos';

interface SocialVideoShowcaseProps {
  productId: string;
}

export default function SocialVideoShowcase({ productId }: SocialVideoShowcaseProps) {
  const [videos, setVideos] = useState<SocialVideoItem[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<SocialVideoItem | null>(null);
  const [isModalMuted, setIsModalMuted] = useState(false);
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);
  const [cardMuted, setCardMuted] = useState(true);

  // Update video selection whenever productId changes
  useEffect(() => {
    const selected = getProductSocialVideos(productId, 5);
    setVideos(selected);
  }, [productId]);

  if (videos.length === 0) {
    return null;
  }

  return (
    <section className="mt-16 sm:mt-20 pt-12 border-t border-outline-variant/30">
      {/* Header with Instagram Branding */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-50 border border-pink-200/70 text-pink-700 text-xs font-bold uppercase tracking-wider mb-2.5">
            <Instagram className="w-3.5 h-3.5 text-pink-600" />
            <span>Community Spotlight</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl text-primary font-bold">
            Styled in Motion
          </h2>
          <p className="text-xs sm:text-sm text-on-surface-variant max-w-xl mt-1">
            Reels and styling inspiration from our community. Tag{' '}
            <a 
              href={INSTAGRAM_URL} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-primary font-semibold hover:underline"
            >
              {INSTAGRAM_HANDLE}
            </a>{' '}
            on Instagram to be featured.
          </p>
        </div>

        <a
          href={INSTAGRAM_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-surface border border-outline-variant/40 hover:border-primary/50 text-primary text-xs font-bold uppercase tracking-wider transition-all hover:bg-surface-container shadow-xs self-start sm:self-auto cursor-pointer"
        >
          <Instagram className="w-4 h-4 text-pink-600" />
          <span>Follow {INSTAGRAM_HANDLE}</span>
          <ExternalLink className="w-3.5 h-3.5 text-outline" />
        </a>
      </div>

      {/* Video Reel Cards Slider (Horizontal 1-row scroll on mobile, responsive grid on desktop) */}
      <div className="flex sm:grid sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4 overflow-x-auto sm:overflow-visible pb-3 sm:pb-0 pt-1 -mx-4 px-4 sm:mx-0 sm:px-0 snap-x snap-mandatory [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {videos.map((item, index) => (
          <VideoCard
            key={`${item.id}-${index}`}
            item={item}
            index={index}
            isMuted={cardMuted}
            onToggleMute={() => setCardMuted(prev => !prev)}
            onOpenModal={() => setSelectedVideo(item)}
            isPlayingGlobal={playingVideoId === item.id}
            onSetPlaying={(id) => setPlayingVideoId(id)}
          />
        ))}
      </div>

      <div className="mt-3 sm:mt-4 flex items-center justify-between text-[11px] text-outline px-1">
        <span className="hidden sm:inline">Showing real client and styling moments</span>
        <span className="sm:hidden inline text-[10px] text-secondary font-medium">Swipe for more reels →</span>
        <a 
          href={INSTAGRAM_URL} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="flex items-center gap-1 hover:text-primary font-medium"
        >
          <span>More reels on Instagram</span>
          <ChevronRight className="w-3 h-3" />
        </a>
      </div>

      {/* Expanded Video Reel Lightbox Modal */}
      {selectedVideo && (
        <div 
          className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setSelectedVideo(null)}
        >
          <div 
            className="relative bg-surface rounded-2xl overflow-hidden max-w-sm w-full shadow-2xl border border-white/20 animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedVideo(null)}
              className="absolute top-3 right-3 z-30 bg-black/60 hover:bg-black text-white p-2 rounded-full backdrop-blur-sm transition-all cursor-pointer"
              aria-label="Close video"
            >
              <X className="w-4 h-4" />
            </button>

            {/* Video Player in Modal */}
            <div className="relative aspect-[9/16] bg-black w-full overflow-hidden">
              <video
                src={selectedVideo.url}
                autoPlay
                loop
                playsInline
                muted={isModalMuted}
                className="w-full h-full object-cover"
              />

              {/* Sound Toggle Button in Modal */}
              <button
                onClick={() => setIsModalMuted(prev => !prev)}
                className="absolute bottom-16 right-3 z-20 bg-black/60 hover:bg-black text-white p-2.5 rounded-full backdrop-blur-sm transition-all cursor-pointer"
                aria-label={isModalMuted ? 'Unmute' : 'Mute'}
              >
                {isModalMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
              </button>

              {/* Overlay Footer in Modal */}
              <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/90 via-black/40 to-transparent text-white">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-400 via-rose-500 to-purple-600 flex items-center justify-center p-0.5">
                    <div className="w-full h-full bg-black rounded-full flex items-center justify-center">
                      <Instagram className="w-3.5 h-3.5 text-white" />
                    </div>
                  </div>
                  <span className="font-bold text-xs">{selectedVideo.handle}</span>
                </div>

                <p className="text-[11px] text-white/80 line-clamp-2 mb-3">
                  {selectedVideo.caption}
                </p>

                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2 px-4 rounded-xl bg-white/20 hover:bg-white/30 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer"
                >
                  <Instagram className="w-3.5 h-3.5 text-pink-400" />
                  <span>View Post on Instagram</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

interface VideoCardProps {
  item: SocialVideoItem;
  index: number;
  isMuted: boolean;
  onToggleMute: () => void;
  onOpenModal: () => void;
  isPlayingGlobal: boolean;
  onSetPlaying: (id: string | null) => void;
}

const VideoCard: FC<VideoCardProps> = ({ 
  item, 
  index, 
  isMuted, 
  onToggleMute, 
  onOpenModal,
  isPlayingGlobal,
  onSetPlaying,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Play video on hover
  const handleMouseEnter = () => {
    setIsHovered(true);
    if (videoRef.current) {
      videoRef.current.play().then(() => {
        setIsPlaying(true);
        onSetPlaying(item.id);
      }).catch(() => {
        // Autoplay may be restricted
      });
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (videoRef.current) {
      videoRef.current.pause();
      setIsPlaying(false);
      onSetPlaying(null);
    }
  };

  const togglePlay = (e: MouseEvent) => {
    e.stopPropagation();
    if (!videoRef.current) return;

    if (videoRef.current.paused) {
      videoRef.current.play().then(() => {
        setIsPlaying(true);
        onSetPlaying(item.id);
      }).catch(() => {});
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
      onSetPlaying(null);
    }
  };

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={onOpenModal}
      className="group relative rounded-2xl overflow-hidden bg-surface-container border border-outline-variant/40 shadow-xs hover:shadow-lg transition-all duration-300 aspect-[9/16] cursor-pointer flex flex-col justify-between shrink-0 snap-start w-[140px] xs:w-[155px] sm:w-auto"
    >
      {/* Video Element */}
      <video
        ref={videoRef}
        src={item.url}
        loop
        playsInline
        muted={isMuted}
        preload="metadata"
        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
      />

      {/* Subtle Top Overlay: Instagram Badge */}
      <div className="relative z-10 p-2.5 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-1 bg-black/60 backdrop-blur-md px-2 py-0.5 rounded-full text-white text-[10px] font-semibold">
          <Instagram className="w-2.5 h-2.5 text-pink-400" />
          <span>Reel</span>
        </div>

        <div className="w-5 h-5 rounded-full bg-black/40 backdrop-blur-md flex items-center justify-center text-white/80">
          <Sparkles className="w-2.5 h-2.5 text-secondary" />
        </div>
      </div>

      {/* Hover Center Play Button (When not playing or paused) */}
      {!isPlaying && (
        <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
          <div className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white shadow-md group-hover:scale-110 transition-transform">
            <Play className="w-4 h-4 fill-white ml-0.5" />
          </div>
        </div>
      )}

      {/* Bottom Overlay Info & Controls */}
      <div className="relative z-10 p-2.5 bg-gradient-to-t from-black/80 via-black/30 to-transparent text-white pt-8">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-bold tracking-wide truncate">
            {INSTAGRAM_HANDLE}
          </span>

          <div className="flex items-center gap-1">
            <button
              onClick={togglePlay}
              className="p-1 rounded-full hover:bg-white/20 transition-colors text-white cursor-pointer"
              title={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleMute();
              }}
              className="p-1 rounded-full hover:bg-white/20 transition-colors text-white cursor-pointer"
              title={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

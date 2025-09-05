import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ChevronLeft, 
  ChevronRight, 
  X, 
  ZoomIn, 
  Download,
  Share2,
  Maximize2
} from "lucide-react";

interface GalleryImage {
  id: string;
  src: string;
  title: string;
  titleEn?: string;
  description?: string;
  descriptionEn?: string;
  category?: string;
  categoryEn?: string;
  tags?: string[];
  tagsEn?: string[];
  projectId?: string;
}

interface ImageGalleryProps {
  images: GalleryImage[];
  variant?: "grid" | "carousel" | "masonry";
  isArabic?: boolean;
  onImageClick?: (image: GalleryImage) => void;
}

export default function ImageGallery({ 
  images, 
  variant = "grid", 
  isArabic = true,
  onImageClick 
}: ImageGalleryProps) {
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const openLightbox = (image: GalleryImage, index: number) => {
    setSelectedImage(image);
    setCurrentIndex(index);
    onImageClick?.(image);
  };

  const closeLightbox = () => {
    setSelectedImage(null);
    setIsFullscreen(false);
  };

  const goToPrevious = () => {
    const newIndex = currentIndex > 0 ? currentIndex - 1 : images.length - 1;
    setCurrentIndex(newIndex);
    setSelectedImage(images[newIndex]);
  };

  const goToNext = () => {
    const newIndex = currentIndex < images.length - 1 ? currentIndex + 1 : 0;
    setCurrentIndex(newIndex);
    setSelectedImage(images[newIndex]);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') goToPrevious();
    if (e.key === 'ArrowRight') goToNext();
    if (e.key === 'Escape') closeLightbox();
  };

  const shareImage = async (image: GalleryImage) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: isArabic ? image.title : image.titleEn || image.title,
          text: isArabic ? image.description : image.descriptionEn || image.description,
          url: image.src,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      navigator.clipboard.writeText(image.src);
    }
  };

  const downloadImage = (image: GalleryImage) => {
    const link = document.createElement('a');
    link.href = image.src;
    link.download = isArabic ? image.title : image.titleEn || image.title;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (variant === "masonry") {
    return (
      <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
        {images.map((image, index) => (
          <Card 
            key={image.id} 
            className="break-inside-avoid mb-4 group cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => openLightbox(image, index)}
          >
            <div className="relative overflow-hidden">
              <img 
                src={image.src} 
                alt={isArabic ? image.title : image.titleEn || image.title}
                className="w-full h-auto object-cover group-hover:scale-105 transition-transform duration-300"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <ZoomIn className="h-8 w-8 text-white" />
              </div>
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold text-sm mb-2 line-clamp-2">
                {isArabic ? image.title : image.titleEn || image.title}
              </h3>
              {image.description && (
                <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                  {isArabic ? image.description : image.descriptionEn || image.description}
                </p>
              )}
              {image.category && (
                <Badge variant="secondary" className="text-xs">
                  {isArabic ? image.category : image.categoryEn || image.category}
                </Badge>
              )}
            </CardContent>
          </Card>
        ))}
        
        {/* Lightbox */}
        {selectedImage && (
          <Dialog open={!!selectedImage} onOpenChange={closeLightbox}>
            <DialogContent 
              className={`max-w-7xl w-full h-full max-h-[90vh] p-0 bg-black ${isFullscreen ? 'fixed inset-0 max-w-none max-h-none' : ''}`}
              onKeyDown={handleKeyDown}
            >
              <DialogTitle className="sr-only">
                {isArabic ? selectedImage.title : selectedImage.titleEn || selectedImage.title}
              </DialogTitle>
              
              {/* Header */}
              <div className="absolute top-0 left-0 right-0 z-10 bg-black/80 backdrop-blur-sm p-4 flex items-center justify-between">
                <div className="flex-1 text-white">
                  <h3 className="font-semibold">
                    {isArabic ? selectedImage.title : selectedImage.titleEn || selectedImage.title}
                  </h3>
                  <p className="text-sm text-white/80">
                    {currentIndex + 1} / {images.length}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => shareImage(selectedImage)}
                    className="text-white hover:bg-white/20"
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => downloadImage(selectedImage)}
                    className="text-white hover:bg-white/20"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsFullscreen(!isFullscreen)}
                    className="text-white hover:bg-white/20"
                  >
                    <Maximize2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={closeLightbox}
                    className="text-white hover:bg-white/20"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Image */}
              <div className="relative w-full h-full flex items-center justify-center">
                <img 
                  src={selectedImage.src} 
                  alt={isArabic ? selectedImage.title : selectedImage.titleEn || selectedImage.title}
                  className="max-w-full max-h-full object-contain"
                />
                
                {/* Navigation */}
                {images.length > 1 && (
                  <>
                    <Button
                      variant="ghost"
                      size="lg"
                      onClick={goToPrevious}
                      className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20 rounded-full h-12 w-12"
                    >
                      <ChevronLeft className="h-6 w-6" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="lg"
                      onClick={goToNext}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20 rounded-full h-12 w-12"
                    >
                      <ChevronRight className="h-6 w-6" />
                    </Button>
                  </>
                )}
              </div>

              {/* Footer */}
              {selectedImage.description && (
                <div className="absolute bottom-0 left-0 right-0 bg-black/80 backdrop-blur-sm p-4 text-white">
                  <p className="text-sm">
                    {isArabic ? selectedImage.description : selectedImage.descriptionEn || selectedImage.description}
                  </p>
                  {selectedImage.tags && selectedImage.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {(isArabic ? selectedImage.tags : selectedImage.tagsEn || selectedImage.tags).map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-white border-white/40">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </DialogContent>
          </Dialog>
        )}
      </div>
    );
  }

  if (variant === "carousel") {
    return (
      <div className="relative">
        <div className="overflow-hidden rounded-lg">
          <div 
            className="flex transition-transform duration-300 ease-in-out"
            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {images.map((image, index) => (
              <div key={image.id} className="w-full flex-shrink-0">
                <div className="aspect-video relative group cursor-pointer" onClick={() => openLightbox(image, index)}>
                  <img 
                    src={image.src} 
                    alt={isArabic ? image.title : image.titleEn || image.title}
                    className="w-full h-full object-cover"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <ZoomIn className="h-8 w-8 text-white" />
                  </div>
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="font-semibold text-lg mb-1">
                      {isArabic ? image.title : image.titleEn || image.title}
                    </h3>
                    {image.description && (
                      <p className="text-sm text-white/80 line-clamp-2">
                        {isArabic ? image.description : image.descriptionEn || image.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Carousel Controls */}
        {images.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="lg"
              onClick={goToPrevious}
              className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white hover:bg-black/70 rounded-full h-12 w-12"
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            <Button
              variant="ghost"
              size="lg"
              onClick={goToNext}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/50 text-white hover:bg-black/70 rounded-full h-12 w-12"
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
            
            {/* Dots Indicator */}
            <div className="flex justify-center gap-2 mt-4">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setCurrentIndex(index);
                    setSelectedImage(images[index]);
                  }}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentIndex ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    );
  }

  // Grid variant (default)
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {images.map((image, index) => (
        <Card 
          key={image.id} 
          className="group cursor-pointer hover:shadow-lg transition-shadow overflow-hidden"
          onClick={() => openLightbox(image, index)}
        >
          <div className="aspect-video relative overflow-hidden">
            <img 
              src={image.src} 
              alt={isArabic ? image.title : image.titleEn || image.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <ZoomIn className="h-8 w-8 text-white" />
            </div>
          </div>
          <CardContent className="p-4">
            <h3 className="font-semibold mb-2 line-clamp-1">
              {isArabic ? image.title : image.titleEn || image.title}
            </h3>
            {image.description && (
              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                {isArabic ? image.description : image.descriptionEn || image.description}
              </p>
            )}
            <div className="flex items-center justify-between">
              {image.category && (
                <Badge variant="secondary">
                  {isArabic ? image.category : image.categoryEn || image.category}
                </Badge>
              )}
              {image.tags && image.tags.length > 0 && (
                <div className="flex gap-1">
                  {(isArabic ? image.tags : image.tagsEn || image.tags).slice(0, 2).map((tag, tagIndex) => (
                    <Badge key={tagIndex} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {image.tags.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{image.tags.length - 2}
                    </Badge>
                  )}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
      
      {/* Lightbox - Same as masonry variant */}
      {selectedImage && (
        <Dialog open={!!selectedImage} onOpenChange={closeLightbox}>
          <DialogContent 
            className={`max-w-7xl w-full h-full max-h-[90vh] p-0 bg-black ${isFullscreen ? 'fixed inset-0 max-w-none max-h-none' : ''}`}
            onKeyDown={handleKeyDown}
          >
            <DialogTitle className="sr-only">
              {isArabic ? selectedImage.title : selectedImage.titleEn || selectedImage.title}
            </DialogTitle>
            
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 z-10 bg-black/80 backdrop-blur-sm p-4 flex items-center justify-between">
              <div className="flex-1 text-white">
                <h3 className="font-semibold">
                  {isArabic ? selectedImage.title : selectedImage.titleEn || selectedImage.title}
                </h3>
                <p className="text-sm text-white/80">
                  {currentIndex + 1} / {images.length}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => shareImage(selectedImage)}
                  className="text-white hover:bg-white/20"
                >
                  <Share2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => downloadImage(selectedImage)}
                  className="text-white hover:bg-white/20"
                >
                  <Download className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsFullscreen(!isFullscreen)}
                  className="text-white hover:bg-white/20"
                >
                  <Maximize2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={closeLightbox}
                  className="text-white hover:bg-white/20"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Image */}
            <div className="relative w-full h-full flex items-center justify-center">
              <img 
                src={selectedImage.src} 
                alt={isArabic ? selectedImage.title : selectedImage.titleEn || selectedImage.title}
                className="max-w-full max-h-full object-contain"
              />
              
              {/* Navigation */}
              {images.length > 1 && (
                <>
                  <Button
                    variant="ghost"
                    size="lg"
                    onClick={goToPrevious}
                    className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20 rounded-full h-12 w-12"
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="lg"
                    onClick={goToNext}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white hover:bg-white/20 rounded-full h-12 w-12"
                  >
                    <ChevronRight className="h-6 w-6" />
                  </Button>
                </>
              )}
            </div>

            {/* Footer */}
            {selectedImage.description && (
              <div className="absolute bottom-0 left-0 right-0 bg-black/80 backdrop-blur-sm p-4 text-white">
                <p className="text-sm">
                  {isArabic ? selectedImage.description : selectedImage.descriptionEn || selectedImage.description}
                </p>
                {selectedImage.tags && selectedImage.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {(isArabic ? selectedImage.tags : selectedImage.tagsEn || selectedImage.tags).map((tag, index) => (
                      <Badge key={index} variant="outline" className="text-white border-white/40">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
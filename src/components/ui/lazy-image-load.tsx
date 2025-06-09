import { apiClient } from "@/api/requests";
import { useQuery } from "@tanstack/react-query";
import { memo, useEffect, useRef, useState } from "react";
import { Skeleton } from "./skeleton";

type LazyImageProps = {
  url: string;
  alt?: string;
  className?: string;
};

function LazyImage({ url }: LazyImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const { data: dataImage } = useQuery({
    queryKey: ["lazy-image", url, isVisible],
    queryFn: async () => apiClient.getCountryFlag(url),
    enabled: isVisible,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect(); // Stop observing once the image is visible
        }
      });
    });

    if (ref.current) {
      observer.observe(ref.current); // Start observing the ref element
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, []);

  return (
    <div ref={ref}>
      {dataImage?.success && dataImage.data.flag ? (
        <img
          src={dataImage.data.flag}
          className="h-4 w-auto object-cover"
          loading="lazy"
          alt={dataImage.data.name}
        />
      ) : (
        <Skeleton className="w-full h-full" />
      )}
    </div>
  );
}

export default memo(LazyImage);

'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { Skeleton } from './LoadingSkeleton';

/**
 * کامپوننت Lazy Loading با Intersection Observer
 * برای بهبود عملکرد و کاهش زمان بارگذاری اولیه
 */
export function LazyLoad({
  children,
  fallback = <Skeleton />,
  threshold = 0.1,
  rootMargin = '50px',
  className = '',
  once = true,
}) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          if (once) {
            setHasLoaded(true);
            observer.unobserve(entry.target);
          }
        } else if (!once) {
          setIsIntersecting(false);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [threshold, rootMargin, once]);

  const shouldRender = once ? hasLoaded : isIntersecting;

  return (
    <div ref={ref} className={className}>
      {shouldRender ? children : fallback}
    </div>
  );
}

/**
 * HOC برای Lazy Loading کامپوننت‌ها
 */
export function withLazyLoading(Component, fallback) {
  return function LazyComponent(props) {
    return (
      <Suspense fallback={fallback}>
        <LazyLoad fallback={fallback}>
          <Component {...props} />
        </LazyLoad>
      </Suspense>
    );
  };
}

/**
 * کامپوننت Lazy Loading برای تصاویر
 */
export function LazyImage({
  src,
  alt,
  className = '',
  width,
  height,
  onLoad,
  ...props
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current);
      }
    };
  }, []);

  const handleLoad = () => {
    setIsLoaded(true);
    if (onLoad) onLoad();
  };

  return (
    <div
      ref={imgRef}
      className={`relative overflow-hidden ${className}`}
      style={{ width, height }}
    >
      {isInView && (
        <img
          src={src}
          alt={alt}
          onLoad={handleLoad}
          className={`
            transition-opacity duration-300
            ${isLoaded ? 'opacity-100' : 'opacity-0'}
            ${className}
          `}
          {...props}
        />
      )}

      {/* Loading placeholder */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
          <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
}

/**
 * کامپوننت Lazy Loading برای محتوای متنی
 */
export function LazyContent({
  children,
  delay = 0,
  className = '',
  animationType = 'fade',
}) {
  const [isVisible, setIsVisible] = useState(false);
  const [shouldAnimate, setShouldAnimate] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          setTimeout(() => {
            setShouldAnimate(true);
          }, delay);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [delay]);

  const getAnimationClass = () => {
    const baseClass = 'transition-all duration-700 ease-out';

    switch (animationType) {
      case 'slideUp':
        return `${baseClass} ${shouldAnimate ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`;
      case 'slideDown':
        return `${baseClass} ${shouldAnimate ? 'translate-y-0 opacity-100' : '-translate-y-8 opacity-0'}`;
      case 'slideLeft':
        return `${baseClass} ${shouldAnimate ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'}`;
      case 'slideRight':
        return `${baseClass} ${shouldAnimate ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'}`;
      case 'scale':
        return `${baseClass} ${shouldAnimate ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}`;
      case 'fade':
      default:
        return `${baseClass} ${shouldAnimate ? 'opacity-100' : 'opacity-0'}`;
    }
  };

  return (
    <div ref={ref} className={`${getAnimationClass()} ${className}`}>
      {isVisible && children}
    </div>
  );
}

/**
 * کامپوننت Lazy Loading برای لیست‌ها (Virtual Scrolling)
 */
export function LazyList({
  items,
  renderItem,
  itemHeight = 100,
  containerHeight = 400,
  overscan = 5,
  className = '',
}) {
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef(null);

  const visibleStart = Math.floor(scrollTop / itemHeight);
  const visibleEnd = Math.min(
    visibleStart + Math.ceil(containerHeight / itemHeight) + overscan,
    items.length
  );

  const visibleItems = items.slice(
    Math.max(0, visibleStart - overscan),
    visibleEnd
  );

  const handleScroll = e => {
    setScrollTop(e.target.scrollTop);
  };

  return (
    <div
      ref={containerRef}
      className={`overflow-auto ${className}`}
      style={{ height: containerHeight }}
      onScroll={handleScroll}
    >
      <div style={{ height: items.length * itemHeight, position: 'relative' }}>
        {visibleItems.map((item, index) => {
          const itemIndex = Math.max(0, visibleStart - overscan) + index;
          return (
            <div
              key={itemIndex}
              style={{
                position: 'absolute',
                top: itemIndex * itemHeight,
                height: itemHeight,
                width: '100%',
              }}
            >
              {renderItem(item, itemIndex)}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Hook برای تشخیص Intersection
 */
export function useIntersectionObserver(
  elementRef,
  { threshold = 0, rootMargin = '0%', freezeOnceVisible = false }
) {
  const [entry, setEntry] = useState();

  const frozen = entry?.isIntersecting && freezeOnceVisible;

  const updateEntry = ([entry]) => {
    setEntry(entry);
  };

  useEffect(() => {
    const node = elementRef?.current;
    const hasIOSupport = !!window.IntersectionObserver;

    if (!hasIOSupport || frozen || !node) return;

    const observerParams = { threshold, rootMargin };
    const observer = new IntersectionObserver(updateEntry, observerParams);

    observer.observe(node);

    return () => observer.disconnect();
  }, [elementRef?.current, JSON.stringify(threshold), rootMargin, frozen]);

  return entry;
}

/**
 * Hook برای Lazy Loading داده‌ها
 */
export function useLazyData(fetchFunction, dependencies = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.1 }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;

    const loadData = async () => {
      setLoading(true);
      setError(null);

      try {
        const result = await fetchFunction();
        setData(result);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [isVisible, ...dependencies]);

  return { data, loading, error, ref };
}

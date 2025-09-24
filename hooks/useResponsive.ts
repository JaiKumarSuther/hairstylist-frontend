import { useState, useEffect } from 'react';

// Breakpoint values matching our design system
const BREAKPOINTS = {
  mobile: 320,
  tablet: 768,
  desktop: 1024,
  wide: 1400,
} as const;

type Breakpoint = keyof typeof BREAKPOINTS;

export function useResponsive() {
  const [windowSize, setWindowSize] = useState({
    width: 0,
    height: 0,
  });

  const [breakpoint, setBreakpoint] = useState<Breakpoint>('mobile');

  useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      // Set window width/height to state
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });

      // Determine current breakpoint
      const width = window.innerWidth;
      if (width >= BREAKPOINTS.wide) {
        setBreakpoint('wide');
      } else if (width >= BREAKPOINTS.desktop) {
        setBreakpoint('desktop');
      } else if (width >= BREAKPOINTS.tablet) {
        setBreakpoint('tablet');
      } else {
        setBreakpoint('mobile');
      }
    }

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Call handler right away so state gets updated with initial window size
    handleResize();

    // Remove event listener on cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []); // Empty array ensures that effect is only run on mount

  return {
    windowSize,
    breakpoint,
    isMobile: breakpoint === 'mobile',
    isTablet: breakpoint === 'tablet',
    isDesktop: breakpoint === 'desktop',
    isWide: breakpoint === 'wide',
    isMobileOrTablet: breakpoint === 'mobile' || breakpoint === 'tablet',
    isDesktopOrWide: breakpoint === 'desktop' || breakpoint === 'wide',
  };
}

// Hook for responsive values
export function useResponsiveValue<T>(values: {
  mobile: T;
  tablet?: T;
  desktop?: T;
  wide?: T;
}) {
  const { breakpoint } = useResponsive();

  switch (breakpoint) {
    case 'wide':
      return values.wide ?? values.desktop ?? values.tablet ?? values.mobile;
    case 'desktop':
      return values.desktop ?? values.tablet ?? values.mobile;
    case 'tablet':
      return values.tablet ?? values.mobile;
    case 'mobile':
    default:
      return values.mobile;
  }
}

// Hook for responsive grid columns
export function useGridColumns() {
  const { breakpoint } = useResponsive();

  switch (breakpoint) {
    case 'wide':
      return 4;
    case 'desktop':
      return 3;
    case 'tablet':
      return 2;
    case 'mobile':
    default:
      return 1;
  }
}

// Hook for responsive spacing
export function useResponsiveSpacing() {
  const { breakpoint } = useResponsive();

  switch (breakpoint) {
    case 'wide':
      return {
        container: 'max-w-7xl',
        padding: 'px-8',
        gap: 'gap-8',
        margin: 'my-8',
      };
    case 'desktop':
      return {
        container: 'max-w-6xl',
        padding: 'px-6',
        gap: 'gap-6',
        margin: 'my-6',
      };
    case 'tablet':
      return {
        container: 'max-w-4xl',
        padding: 'px-4',
        gap: 'gap-4',
        margin: 'my-4',
      };
    case 'mobile':
    default:
      return {
        container: 'max-w-full',
        padding: 'px-4',
        gap: 'gap-4',
        margin: 'my-4',
      };
  }
}

// Hook for responsive navigation
export function useNavigationLayout() {
  const { isMobile, isTablet, isDesktop } = useResponsive();

  return {
    showBottomNav: isMobile,
    showSidebar: isDesktop,
    showTopNav: !isMobile,
    navType: isMobile ? 'bottom' : isTablet ? 'top' : 'sidebar',
  };
}

// Hook for responsive image sizes
export function useResponsiveImage() {
  const { breakpoint } = useResponsive();

  switch (breakpoint) {
    case 'wide':
      return {
        width: 400,
        height: 300,
        sizes: '(max-width: 1400px) 400px, 400px',
      };
    case 'desktop':
      return {
        width: 300,
        height: 225,
        sizes: '(max-width: 1024px) 300px, 300px',
      };
    case 'tablet':
      return {
        width: 250,
        height: 188,
        sizes: '(max-width: 768px) 250px, 250px',
      };
    case 'mobile':
    default:
      return {
        width: 200,
        height: 150,
        sizes: '(max-width: 320px) 200px, 200px',
      };
  }
}


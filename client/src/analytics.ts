const GA_ID = "G-4BFXKVG4JW";

export const initGA = () => {
  if (!GA_ID) {
    console.warn('Google Analytics GA_ID is not defined.');
    return;
  }
  
  if (typeof window === 'undefined' || (window as any).gtag) return;

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(script);

  (window as any).dataLayer = (window as any).dataLayer || [];

  (window as any).gtag = function () {
    (window as any).dataLayer.push(arguments);
  };

  (window as any).gtag("js", new Date());
  (window as any).gtag("config", GA_ID);
};

export const trackPageView = (path: string, title?: string) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag("event", "page_view", {
      page_title: title || document.title,
      page_location: window.location.origin + path,
      page_path: path
    });
  }
};

export const trackEvent = (eventName: string, parameters: any = {}) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag("event", eventName, parameters);
  }
};

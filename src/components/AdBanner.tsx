import React, { useEffect } from 'react';

interface AdBannerProps {
  adSlot: string;
  width?: number;
  height?: number;
  style?: React.CSSProperties;
  className?: string;
}

declare global {
  interface Window {
    adsbygoogle: any[];
  }
}

const AdBanner: React.FC<AdBannerProps> = ({ 
  adSlot, 
  width = 728, 
  height = 90, 
  style = {},
  className = '' 
}) => {
  useEffect(() => {
    try {
      // Push ad to AdSense queue
      if (window.adsbygoogle) {
        window.adsbygoogle.push({});
      }
    } catch (error) {
      console.error('AdSense error:', error);
    }
  }, []);

  const adStyle: React.CSSProperties = {
    display: 'block',
    textAlign: 'center',
    margin: '0 auto',
    ...style
  };

  return (
    <div className={`ad-container ${className}`} style={{ textAlign: 'center', margin: '10px 0' }}>
      <ins
        className="adsbygoogle"
        style={{
          ...adStyle,
          width: `${width}px`,
          height: `${height}px`
        }}
        data-ad-client="ca-pub-6674314228853992"
        data-ad-slot={adSlot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
};

export default AdBanner; 
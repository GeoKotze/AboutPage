import { useEffect, useState } from "react";

const ProgImg = (lowQualitySrc: string, highQualitySrc: string) => {
  const [src, setSrc] = useState(lowQualitySrc);
  const [blur, setBlur] = useState(true);
  useEffect(() => {
    setSrc(lowQualitySrc);
    const img = new Image();
    img.src = highQualitySrc;
    img.onload = () => {
      setSrc(highQualitySrc);
      setBlur(false);
    };
  }, [lowQualitySrc, highQualitySrc]);
  return [src, blur];
};
export default ProgImg;

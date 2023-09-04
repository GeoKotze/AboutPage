import CarouselMkr from "../components/AboutPage/CarouselMkr";
import ParagraphMkr from "../components/AboutPage/ParagraphMkr";

interface Props {
  lang: string;
  setPicsShow: (arg: boolean) => void;
  picsShow: boolean;
}

export function AboutPage({ lang, setPicsShow, picsShow }: Props) {
  return (
    <>
      <ParagraphMkr lang={lang} setPicsShow={setPicsShow} />
      <CarouselMkr lang={lang} setPicsShow={setPicsShow} picsShow={picsShow} />
    </>
  );
}

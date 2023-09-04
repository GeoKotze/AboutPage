import { useEffect, useState } from "react";
import { Button, Container, Fade } from "react-bootstrap";

interface Props {
  lang: string;
  setPicsShow: (arg: boolean) => void;
}

const ParagraphMkr = ({ lang, setPicsShow }: Props) => {
  const [texts, setTexts] = useState<string[]>([]);
  const [hover, setHover] = useState(false);

  const textMaker = (lang: string): void => {
    fetch(`/about${lang.toUpperCase()}.txt`)
      .then((response) => response.text())
      .then((data) => {
        setTexts(data.split("#"));
      });
  };

  useEffect(() => {
    textMaker(lang);
  }, [lang]);

  return (
    <>
      <Container fluid>
        <div className="d-flex" style={{ height: "70vh" }}>
          <div
            className="rounded shadow-lg translucent p-5"
            style={{
              zIndex: 1,
              overflow: "auto",
              alignItems: "center",
            }}
          >
            {texts.map((text, index) => {
              if (index === 0) {
                //as long as the mouse hovers over the h2 the cat will be there
                return (
                  <p
                    className="display-2 text-center"
                    key={index}
                    onMouseEnter={() => setHover(true)}
                    onMouseLeave={() => setHover(false)}
                  >
                    {text}
                  </p>
                );
              } else if (index + 1 === texts.length) {
                return (
                  <div className="d-flex justify-content-center">
                    <Button
                      variant="info"
                      className=" d-flex"
                      key={index + 1}
                      onClick={() => setPicsShow(true)}
                    >
                      <small>{text}</small>
                    </Button>
                  </div>
                );
              } else {
                return (
                  <p className="lead rounded text-center" key={index}>
                    {text}
                  </p>
                );
              }
            })}
          </div>
        </div>
      </Container>

      <Fade in={hover} timeout={10000}>
        <img
          src="cat.webp"
          id="catImg"
          style={{
            zIndex: -1,
            position: "absolute",
            top: "0",
            left: "0",
            maxWidth: "100%",
            height: "100%",
          }}
        ></img>
      </Fade>
    </>
  );
};

export default ParagraphMkr;

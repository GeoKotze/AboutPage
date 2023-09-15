import { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
import ProgImg from "../components/HomePage/ProgImg";
import { TypeAnimation } from "react-type-animation";

interface Props {
  lang: string;
  page: string;
}

const HomePage = ({ lang, page }: Props) => {
  const [src, blur] = ProgImg("/slf-sm.webp", "/slf.webp");

  //Below is a hacky way to reload the text component when the language changes or the user comes back to the home page
  const [reset, setReset] = useState(false);

  useEffect(() => {
    setReset(!reset);
  }, [page, lang]);

  return (
    <>
      <Container>
        <Row>
          <Col
            sm={6}
            id="autoText"
            //Don't judge me for this. I am not proud of it but it works
            key={reset ? 1000 : 1001}
            className="text-center autoMargin"
            style={
              lang === "en" ? { maxHeight: "15vh" } : { maxHeight: "20vh" }
            }
          >
            <div className="smallWidthTxtBox">
              <TypeAnimation
                cursor={true}
                style={{
                  whiteSpace: "pre-line",
                }}
                sequence={[
                  lang === "en" ? "Hello!" : "Γεια!",
                  1000,
                  lang === "en" ? "Welcome to my \n" : "Καλώς ήρθες στο \n",
                  200,
                  lang === "en"
                    ? "Welcome to my \n Portfolio"
                    : "Καλώς ήρθες στο \n Πορτφόλιο",
                  1000,
                  lang === "en"
                    ? "Welcome to my \n Hobby"
                    : "Καλώς ήρθες στο \n Χόμπυ",
                  1000,
                  lang === "en"
                    ? "Welcome to my \n About Page"
                    : "Καλώς ήρθες στο \n About Page μου",
                ]}
                className="autoTextSize smallWidthTxt"
              ></TypeAnimation>
            </div>
          </Col>
          <Col sm={6}>
            <img
              src={src.toString()}
              className="smallWidthImg"
              style={{
                filter: blur ? "blur(20px)" : "none",
                transition: blur ? "none" : "filter 0.3s ease-out",
                width: "100%",
              }}
            />
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default HomePage;

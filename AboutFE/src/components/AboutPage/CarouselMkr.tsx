import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { Carousel, Modal, ModalHeader, Image } from "react-bootstrap";

interface Props {
  lang: string;
  picsShow: boolean;
  setPicsShow: (arg: boolean) => void;
}

const CarouselMkr = ({ lang, setPicsShow, picsShow }: Props) => {
  //TODO: Implement ProgImg in this
  const [pics, setPics] = useState<
    { key: number; path: string; name: string; nameEl: string }[]
  >([]);

  const picMkr = useCallback(async () => {
    const { data } = await axios({
      method: "GET",
      url: "/picnames",
    });
    setPics(data);
  }, []);

  useEffect(() => {
    picMkr();
  }, []);

  return (
    <Modal
      show={picsShow}
      className="transparent"
      size="xl"
      onHide={() => setPicsShow(false)}
    >
      <ModalHeader closeButton />
      <Modal.Body
        style={{
          maxHeight: "80vh",
        }}
      >
        <Carousel interval={null} indicators={false} fade>
          {pics.map((pic) => {
            return (
              <Carousel.Item
                key={pic.key}
                className="d-flex justify-content-center"
                style={{
                  maxHeight: "80vh",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <Image
                  src={`./pics/${pic.path}`}
                  alt={lang === "en" ? pic.name : pic.nameEl}
                  style={{ maxHeight: "80vh", alignSelf: "center" }}
                />
                <Carousel.Caption>
                  <h3>{lang === "en" ? pic.name : pic.nameEl}</h3>
                </Carousel.Caption>
              </Carousel.Item>
            );
          })}
        </Carousel>
      </Modal.Body>
    </Modal>
  );
};

export default CarouselMkr;

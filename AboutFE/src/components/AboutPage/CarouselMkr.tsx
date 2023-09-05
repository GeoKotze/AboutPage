import { useEffect, useState } from "react";
import { Carousel, Modal, ModalHeader, Image } from "react-bootstrap";

//TODO automate the everliving FUCK out of this
//I need to put the pics in docker volume and bind them to the nginx container so that the backend container can also access them now that i have it.
//That way i can load the filenames in an array and pass them here by making a call to the BE when the app loads
const picNames = [
  "Athens_Αθήνα",
  "Livadia_Λιβαδειά",
  "Pentalofo_Πεντάλοφο",
  "Platanistos_Πλατανιστός",
  "grove_grove",
];

interface Props {
  lang: string;
  picsShow: boolean;
  setPicsShow: (arg: boolean) => void;
}

const CarouselMkr = ({ lang, setPicsShow, picsShow }: Props) => {
  //TODO: Implement ProgImg in this
  //I initialize the pics as an empty array so that their names are dependend on the lang. probably there is a better way to do this but oh well
  const [pics, setPics] = useState<
    { key: number; path: string; caption: string }[]
  >([]);

  const picMkr = (lang: string) => {
    //The names of the photos are formated as "grName_enName" so depending on the language the caption will be the part before or after the underscore
    const picsArray: { key: number; path: string; caption: string }[] = [];
    picNames.forEach((name) => {
      //I am doing this to order them as well. The grove street one has english as the greek part too so it will always be last
      let i = 0;
      const path = `./pics/${name}.webp`;
      let caption;
      if (lang === "en") {
        if (name !== "grove_grove") {
          caption = name.split("_")[0];
        } else {
          caption = "If you know, you know";
        }
      } else {
        if (name !== "grove_grove") {
          caption = name.split("_")[1];
        } else {
          caption = "Αν ξέρεις, ξέρεις";
        }
      }
      picsArray.push({ key: i, path: path, caption: caption });
      i++;
    });
    setPics(picsArray);
  };

  useEffect(() => {
    picMkr(lang);
  }, [lang]);

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
                  src={pic.path}
                  alt={pic.caption}
                  style={{ maxHeight: "80vh", alignSelf: "center" }}
                />
                <Carousel.Caption>
                  <h3>{pic.caption}</h3>
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

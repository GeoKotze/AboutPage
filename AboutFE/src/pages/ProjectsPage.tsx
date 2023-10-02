//This will be the page that displays all the projects in a grid with cards
//It will also have a button to go to the project page and it's github repo
//It will have a picture of the project the title and a short description
//at the bottom there will be two buttons one for the github repo and one for the project page

import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { Card, Container, Row, Col } from "react-bootstrap";

interface Props {
  lang: string;
  setPage: (page: string) => void;
}

const ProjectsPage = ({ lang, setPage }: Props) => {
  //i need to initialize the projects array so that the compiler doesn't complain
  const [projects, setProjects] = useState([
    {
      title: "",
      titleEl: "",
      desc: "",
      descEl: "",
      img: "",
      url: "",
      github: "",
    },
  ]);

  const getProjects = useCallback(async () => {
    const { data } = await axios({
      method: "GET",
      url: "/projects",
    });
    setProjects(data);
  }, []);

  useEffect(() => {
    console.log("getting projects");
    getProjects();
  }, []);

  const changePage = (page: string) => {
    page === "https://geokotze.dev"
      ? setPage("home")
      : window.open(page, "_blank");
  };

  return (
    <Container>
      <Row className="text-center" style={{ paddingBottom: "3rem" }}>
        <Col>
          <h1>{lang === "en" ? "Projects" : "Έργα"}</h1>
        </Col>
      </Row>
      <Row>
        {projects.map((project) => (
          <Col xs={12} sm={6} md={4} className="justify-content-center d-flex">
            <Card>
              <Card.Img
                variant="top"
                src={project.img}
                style={{ width: "50%", margin: "auto", paddingTop: "1rem" }}
              />
              <Card.Body>
                <Card.Title>
                  {lang === "en" ? project.title : project.titleEl}
                </Card.Title>
                <Card.Text>
                  {lang === "en" ? project.desc : project.descEl}
                </Card.Text>
                <Card.Footer className="justify-content-between d-flex">
                  <img
                    src="urlBtn.svg"
                    className="btn btn-success"
                    style={{ width: "25%" }}
                    onClick={() => changePage(project.url)}
                  />
                  <img
                    src="gitBtn.svg"
                    className="btn btn-primary"
                    style={{ width: "25%" }}
                    onClick={() => changePage(project.github)}
                  ></img>
                </Card.Footer>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default ProjectsPage;

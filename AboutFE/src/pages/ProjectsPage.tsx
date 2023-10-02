import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { Card, Container, Row, Col } from "react-bootstrap";

interface Props {
  lang: string;
  setPage: (page: string) => void;
}

const ProjectsPage = ({ lang, setPage }: Props) => {
  const [projects, setProjects] = useState<
    {
      title: string;
      titleEl: string;
      desc: string;
      descEl: string;
      img: string;
      url: string;
      github: string;
    }[]
  >([]);

  const getProjects = useCallback(async () => {
    const { data } = await axios({
      method: "GET",
      url: "/projects",
    });
    setProjects(data);
  }, []);

  useEffect(() => {
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

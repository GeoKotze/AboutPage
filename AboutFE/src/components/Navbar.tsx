import {
  Row,
  Col,
  Nav,
  Navbar,
  Container,
  Dropdown,
  Offcanvas,
} from "react-bootstrap";
import Logo from "./Logo";

interface Props {
  logo: string;
  logoText: string;
  lang: string;
  languages: { [key: string]: string };
  setPage: (page: string) => void;
  setLang: (lang: string) => void;
  setOffcanvasOn: (arg: boolean) => void;
  offcanvasOn: boolean;
}

const MainNavbar = ({
  logo,
  logoText,
  lang,
  languages,
  setPage,
  setLang,
  setOffcanvasOn,
  offcanvasOn,
}: Props) => {
  return (
    <Navbar
      bg="transparent"
      expand="sm"
      style={{
        paddingBottom: "2rem",
      }}
    >
      {/*While some of these css rules may not be needed, i do not have the time to fuck around and find out currently*/}
      <Container fluid style={{ paddingRight: 0 }}>
        <Row
          style={{
            display: "flex",
            width: "100%",
          }}
        >
          {/*I'm gonna have to clean the css/class confusion in this but for now we operate on a "ain't broke don't fix it" paradigm */}
          <Col sm={2} xs={12}>
            <Row>
              <Col>
                <Navbar.Brand>
                  <Nav.Link
                    //Why use a link then? Tbh i find it safer to do what the library expects and js my way around it
                    href=""
                    onClick={(e) => {
                      e.preventDefault();
                      setPage("home");
                    }}
                    style={{
                      //Yes this is needed otherwise the links are not perfectly centered.
                      marginRight: "0",
                    }}
                  >
                    <Logo logo={logo} logoText={logoText} />
                  </Nav.Link>
                </Navbar.Brand>
              </Col>
              <Col>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "right",
                  }}
                >
                  <Navbar.Toggle
                    id="offcanvasToggle"
                    onClick={() => setOffcanvasOn(true)}
                  />
                </div>
              </Col>
            </Row>
          </Col>
          <Col sm={10} xs={0}>
            <Navbar.Offcanvas
              id="offcanvas"
              show={offcanvasOn}
              style={{
                paddingRight: 0,
                paddingLeft: 0,
              }}
              aria-labelledby={"offcanvasLabel"}
              onHide={() => {
                setOffcanvasOn(false);
              }}
              onShow={() => {
                setOffcanvasOn(true);
              }}
            >
              <Offcanvas.Header closeButton>
                <Offcanvas.Title id={"offcanvasLabel"}>
                  <Nav.Link
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setOffcanvasOn(false);
                      setPage("home");
                    }}
                    style={{
                      //Yes this is needed
                      marginRight: "0",
                    }}
                  >
                    <Logo logo={logo} logoText={logoText} />
                  </Nav.Link>
                </Offcanvas.Title>
              </Offcanvas.Header>
              <Offcanvas.Body>
                <Row
                  className="justify-content-between w-100"
                  style={{ height: "100%" }}
                >
                  <Col
                    sm={8}
                    xs={6}
                    //TODO: Not this, but at least the nav links are "centered"
                    className="d-flex justify-content-sm-center justify-content-start navAlign"
                  >
                    <Nav className="d-flex align-items-sm-center align-items-start">
                      <Nav.Link
                        href=""
                        onClick={(e) => {
                          e.preventDefault();
                          setOffcanvasOn(false);
                          setPage("about");
                        }}
                        aria-controls="offcanvasToggle"
                      >
                        {lang === "en" ? "About" : "Σχετικά"}
                      </Nav.Link>
                      <Nav.Link
                        href=""
                        onClick={(e) => {
                          e.preventDefault();
                          setOffcanvasOn(false);
                          setPage("contact");
                        }}
                        aria-controls="offcanvas"
                      >
                        {lang === "en" ? "Contact" : "Επικοινωνία"}
                      </Nav.Link>
                      <Nav.Link
                        href=""
                        onClick={(e) => {
                          e.preventDefault();
                          setOffcanvasOn(false);
                          setPage("projects");
                        }}
                        aria-controls="offcanvas"
                      >
                        {lang === "en" ? "Projects" : "Έργα"}
                      </Nav.Link>
                    </Nav>
                  </Col>
                  <Col
                    sm={2}
                    xs={6}
                    className="d-flex p-0 justify-content-sm-end justify-content-end align-items-sm-center align-items-end"
                  >
                    {/*The lang toggle. The drop if statement is meant to place it in the bottom right of it if the nav is collapsed in the burger. */}
                    <Dropdown drop={offcanvasOn ? "up-centered" : "down"}>
                      <Dropdown.Toggle variant="secondary" id="languageBtn">
                        <img
                          id={`Selected`}
                          src={`/${lang}.webp`}
                          height="20px"
                          width={"20px"}
                        ></img>
                        <label htmlFor="Selected">{languages[lang]}</label>
                      </Dropdown.Toggle>

                      <Dropdown.Menu>
                        {Object.keys(languages).map((language) => (
                          <Dropdown.Item
                            href=""
                            key={language}
                            onClick={() => {
                              setLang(language);
                              setOffcanvasOn(false);
                            }}
                          >
                            <img
                              id={language}
                              src={`/${language}.webp`}
                              height="20px"
                              width={"20px"}
                            ></img>
                            <label htmlFor={language}>
                              {languages[language]}
                            </label>
                          </Dropdown.Item>
                        ))}
                      </Dropdown.Menu>
                    </Dropdown>
                  </Col>
                </Row>
              </Offcanvas.Body>
            </Navbar.Offcanvas>
          </Col>
        </Row>
      </Container>
    </Navbar>
  );
};

export default MainNavbar;

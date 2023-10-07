import { useState, useEffect } from "react";
import { Container, TabContainer, TabContent, TabPane } from "react-bootstrap";
import MainNavbar from "./components/Navbar";

import { GoogleReCaptchaProvider } from "react-google-recaptcha-v3";

import HomePage from "./pages/HomePage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import ProjectsPage from "./pages/ProjectsPage";
import Loading from "./components/Loading";

function App() {
  const [page, setPage] = useState<string>("home");
  const [lang, setLang] = useState<string>("en");
  const [picsShow, setPicsShow] = useState<boolean>(false);
  const [offcanvasOn, setOffcanvasOn] = useState<boolean>(false);
  const [reset, setReset] = useState(false);

  //This pretty much handles the back button by modifying it's behaviour depending on the state of the app
  const onPop = (e: PopStateEvent) => {
    e.preventDefault;
    if (offcanvasOn.valueOf()) {
      setOffcanvasOn(false);
    } else if (page.toString() === "about" && picsShow.valueOf()) {
      setPicsShow(false);
    } else if (page.toString() === "home") {
      window.history.back();
    } else {
      setPage("home");
    }
  };

  //When in doubt return to js
  //these two fucnctions handle a "welcome" message animation
  const cleanUp = () => {
    const target = document.getElementById("content");

    target?.setAttribute("style", "opacity: 1");
    target?.classList.remove("fadeIn");
    target?.removeEventListener("animationed", cleanUp);
  };

  const handleAnimationEnd = () => {
    const content = document.getElementById("content");
    const greeting = document.querySelector(".fadeInAndOut");

    greeting?.setAttribute("style", "display: none");
    greeting?.classList.remove("fadeInAndOut");
    content?.classList.add("fadeIn");
    setReset(!reset);
    greeting?.removeEventListener("animationend", handleAnimationEnd);
  };

  useEffect(() => {
    window.history.pushState("home", "", "");
    window.addEventListener("popstate", onPop);

    //cleaning an event listener that is loaded with the app itself is not needed but i have it here for reference
    return () => {
      window.removeEventListener("popstate", onPop);
    };
  });

  return (
    <GoogleReCaptchaProvider
      reCaptchaKey="6LfoXDEoAAAAAKEcXUfISqSKMZQvIrbQ_7c94Ap-"
      scriptProps={{ async: true }}
    >
      <Loading lang={lang} onAnimationEnd={handleAnimationEnd}></Loading>
      <div style={{ opacity: 0 }} id="content" onAnimationEnd={cleanUp}>
        {/* Here is load the navbar with all the parameters needed to set it up */}
        <MainNavbar
          logo="/bash.svg"
          logoText="Hello World"
          lang={lang}
          languages={{ en: "English", el: "Ελληνικά" }}
          setPage={setPage}
          setLang={setLang}
          setOffcanvasOn={setOffcanvasOn}
          offcanvasOn={offcanvasOn}
        />
        {/*This is where the "page" state comes in, by updating it when a button in the nav is pressed the appropriate tab will render*/}
        <Container>
          <TabContainer activeKey={page}>
            <TabContent>
              <TabPane eventKey="home">
                <HomePage
                  lang={lang}
                  page={page}
                  reset={reset}
                  setReset={setReset}
                />
              </TabPane>
              <TabPane eventKey="about">
                <AboutPage
                  lang={lang}
                  setPicsShow={setPicsShow}
                  picsShow={picsShow}
                />
              </TabPane>
              <TabPane eventKey="contact">
                <ContactPage lang={lang} />
              </TabPane>
              <TabPane eventKey="projects">
                <ProjectsPage lang={lang} setPage={setPage} />
              </TabPane>
            </TabContent>
          </TabContainer>
        </Container>
      </div>
    </GoogleReCaptchaProvider>
  );
}

export default App;

import { Form, Button, Alert } from "react-bootstrap";
import {
  useState,
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
} from "react";
import axios from "axios";
import { useGoogleReCaptcha } from "react-google-recaptcha-v3";

interface Props {
  lang: string;
}

const ContactPage = ({ lang }: Props) => {
  const [post, setPost] = useState({
    name: "",
    company: "",
    email: "",
    message: "",
    lang: lang,
    token: "",
  });

  //This is to ensure no double submits
  const [disabled, setDisabled] = useState(false);

  //This updates the proper attribute of the object every time the user types in a field
  function handleChange(e: ChangeEvent<HTMLTextAreaElement>) {
    setPost({ ...post, [e.target.id]: e.target.value });
  }

  const { executeRecaptcha } = useGoogleReCaptcha();

  //an object that holds the state of the alert that pops up when needed
  const [showAlert, setShowAlert] = useState({
    show: false,
    code: 200,
    message: "",
  });

  const clearForm = () => {
    setPost({ ...post, name: "", email: "", company: "", message: "" });
  };

  const handleCaptcha = useCallback(async () => {
    if (!executeRecaptcha) {
      console.log("Recaptcha not yet available");
      return;
    }
    const token = await executeRecaptcha("submit");
    setPost({ ...post, token: token });
  }, [executeRecaptcha]);

  useEffect(() => {
    handleCaptcha();
  }, [handleCaptcha]);

  //This function is called when the user presses the submit button
  //e.preventDefault() is starting to become my favorite function
  const postForm = (e: FormEvent<HTMLFormElement>) => {
    setDisabled(true);
    e.preventDefault();

    let message = "";
    //in case any cheeky user tries to bypass the required attributes of the form
    //assuming that anyone that bypasses the required attributes is doing it on purpose there is a shift in tone in the alert message
    if (post.token === "") {
      if (lang === "en") {
        message = "Please pass the captcha";
      } else {
        message = "Παρακαλώ περάστε το captcha";
      }
      setShowAlert({
        show: true,
        code: 400,
        message: message,
      });
      setDisabled(false);
      return;
    } else if (post.email === "") {
      if (lang === "en") {
        message = "I'll still need your email";
      } else {
        message = "Ναι, αλλά θέλω το email σου";
      }
      setShowAlert({
        show: true,
        code: 400,
        message: message,
      });
      setDisabled(false);
      return;
    } else if (post.name === "") {
      if (lang === "en") {
        message = "It's nice to know your name";
      } else {
        message = "Δεν είναι ευγενικό να μην συστηθείς";
      }
      setShowAlert({
        show: true,
        code: 400,
        message: message,
      });
      setDisabled(false);
      return;
    } else if (post.message === "") {
      if (lang === "en") {
        message = "Without a message I can't do much";
      } else {
        message = "Αν δεν ξέρω τι θες, δεν μπορώ να σε βοηθήσω";
      }
      setShowAlert({
        show: true,
        code: 400,
        message: message,
      });
      setDisabled(false);
      return;
    }

    //This is where the magic happens
    //i had to setup a docker container with an https nodejs server just to send the email but it was a worthwhile learning experience
    //#noragerts
    let data = JSON.stringify(post);
    axios({
      method: "post",
      url: "/send",
      data: data,
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        setShowAlert({
          show: true,
          code: res.status,
          message: res.data,
        });
        // recaptchaRef.current.reset();
        setDisabled(false);
        clearForm();
      })
      .catch((err) => {
        setShowAlert({
          show: true,
          code: err.response.status,
          message: err.response.data,
        });
        clearForm();
        setDisabled(false);
      });
  };

  return (
    <>
      {/*If i ever add anothel language this will be pain*/}
      <Form onSubmit={postForm}>
        <Form.Group className="mb-3" onChange={handleChange} controlId="email">
          <Form.Label>{lang === "en" ? `Email*` : `Email*`}</Form.Label>
          <Form.Control
            value={post.email}
            required
            type="email"
            placeholder={
              lang === "en" ? "Tell me how to contact you" : "Είσαι ο / η / N/A"
            }
          />
        </Form.Group>
        <Form.Group className="mb-3" onChange={handleChange} controlId="name">
          <Form.Label>{lang === "en" ? "Name*" : "Όνομα*"}</Form.Label>
          <Form.Control
            value={post.name}
            required
            type="text"
            placeholder={
              lang === "en"
                ? "Introduce yourself, don't be rude"
                : "Και λέγεσαι"
            }
          />
        </Form.Group>
        <Form.Group
          className="mb-3"
          onChange={handleChange}
          controlId="company"
        >
          <Form.Label>{lang === "en" ? "Company" : "Εταιρία"}</Form.Label>
          <Form.Control
            value={post.company}
            type="text"
            placeholder={
              lang === "en" ? "In case you are from HR" : "Αν είσαι από το HR"
            }
          />
        </Form.Group>
        <Form.Group
          className="mb-3"
          onChange={handleChange}
          controlId="message"
        >
          <Form.Label>{lang === "en" ? "Message*" : "Μήνημα*"}</Form.Label>
          <Form.Control
            value={post.message}
            required
            as="textarea"
            rows={3}
            placeholder={
              lang === "en"
                ? "Feedback is welcome, a job offer is welcome-er"
                : "Το feedback είναι ευπρόσδεκτο, η δουλειά περισσότερο"
            }
          />
        </Form.Group>
        {/* <Form.Group>
          <ReCAPTCHA
            ref={recaptchaRef}
            sitekey="6Lf0gGUnAAAAAH-_0Aar9uen09bSCovVc8EvxEBA"
            onChange={captcha}
          />
        </Form.Group> */}
        <Button
          variant="success"
          type="submit"
          style={{ marginTop: "1vh" }}
          disabled={disabled}
        >
          {lang === "en" ? "Submit" : "Υποβολή"}
        </Button>
      </Form>

      {/*THe afformentioned alert*/}
      <Alert
        show={showAlert.show}
        variant={showAlert.code === 200 ? "success" : "danger"}
        onClose={() => setShowAlert({ ...showAlert, show: false })}
        dismissible
        style={{
          position: "fixed",
          bottom: "1vh",
          right: "1vw",
          zIndex: 100,
        }}
      >
        <p>{showAlert.message}</p>
      </Alert>
    </>
  );
};

export default ContactPage;

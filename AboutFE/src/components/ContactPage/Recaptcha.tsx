import { useCallback, useEffect } from "react";
import {
  GoogleReCaptchaProvider,
  useGoogleReCaptcha,
} from "react-google-recaptcha-v3";

interface Props {
  setPost: (arg: string) => void;
}

const Recaptcha = ({ setPost }: Props) => {
  const { executeRecaptcha } = useGoogleReCaptcha();

  const handleRecaptcha = useCallback(async () => {
    if (!executeRecaptcha) {
      console.log("Execute recaptcha not yet available");
      return;
    }

    const token = await executeRecaptcha("contact");
    setPost(token);
  }, [executeRecaptcha]);

  useEffect(() => {
    handleRecaptcha();
  }, [handleRecaptcha]);

  return (
    <GoogleReCaptchaProvider
      reCaptchaKey="6LcZ1qQaAAAAAExX6Z3Z2Z2Z2Z2Z2Z2Z2Z2Z2Z2Z"
      children={undefined}
    ></GoogleReCaptchaProvider>
  );
};

export default Recaptcha;

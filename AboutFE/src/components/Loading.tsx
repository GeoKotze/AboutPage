interface Props {
  lang: string;
  onAnimationEnd: () => void;
}

const Loading = ({ lang, onAnimationEnd }: Props) => {
  return (
    <div
      className="text-center absoluteCenter fadeInAndOut"
      onAnimationEnd={onAnimationEnd}
    >
      <span className="autoTextSize">{lang === "en" ? "Hello" : "Γειά"}</span>
    </div>
  );
};

export default Loading;

interface MultilineProps {
  text: string;
  onClick?: () => void;
  className?: string;
  lineclamp: number;
  expanded: boolean;
}

export function Multiline(props: MultilineProps) {
  return (
    <div
      className={
        `line-clamp-${props.expanded ? "none" : props.lineclamp}` +
        props.className
      }
      onClick={() => props.onClick()}>
      {props.text
        .trim()
        .split("\n")
        .map((line, i) => {
          return (
            <div key={i}>
              <p className="text-md break-words">{line}</p>
              {line === "" && <br />}
            </div>
          );
        })}
    </div>
  );
}

import { ButtonHTMLAttributes } from "react";

function Button(props: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className={`px-3 py-1 rounded-lg border border-black font-bold text-sm uppercase disabled:text-gray-500 ${props.className}`}
    />
  );
}

export default Button;

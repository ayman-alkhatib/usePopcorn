import { useState } from "react";
import { Button } from "./Button";

export function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);

  return <div className="box">
    <Button isOpen={isOpen} onClick={() => setIsOpen((open) => !open)} />
    {isOpen && children}
  </div>;

}

import React from "react";
import { Button, Card, CheckBox, Footer, Logo } from "../Components";

const layout = () => {
  return (
    <div className="home">
      <Logo /> <p>button</p> <Button />
      <p>Card</p>
      <Card />
      <p>checkbox</p>
      <CheckBox />
      <p>Footer</p>
      <Footer />
    </div>
  );
};

export default layout;

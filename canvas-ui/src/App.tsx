import "./App.css";
import React from "react";
import { useToast } from "./components/ui/use-toast";
import { useNavigate } from "react-router-dom";

function App() {
  const { toast } = useToast();

  React.useEffect(() => {}, []);

  return (
    <>
      <div className="flex">
        <div className="h-screen w-full overflow-y-auto bg-black">
          <div className="flex flex-col p-16">
            <h1 className="text-4xl font-extrabold tracking-tight lg:text-5xl">
              Canvas
            </h1>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;

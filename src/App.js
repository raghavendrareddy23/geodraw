import React from "react";
import Weather from "./components/weather";
import Canvas from "./components/canvas";
import NetworkInfo from "./components/networkInfo";

function App() {
  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 to-indigo-100 py-10 px-4">
      <h1 className="text-4xl text-center font-extrabold text-indigo-700 mb-10">
        GeoDraw App
      </h1>

      <div className="flex justify-center gap-6 flex-wrap mb-10">
        <div className="min-w-96">
          <Weather />
        </div>
        <div className="min-w-96">
          <NetworkInfo />
        </div>
      </div>

      <Canvas />
    </div>
  );
}

export default App;

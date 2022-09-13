import schwifty from "./assets/schwifty.png";

function App() {
  return (
    <div className="h-screen w-screen flex flex-col justify-center items-center bg-slate-700 text-white">
      <div className="max-w-lg flex flex-col items-center">
        <h1 className="text-4xl">Get schwifty</h1>
        <img src={schwifty} alt="Get schwifty" />
      </div>
    </div>
  );
}

export default App;

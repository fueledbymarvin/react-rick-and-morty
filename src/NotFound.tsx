import schwifty from "./assets/schwifty.png";

function NotFound() {
  return (
    <div className="h-screen w-screen flex flex-col items-center bg-slate-700 text-white">
      <div className="max-w-lg flex flex-col items-center">
        <div className="text-4xl">Page not schwifty</div>
        <img src={schwifty} alt="schwifty" />
      </div>
    </div>
  );
}

export default NotFound;

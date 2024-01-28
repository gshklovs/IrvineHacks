import openPalm from "../../assets/open_palm1.png";
import closedFist from "../../assets/closed_fist.png";

const Legend = ({ handColorIds }: { handColorIds: any[] }) => {
  return (
    <div className="z-2 w-70 absolute right-0 top-0 m-8 min-h-48 rounded-xl border-2 border-yellow-600 bg-slate-500 bg-opacity-50 p-4">
      <p className="pb-2 text-2xl text-white opacity-100">
        Draw With Your Hands
      </p>
      <p className="text-lg font-bold text-white opacity-100">
        Find your cursor:{" "}
      </p>
      <img className="right-0 m-2 inline-block h-12 invert" src={openPalm} />
      <p className="inline-block text-white opacity-100">Open Palm</p>
      <p className="text-lg font-bold text-white opacity-100">Draw: </p>
      <img className="inline-block h-16 invert" src={closedFist} />
      <p className="inline-block text-white opacity-100">Closed Fist</p>
      <p className="pb-2 text-2xl text-white opacity-100">Colors:</p>
      <div className="flex flex-row">
        <div className="my-2 h-10 w-20 rounded-lg bg-[#ef476f]" />
        <div className="mx-4 my-3 h-8 w-8 rounded-full border-2 border-neutral-100 pt-[.125rem] text-center ">
          1
        </div>
      </div>
      <div className="flex flex-row">
        <div className="my-2 h-10 w-20 rounded-lg bg-[#ffd166]" />
        <div className="mx-4 my-3 h-8 w-8 rounded-full border-2 border-neutral-100 pt-[.125rem] text-center ">
          2
        </div>
      </div>
      <div className="flex flex-row">
        <div className="my-2 h-10 w-20 rounded-lg bg-[#06d6a0]" />
        <div className="mx-4 my-3 h-8 w-8 rounded-full border-2 border-neutral-100 pt-[.125rem] text-center ">
          3
        </div>
      </div>
      <div className="flex flex-row">
        <div className="my-2 h-10 w-20 rounded-lg bg-[#06b6d4]" />
        <div className="mx-4 my-3 h-8 w-8 rounded-full border-2 border-neutral-100 pt-[.125rem] text-center ">
          4
        </div>
      </div>
      <div className="flex flex-row">
        <div className="my-2 h-10 w-20 rounded-lg bg-[#d946ef]" />
        <div className="mx-4 my-3 h-8 w-8 rounded-full border-2 border-neutral-100 pt-[.125rem] text-center ">
          {/* each i for which handColorId[i] == 5 */}
        </div>
      </div>
      <div className="flex flex-row">
        <div className="my-2 h-10 w-20 rounded-lg border bg-neutral-100">
          <p className="pt-1.5 text-center text-red-600 opacity-100">Eraser</p>
        </div>
        <div className="mx-4 my-3 h-8 w-8 rounded-full border-2 border-neutral-100 pt-[.125rem] text-center ">
          6
        </div>
      </div>
    </div>
  );
};

export default Legend;

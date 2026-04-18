import Link from "next/link";

export default function Home() {
  return (
    <div className="flex  bg-zinc-50 font-sans dark:bg-black">
      <div>
        <p className="py-5"> This is a home page.</p>

        <div>
          <Link
            href="/products"
            className="max-w-1 w-1 rounded-lg
             bg-white px-4 py-2 text-sm font-medium text-zinc-950 shadow-sm ring-1 ring-zinc-950/10 hover:bg-zinc-50 
             focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-950/10"
          >
            View Products
          </Link>
        </div>
      </div>
    </div>
  );
}

import { Button } from "@heroui/react";
import Link from "next/link";

const Home = () => {
  return (
    <main className="w-full min-h-screen flex-center">
      <Link href="/login">
        <Button>Get Started</Button>
      </Link>
    </main>
  );
};

export default Home;

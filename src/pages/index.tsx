import { type NextPage } from "next";
import Head from "next/head";
import { signIn, signOut, useSession } from "next-auth/react";

import { api } from "~/utils/api";
import { Button } from "~/components/ui/Button";
import { BiChevronRight } from "react-icons/bi";
import { Icon } from "~/components/icon";
import { env } from "~/env.mjs";
import { SlackLogo } from "~/components/slackLogo";
import { Dashboard } from "~/components/Dashboard";
const Home: NextPage = () => {
  const { data: sessionData } = useSession();
  const { data: user } = api.user.getUser.useQuery();

  return (
    <>
      <Head>
        <title>Code Cheer</title>
        <meta name="description" content="Celebrate your teams wins" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="bg-white">
        <header className="absolute inset-x-0 top-0 z-50">
          <nav
            className="flex items-center justify-between p-4 lg:px-8"
            aria-label="Global"
          >
            <div className="flex items-center lg:flex-1">
              <Icon className="h-10 w-10" />
              <p className="ml-3 text-xl font-semibold text-gray-700">
                CodeCheer
              </p>
            </div>
          </nav>
        </header>

        <div className="relative isolate pt-14">
          <div
            className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
            aria-hidden="true"
          >
            <div
              className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
              style={{
                clipPath:
                  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
              }}
            />
          </div>
          <div className="py-24 sm:py-32 lg:pb-40">
            <div className="mx-auto max-w-7xl px-6 lg:px-8">
              <div className="mx-auto max-w-2xl text-center">
                <h1 className="text-6xl font-bold tracking-tight text-gray-900 sm:text-6xl">
                  Celebrate your developer wins 🎉
                </h1>
                <p className="mt-6 text-lg leading-8 text-gray-600">
                  At the end of each day, receive a slack message with stats
                  from Linear about your day.
                </p>
              </div>
              <div className="mx-auto mt-16 flow-root max-w-2xl sm:mt-24">
                <div className="-m-2 flex min-h-[400px] items-center justify-center rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-purple-500/10 lg:-m-4 lg:rounded-2xl lg:p-4">
                  {!user ? (
                    <Button onClick={() => void signIn()}>
                      Login or Signup To Configure
                      <BiChevronRight className="ml-2 h-4 w-4" />
                    </Button>
                  ) : (
                    <Dashboard />
                  )}
                </div>
              </div>
            </div>
          </div>
          <div
            className="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]"
            aria-hidden="true"
          >
            <div
              className="relative left-[calc(50%+3rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 bg-gradient-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%+36rem)] sm:w-[72.1875rem]"
              style={{
                clipPath:
                  "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
              }}
            />
          </div>
        </div>
      </div>{" "}
    </>
  );
};

export default Home;

const AuthShowcase: React.FC = () => {
  const { data: sessionData } = useSession();

  const { data: secretMessage } = api.example.getSecretMessage.useQuery(
    undefined, // no input
    { enabled: sessionData?.user !== undefined }
  );

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <p className="text-center text-2xl text-white">
        {sessionData && <span>Logged in as {sessionData.user?.name}</span>}
        {secretMessage && <span> - {secretMessage}</span>}
      </p>
      <button
        className="rounded-full bg-white/10 px-10 py-3 font-semibold text-white no-underline transition hover:bg-white/20"
        onClick={sessionData ? () => void signOut() : () => void signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
};

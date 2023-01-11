import { useContext } from "react";
import { PageProps } from "../../lib/types";
import type { NextPage } from "next";
import Images from "../../components/workflows/outputs/images";
import Link from "next/link";
import {
  UserContext,
  UserContextType,
  AppContext,
  AppContextType,
} from "../../lib/contexts";

const C: NextPage<PageProps> = ({}) => {
  const userContext = useContext(UserContext) as UserContextType;

  return (
    <div className="mt-24 max-w-5xl mx-auto px-12">
      <h1 className="text-4xl font-bold text-center mb-16">Workflow Outputs</h1>
      {userContext.uid ? (
        <Images uid={userContext.uid} />
      ) : (
        <div className="text-center">
          <p className="text-xl">
            Please{" "}
            <Link className="underline" href="/api/auth/login">
              sign in
            </Link>{" "}
            to view your outputs
          </p>
        </div>
      )}
    </div>
  );
};

export default C;

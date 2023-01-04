import { PageProps } from "../../lib/types";
import type { NextPage } from "next";
import Images from "../../components/workflows/outputs/images";
import Link from "next/link";

const C: NextPage<PageProps> = ({ uid }) => {
  return (
    <div className="mt-24 max-w-5xl mx-auto px-12">
      <h1 className="text-4xl font-bold text-center mb-16">Workflow Outputs</h1>
      {uid ? (
        <Images uid={uid} />
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

import { PageProps } from "../../lib/types";
import type { NextPage } from "next";
import Images from "../../components/workflows/outputs/images";

const C: NextPage<PageProps> = ({ uid }) => {
  return (
    <div className="mt-24 max-w-5xl mx-auto px-12">
      <h1 className="text-4xl font-bold text-center mb-16">Workflow Outputs</h1>
      <Images uid={uid} />
    </div>
  );
};

export default C;

import React from "react";
import { Card, CardHeader, CardTitle } from "../../../components/ui/card";

const JsonPreview = ({ priorityScoring }) => {
  if (priorityScoring.attributes.length === 0) {
    return null;
  }

  return (
    <Card className="shadow-lg border-0 bg-white">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-xl">
          <div className="p-2 rounded-lg bg-gray-100 text-gray-600">
            <span className="text-sm font-mono">{}</span>
          </div>
          JSON Preview
        </CardTitle>
      </CardHeader>
      <div className="px-6 pb-6">
        <div className="bg-gray-900 rounded-xl p-6 overflow-hidden">
          <pre className="text-sm text-gray-100 overflow-auto max-h-96 font-mono leading-relaxed">
            {JSON.stringify(priorityScoring, null, 2)}
          </pre>
        </div>
      </div>
    </Card>
  );
};

export default JsonPreview;

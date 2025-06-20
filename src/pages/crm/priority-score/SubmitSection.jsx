import React from "react";
import { Card, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Send } from "lucide-react";

const SubmitSection = ({ priorityScoring, submitPriorityScoring }) => {
  if (priorityScoring.attributes.length === 0) {
    return null;
  }

  return (
    <Card className="shadow-lg border-0 bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-3 text-xl text-green-800">
          <div className="p-2 rounded-lg bg-green-100 text-green-600">
            <Send className="w-5 h-5" />
          </div>
          Submit Priority Scoring Configuration
        </CardTitle>
      </CardHeader>
      <div className="px-6 pb-6">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="flex-1">
            <div className="text-gray-700 mb-2">
              <span className="font-semibold">Ready to submit:</span>
            </div>
            <div className="flex flex-wrap gap-3">
              <div className="bg-white px-4 py-2 rounded-lg border border-green-200">
                <span className="text-sm text-gray-600">Attributes:</span>
                <span className="font-bold text-green-600 ml-1">
                  {priorityScoring.attributes.length}
                </span>
              </div>
              <div className="bg-white px-4 py-2 rounded-lg border border-green-200">
                <span className="text-sm text-gray-600">Version:</span>
                <span className="font-bold text-green-600 ml-1">
                  {priorityScoring.version}
                </span>
              </div>
            </div>
          </div>
          <Button
            onClick={submitPriorityScoring}
            size="lg"
            className="bg-green-600 hover:bg-green-700 text-white h-12 px-8 whitespace-nowrap"
          >
            <Send className="w-5 h-5 mr-2" />
            Submit Configuration
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default SubmitSection;

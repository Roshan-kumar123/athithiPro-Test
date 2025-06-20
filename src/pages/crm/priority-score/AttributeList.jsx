import React from "react";
import { Card, CardHeader, CardTitle } from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Badge } from "../../../components/ui/badge";
import { Plus, Trash2, Edit, Building } from "lucide-react";

const AttributesList = ({
  priorityScoring,
  editAttribute,
  deleteAttribute,
}) => {
  return (
    <Card className="shadow-lg border-0 bg-white">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center justify-between text-xl">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-100 text-purple-600">
              <span className="text-lg font-bold">
                {priorityScoring.attributes.length}
              </span>
            </div>
            <span>Current Attributes</span>
          </div>
          <div className="text-sm font-normal text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            Version: {priorityScoring.version}
          </div>
        </CardTitle>
      </CardHeader>
      <div className="px-6 pb-6">
        {priorityScoring.attributes.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No attributes yet
            </h3>
            <p className="text-gray-500">
              Add your first attribute to get started with priority scoring.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {priorityScoring.attributes.map((attr, index) => (
              <div
                key={attr.key}
                className="bg-gradient-to-r from-white to-gray-50 border border-gray-200 rounded-xl p-5 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {attr.label}
                      </h3>
                      <Badge variant="outline" className="text-xs">
                        #{index + 1}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 font-mono bg-gray-100 px-2 py-1 rounded inline-block">
                      {attr.key}
                    </p>

                    {/* Show organization info if available */}
                    {attr.orgName && (
                      <div className="mt-2 flex items-center text-sm text-gray-600">
                        <Building className="w-3 h-3 mr-1" />
                        <span>{attr.orgName}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button
                      onClick={() => editAttribute(attr)}
                      size="sm"
                      variant="outline"
                      className="h-9 w-9 p-0"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => deleteAttribute(attr.key)}
                      size="sm"
                      variant="destructive"
                      className="h-9 w-9 p-0"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge
                    variant="secondary"
                    className="bg-blue-100 text-blue-800 capitalize"
                  >
                    {attr.type}
                  </Badge>
                  <Badge
                    variant="outline"
                    className="text-green-700 bg-green-50 border-green-200"
                  >
                    Weight: {attr.weight}
                  </Badge>
                  {attr.rules.defaultScore !== undefined && (
                    <Badge
                      variant="outline"
                      className="text-purple-700 bg-purple-50 border-purple-200"
                    >
                      Default: {attr.rules.defaultScore}
                    </Badge>
                  )}
                </div>

                <div className="text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
                  {attr.type === "date" && (
                    <span>
                      📅 {attr.rules.ranges.length} date range
                      {attr.rules.ranges.length !== 1 ? "s" : ""} configured
                    </span>
                  )}
                  {attr.type === "enum" && (
                    <span>
                      🏷️ {Object.keys(attr.rules.values).length} enum value
                      {Object.keys(attr.rules.values).length !== 1
                        ? "s"
                        : ""}{" "}
                      defined
                    </span>
                  )}
                  {attr.type === "set" && (
                    <span>
                      📊 {attr.rules.sets.length} set
                      {attr.rules.sets.length !== 1 ? "s" : ""} configured
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Card>
  );
};

export default AttributesList;

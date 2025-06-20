import React, { useState } from "react";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { Textarea } from "../../../components/ui/textarea";
import { Badge } from "../../../components/ui/badge";
import { Separator } from "../../../components/ui/separator";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../components/ui/tabs";
import { Plus, Trash2, Edit, Send } from "lucide-react";
import { toast } from "../../../hooks/use-toast.js";

const PriorityScore = () => {
  const [priorityScoring, setPriorityScoring] = useState({
    version: "1.0.0",
    attributes: [],
  });

  const [editingAttribute, setEditingAttribute] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [currentAttribute, setCurrentAttribute] = useState({
    key: "",
    label: "",
    type: "date",
    weight: 1,
    orgId: "",
    rules: {
      ranges: [],
      values: {},
      sets: [],
      defaultScore: 0,
    },
  });

  const resetForm = () => {
    setCurrentAttribute({
      key: "",
      label: "",
      type: "date",
      weight: 1,
      orgId: "",
      rules: {
        ranges: [],
        values: {},
        sets: [],
        defaultScore: 0,
      },
    });
    setEditingAttribute(null);
    setIsEditing(false);
  };

  const validateAttribute = () => {
    if (!currentAttribute.orgId) {
      toast({
        title: "Error",
        description: "Org Id is required",
        variant: "destructive",
      });
      return false;
    }
    if (!currentAttribute.key || !currentAttribute.label) {
      toast({
        title: "Error",
        description: "Key and Label are required",
        variant: "destructive",
      });
      return false;
    }

    if (
      currentAttribute.rules.defaultScore === undefined ||
      currentAttribute.rules.defaultScore === null
    ) {
      toast({
        title: "Error",
        description: "Default Score is required",
        variant: "destructive",
      });
      return false;
    }

    // Type-specific validations
    if (
      currentAttribute.type === "date" &&
      currentAttribute.rules.ranges.length === 0
    ) {
      toast({
        title: "Error",
        description: "At least one date range is required for date type",
        variant: "destructive",
      });
      return false;
    }

    if (
      currentAttribute.type === "enum" &&
      Object.keys(currentAttribute.rules.values).length === 0
    ) {
      toast({
        title: "Error",
        description: "At least one enum value is required for enum type",
        variant: "destructive",
      });
      return false;
    }

    if (
      currentAttribute.type === "set" &&
      currentAttribute.rules.sets.length === 0
    ) {
      toast({
        title: "Error",
        description: "At least one set is required for set type",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  const addOrUpdateAttribute = () => {
    if (!validateAttribute()) {
      return;
    }

    if (isEditing && editingAttribute) {
      setPriorityScoring((prev) => ({
        ...prev,
        attributes: prev.attributes.map((attr) =>
          attr.key === editingAttribute.key ? currentAttribute : attr
        ),
      }));
      toast({
        title: "Success",
        description: "Attribute updated successfully",
      });
    } else {
      if (
        priorityScoring.attributes.some(
          (attr) => attr.key === currentAttribute.key
        )
      ) {
        toast({
          title: "Error",
          description: "Attribute key must be unique",
          variant: "destructive",
        });
        return;
      }
      setPriorityScoring((prev) => ({
        ...prev,
        attributes: [...prev.attributes, currentAttribute],
      }));
      toast({ title: "Success", description: "Attribute added successfully" });
    }
    resetForm();
  };

  const editAttribute = (attribute) => {
    setCurrentAttribute({ ...attribute });
    setEditingAttribute(attribute);
    setIsEditing(true);
  };

  const deleteAttribute = (key) => {
    setPriorityScoring((prev) => ({
      ...prev,
      attributes: prev.attributes.filter((attr) => attr.key !== key),
    }));
    toast({ title: "Success", description: "Attribute deleted successfully" });
  };

  const handleTypeChange = (value) => {
    setCurrentAttribute((prev) => ({ ...prev, type: value }));
  };

  const submitPriorityScoring = () => {
    if (priorityScoring.attributes.length === 0) {
      toast({
        title: "Error",
        description: "At least one attribute is required before submitting",
        variant: "destructive",
      });
      return;
    }

    // Here you would typically send the data to your backend
    console.log("Submitting priority scoring data:", priorityScoring);
    toast({
      title: "Success",
      description: `Priority scoring with ${priorityScoring.attributes.length} attributes submitted successfully!`,
      duration: 3000,
    });
  };

  const addRange = () => {
    setCurrentAttribute((prev) => ({
      ...prev,
      rules: {
        ...prev.rules,
        ranges: [
          ...prev.rules.ranges,
          { minDaysAgo: 0, maxDaysAgo: null, score: 0 },
        ],
      },
    }));
  };

  const updateRange = (index, field, value) => {
    setCurrentAttribute((prev) => ({
      ...prev,
      rules: {
        ...prev.rules,
        ranges: prev.rules.ranges.map((range, i) =>
          i === index ? { ...range, [field]: value } : range
        ),
      },
    }));
  };

  const removeRange = (index) => {
    setCurrentAttribute((prev) => ({
      ...prev,
      rules: {
        ...prev.rules,
        ranges: prev.rules.ranges.filter((_, i) => i !== index),
      },
    }));
  };

  const addSet = () => {
    setCurrentAttribute((prev) => ({
      ...prev,
      rules: {
        ...prev.rules,
        sets: [...prev.rules.sets, { name: "", values: [], score: 0 }],
      },
    }));
  };

  const updateSet = (index, field, value) => {
    setCurrentAttribute((prev) => ({
      ...prev,
      rules: {
        ...prev.rules,
        sets: prev.rules.sets.map((set, i) =>
          i === index ? { ...set, [field]: value } : set
        ),
      },
    }));
  };

  const removeSet = (index) => {
    setCurrentAttribute((prev) => ({
      ...prev,
      rules: {
        ...prev.rules,
        sets: prev.rules.sets.filter((_, i) => i !== index),
      },
    }));
  };

  const addEnumValue = () => {
    const key = prompt("Enter enum key:");
    const scoreStr = prompt("Enter score:");
    if (key && scoreStr) {
      const score = parseFloat(scoreStr);
      if (!isNaN(score)) {
        setCurrentAttribute((prev) => ({
          ...prev,
          rules: {
            ...prev.rules,
            values: { ...prev.rules.values, [key]: score },
          },
        }));
      }
    }
  };

  const removeEnumValue = (key) => {
    setCurrentAttribute((prev) => {
      const newValues = { ...prev.rules.values };
      delete newValues[key];
      return {
        ...prev,
        rules: {
          ...prev.rules,
          values: newValues,
        },
      };
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-sm border p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-gray-900">
                Insights & Analytics
              </h1>
              <p className="text-gray-600 mt-1">
                Data-driven insights to improve your business
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Form Section */}
          <Card className="shadow-lg border-0 bg-white">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-3 text-xl">
                <div
                  className={`p-2 rounded-lg ${
                    isEditing
                      ? "bg-blue-100 text-blue-600"
                      : "bg-green-100 text-green-600"
                  }`}
                >
                  {isEditing ? (
                    <Edit className="w-5 h-5" />
                  ) : (
                    <Plus className="w-5 h-5" />
                  )}
                </div>
                {isEditing ? "Edit Attribute" : "Add New Attribute"}
              </CardTitle>
            </CardHeader>
            <div className="px-6 pb-6">
              <div className="space-y-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="orgId"
                        className="text-sm font-medium text-gray-700"
                      >
                        Organization ID *
                      </Label>
                      <Input
                        id="orgId"
                        value={currentAttribute.orgId}
                        onChange={(e) =>
                          setCurrentAttribute((prev) => ({
                            ...prev,
                            orgId: e.target.value,
                          }))
                        }
                        placeholder="e.g., org id"
                        disabled={isEditing}
                        className="h-11"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="key"
                        className="text-sm font-medium text-gray-700"
                      >
                        Key *
                      </Label>
                      <Input
                        id="key"
                        value={currentAttribute.key}
                        onChange={(e) =>
                          setCurrentAttribute((prev) => ({
                            ...prev,
                            key: e.target.value,
                          }))
                        }
                        placeholder="e.g., lastActivity"
                        disabled={isEditing}
                        className="h-11"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="label"
                        className="text-sm font-medium text-gray-700"
                      >
                        Label *
                      </Label>
                      <Input
                        id="label"
                        value={currentAttribute.label}
                        onChange={(e) =>
                          setCurrentAttribute((prev) => ({
                            ...prev,
                            label: e.target.value,
                          }))
                        }
                        placeholder="e.g., Last Activity"
                        className="h-11"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label
                        htmlFor="type"
                        className="text-sm font-medium text-gray-700"
                      >
                        Type *
                      </Label>
                      <Select
                        value={currentAttribute.type}
                        onValueChange={handleTypeChange}
                      >
                        <SelectTrigger className="h-11">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="date">Date</SelectItem>
                          <SelectItem value="enum">Enum</SelectItem>
                          <SelectItem value="set">Set</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label
                        htmlFor="weight"
                        className="text-sm font-medium text-gray-700"
                      >
                        Weight *
                      </Label>
                      <Input
                        id="weight"
                        type="number"
                        step="0.1"
                        value={currentAttribute.weight}
                        onChange={(e) =>
                          setCurrentAttribute((prev) => ({
                            ...prev,
                            weight: parseFloat(e.target.value) || 1,
                          }))
                        }
                        className="h-11"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="defaultScore"
                      className="text-sm font-medium text-gray-700"
                    >
                      Default Score *
                    </Label>
                    <Input
                      id="defaultScore"
                      type="number"
                      step="0.1"
                      value={currentAttribute.rules.defaultScore || ""}
                      onChange={(e) =>
                        setCurrentAttribute((prev) => ({
                          ...prev,
                          rules: {
                            ...prev.rules,
                            defaultScore: parseFloat(e.target.value) || 0,
                          },
                        }))
                      }
                      required
                      className="h-11"
                    />
                  </div>
                </div>

                <Separator className="my-6" />

                {/* Rules Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Configuration Rules
                  </h3>
                  <Tabs value={currentAttribute.type} className="w-full">
                    <TabsList className="grid grid-cols-3 w-full h-11 bg-gray-100">
                      <TabsTrigger
                        value="date"
                        disabled={currentAttribute.type !== "date"}
                        className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
                      >
                        Date Rules
                      </TabsTrigger>
                      <TabsTrigger
                        value="enum"
                        disabled={currentAttribute.type !== "enum"}
                        className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
                      >
                        Enum Rules
                      </TabsTrigger>
                      <TabsTrigger
                        value="set"
                        disabled={currentAttribute.type !== "set"}
                        className="data-[state=active]:bg-white data-[state=active]:shadow-sm"
                      >
                        Set Rules
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="date" className="space-y-4 mt-6">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium text-gray-700">
                          Date Ranges *
                        </Label>
                        <Button
                          onClick={addRange}
                          size="sm"
                          variant="outline"
                          className="h-9"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Range
                        </Button>
                      </div>
                      {currentAttribute.rules.ranges.length === 0 && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                          <p className="text-sm text-red-600">
                            At least one date range is required
                          </p>
                        </div>
                      )}
                      <div className="space-y-3">
                        {currentAttribute.rules.ranges.map((range, index) => (
                          <div
                            key={index}
                            className="bg-gray-50 border border-gray-200 rounded-lg p-4"
                          >
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
                              <div className="space-y-1">
                                <Label className="text-xs text-gray-600">
                                  Min Days Ago
                                </Label>
                                <Input
                                  type="number"
                                  placeholder="0"
                                  value={range.minDaysAgo}
                                  onChange={(e) =>
                                    updateRange(
                                      index,
                                      "minDaysAgo",
                                      parseInt(e.target.value) || 0
                                    )
                                  }
                                  className="h-10"
                                />
                              </div>
                              <div className="space-y-1">
                                <Label className="text-xs text-gray-600">
                                  Max Days Ago
                                </Label>
                                <Input
                                  type="number"
                                  placeholder="Optional"
                                  value={range.maxDaysAgo || ""}
                                  onChange={(e) =>
                                    updateRange(
                                      index,
                                      "maxDaysAgo",
                                      e.target.value
                                        ? parseInt(e.target.value)
                                        : null
                                    )
                                  }
                                  className="h-10"
                                />
                              </div>
                              <div className="space-y-1">
                                <Label className="text-xs text-gray-600">
                                  Score
                                </Label>
                                <Input
                                  type="number"
                                  step="0.1"
                                  placeholder="0.0"
                                  value={range.score}
                                  onChange={(e) =>
                                    updateRange(
                                      index,
                                      "score",
                                      parseFloat(e.target.value) || 0
                                    )
                                  }
                                  className="h-10"
                                />
                              </div>
                              <Button
                                onClick={() => removeRange(index)}
                                size="sm"
                                variant="destructive"
                                className="h-10"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </TabsContent>

                    <TabsContent value="enum" className="space-y-4 mt-6">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium text-gray-700">
                          Enum Values *
                        </Label>
                        <Button
                          onClick={addEnumValue}
                          size="sm"
                          variant="outline"
                          className="h-9"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Value
                        </Button>
                      </div>
                      {Object.keys(currentAttribute.rules.values).length ===
                        0 && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                          <p className="text-sm text-red-600">
                            At least one enum value is required
                          </p>
                        </div>
                      )}
                      <div className="space-y-2">
                        {Object.entries(currentAttribute.rules.values).map(
                          ([key, score]) => (
                            <div
                              key={key}
                              className="flex items-center justify-between p-4 bg-gray-50 border border-gray-200 rounded-lg"
                            >
                              <span className="font-medium text-gray-900">
                                {key}
                              </span>
                              <div className="flex items-center gap-3">
                                <Badge
                                  variant="secondary"
                                  className="bg-blue-100 text-blue-800"
                                >
                                  Score: {score}
                                </Badge>
                                <Button
                                  onClick={() => removeEnumValue(key)}
                                  size="sm"
                                  variant="destructive"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </TabsContent>

                    <TabsContent value="set" className="space-y-4 mt-6">
                      <div className="flex items-center justify-between">
                        <Label className="text-sm font-medium text-gray-700">
                          Sets *
                        </Label>
                        <Button
                          onClick={addSet}
                          size="sm"
                          variant="outline"
                          className="h-9"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Add Set
                        </Button>
                      </div>
                      {currentAttribute.rules.sets.length === 0 && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                          <p className="text-sm text-red-600">
                            At least one set is required
                          </p>
                        </div>
                      )}
                      <div className="space-y-4">
                        {currentAttribute.rules.sets.map((set, index) => (
                          <div
                            key={index}
                            className="bg-gray-50 border border-gray-200 rounded-lg p-4 space-y-3"
                          >
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
                              <div className="space-y-1 md:col-span-2">
                                <Label className="text-xs text-gray-600">
                                  Set Name
                                </Label>
                                <Input
                                  placeholder="Set name"
                                  value={set.name}
                                  onChange={(e) =>
                                    updateSet(index, "name", e.target.value)
                                  }
                                  className="h-10"
                                />
                              </div>
                              <div className="flex gap-2">
                                <div className="space-y-1 flex-1">
                                  <Label className="text-xs text-gray-600">
                                    Score
                                  </Label>
                                  <Input
                                    type="number"
                                    step="0.1"
                                    placeholder="0.0"
                                    value={set.score}
                                    onChange={(e) =>
                                      updateSet(
                                        index,
                                        "score",
                                        parseFloat(e.target.value) || 0
                                      )
                                    }
                                    className="h-10"
                                  />
                                </div>
                                <Button
                                  onClick={() => removeSet(index)}
                                  size="sm"
                                  variant="destructive"
                                  className="h-10 mt-5"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs text-gray-600">
                                Values (one per line)
                              </Label>
                              <Textarea
                                placeholder="Enter values, one per line"
                                value={set.values.join("\n")}
                                onChange={(e) =>
                                  updateSet(
                                    index,
                                    "values",
                                    e.target.value
                                      .split("\n")
                                      .filter((v) => v.trim())
                                  )
                                }
                                rows={3}
                                className="resize-none"
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    </TabsContent>
                  </Tabs>
                </div>

                <Separator className="my-6" />

                {/* Action Buttons */}
                <div className="flex gap-3">
                  <Button
                    onClick={addOrUpdateAttribute}
                    className="flex-1 h-11 bg-blue-600 hover:bg-blue-700"
                  >
                    {isEditing ? "Update Attribute" : "Add Attribute"}
                  </Button>
                  {isEditing && (
                    <Button
                      onClick={resetForm}
                      variant="outline"
                      className="h-11 px-6"
                    >
                      Cancel
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* Attributes List */}
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
                    Add your first attribute to get started with priority
                    scoring.
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
                            {attr.rules.ranges.length !== 1 ? "s" : ""}{" "}
                            configured
                          </span>
                        )}
                        {attr.type === "enum" && (
                          <span>
                            🏷️ {Object.keys(attr.rules.values).length} enum
                            value
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
        </div>

        {/* Submit Section */}
        {priorityScoring.attributes.length > 0 && (
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
        )}

        {/* JSON Preview */}
        {priorityScoring.attributes.length > 0 && (
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
        )}
      </div>
    </div>
  );
};

export default PriorityScore;

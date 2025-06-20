import React, { useState, useEffect, useRef } from "react";
import { Card, CardHeader, CardTitle } from "../../../components/ui/card";
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
import {
  Plus,
  Trash2,
  Edit,
  Search,
  Loader2,
  Building,
  Mail,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  searchOrganizations,
  fetchPriorityScoreByOrgId,
} from "../../../store/slices/organizations/organizationThunk";
import {
  clearSearchResults,
  clearPriorityScoreData,
} from "../../../store/slices/organizations/organizationsSlice";
import { useDebounce } from "../../../hooks/useDebounce";
import SearchResults from "./components/SearchResults";
// import { usePriorityScore } from "./usePriorityScore";

const AttributeForm = ({
  currentAttribute,
  setCurrentAttribute,
  isEditing,
  handleTypeChange,
  addOrUpdateAttribute,
  resetForm,
  addRange,
  updateRange,
  removeRange,
  startAddingEnumValue,
  cancelAddingEnumValue,
  confirmAddEnumValue,
  removeEnumValue,
  newEnumValue,
  setNewEnumValue,
  isAddingEnumValue,
  addSet,
  updateSet,
  removeSet,
  setPriorityScoring,
  isUpdating,
}) => {
  const dispatch = useDispatch();
  const {
    searchResults,
    isLoading,
    priorityScoreData,
    isPriorityScoreLoading,
  } = useSelector((state) => state.organizations);

  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef(null);

  // Effect for search
  useEffect(() => {
    if (debouncedSearchTerm && debouncedSearchTerm.trim().length > 0) {
      dispatch(searchOrganizations(debouncedSearchTerm));
      if (!currentAttribute.orgId) {
        setShowResults(true);
      }
    } else {
      dispatch(clearSearchResults());
      setShowResults(false);
    }
  }, [debouncedSearchTerm, dispatch, currentAttribute.orgId]);

  // Effect to handle clicking outside of search results
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [searchRef]);

  // Effect to update priority scoring when data is loaded
  useEffect(() => {
    if (priorityScoreData && priorityScoreData.attributes) {
      setPriorityScoring({
        version: priorityScoreData.version || "1.0.0",
        attributes: priorityScoreData.attributes.map((attr) => ({
          ...attr,
          orgId: priorityScoreData.orgId,
          orgName: currentAttribute.orgName,
          orgEmail: currentAttribute.orgEmail,
        })),
      });
    }
  }, [
    priorityScoreData,
    currentAttribute.orgName,
    currentAttribute.orgEmail,
    setPriorityScoring,
  ]);

  // Handle organization selection
  const handleOrgSelect = (org) => {
    // Immediately set showResults to false
    setShowResults(false);

    // Update search term and current attribute
    setSearchTerm("");
    setCurrentAttribute((prev) => ({
      ...prev,
      orgId: org.orgId,
      orgName: org.agencyName,
      orgEmail: org.email,
    }));

    // Fetch priority score data for this organization
    dispatch(fetchPriorityScoreByOrgId(org.orgId));
  };

  // Clear organization data
  const clearOrgData = () => {
    setCurrentAttribute((prev) => ({
      ...prev,
      orgId: "",
      orgName: "",
      orgEmail: "",
    }));
    setSearchTerm("");
    dispatch(clearPriorityScoreData());
    setPriorityScoring({
      version: "1.0.0",
      attributes: [],
    });
  };

  return (
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
              <div className="space-y-2 relative" ref={searchRef}>
                <Label
                  htmlFor="orgSearch"
                  className="text-sm font-medium text-gray-700"
                >
                  Agency Name *
                </Label>
                <div className="relative">
                  <Input
                    id="orgSearch"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search for agency..."
                    disabled={isEditing || currentAttribute.orgId}
                    className="h-11 pl-10"
                  />
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 text-gray-400 animate-spin" />
                    ) : (
                      <Search className="h-4 w-4 text-gray-400" />
                    )}
                  </div>

                  {/* Clear button when agency is selected */}
                  {currentAttribute.orgId && !isEditing && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearOrgData}
                        className="h-7 w-7 p-0"
                      >
                        <Trash2 className="h-4 w-4 text-gray-500" />
                      </Button>
                    </div>
                  )}
                </div>

                {showResults && !currentAttribute.orgId && (
                  <SearchResults
                    results={searchResults}
                    isLoading={isLoading}
                    onSelect={handleOrgSelect}
                    searchTerm={searchTerm}
                  />
                )}
              </div>
            </div>

            {/* Agency details fields - show only when agency is selected */}
            {currentAttribute.orgId && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                <div className="space-y-2">
                  <Label className="text-xs text-gray-600 flex items-center">
                    <Building className="w-3.5 h-3.5 mr-1" />
                    Agency Name
                  </Label>
                  <Input
                    value={currentAttribute.orgName}
                    readOnly
                    disabled
                    className="h-10 bg-gray-50 text-gray-700"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-xs text-gray-600 flex items-center">
                    <Mail className="w-3.5 h-3.5 mr-1" />
                    Email
                  </Label>
                  <Input
                    value={currentAttribute.orgEmail}
                    readOnly
                    disabled
                    className="h-10 bg-gray-50 text-gray-700"
                  />
                </div>
              </div>
            )}

            {isPriorityScoreLoading && (
              <div className="p-2 bg-blue-50 rounded-md">
                <div className="flex items-center justify-center">
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  <span className="text-sm">
                    Loading priority score data...
                  </span>
                </div>
              </div>
            )}

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
                                e.target.value ? parseInt(e.target.value) : null
                              )
                            }
                            className="h-10"
                          />
                        </div>
                        <div className="space-y-1">
                          <Label className="text-xs text-gray-600">Score</Label>
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
                    onClick={startAddingEnumValue}
                    size="sm"
                    variant="outline"
                    className="h-9"
                    disabled={isAddingEnumValue}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Value
                  </Button>
                </div>

                {(!currentAttribute.rules.values ||
                  Object.keys(currentAttribute.rules.values).length === 0) &&
                  !isAddingEnumValue && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <p className="text-sm text-red-600">
                        At least one enum value is required
                      </p>
                    </div>
                  )}

                <div className="space-y-3">
                  {/* Add new enum value form */}
                  {isAddingEnumValue && (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-gray-700">
                            Key *
                          </Label>
                          <Input
                            placeholder="Enter key..."
                            value={newEnumValue.key}
                            onChange={(e) =>
                              setNewEnumValue((prev) => ({
                                ...prev,
                                key: e.target.value,
                              }))
                            }
                            className="h-10"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label className="text-sm font-medium text-gray-700">
                            Value *
                          </Label>
                          <Input
                            type="number"
                            step="0.1"
                            placeholder="Enter numeric value..."
                            value={newEnumValue.value}
                            onChange={(e) =>
                              setNewEnumValue((prev) => ({
                                ...prev,
                                value: e.target.value,
                              }))
                            }
                            className="h-10"
                          />
                        </div>
                      </div>

                      <div className="flex gap-3 mt-4 pt-3 border-t border-gray-200">
                        <Button
                          onClick={confirmAddEnumValue}
                          size="sm"
                          className="h-10 bg-blue-600 hover:bg-blue-700 text-white font-medium px-6"
                        >
                          Add
                        </Button>
                        <Button
                          onClick={cancelAddingEnumValue}
                          size="sm"
                          variant="outline"
                          className="h-10 border-gray-300 hover:bg-gray-50 font-medium px-6"
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Existing enum values */}
                  {currentAttribute.rules.values &&
                    Object.entries(currentAttribute.rules.values).map(
                      ([key, score]) => (
                        <div
                          key={key}
                          className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-6">
                              <div className="flex flex-col">
                                <Label className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">
                                  Key
                                </Label>
                                <span className="text-sm font-semibold text-gray-900">
                                  {key}
                                </span>
                              </div>
                              <div className="flex flex-col">
                                <Label className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">
                                  Value
                                </Label>
                                <span className="text-sm font-semibold text-gray-900">
                                  {score}
                                </span>
                              </div>
                              <div className="flex flex-col">
                                <Label className="text-xs text-gray-500 uppercase tracking-wide font-medium mb-1">
                                  Score
                                </Label>
                                <Badge
                                  variant="secondary"
                                  className="bg-blue-50 text-blue-700 border border-blue-200 font-medium w-fit"
                                >
                                  {score}
                                </Badge>
                              </div>
                            </div>
                            <Button
                              onClick={() => removeEnumValue(key)}
                              size="sm"
                              variant="destructive"
                              className="h-9 w-9 p-0 hover:bg-red-600"
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
                              e.target.value.split("\n").filter((v) => v.trim())
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
              disabled={isUpdating}
              className="flex-1 h-11 bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
            >
              {isUpdating ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  {isEditing ? "Updating..." : "Adding..."}
                </>
              ) : (
                <>{isEditing ? "Update Attribute" : "Add Attribute"}</>
              )}
            </Button>
            {isEditing && (
              <Button
                onClick={resetForm}
                variant="outline"
                className="h-11 px-6"
                disabled={isUpdating}
              >
                Cancel
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default AttributeForm;

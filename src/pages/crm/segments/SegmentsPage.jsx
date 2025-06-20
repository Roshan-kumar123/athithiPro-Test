import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../../components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import { Badge } from "../../../components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { Users, Filter, Tag, Calendar } from "lucide-react";
import { toast } from "sonner";

const SegmentsPage = () => {
  const navigate = useNavigate();
  const { leads, isOffline } = useSelector((state) => state.crm);
  const [cohorts, setCohorts] = useState([]);
  const [activeCohort, setActiveCohort] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDestination, setFilterDestination] = useState("");
  const [filterBudget, setFilterBudget] = useState("");
  const [filterTags, setFilterTags] = useState([]);

  // Get all unique destinations from leads
  const destinations = Array.from(
    new Set(
      leads
        .filter((lead) => lead.preferences?.destination)
        .map((lead) => lead.preferences?.destination)
    )
  ).filter(Boolean);

  // Get all unique tags from leads
  const allTags = Array.from(
    new Set(leads.flatMap((lead) => lead.tags))
  ).sort();

  // Budget ranges
  const budgetRanges = [
    { label: "Any Budget", value: "any" },
    { label: "Budget (< $3,000)", value: "budget" },
    { label: "Mid-Range ($3,000-$7,000)", value: "mid-range" },
    { label: "Luxury (> $7,000)", value: "luxury" },
  ];

  // Generate cohorts from leads (simplified version without AI utility)
  const generateCohorts = (leads) => {
    // Group leads by tags
    const tagGroups = {};
    leads.forEach((lead) => {
      lead.tags?.forEach((tag) => {
        if (!tagGroups[tag]) {
          tagGroups[tag] = {
            id: `cohort-${tag}`,
            name: `${tag.charAt(0).toUpperCase()}${tag.slice(1)} Travelers`,
            description: `Leads interested in ${tag} travel experiences`,
            leadIds: [],
            tags: [tag],
          };
        }
        tagGroups[tag].leadIds.push(lead.id);
      });
    });

    // Also create cohorts by budget ranges
    const budgetCohorts = {};
    leads.forEach((lead) => {
      if (lead.budget) {
        let range;
        if (lead.budget < 3000) range = "budget";
        else if (lead.budget <= 7000) range = "mid-range";
        else range = "luxury";

        if (!budgetCohorts[range]) {
          budgetCohorts[range] = {
            id: `cohort-${range}`,
            name: `${range.charAt(0).toUpperCase()}${range.slice(1)} Travelers`,
            description: `Leads with ${range} budget preferences`,
            leadIds: [],
            tags: [range],
          };
        }
        budgetCohorts[range].leadIds.push(lead.id);
      }
    });

    // Combine all cohorts and filter those with at least 2 leads
    return [
      ...Object.values(tagGroups),
      ...Object.values(budgetCohorts),
    ].filter((cohort) => cohort.leadIds.length >= 2);
  };

  // Generate cohorts when leads change
  useEffect(() => {
    if (leads.length > 0) {
      const generatedCohorts = generateCohorts(leads);
      setCohorts(generatedCohorts);
    }
  }, [leads]);

  // Filter cohorts based on search term
  const filteredCohorts = cohorts.filter(
    (cohort) =>
      cohort.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cohort.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cohort.tags.some((tag) =>
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      )
  );

  // Function to filter leads that belong to a cohort
  const getLeadsForCohort = (cohort) => {
    let filteredLeads = leads.filter((lead) =>
      cohort.leadIds.includes(lead.id)
    );

    if (filterDestination && filterDestination !== "all") {
      filteredLeads = filteredLeads.filter(
        (lead) => lead.preferences?.destination === filterDestination
      );
    }

    if (filterBudget && filterBudget !== "any") {
      filteredLeads = filteredLeads.filter((lead) => {
        if (!lead.budget) return false;

        switch (filterBudget) {
          case "budget":
            return lead.budget < 3000;
          case "mid-range":
            return lead.budget >= 3000 && lead.budget <= 7000;
          case "luxury":
            return lead.budget > 7000;
          default:
            return true;
        }
      });
    }

    if (filterTags.length > 0) {
      filteredLeads = filteredLeads.filter((lead) =>
        filterTags.some((tag) => lead.tags.includes(tag))
      );
    }

    return filteredLeads;
  };

  // Handle clicking on a cohort
  const handleCohortClick = (cohort) => {
    setActiveCohort(cohort);
  };

  // Reset all filters
  const resetFilters = () => {
    setFilterDestination("");
    setFilterBudget("");
    setFilterTags([]);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Segments</h1>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={resetFilters}
            disabled={
              !filterDestination && !filterBudget && filterTags.length === 0
            }
          >
            Reset Filters
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left sidebar with cohorts list */}
        <div className="md:col-span-4 lg:col-span-3 space-y-4">
          <div className="flex items-center space-x-2">
            <Input
              placeholder="Search segments..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1"
            />
          </div>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Users className="mr-2 h-5 w-5" /> Available Segments
              </CardTitle>
              <CardDescription>AI-generated customer segments</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
              <div className="divide-y">
                {filteredCohorts.length > 0 ? (
                  filteredCohorts.map((cohort) => (
                    <button
                      key={cohort.id}
                      className={`w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors ${
                        activeCohort?.id === cohort.id ? "bg-[#9b87f5]/10" : ""
                      }`}
                      onClick={() => handleCohortClick(cohort)}
                    >
                      <div className="font-medium">{cohort.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {cohort.leadIds.length} leads
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {cohort.tags.map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="text-xs"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="p-4 text-center text-muted-foreground">
                    No segments found
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main content area */}
        <div className="md:col-span-8 lg:col-span-9 space-y-6">
          {/* Filters */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Filter className="mr-2 h-5 w-5" /> Filter Options
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">
                    Destination
                  </label>
                  <Select
                    value={filterDestination}
                    onValueChange={setFilterDestination}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All destinations" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All destinations</SelectItem>
                      {destinations.map((destination) => (
                        <SelectItem key={destination} value={destination}>
                          {destination}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">
                    Budget Range
                  </label>
                  <Select value={filterBudget} onValueChange={setFilterBudget}>
                    <SelectTrigger>
                      <SelectValue placeholder="Any budget" />
                    </SelectTrigger>
                    <SelectContent>
                      {budgetRanges.map((range) => (
                        <SelectItem key={range.value} value={range.value}>
                          {range.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-1 block">Tags</label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start"
                      >
                        <Tag className="mr-2 h-4 w-4" />
                        {filterTags.length
                          ? `${filterTags.length} selected`
                          : "Select tags"}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-[200px]">
                      {allTags.map((tag) => (
                        <DropdownMenuItem
                          key={tag}
                          onClick={(e) => {
                            e.preventDefault();
                            setFilterTags((current) =>
                              current.includes(tag)
                                ? current.filter((t) => t !== tag)
                                : [...current, tag]
                            );
                          }}
                        >
                          <div className="flex items-center space-x-2">
                            <input
                              type="checkbox"
                              checked={filterTags.includes(tag)}
                              readOnly
                              className="form-checkbox h-4 w-4"
                            />
                            <span>{tag}</span>
                          </div>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              {/* Show selected tag badges */}
              {filterTags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {filterTags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="cursor-pointer"
                      onClick={() =>
                        setFilterTags((current) =>
                          current.filter((t) => t !== tag)
                        )
                      }
                    >
                      {tag} ×
                    </Badge>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Cohort Details */}
          {activeCohort ? (
            <Card>
              <CardHeader>
                <CardTitle>{activeCohort.name}</CardTitle>
                <CardDescription>{activeCohort.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="leads">
                  <TabsList className="mb-4">
                    <TabsTrigger value="leads">
                      Leads ({getLeadsForCohort(activeCohort).length})
                    </TabsTrigger>
                    <TabsTrigger value="insights">Insights</TabsTrigger>
                  </TabsList>

                  <TabsContent value="leads">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Name</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Budget</TableHead>
                          <TableHead>Travel Date</TableHead>
                          <TableHead>Return Customer</TableHead>
                          <TableHead></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {getLeadsForCohort(activeCohort).length > 0 ? (
                          getLeadsForCohort(activeCohort).map((lead) => (
                            <TableRow key={lead.id}>
                              <TableCell>
                                <div className="font-medium">{lead.name}</div>
                                <div className="text-sm text-muted-foreground">
                                  {lead.email}
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline">{lead.status}</Badge>
                              </TableCell>
                              <TableCell>
                                ${lead.budget?.toLocaleString() || "N/A"}
                              </TableCell>
                              <TableCell>
                                {lead.travelDates?.start
                                  ? new Date(
                                      lead.travelDates.start
                                    ).toLocaleDateString()
                                  : "N/A"}
                              </TableCell>
                              <TableCell>
                                {lead.isReturnCustomer ? (
                                  <Badge variant="secondary">
                                    Return Customer
                                  </Badge>
                                ) : (
                                  "New Customer"
                                )}
                              </TableCell>
                              <TableCell>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() =>
                                    navigate(`/crm/leads/${lead.id}`)
                                  }
                                >
                                  View
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        ) : (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center">
                              No leads match the current filters.
                            </TableCell>
                          </TableRow>
                        )}
                      </TableBody>
                    </Table>
                  </TabsContent>

                  <TabsContent value="insights">
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">
                              Average Budget
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">
                              $
                              {Math.round(
                                getLeadsForCohort(activeCohort).reduce(
                                  (sum, lead) => sum + (lead.budget || 0),
                                  0
                                ) /
                                  Math.max(
                                    getLeadsForCohort(activeCohort).length,
                                    1
                                  )
                              )}
                            </div>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">
                              Return Customers
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">
                              {
                                getLeadsForCohort(activeCohort).filter(
                                  (lead) => lead.isReturnCustomer
                                ).length
                              }
                            </div>
                          </CardContent>
                        </Card>

                        <Card>
                          <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">
                              Average Priority
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="text-2xl font-bold">
                              {(
                                (getLeadsForCohort(activeCohort).reduce(
                                  (sum, lead) => sum + lead.aiPriorityScore,
                                  0
                                ) /
                                  Math.max(
                                    getLeadsForCohort(activeCohort).length,
                                    1
                                  )) *
                                  100 || 0
                              ).toFixed(0)}
                              %
                            </div>
                          </CardContent>
                        </Card>
                      </div>

                      <Card>
                        <CardHeader>
                          <CardTitle className="text-lg">
                            Popular Travel Dates
                          </CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="flex items-center">
                            <Calendar className="h-5 w-5 text-muted-foreground mr-2" />
                            <div>
                              Most leads in this segment are traveling in{" "}
                              <span className="font-medium">
                                {new Date().toLocaleString("default", {
                                  month: "long",
                                })}
                              </span>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-16 text-center">
                <Users className="h-16 w-16 text-muted-foreground mb-4" />
                <h3 className="text-lg font-medium">No segment selected</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Select a segment from the list to view details
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default SegmentsPage;

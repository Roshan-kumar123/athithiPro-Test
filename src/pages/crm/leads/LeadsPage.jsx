import { useState, useEffect, useCallback } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { debounce } from "lodash"; // Add lodash for debouncing

import {
  User,
  Plus,
  List,
  LayoutGrid,
  Filter,
  ArrowUpDown,
  FilePlus,
  FileText,
  AlertTriangle,
} from "lucide-react";
import { Button } from "../../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Input } from "../../../components/ui/input";
import { Badge } from "../../../components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../components/ui/tabs";
import { Separator } from "../../../components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import LeadListView from "./LeadListView";
import LeadKanbanView from "./LeadKanbanView";
import BulkUploadModal from "./BulkUploadModal";
import { getAllLeadsWithSearchFilter } from "../../../store/slices/leads/leadThunk";
import { toast } from "sonner";
import { LeadStatus } from "../../../store/slices/leads/leadSlice";

const LeadsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const [searchParams] = useSearchParams();

  // Filter and search states
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [isOffline, setIsOffline] = useState(false);
  const [leadViewMode, setLeadViewMode] = useState("list");

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Sorting states
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortOrder, setSortOrder] = useState("desc");

  // Get leads from Redux store
  const { leads, loading, error, pagination } = useSelector(
    (state) => state.leads
  );

  // Add phone number filter from URL params
  const phoneNumberFilter = searchParams.get("phoneNumber");

  // Function to fetch leads with current filters
  const fetchFilteredLeads = useCallback(() => {
    const searchFilter = {
      page: currentPage,
      limit: itemsPerPage,
      search: searchTerm,
      status: statusFilter,
      sortBy: sortBy,
      sortOrder: sortOrder,
    };

    // Add phone number filter if present
    if (phoneNumberFilter) {
      searchFilter.phoneNumber = phoneNumberFilter;
    }

    dispatch(getAllLeadsWithSearchFilter(searchFilter));
  }, [
    dispatch,
    currentPage,
    itemsPerPage,
    searchTerm,
    statusFilter,
    sortBy,
    sortOrder,
    phoneNumberFilter,
  ]);

  // Apply debouncing to search
  const debouncedSearch = useCallback(
    debounce((term) => {
      setCurrentPage(1);
      const searchFilter = {
        page: 1,
        limit: itemsPerPage,
        search: term,
        status: statusFilter,
        sortBy: sortBy,
        sortOrder: sortOrder,
      };

      // Add phone number filter if present
      if (phoneNumberFilter) {
        searchFilter.phoneNumber = phoneNumberFilter;
      }

      dispatch(getAllLeadsWithSearchFilter(searchFilter));
    }, 2000),
    [dispatch, itemsPerPage, statusFilter, sortBy, sortOrder, phoneNumberFilter]
  );

  // Handle search input change with debounce
  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    debouncedSearch(term);
  };

  // Handle status filter change
  const handleStatusFilterChange = (status) => {
    setStatusFilter(status);
    setCurrentPage(1);

    const searchFilter = {
      page: 1,
      limit: itemsPerPage,
      search: searchTerm,
      status: status,
      sortBy: sortBy,
      sortOrder: sortOrder,
    };

    // Add phone number filter if present
    if (phoneNumberFilter) {
      searchFilter.phoneNumber = phoneNumberFilter;
    }

    dispatch(getAllLeadsWithSearchFilter(searchFilter));
  };

  // Handle sort change
  const handleSortChange = (newSortBy) => {
    const newSortOrder =
      sortBy === newSortBy && sortOrder === "asc" ? "desc" : "asc";
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
    setCurrentPage(1);

    const searchFilter = {
      page: 1,
      limit: itemsPerPage,
      search: searchTerm,
      status: statusFilter,
      sortBy: newSortBy,
      sortOrder: newSortOrder,
    };

    // Add phone number filter if present
    if (phoneNumberFilter) {
      searchFilter.phoneNumber = phoneNumberFilter;
    }

    dispatch(getAllLeadsWithSearchFilter(searchFilter));
  };

  // Handle tab change
  const handleTabChange = (tabValue) => {
    const status = tabValue === "all" ? "all" : tabValue;
    setStatusFilter(status);
    setCurrentPage(1);

    const searchFilter = {
      page: 1,
      limit: itemsPerPage,
      search: searchTerm,
      status: status,
      sortBy: sortBy,
      sortOrder: sortOrder,
    };

    // Add phone number filter if present
    if (phoneNumberFilter) {
      searchFilter.phoneNumber = phoneNumberFilter;
    }

    dispatch(getAllLeadsWithSearchFilter(searchFilter));
  };

  // Initial fetch on component mount or location change
  useEffect(() => {
    fetchFilteredLeads();
  }, [location.key, fetchFilteredLeads]);

  // Handle page change
  const handlePageChange = (newPage) => {
    setCurrentPage(newPage);
    const searchFilter = {
      page: newPage,
      limit: itemsPerPage,
      search: searchTerm,
      status: statusFilter,
      sortBy: sortBy,
      sortOrder: sortOrder,
    };

    // Add phone number filter if present
    if (phoneNumberFilter) {
      searchFilter.phoneNumber = phoneNumberFilter;
    }

    dispatch(getAllLeadsWithSearchFilter(searchFilter));
  };

  // Handle view mode change
  const handleViewModeChange = (mode) => {
    setLeadViewMode(mode);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Leads {phoneNumberFilter && `for ${phoneNumberFilter}`}
          </h1>
          <p className="text-muted-foreground">
            {phoneNumberFilter
              ? `Showing leads associated with ${phoneNumberFilter}`
              : "Manage and track your potential clients"}
          </p>
          {phoneNumberFilter && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate("/crm/leads")}
              className="mt-2"
            >
              Clear Phone Filter
            </Button>
          )}
        </div>

        <div className="flex gap-2">
          <Button
            disabled={isOffline}
            onClick={() => navigate("/crm/leads/new")}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Lead
          </Button>

          <BulkUploadModal />
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center">
        <div className="relative w-full md:w-96">
          <User className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
          <Input
            type="search"
            placeholder="Search leads..."
            className="w-full pl-9 bg-white"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>

        <div className="flex gap-2 self-start">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Filter className="mr-2 h-4 w-4" />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleStatusFilterChange("all")}>
                All Statuses
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleStatusFilterChange(LeadStatus.NEW)}
              >
                New Leads
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleStatusFilterChange(LeadStatus.CONTACTED)}
              >
                Contacted
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleStatusFilterChange(LeadStatus.QUALIFIED)}
              >
                Qualified
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleStatusFilterChange(LeadStatus.PROPOSAL)}
              >
                Proposal Sent
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleStatusFilterChange(LeadStatus.NEGOTIATION)}
              >
                In Negotiation
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleStatusFilterChange(LeadStatus.BOOKED)}
              >
                Booked
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleStatusFilterChange(LeadStatus.LOST)}
              >
                Lost
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <ArrowUpDown className="mr-2 h-4 w-4" />
                Sort
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleSortChange("createdAt")}>
                {sortBy === "createdAt" && sortOrder === "desc"
                  ? "Oldest First"
                  : "Newest First"}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSortChange("name")}>
                {sortBy === "name" && sortOrder === "asc"
                  ? "Z-A by Name"
                  : "A-Z by Name"}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSortChange("status")}>
                By Status
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSortChange("email")}>
                By Email
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <div className="border rounded-md flex">
            <Button
              variant={leadViewMode === "list" ? "default" : "ghost"}
              size="sm"
              onClick={() => handleViewModeChange("list")}
              className="rounded-r-none"
            >
              <List className="h-4 w-4" />
              <span className="sr-only">List view</span>
            </Button>
            <Separator orientation="vertical" className="h-8" />
            <Button
              variant={leadViewMode === "kanban" ? "default" : "ghost"}
              size="sm"
              onClick={() => handleViewModeChange("kanban")}
              className="rounded-l-none"
            >
              <LayoutGrid className="h-4 w-4" />
              <span className="sr-only">Kanban view</span>
            </Button>
          </div>
        </div>
      </div>

      <Tabs
        defaultValue="all"
        className="w-full"
        onValueChange={handleTabChange}
      >
        <TabsList className="grid grid-cols-4 sm:grid-cols-7">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="new">New</TabsTrigger>
          <TabsTrigger value="contacted">Contacted</TabsTrigger>
          <TabsTrigger value="qualified">Qualified</TabsTrigger>
          <TabsTrigger value="proposal" className="hidden sm:inline-flex">
            Proposal
          </TabsTrigger>
          <TabsTrigger value="negotiation" className="hidden sm:inline-flex">
            Negotiation
          </TabsTrigger>
          <TabsTrigger value="booked" className="hidden sm:inline-flex">
            Booked
          </TabsTrigger>
        </TabsList>

        {/* The key change - display the same content for ALL tab values */}
        {[
          "all",
          "new",
          "contacted",
          "qualified",
          "proposal",
          "negotiation",
          "booked",
        ].map((tabValue) => (
          <TabsContent key={tabValue} value={tabValue} className="mt-4">
            {loading ? (
              <div className="flex justify-center p-8">
                <p>Loading leads...</p>
              </div>
            ) : leads && leads.length > 0 ? (
              <>
                {leadViewMode === "list" ? (
                  <LeadListView leads={leads} />
                ) : (
                  <LeadKanbanView leads={leads} />
                )}

                {/* Pagination controls */}
                {pagination.totalItems > itemsPerPage && (
                  <div className="flex justify-center mt-4">
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={currentPage === 1}
                        onClick={() => handlePageChange(currentPage - 1)}
                      >
                        Previous
                      </Button>

                      <div className="flex items-center px-2">
                        Page {pagination.currentPage} of{" "}
                        {Math.ceil(
                          pagination.totalItems / pagination.itemsPerPage
                        )}
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        disabled={
                          currentPage >=
                          Math.ceil(
                            pagination.totalItems / pagination.itemsPerPage
                          )
                        }
                        onClick={() => handlePageChange(currentPage + 1)}
                      >
                        Next
                      </Button>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <Card className="bg-gray-50 border-dashed">
                <CardHeader className="space-y-1">
                  <CardTitle className="text-xl">No leads found</CardTitle>
                  <CardDescription>
                    There are no leads matching your current filters.
                  </CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col items-center justify-center py-8 space-y-4">
                  <div className="rounded-full bg-muted p-6">
                    <AlertTriangle className="h-12 w-12 text-muted-foreground" />
                  </div>
                  <div className="text-center space-y-2">
                    <p>Try adjusting your search or filter settings</p>
                  </div>
                </CardContent>
                <CardFooter className="flex justify-center border-t pt-6 pb-4 space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => navigate("/crm/leads/new")}
                  >
                    <FilePlus className="mr-2 h-4 w-4" />
                    Create New Lead
                  </Button>
                  <Button variant="outline" onClick={() => {}}>
                    <FileText className="mr-2 h-4 w-4" />
                    Import Leads
                  </Button>
                </CardFooter>
              </Card>
            )}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};

export default LeadsPage;

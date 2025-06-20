import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  LeadStatus,
  deleteLead,
} from "../../../store/slices/crmSlice";
import { fetchLeadById, updateLead } from "../../../store/slices/leads/leadThunk";
import {
  User,
  Phone,
  Mail,
  Calendar,
  Tag,
  DollarSign,
  Edit,
  Trash2,
  MessageSquare,
  ClipboardList,
  FileCheck,
  ArrowLeft,
  Clock,
  RefreshCw,
  BarChart2,
  BadgeIndianRupee,
  MapPin,
  Activity,
  Home,
} from "lucide-react";
import { format, isValid, parseISO } from "date-fns";
import { Button } from "../../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../components/ui/tabs";
import { Separator } from "../../../components/ui/separator";
import { toast } from "sonner";

// Helper function to safely format dates
const safeFormat = (date, formatStr, fallback = "N/A") => {
  if (!date) return fallback;

  // If it's a string, try to parse it
  let dateObj;
  if (typeof date === "string") {
    dateObj = parseISO(date);
  } else {
    dateObj = date;
  }

  return isValid(dateObj) ? format(dateObj, formatStr) : fallback;
};

const LeadDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {  loading, error, currentLead } = useSelector((state) => state.leads);
  const [currentStatus, setCurrentStatus] = useState(null);
  const [isOffline, setIsOffline] = useState(false);
  const [suggestions, setSuggestions] = useState(null);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  
  // Default AI priority score for the UI
  const aiPriorityScore = 0.7;

  // Fetch lead details when component mounts
  useEffect(() => {
    console.log('id----------------------',id)
    if (id) {
      dispatch(fetchLeadById(id));
    }
  }, [id, dispatch]);

  // Use the currentLead from Redux store
  const lead = currentLead || {};

  // Mock AI suggestions function (you can replace this with actual AI integration)
  const loadAiSuggestions = async () => {
    if (!lead) return;

    setIsLoadingSuggestions(true);

    // Simulate API call
    setTimeout(() => {
      const mockSuggestions = {
        nextAction:
          aiPriorityScore > 0.7
            ? "This lead has high priority. Consider sending a personalized proposal soon."
            : aiPriorityScore > 0.4
            ? "Follow up with additional information about their travel preferences."
            : "Keep this lead informed with occasional updates about new travel options.",
        priorityFactors: {
          budgetRange: lead.budget > 5000 ? 0.3 : 0.1,
          responseTime: 0.2,
          engagement: 0.15,
          travelDates: lead.travelStartDate ? 0.25 : 0.05,
        },
        replyTemplate: `Hi ${
          lead.name
        }, I hope you're doing well. I wanted to follow up on your interest in ${
          lead.destination || "travel planning"
        }. Based on your preferences, I have some exciting options to share with you.`,
        tags: ["high-value", "responsive", "family-oriented"],
      };

      setSuggestions(mockSuggestions);
      setIsLoadingSuggestions(false);
    }, 1000);
  };

  // Load AI suggestions for this lead on initial render
  useEffect(() => {
    if (lead && lead._id) {
      loadAiSuggestions();
    }
  }, [lead]);

  const handleStatusChange = (status) => {
    if (isOffline) {
      toast.warning("Status changes will be synced when you're back online.");
    }

    dispatch(updateLead({ id: lead._id, data: { status } }))
      .unwrap()
      .then(() => {
        // After successful update, fetch the lead details again to refresh the UI
        dispatch(fetchLeadById(lead._id));
        toast.success(`Lead status updated to ${status}`);
        setCurrentStatus(status);
      })
      .catch((error) => {
        toast.error(error || "Failed to update lead status");
      });
  };

  const handleDeleteLead = () => {
    if (isOffline) {
      toast.warning("This lead will be deleted when you're back online.");
    }

    dispatch(deleteLead(lead._id));
    navigate("/crm/leads");
    toast.success("The lead has been successfully deleted.");
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case LeadStatus.NEW:
        return "bg-blue-100 text-blue-800";
      case LeadStatus.CONTACTED:
        return "bg-purple-100 text-purple-800";
      case LeadStatus.QUALIFIED:
        return "bg-green-100 text-green-800";
      case LeadStatus.PROPOSAL:
        return "bg-yellow-100 text-yellow-800";
      case LeadStatus.NEGOTIATION:
        return "bg-orange-100 text-orange-800";
      case LeadStatus.BOOKED:
        return "bg-green-100 text-green-800";
      case LeadStatus.LOST:
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Create empty timeline items for now
  const timelineItems = [];

  return (
    <div className="space-y-6">
      {loading ? (
        <div className="flex justify-center items-center h-[70vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center h-[70vh]">
          <h2 className="text-2xl font-bold">Error Loading Lead</h2>
          <p className="text-muted-foreground mt-2">{error}</p>
          <Button className="mt-4" onClick={() => navigate("/crm/leads")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Leads
          </Button>
        </div>
      ) : !lead || !lead._id ? (
        <div className="flex flex-col items-center justify-center h-[70vh]">
          <h2 className="text-2xl font-bold">Lead Not Found</h2>
          <p className="text-muted-foreground mt-2">
            The lead you're looking for doesn't exist.
          </p>
          <Button className="mt-4" onClick={() => navigate("/crm/leads")}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Leads
          </Button>
        </div>
      ) : (
        <>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/crm/leads")}
                className="mr-2"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
              <h1 className="text-2xl font-bold tracking-tight">{lead.name}</h1>
              <Badge
                variant="outline"
                className={`ml-3 ${getStatusBadgeClass(lead.status)}`}
              >
                {lead.status}
              </Badge>
              {lead.isReturnCustomer && (
                <Badge variant="outline" className="ml-2 bg-[#9b87f5] text-white">
                  Return Customer
                </Badge>
              )}
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => navigate(`/crm/communication/new/${lead._id}`)}
                disabled={isOffline}
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Message
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate(`/crm/tasks/new/${lead._id}`)}
                disabled={isOffline}
              >
                <ClipboardList className="mr-2 h-4 w-4" />
                Add Task
              </Button>
              <Button
                variant="outline"
                onClick={() => navigate(`/crm/bookings/new/${lead._id}`)}
                disabled={isOffline}
              >
                <FileCheck className="mr-2 h-4 w-4" />
                Create Booking
              </Button>
              <Button
                onClick={() => navigate(`/crm/leads/${lead._id}/edit`)}
                disabled={isOffline}
              >
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Left Column - Lead Info */}
            <div className="space-y-6 md:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle>Lead Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-4">
                      {lead.email && (
                        <div className="flex items-center">
                          <Mail className="h-4 w-4 text-muted-foreground mr-2" />
                          <span className="text-sm">{lead.email}</span>
                        </div>
                      )}
                      {lead.phone && (
                        <div className="flex items-center">
                          <Phone className="h-4 w-4 text-muted-foreground mr-2" />
                          <span className="text-sm">{lead.phone}</span>
                        </div>
                      )}
                      {lead.source && (
                        <div className="flex items-center">
                          <User className="h-4 w-4 text-muted-foreground mr-2" />
                          <span className="text-sm">Source: {lead.source}</span>
                        </div>
                      )}
                      {lead.destination && (
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 text-muted-foreground mr-2" />
                          <span className="text-sm">Destination: {lead.destination}</span>
                        </div>
                      )}
                    </div>

                    <div className="space-y-4">
                      {lead.budget && (
                        <div className="flex items-center">
                          <DollarSign className="h-4 w-4 text-muted-foreground mr-2" />
                          <span className="text-sm">Budget: {lead.budget}</span>
                        </div>
                      )}
                      {(lead.travelStartDate || lead.travelEndDate) && (
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 text-muted-foreground mr-2" />
                          <span className="text-sm">
                            Travel Dates: {lead.travelStartDate || "Not specified"}
                            {lead.travelEndDate && ` - ${lead.travelEndDate}`}
                          </span>
                        </div>
                      )}
                      {lead.accommodationPreference && (
                        <div className="flex items-center">
                          <Home className="h-4 w-4 text-muted-foreground mr-2" />
                          <span className="text-sm">Accommodation: {lead.accommodationPreference}</span>
                        </div>
                      )}
                      {lead.createdAt && (
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 text-muted-foreground mr-2" />
                          <span className="text-sm">
                            Created: {safeFormat(lead.createdAt, "MMM d, yyyy")}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {lead.preferredActivities && (
                    <div className="mt-4">
                      <div className="flex items-center mb-2">
                        <Activity className="h-4 w-4 text-muted-foreground mr-2" />
                        <span className="text-sm font-medium">Preferred Activities</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{lead.preferredActivities}</p>
                    </div>
                  )}

                  {lead.tags && (
                    <div className="mt-4">
                      <div className="flex items-center mb-2">
                        <Tag className="h-4 w-4 text-muted-foreground mr-2" />
                        <span className="text-sm font-medium">Tags</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {typeof lead.tags === 'string' ? (
                          <Badge variant="secondary">{lead.tags}</Badge>
                        ) : Array.isArray(lead.tags) ? (
                          lead.tags.map((tag) => (
                            <Badge key={tag} variant="secondary">
                              {tag}
                            </Badge>
                          ))
                        ) : null}
                      </div>
                    </div>
                  )}

                  {lead.notes && (
                    <div className="mt-4 pt-4 border-t">
                      <h4 className="text-sm font-medium mb-2">Notes</h4>
                      <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                        {lead.notes}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle>Timeline</CardTitle>
                </CardHeader>
                <CardContent>
                  {timelineItems.length > 0 ? (
                    <div className="space-y-4">
                      {/* Timeline items would go here */}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No activity recorded for this lead yet.
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Right Column - Status & AI Insights */}
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Lead Status</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Button
                      className={`w-full justify-start ${
                        lead.status === LeadStatus.NEW
                          ? "bg-blue-100 text-blue-800 hover:bg-blue-200"
                          : ""
                      }`}
                      variant={
                        lead.status === LeadStatus.NEW ? "secondary" : "outline"
                      }
                      onClick={() => handleStatusChange(LeadStatus.NEW)}
                      disabled={isOffline}
                    >
                      New Lead
                    </Button>
                    <Button
                      className={`w-full justify-start ${
                        lead.status === LeadStatus.CONTACTED
                          ? "bg-purple-100 text-purple-800 hover:bg-purple-200"
                          : ""
                      }`}
                      variant={
                        lead.status === LeadStatus.CONTACTED
                          ? "secondary"
                          : "outline"
                      }
                      onClick={() => handleStatusChange(LeadStatus.CONTACTED)}
                      disabled={isOffline}
                    >
                      Contacted
                    </Button>
                    <Button
                      className={`w-full justify-start ${
                        lead.status === LeadStatus.QUALIFIED
                          ? "bg-green-100 text-green-800 hover:bg-green-200"
                          : ""
                      }`}
                      variant={
                        lead.status === LeadStatus.QUALIFIED
                          ? "secondary"
                          : "outline"
                      }
                      onClick={() => handleStatusChange(LeadStatus.QUALIFIED)}
                      disabled={isOffline}
                    >
                      Qualified
                    </Button>
                    <Button
                      className={`w-full justify-start ${
                        lead.status === LeadStatus.PROPOSAL
                          ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                          : ""
                      }`}
                      variant={
                        lead.status === LeadStatus.PROPOSAL
                          ? "secondary"
                          : "outline"
                      }
                      onClick={() => handleStatusChange(LeadStatus.PROPOSAL)}
                      disabled={isOffline}
                    >
                      Proposal Sent
                    </Button>
                    <Button
                      className={`w-full justify-start ${
                        lead.status === LeadStatus.NEGOTIATION
                          ? "bg-orange-100 text-orange-800 hover:bg-orange-200"
                          : ""
                      }`}
                      variant={
                        lead.status === LeadStatus.NEGOTIATION
                          ? "secondary"
                          : "outline"
                      }
                      onClick={() => handleStatusChange(LeadStatus.NEGOTIATION)}
                      disabled={isOffline}
                    >
                      In Negotiation
                    </Button>
                    <Button
                      className={`w-full justify-start ${
                        lead.status === LeadStatus.BOOKED
                          ? "bg-green-100 text-green-800 hover:bg-green-200"
                          : ""
                      }`}
                      variant={
                        lead.status === LeadStatus.BOOKED ? "secondary" : "outline"
                      }
                      onClick={() => handleStatusChange(LeadStatus.BOOKED)}
                      disabled={isOffline}
                    >
                      Booked
                    </Button>
                    <Button
                      className={`w-full justify-start ${
                        lead.status === LeadStatus.LOST
                          ? "bg-red-100 text-red-800 hover:bg-red-200"
                          : ""
                      }`}
                      variant={
                        lead.status === LeadStatus.LOST ? "secondary" : "outline"
                      }
                      onClick={() => handleStatusChange(LeadStatus.LOST)}
                      disabled={isOffline}
                    >
                      Lost
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle>AI Insights</CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => loadAiSuggestions()}
                    disabled={isLoadingSuggestions}
                    className="h-8 w-8 p-0"
                  >
                    <RefreshCw
                      className={`h-4 w-4 ${
                        isLoadingSuggestions ? "animate-spin" : ""
                      }`}
                    />
                    <span className="sr-only">Refresh</span>
                  </Button>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <div className="text-sm font-medium">Priority Score</div>
                      <div className="mt-1 flex items-center">
                        <div className="w-full bg-gray-200 rounded-full h-2.5 mr-2">
                          <div
                            className={`h-2.5 rounded-full ${
                              aiPriorityScore > 0.7
                                ? "bg-red-500"
                                : aiPriorityScore > 0.4
                                ? "bg-yellow-500"
                                : "bg-green-500"
                            }`}
                            style={{ width: `${aiPriorityScore * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-xs font-medium">
                          {Math.round(aiPriorityScore * 100)}
                        </span>
                      </div>
                    </div>

                    {suggestions?.priorityFactors && (
                      <div className="mt-2">
                        <h4 className="text-xs font-medium text-muted-foreground">
                          Score Factors:
                        </h4>
                        <div className="grid grid-cols-2 gap-1 mt-1">
                          {Object.entries(suggestions.priorityFactors).map(
                            ([factor, value]) => (
                              <div
                                key={factor}
                                className="text-xs flex items-center"
                              >
                                <span
                                  className={`w-1 h-1 rounded-full mr-1 ${
                                    value > 0.1 ? "bg-red-500" : "bg-yellow-500"
                                  }`}
                                ></span>
                                <span className="capitalize">
                                  {factor.replace(/([A-Z])/g, " $1").trim()}
                                </span>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    )}

                    <div className="pt-3 border-t">
                      <div className="text-sm font-medium mb-2">
                        Suggested Next Action
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {suggestions?.nextAction ||
                          (aiPriorityScore > 0.7
                            ? "This lead has high priority. Consider sending a personalized proposal soon."
                            : aiPriorityScore > 0.4
                            ? "Follow up with additional information about their travel preferences."
                            : "Keep this lead informed with occasional updates about new travel options.")}
                      </p>
                    </div>

                    {suggestions?.replyTemplate && (
                      <div className="pt-3 border-t">
                        <div className="text-sm font-medium mb-2">
                          Suggested Reply Template
                        </div>
                        <div className="bg-gray-50 p-3 rounded text-sm">
                          {suggestions.replyTemplate}
                        </div>
                      </div>
                    )}

                    {suggestions?.tags && suggestions.tags.length > 0 && (
                      <div className="pt-3 border-t">
                        <div className="text-sm font-medium mb-2">
                          Suggested Tags
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {suggestions.tags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="outline"
                              className="bg-gray-50 cursor-pointer hover:bg-gray-100"
                              onClick={() => {
                                if (typeof lead.tags === 'string') {
                                  dispatch(
                                    updateLead({
                                      id: lead._id,
                                      data: { tags: [lead.tags, tag] },
                                    })
                                  );
                                } else if (Array.isArray(lead.tags) && !lead.tags.includes(tag)) {
                                  dispatch(
                                    updateLead({
                                      id: lead._id,
                                      data: { tags: [...lead.tags, tag] },
                                    })
                                  );
                                } else {
                                  dispatch(
                                    updateLead({
                                      id: lead._id,
                                      data: { tags: [tag] },
                                    })
                                  );
                                }
                              }}
                            >
                              + {tag}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="border-destructive/20">
                <CardHeader>
                  <CardTitle className="text-destructive">Danger Zone</CardTitle>
                </CardHeader>
                <CardContent>
                  <Button
                    variant="destructive"
                    className="w-full"
                    onClick={handleDeleteLead}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete Lead
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default LeadDetailPage;

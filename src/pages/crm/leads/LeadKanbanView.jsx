import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "../../../components/ui/card";
import { Badge } from "../../../components/ui/badge";
import { Button } from "../../../components/ui/button";
import { Separator } from "../../../components/ui/separator";
import { MessageSquare, Calendar, Phone, Mail } from "lucide-react";

// Define LeadStatus constants to match your data
const LeadStatus = {
  NEW: "new",
  CONTACTED: "contacted",
  QUALIFIED: "qualified",
  PROPOSAL: "proposal",
  NEGOTIATION: "negotiation",
  BOOKED: "booked",
  LOST: "lost",
};

const LeadKanbanView = ({ leads }) => {
  const navigate = useNavigate();

  // Group leads by status
  const leadsByStatus = {
    [LeadStatus.NEW]: [],
    [LeadStatus.CONTACTED]: [],
    [LeadStatus.QUALIFIED]: [],
    [LeadStatus.PROPOSAL]: [],
    [LeadStatus.NEGOTIATION]: [],
    [LeadStatus.BOOKED]: [],
    [LeadStatus.LOST]: [],
  };

  leads.forEach((lead) => {
    if (leadsByStatus[lead.status]) {
      leadsByStatus[lead.status].push(lead);
    }
  });

  // Define the statuses to display in the kanban board
  const displayStatuses = [
    LeadStatus.NEW,
    LeadStatus.CONTACTED,
    LeadStatus.QUALIFIED,
    LeadStatus.PROPOSAL,
    LeadStatus.NEGOTIATION,
  ];

  const getStatusLabel = (status) => {
    switch (status) {
      case LeadStatus.NEW:
        return "New Leads";
      case LeadStatus.CONTACTED:
        return "Contacted";
      case LeadStatus.QUALIFIED:
        return "Qualified";
      case LeadStatus.PROPOSAL:
        return "Proposal";
      case LeadStatus.NEGOTIATION:
        return "Negotiation";
      default:
        return status;
    }
  };

  // Since we don't have aiPriorityScore, we'll generate a pseudo-priority 
  // based on the budget (if available) or use a default
  const getLeadCardBorderColor = (lead) => {
    // Convert budget to number and normalize
    const budget = Number(lead.budget || 0);
    
    // Simple logic: higher budget = higher priority
    if (budget > 5000) return "border-l-red-500";
    if (budget > 2000) return "border-l-yellow-500";
    return "border-l-green-500";
  };

  // Helper to convert tags string to array
  const getTagsArray = (tagsString) => {
    if (!tagsString) return [];
    return tagsString.split(",").map(tag => tag.trim());
  };

  return (
    <div className="overflow-x-auto pb-4">
      <div className="flex space-x-4 min-w-max">
        {displayStatuses.map((status) => (
          <div key={status} className="w-72 flex-shrink-0">
            <div className="mb-3 flex items-center">
              <h3 className="font-medium text-sm">{getStatusLabel(status)}</h3>
              <Badge variant="secondary" className="ml-2">
                {leadsByStatus[status]?.length || 0}
              </Badge>
            </div>

            <div className="space-y-3">
              {leadsByStatus[status]?.map((lead) => (
                <Card
                  key={lead._id}
                  className={`border-l-4 ${getLeadCardBorderColor(lead)} cursor-pointer hover:bg-gray-50 transition-colors`}
                  onClick={() => navigate(`/crm/leads/${lead._id}`)}
                >
                  <CardHeader className="p-4 pb-2">
                    <div className="font-medium">{lead.name}</div>
                    <div className="text-sm text-muted-foreground">
                      {lead.destination && `Trip to ${lead.destination}`}
                    </div>
                  </CardHeader>

                  <CardContent className="p-4 pt-0 text-xs space-y-2">
                    {lead.budget && (
                      <div className="flex items-center">
                        <span className="text-muted-foreground mr-1">
                          Budget:
                        </span>
                        <span>${Number(lead.budget).toLocaleString()}</span>
                      </div>
                    )}

                    {lead.travelStartDate && (
                      <div className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1 text-muted-foreground" />
                        <span>
                          {lead.travelStartDate}
                          {lead.travelEndDate && ` - ${lead.travelEndDate}`}
                        </span>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-1 pt-1">
                      {getTagsArray(lead.tags).slice(0, 3).map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="text-xs"
                        >
                          {tag}
                        </Badge>
                      ))}
                      {getTagsArray(lead.tags).length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{getTagsArray(lead.tags).length - 3}
                        </Badge>
                      )}
                    </div>
                  </CardContent>

                  <Separator />

                  <CardFooter className="p-2 flex justify-between">
                    <span className="text-xs text-muted-foreground">
                      Source: {lead.source}
                    </span>
                    <div className="flex space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Handle message action
                        }}
                      >
                        <MessageSquare className="h-3.5 w-3.5" />
                        <span className="sr-only">Message</span>
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Handle call action
                        }}
                      >
                        <Phone className="h-3.5 w-3.5" />
                        <span className="sr-only">Call</span>
                      </Button>

                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 p-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Handle email action
                        }}
                      >
                        <Mail className="h-3.5 w-3.5" />
                        <span className="sr-only">Email</span>
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              ))}

              {leadsByStatus[status]?.length === 0 && (
                <div className="border border-dashed rounded-md p-4 text-center text-muted-foreground text-sm">
                  No leads in this stage
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LeadKanbanView;

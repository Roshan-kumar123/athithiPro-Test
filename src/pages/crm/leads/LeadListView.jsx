import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { LeadStatus } from "../../../store/slices/leads/leadSlice";
import { deleteLead } from "../../../store/slices/leads/leadThunk";
import { toast } from "sonner";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "../../../components/ui/table";
import { Badge } from "../../../components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../../components/ui/dropdown-menu";
import { Button } from "../../../components/ui/button";
import { MoreHorizontal, ArrowRight } from "lucide-react";
import { format } from "date-fns";

const LeadListView = ({ leads }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Simple currency formatter
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const getStatusColor = (status) => {
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

  const renderBudget = (lead) => {
    if (lead.budget) {
      return formatCurrency(lead.budget);
    }
    return "";
  };

  const handleDelete = (e, id) => {
    e.stopPropagation();
    
    if (window.confirm("Are you sure you want to delete this lead?")) {
      dispatch(deleteLead(id))
        .unwrap()
        .then(() => {
          toast.success("Lead deleted successfully");
        })
        .catch((error) => {
          toast.error(error || "Failed to delete lead");
        });
    }
  };

  console.log('leads--------------------a',leads)
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">Name</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead className="hidden md:table-cell">Status</TableHead>
            <TableHead className="hidden md:table-cell">Source</TableHead>
            <TableHead className="hidden lg:table-cell">Priority</TableHead>
            <TableHead className="hidden xl:table-cell">Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leads?.map((lead) => (
            <TableRow
              key={lead._id}
              className="cursor-pointer hover:bg-muted/50"
              onClick={() => navigate(`/crm/leads/${lead._id}`)}
            >
              <TableCell className="font-medium">{lead.name}</TableCell>
              <TableCell>
                <div className="flex flex-col">
                  {lead.email && (
                    <span className="text-xs md:text-sm">{lead.email}</span>
                  )}
                  {lead.phone && (
                    <span className="text-xs text-muted-foreground">
                      {lead.phone}
                    </span>
                  )}
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <Badge
                  variant="outline"
                  className={getStatusColor(lead.status)}
                >
                  {lead.status}
                </Badge>
              </TableCell>
              <TableCell className="hidden md:table-cell capitalize">
                {lead.source}
              </TableCell>
              <TableCell className="hidden lg:table-cell">
                <div className="flex items-center">
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className={`h-2.5 rounded-full ${
                        lead.aiPriorityScore > 0.7
                          ? "bg-red-500"
                          : lead.aiPriorityScore > 0.4
                          ? "bg-yellow-500"
                          : "bg-green-500"
                      }`}
                      style={{ width: `${lead.aiPriorityScore * 100}%` }}
                    ></div>
                  </div>
                  <span className="ml-2 text-xs">
                    {Math.round(lead.aiPriorityScore * 100)}
                  </span>
                </div>
              </TableCell>
              <TableCell className="hidden xl:table-cell">
                {format(lead.createdAt, "MMM d, yyyy")}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger
                    asChild
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/crm/leads/${lead._id}`);
                      }}
                    >
                      <ArrowRight className="mr-2 h-4 w-4" />
                      View Details
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        // Add quick task
                      }}
                    >
                      Add Task
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        // Send message
                      }}
                    >
                      Send Message
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/crm/leads/edit/${lead._id}`);
                      }}
                    >
                      Edit
                    </DropdownMenuItem>

                     <DropdownMenuItem
                      onClick={(e) => handleDelete(e, lead._id)}
                      className="text-red-600"
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default LeadListView;

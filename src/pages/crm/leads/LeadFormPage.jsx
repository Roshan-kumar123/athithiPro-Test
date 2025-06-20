import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  LeadStatus,
  LeadSource,
  clearCurrentLead
} from "../../../store/slices/leads/leadSlice";
import { createLead, updateLead, fetchLeadById } from "../../../store/slices/leads/leadThunk";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";
import { Textarea } from "../../../components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { Label } from "../../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import { toast } from "sonner";

const LeadFormPage = () => {
  const { id } = useParams(); // Get the id from URL if it exists
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { currentLead, loading, error } = useSelector(state => state.leads);
  const isEditMode = !!id;
  
  // Initial form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    status: LeadStatus.NEW,
    source: LeadSource.WEBSITE,
    budget: "",
    notes: "",
    tags: "",
    destination: "",
    travelStartDate: "",
    travelEndDate: "",
    accommodationPreference: "",
    preferredActivities: "",
  });
  
  // Add validation errors state
  const [validationErrors, setValidationErrors] = useState({});
  
  // Fetch lead data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      dispatch(fetchLeadById(id));
      
      // Return a cleanup function to clear currentLead when component unmounts
      return () => {
        dispatch(clearCurrentLead());
      }
    }
  }, [isEditMode, id, dispatch]);
  
  // Populate form with lead data when currentLead changes
  useEffect(() => {
    if (isEditMode && currentLead) {
      setFormData({
        name: currentLead.name || "",
        email: currentLead.email || "",
        phone: currentLead.phone || "",
        status: currentLead.status || LeadStatus.NEW,
        source: currentLead.source || LeadSource.WEBSITE,
        budget: currentLead.budget || "",
        notes: currentLead.notes || "",
        tags: currentLead.tags || "",
        destination: currentLead.destination || "",
        travelStartDate: currentLead.travelStartDate || "",
        travelEndDate: currentLead.travelEndDate || "",
        accommodationPreference: currentLead.accommodationPreference || "",
        preferredActivities: currentLead.preferredActivities || "",
      });
    }
  }, [isEditMode, currentLead]);

  const validateForm = () => {
    const errors = {};
    
    // Required fields validation
    if (!formData.name.trim()) {
      errors.name = "Name is required";
    }
    
    // Email validation (required and must be valid)
    if (!formData.email) {
      errors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      errors.email = "Invalid email format";
    }
    
    // Phone validation (required and must be 10-15 digits)
    if (!formData.phone) {
      errors.phone = "Phone number is required";
    } else if (!/^\d{10,15}$/.test(formData.phone)) {
      errors.phone = "Phone number should be 10 to 15 digits";
    }
    
    // Budget validation (required and digits only)
    if (!formData.budget) {
      errors.budget = "Budget is required";
    } else if (!/^\d+$/.test(formData.budget)) {
      errors.budget = "Budget should contain digits only";
    }
    
    // Destination validation (required)
    if (!formData.destination.trim()) {
      errors.destination = "Destination is required";
    }
    
    // Travel dates validation (required and YYYY-MM-DD format)
    if (!formData.travelStartDate) {
      errors.travelStartDate = "Travel start date is required";
    } else if (!/^\d{4}-\d{2}-\d{2}$/.test(formData.travelStartDate)) {
      errors.travelStartDate = "Travel start date must be in YYYY-MM-DD format";
    }
    
    if (!formData.travelEndDate) {
      errors.travelEndDate = "Travel end date is required";
    } else if (!/^\d{4}-\d{2}-\d{2}$/.test(formData.travelEndDate)) {
      errors.travelEndDate = "Travel end date must be in YYYY-MM-DD format";
    }
    
    // Check if end date is after start date
    if (formData.travelStartDate && formData.travelEndDate &&
        new Date(formData.travelStartDate) > new Date(formData.travelEndDate)) {
      errors.travelEndDate = "End date must be after start date";
    }
    
    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Always clear previous validation errors
    setValidationErrors({});

    // Validate form before submission
    if (!validateForm()) {
      // Display validation errors as toast
      const errorMessages = Object.values(validationErrors);
      errorMessages.forEach(error => toast.error(error));
      return;
    }

    const leadData = {
      ...formData,
    };

    if (isEditMode) {
      // Update existing lead
      dispatch(updateLead({ id, data: leadData }))
        .unwrap()
        .then(() => {
          toast.success("Lead updated successfully");
          navigate("/crm/leads", { replace: true });
        })
        .catch((error) => {
          toast.error(error || "Failed to update lead");
        });
    } else {
      // Create new lead
      dispatch(createLead(leadData))
        .unwrap()
        .then(() => {
          toast.success("Lead created successfully");
          navigate("/crm/leads", { replace: true });
        })
        .catch((error) => {
          toast.error(error || "Failed to create lead");
        });
    }
  };

  // Input handler with optional pattern validation
  const handleInputChange = (field, value, pattern = null) => {
    // If pattern is provided, validate against it
    if (pattern && !pattern.test(value) && value !== '') {
      return; // Don't update the field if validation fails
    }
    
    setFormData((prev) => ({ ...prev, [field]: value }));
    
    // Clear specific validation error when field is modified
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const updated = {...prev};
        delete updated[field];
        return updated;
      });
    }
  };

  // Helper to get today's date in YYYY-MM-DD format for min date attribute
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Show loading state while fetching lead data in edit mode
  if (isEditMode && loading) {
    return (
      <div className="flex justify-center items-center h-[70vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  // Show error state if fetch failed in edit mode
  if (isEditMode && error && !currentLead) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh]">
        <h2 className="text-2xl font-bold">Error Loading Lead</h2>
        <p className="text-muted-foreground mt-2">{error}</p>
        <Button className="mt-4" onClick={() => navigate("/crm/leads")}>
          Back to Leads
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          {isEditMode ? "Edit Lead" : "Create New Lead"}
        </h1>
        <p className="text-muted-foreground">
          {isEditMode ? "Update lead information" : "Add a new potential client"}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter lead name"
                  required
                  className={validationErrors.name ? "border-red-500" : ""}
                />
                {validationErrors.name && (
                  <p className="text-sm text-red-500">{validationErrors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="Enter email address"
                  required
                  className={validationErrors.email ? "border-red-500" : ""}
                />
                {validationErrors.email && (
                  <p className="text-sm text-red-500">{validationErrors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone *</Label>
                <Input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value, /^\d*$/)}
                  placeholder="Enter phone number"
                  required
                  className={validationErrors.phone ? "border-red-500" : ""}
                />
                {validationErrors.phone && (
                  <p className="text-sm text-red-500">{validationErrors.phone}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="budget">Budget *</Label>
                <Input
                  id="budget"
                  type="text"
                  value={formData.budget}
                  onChange={(e) => handleInputChange("budget", e.target.value, /^\d*$/)}
                  placeholder="Enter budget (digits only)"
                  required
                  className={validationErrors.budget ? "border-red-500" : ""}
                />
                {validationErrors.budget && (
                  <p className="text-sm text-red-500">{validationErrors.budget}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => handleInputChange("status", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={LeadStatus.NEW}>New</SelectItem>
                    <SelectItem value={LeadStatus.CONTACTED}>
                      Contacted
                    </SelectItem>
                    <SelectItem value={LeadStatus.QUALIFIED}>
                      Qualified
                    </SelectItem>
                    <SelectItem value={LeadStatus.PROPOSAL}>
                      Proposal
                    </SelectItem>
                    <SelectItem value={LeadStatus.NEGOTIATION}>
                      Negotiation
                    </SelectItem>
                    <SelectItem value={LeadStatus.BOOKED}>Booked</SelectItem>
                    <SelectItem value={LeadStatus.LOST}>Lost</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="source">Source</Label>
                <Select
                  value={formData.source}
                  onValueChange={(value) => handleInputChange("source", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select source" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={LeadSource.WEBSITE}>Website</SelectItem>
                    <SelectItem value={LeadSource.REFERRAL}>
                      Referral
                    </SelectItem>
                    <SelectItem value={LeadSource.SOCIAL}>
                      Social Media
                    </SelectItem>
                    <SelectItem value={LeadSource.EMAIL}>Email</SelectItem>
                    <SelectItem value={LeadSource.PHONE}>Phone</SelectItem>
                    <SelectItem value={LeadSource.WHATSAPP}>
                      WhatsApp
                    </SelectItem>
                    <SelectItem value={LeadSource.MARKETPLACE}>
                      Marketplace
                    </SelectItem>
                    <SelectItem value={LeadSource.OTHER}>Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="tags">Tags</Label>
              <Input
                id="tags"
                value={formData.tags}
                onChange={(e) => handleInputChange("tags", e.target.value)}
                placeholder="family, beach, summer (comma separated)"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                value={formData.notes}
                onChange={(e) => handleInputChange("notes", e.target.value)}
                placeholder="Enter any additional notes"
                rows={4}
              />
            </div>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Travel Preferences</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="destination">Destination *</Label>
              <Input
                id="destination"
                value={formData.destination}
                onChange={(e) => handleInputChange("destination", e.target.value)}
                placeholder="Hawaii, Paris, etc."
                required
                className={validationErrors.destination ? "border-red-500" : ""}
              />
              {validationErrors.destination && (
                <p className="text-sm text-red-500">{validationErrors.destination}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="travelStartDate">Travel Start Date *</Label>
                <Input
                  id="travelStartDate"
                  type="date"
                  value={formData.travelStartDate}
                  onChange={(e) => handleInputChange("travelStartDate", e.target.value)}
                  min={getTodayDate()}
                  required
                  className={`w-full ${validationErrors.travelStartDate ? "border-red-500" : ""}`}
                />
                {validationErrors.travelStartDate && (
                  <p className="text-sm text-red-500">{validationErrors.travelStartDate}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="travelEndDate">Travel End Date *</Label>
                <Input
                  id="travelEndDate"
                  type="date"
                  value={formData.travelEndDate}
                  onChange={(e) => handleInputChange("travelEndDate", e.target.value)}
                  min={formData.travelStartDate || getTodayDate()}
                  required
                  className={`w-full ${validationErrors.travelEndDate ? "border-red-500" : ""}`}
                />
                {validationErrors.travelEndDate && (
                  <p className="text-sm text-red-500">{validationErrors.travelEndDate}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="accommodationPreference">Accommodation Preference</Label>
              <Input
                id="accommodationPreference"
                value={formData.accommodationPreference}
                onChange={(e) => handleInputChange("accommodationPreference", e.target.value)}
                placeholder="Resort, Hotel, Airbnb, etc."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="preferredActivities">Preferred Activities</Label>
              <Input
                id="preferredActivities"
                value={formData.preferredActivities}
                onChange={(e) => handleInputChange("preferredActivities", e.target.value)}
                placeholder="Beach, Hiking, Sightseeing, etc."
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button 
          type="button" 
          variant="outline" 
          onClick={() => navigate("/crm/leads")}
        >
          Cancel
        </Button>
        <Button 
          type="submit"
          onClick={handleSubmit}
        >
          {isEditMode ? "Update Lead" : "Create Lead"}
        </Button>
      </div>
    </div>
  );
};

export default LeadFormPage;

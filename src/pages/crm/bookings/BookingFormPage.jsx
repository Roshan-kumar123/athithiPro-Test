import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  BookingStatus,
  PaymentStatus,
  addBooking,
} from "../../../store/slices/crmSlice";
import { Button } from "../../../components/ui/button";
import { ArrowLeft, Save, X, Plus, Trash2 } from "lucide-react";
import { Input } from "../../../components/ui/input";
import { Textarea } from "../../../components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../../components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../../../components/ui/form";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../../components/ui/card";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

// Form schema
const bookingFormSchema = z.object({
  leadId: z.string().min(1, "Client is required"),
  status: z.nativeEnum(BookingStatus),
  itineraryName: z.string().min(1, "Itinerary name is required"),
  itineraryDescription: z.string().optional().or(z.literal("")),
  totalAmount: z.string().min(1, "Total amount is required"),
  startDate: z.string().min(1, "Start date is required"),
  endDate: z.string().min(1, "End date is required"),
});

// Payment stage schema
const paymentStageSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, "Name is required"),
  amount: z.string().min(1, "Amount is required"),
  dueDate: z.string().min(1, "Due date is required"),
  paid: z.boolean().default(false),
  paidAt: z.string().optional(),
});

const BookingFormPage = () => {
  const { leadId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { leads, isOffline } = useSelector((state) => state.crm);
  const [paymentStages, setPaymentStages] = useState([
    {
      id: `payment-${uuidv4().slice(0, 8)}`,
      name: "Deposit",
      amount: "",
      dueDate: new Date().toISOString().split("T")[0],
      paid: false,
    },
  ]);

  // Initialize form
  const form = useForm({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      leadId: leadId || "",
      status: BookingStatus.PENDING,
      itineraryName: "",
      itineraryDescription: "",
      totalAmount: "",
      startDate: "",
      endDate: "",
    },
  });

  // Add payment stage
  const addPaymentStage = () => {
    setPaymentStages([
      ...paymentStages,
      {
        id: `payment-${uuidv4().slice(0, 8)}`,
        name: `Payment ${paymentStages.length + 1}`,
        amount: "",
        dueDate: new Date().toISOString().split("T")[0],
        paid: false,
      },
    ]);
  };

  // Remove payment stage
  const removePaymentStage = (index) => {
    setPaymentStages(paymentStages.filter((_, i) => i !== index));
  };

  // Update payment stage
  const updatePaymentStage = (index, field, value) => {
    const updatedStages = [...paymentStages];
    updatedStages[index] = { ...updatedStages[index], [field]: value };
    setPaymentStages(updatedStages);
  };

  // Handle form submission
  const onSubmit = (data) => {
    // Validate payment stages
    let totalPaymentAmount = 0;
    const formattedPaymentStages = paymentStages.map((stage) => {
      const amount = parseFloat(stage.amount);
      totalPaymentAmount += amount;
      return {
        id: stage.id || `payment-${uuidv4().slice(0, 8)}`,
        name: stage.name,
        amount,
        dueDate: new Date(stage.dueDate),
        paid: stage.paid,
        paidAt: stage.paid && stage.paidAt ? new Date(stage.paidAt) : undefined,
      };
    });

    const totalBookingAmount = parseFloat(data.totalAmount);

    // Check if payment stages match total amount
    if (Math.abs(totalPaymentAmount - totalBookingAmount) > 0.01) {
      toast.error(
        `The sum of payment stages ($${totalPaymentAmount}) doesn't match the total amount ($${totalBookingAmount}).`
      );
      return;
    }

    if (isOffline) {
      toast.info(
        "Offline Mode - Booking will be created when you're back online."
      );
    }

    try {
      const paidAmount = formattedPaymentStages
        .filter((stage) => stage.paid)
        .reduce((sum, stage) => sum + stage.amount, 0);

      // Determine payment status
      let paymentStatus;
      if (paidAmount === 0) {
        paymentStatus = PaymentStatus.PENDING;
      } else if (paidAmount < totalBookingAmount) {
        paymentStatus = PaymentStatus.PARTIAL;
      } else {
        paymentStatus = PaymentStatus.PAID;
      }

      const newBooking = {
        id: `booking-${uuidv4().slice(0, 8)}`,
        leadId: data.leadId,
        status: data.status,
        itinerary: {
          id: `itinerary-${uuidv4().slice(0, 8)}`,
          name: data.itineraryName,
          description: data.itineraryDescription || undefined,
          startDate: new Date(data.startDate),
          endDate: new Date(data.endDate),
        },
        totalAmount: totalBookingAmount,
        paidAmount,
        paymentStatus,
        paymentStages: formattedPaymentStages,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      dispatch(addBooking(newBooking));

      toast.success("Booking has been successfully created.");

      navigate(`/crm/leads/${data.leadId}`);
    } catch (error) {
      toast.error(
        "There was a problem creating the booking. Please try again."
      );
      console.error("Error creating booking:", error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              navigate(leadId ? `/crm/leads/${leadId}` : "/crm/bookings")
            }
            className="mr-2"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">
            Create New Booking
          </h1>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Booking Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="leadId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Client *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={Boolean(leadId)}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a client" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {leads.map((lead) => (
                          <SelectItem key={lead.id} value={lead.id}>
                            {lead.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={BookingStatus.PENDING}>
                          Pending
                        </SelectItem>
                        <SelectItem value={BookingStatus.CONFIRMED}>
                          Confirmed
                        </SelectItem>
                        <SelectItem value={BookingStatus.CANCELLED}>
                          Cancelled
                        </SelectItem>
                        <SelectItem value={BookingStatus.COMPLETED}>
                          Completed
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="totalAmount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Amount *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="1000.00"
                        type="number"
                        min="0"
                        step="0.01"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Itinerary Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="itineraryName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Itinerary Name *</FormLabel>
                    <FormControl>
                      <Input placeholder="Paris Getaway Package" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="startDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Start Date *</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="endDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>End Date *</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="itineraryDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Itinerary Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Details about the itinerary..."
                        {...field}
                        className="min-h-[100px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Payment Schedule</CardTitle>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addPaymentStage}
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Payment
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {paymentStages.map((stage, index) => (
                <div
                  key={stage.id || index}
                  className="p-4 border rounded-md space-y-4"
                >
                  <div className="flex justify-between items-center">
                    <h4 className="text-sm font-medium">Payment {index + 1}</h4>
                    {paymentStages.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0 text-destructive"
                        onClick={() => removePaymentStage(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Remove payment</span>
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Name *</label>
                      <Input
                        value={stage.name}
                        onChange={(e) =>
                          updatePaymentStage(index, "name", e.target.value)
                        }
                        placeholder="Deposit, Final Payment, etc."
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Amount *</label>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={stage.amount}
                        onChange={(e) =>
                          updatePaymentStage(index, "amount", e.target.value)
                        }
                        placeholder="Amount"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Due Date *</label>
                      <Input
                        type="date"
                        value={stage.dueDate}
                        onChange={(e) =>
                          updatePaymentStage(index, "dueDate", e.target.value)
                        }
                      />
                    </div>

                    <div className="flex items-center space-x-4 pt-6">
                      <label className="inline-flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={stage.paid}
                          onChange={(e) =>
                            updatePaymentStage(index, "paid", e.target.checked)
                          }
                          className="w-4 h-4 rounded border-gray-300 text-primary focus:ring-primary"
                        />
                        <span>Paid</span>
                      </label>

                      {stage.paid && (
                        <div className="flex-1">
                          <Input
                            type="date"
                            value={stage.paidAt || ""}
                            onChange={(e) =>
                              updatePaymentStage(
                                index,
                                "paidAt",
                                e.target.value
                              )
                            }
                            placeholder="Payment date"
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}

              {paymentStages.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No payment stages defined</p>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={addPaymentStage}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Payment Stage
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                navigate(leadId ? `/crm/leads/${leadId}` : "/crm/bookings")
              }
            >
              <X className="mr-2 h-4 w-4" /> Cancel
            </Button>
            <Button type="submit" disabled={isOffline}>
              <Save className="mr-2 h-4 w-4" /> Create Booking
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default BookingFormPage;

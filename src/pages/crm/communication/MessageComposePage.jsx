import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  CommunicationChannel,
  addCommunication,
} from "../../../store/slices/crmSlice";
import { Button } from "../../../components/ui/button";
import { ArrowLeft, Send, X } from "lucide-react";
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
  CardDescription,
} from "../../../components/ui/card";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";

// Form schema
const messageFormSchema = z.object({
  leadId: z.string().min(1, "Recipient is required"),
  subject: z.string().optional().or(z.literal("")),
  channel: z.nativeEnum(CommunicationChannel),
  content: z.string().min(1, "Message content is required"),
});

const MessageComposePage = () => {
  const { leadId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { leads, isOffline } = useSelector((state) => state.crm);
  const [channelType, setChannelType] = useState(CommunicationChannel.EMAIL);

  // Initialize form
  const form = useForm({
    resolver: zodResolver(messageFormSchema),
    defaultValues: {
      leadId: leadId || "",
      subject: "",
      channel: CommunicationChannel.EMAIL,
      content: "",
    },
  });

  // Watch for channel changes to update UI
  const watchChannel = form.watch("channel");

  useEffect(() => {
    setChannelType(watchChannel);
  }, [watchChannel]);

  // Handle form submission
  const onSubmit = (data) => {
    if (isOffline) {
      toast.info(
        "Offline Mode - Message will be sent when you're back online."
      );
    }

    try {
      const newCommunication = {
        id: `comm-${uuidv4().slice(0, 8)}`,
        leadId: data.leadId,
        channel: data.channel,
        direction: "outgoing",
        content: data.content,
        sentAt: new Date(),
        sentBy: "agent-1", // Hard-coded for now, would be the current user in a real app
        aiSentiment: 0.7, // Mocked sentiment score
      };

      dispatch(addCommunication(newCommunication));

      toast.success(`Your ${data.channel} message has been sent.`);

      navigate(`/crm/leads/${data.leadId}`);
    } catch (error) {
      toast.error("There was a problem sending the message. Please try again.");
      console.error("Error sending message:", error);
    }
  };

  // Get selected lead name
  const selectedLeadName = form.getValues().leadId
    ? leads.find((l) => l.id === form.getValues().leadId)?.name
    : "";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Button
            variant="ghost"
            size="sm"
            onClick={() =>
              navigate(leadId ? `/crm/leads/${leadId}` : "/crm/communication")
            }
            className="mr-2"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">New Message</h1>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <Card>
            <CardHeader>
              <CardTitle>Compose Message</CardTitle>
              <CardDescription>Send a new message to a lead</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="leadId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Recipient *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={Boolean(leadId)}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a lead" />
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
                name="channel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Channel</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select channel" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value={CommunicationChannel.EMAIL}>
                          Email
                        </SelectItem>
                        <SelectItem value={CommunicationChannel.PHONE}>
                          Phone Call
                        </SelectItem>
                        <SelectItem value={CommunicationChannel.WHATSAPP}>
                          WhatsApp
                        </SelectItem>
                        <SelectItem value={CommunicationChannel.SMS}>
                          SMS
                        </SelectItem>
                        <SelectItem value={CommunicationChannel.IN_PERSON}>
                          In Person
                        </SelectItem>
                        <SelectItem value={CommunicationChannel.OTHER}>
                          Other
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {channelType === CommunicationChannel.EMAIL && (
                <FormField
                  control={form.control}
                  name="subject"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subject</FormLabel>
                      <FormControl>
                        <Input placeholder="Message subject" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              <FormField
                control={form.control}
                name="content"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {channelType === CommunicationChannel.EMAIL
                        ? "Email Body"
                        : channelType === CommunicationChannel.PHONE
                        ? "Call Notes"
                        : channelType === CommunicationChannel.IN_PERSON
                        ? "Meeting Notes"
                        : "Message"}
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder={
                          channelType === CommunicationChannel.EMAIL
                            ? "Compose your email..."
                            : channelType === CommunicationChannel.PHONE
                            ? "Describe the call..."
                            : channelType === CommunicationChannel.IN_PERSON
                            ? "Record meeting notes..."
                            : "Enter your message..."
                        }
                        {...field}
                        className="min-h-[200px]"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {channelType === CommunicationChannel.EMAIL && (
                <div className="bg-gray-50 p-4 rounded-md mt-4">
                  <h4 className="text-sm font-medium mb-2">AI Suggestions</h4>
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      type="button"
                      className="w-full justify-start text-left"
                      onClick={() => {
                        form.setValue(
                          "content",
                          `Dear ${selectedLeadName},\n\nThank you for your interest in our travel services. Based on your preferences, I've put together some options that I think would be perfect for your upcoming trip.\n\nWould you be available for a quick call to discuss these options in more detail?\n\nBest regards,\nYour Travel Agent`
                        );
                      }}
                    >
                      Initial Follow-up Email
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      type="button"
                      className="w-full justify-start text-left"
                      onClick={() => {
                        form.setValue(
                          "content",
                          `Dear ${selectedLeadName},\n\nI hope this email finds you well. I wanted to follow up on our previous conversation about your travel plans.\n\nI've attached a detailed itinerary based on your preferences. Please review it and let me know if you'd like to make any changes.\n\nI look forward to hearing from you.\n\nBest regards,\nYour Travel Agent`
                        );
                      }}
                    >
                      Itinerary Proposal
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      type="button"
                      className="w-full justify-start text-left"
                      onClick={() => {
                        form.setValue(
                          "content",
                          `Dear ${selectedLeadName},\n\nThank you for choosing our services for your travel needs. We're excited to confirm your booking!\n\nI've attached all the necessary details for your upcoming trip. Please review them and let me know if you have any questions.\n\nWe look forward to providing you with an exceptional travel experience.\n\nBest regards,\nYour Travel Agent`
                        );
                      }}
                    >
                      Booking Confirmation
                    </Button>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                navigate(leadId ? `/crm/leads/${leadId}` : "/crm/communication")
              }
            >
              <X className="mr-2 h-4 w-4" /> Cancel
            </Button>
            <Button type="submit" disabled={isOffline}>
              <Send className="mr-2 h-4 w-4" />
              {channelType === CommunicationChannel.EMAIL
                ? "Send Email"
                : channelType === CommunicationChannel.PHONE
                ? "Log Call"
                : channelType === CommunicationChannel.IN_PERSON
                ? "Save Meeting"
                : "Send Message"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default MessageComposePage;

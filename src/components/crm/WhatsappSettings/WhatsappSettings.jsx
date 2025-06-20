import React, { useState, useEffect } from "react";
import { ArrowLeft, ChevronDown } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { Textarea } from "../../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "../../ui/card";
import {
  getPermanentToken,
  updateWabaTokenDetails,
  updateWabaBusinessDetails,
  submitBusinessVerification,
} from "../../../store/slices/whatsapp/whatsappThunk";
import {
  updateBusinessForm,
  clearError,
  clearSuccess,
} from "../../../store/slices/whatsapp/whatsappSlice";

// Facebook Login Component (inline for now)
const FacebookLogin = ({ disabled, onSuccess }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    // Inject the Facebook SDK script
    const script = document.createElement("script");
    script.src = "https://connect.facebook.net/en_US/sdk.js";
    script.async = true;
    script.defer = true;
    script.crossOrigin = "anonymous";
    document.body.appendChild(script);

    // Initialize FB SDK
    window.fbAsyncInit = function () {
      window.FB.init({
        appId: "1334612180951751",
        autoLogAppEvents: true,
        xfbml: true,
        version: "v23.0",
      });
    };

    window.addEventListener("message", (event) => {
      if (!event.origin.endsWith("facebook.com")) return;
      try {
        const data = JSON.parse(event.data);
        if (data.type === "WA_EMBEDDED_SIGNUP") {
          console.log("WhatsApp signup message received:", data);
          // Dispatch Redux action
          dispatch(
            updateWabaBusinessDetails({
              businessAccountId: data.data.business_id,
              phoneNumberId: data.data.phone_number_id,
              wabaId: data.data.waba_id,
            })
          );
          if (onSuccess) {
            onSuccess(data.data);
          }
        }
      } catch (error) {
        console.log("Error in getting waba details", error);
      }
    });

    // Cleanup function
    return () => {
      const existingScript = document.querySelector(
        'script[src*="connect.facebook.net"]'
      );
      if (existingScript) {
        existingScript.remove();
      }
    };
  }, [dispatch, onSuccess]);

  const fbLoginCallback = (response) => {
    if (response.authResponse) {
      const code = response.authResponse.code;
      // Handle async operations inside the function without making the callback async
      (async () => {
        try {
          // Dispatch get permanent token action
          const tokenResult = await dispatch(getPermanentToken(code)).unwrap();
          // Then update token details
          await dispatch(
            updateWabaTokenDetails(tokenResult.access_token)
          ).unwrap();
          if (onSuccess) {
            onSuccess({ access_token: tokenResult.access_token });
          }
        } catch (error) {
          console.error("Failed to process Facebook login:", error);
        }
      })();
    } else {
      console.log("Error in generating code");
    }
  };

  const launchWhatsAppSignup = () => {
    if (!window.FB) return console.warn("FB SDK not yet loaded");
    window.FB.login(fbLoginCallback, {
      config_id: "700908572907725",
      response_type: "code",
      override_default_response_type: true,
      extras: {
        setup: {},
        featureType: "<FEATURE_TYPE>",
        sessionInfoVersion: "3",
      },
    });
  };

  return (
    <Button
      onClick={launchWhatsAppSignup}
      disabled={disabled}
      className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2"
    >
      Login with Facebook
    </Button>
  );
};

const WhatsappSettings = () => {
  const dispatch = useDispatch();
  const {
    businessDetails,
    isConnected,
    isSubmitting,
    isConnecting,
    verificationStatus,
    error,
    successMessage,
  } = useSelector((state) => state.whatsapp);

  const [isExpanded, setIsExpanded] = useState(true);

  const businessCategories = [
    "Accommodation",
    "Automotive",
    "Business Services",
    "Education",
    "Entertainment",
    "Finance Services",
    "Food & Beverage",
    "Government",
    "Healthcare",
    "Non-profit",
    "Professional Services",
    "Real Estate",
    "Retail",
    "Technology",
    "Travel & Transportation",
    "Other",
  ];

  const handleInputChange = (field, value) => {
    dispatch(updateBusinessForm({ [field]: value }));
  };

  const handleSubmit = async () => {
    try {
      await dispatch(submitBusinessVerification(businessDetails)).unwrap();
    } catch (error) {
      console.error("Submission failed:", error);
    }
  };

  const handleFacebookSuccess = (data) => {
    console.log("Facebook login successful:", data);
  };

  // Clear messages after some time
  useEffect(() => {
    if (error || successMessage) {
      const timer = setTimeout(() => {
        dispatch(clearError());
        dispatch(clearSuccess());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, successMessage, dispatch]);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-heading font-semibold text-foreground">
          Business Account Configuration
        </h1>
      </div>

      {/* Success/Error Messages */}
      {successMessage && (
        <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-md">
          {successMessage}
        </div>
      )}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-md">
          {error}
        </div>
      )}

      {/* Facebook Login Button */}
      <div className="flex justify-end gap-3 mb-6">
        <FacebookLogin
          disabled={isConnected || isConnecting}
          onSuccess={handleFacebookSuccess}
        />
        {isConnected && (
          <span className="ml-3 text-sm text-green-600 flex items-center">
            ✓ Connected to WhatsApp Business
          </span>
        )}
      </div>

      {/* WhatsApp Business Account Verification Card */}
      <Card className="border border-border shadow-sm">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-3 text-lg font-heading">
              <div className="w-6 h-6 rounded-full bg-green-100 flex items-center justify-center">
                <div className="w-3 h-3 rounded-full bg-green-600"></div>
              </div>
              WhatsApp Business Account Verification
              {verificationStatus !== "pending" && (
                <span
                  className={`text-xs px-2 py-1 rounded-full ${
                    verificationStatus === "approved"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {verificationStatus}
                </span>
              )}
            </CardTitle>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsExpanded(!isExpanded)}
              className="h-6 w-6"
            >
              <ChevronDown
                className={`h-4 w-4 transition-transform ${
                  isExpanded ? "rotate-180" : ""
                }`}
              />
            </Button>
          </div>
        </CardHeader>

        {isExpanded && (
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Business Name */}
              <div className="space-y-2">
                <Label
                  htmlFor="businessName"
                  className="text-sm font-medium text-foreground"
                >
                  Business Name *
                </Label>
                <Input
                  id="businessName"
                  value={businessDetails.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Enter your business name"
                  className="w-full"
                  disabled={verificationStatus === "approved"}
                />
              </div>

              {/* Business Category */}
              <div className="space-y-2">
                <Label
                  htmlFor="businessCategory"
                  className="text-sm font-medium text-foreground"
                >
                  Business Category *
                </Label>
                <Select
                  value={businessDetails.category}
                  onValueChange={(value) =>
                    handleInputChange("category", value)
                  }
                  disabled={verificationStatus === "approved"}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {businessCategories.map((category) => (
                      <SelectItem
                        key={category}
                        value={category.toLowerCase().replace(/\s+/g, "_")}
                      >
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Business Description */}
            <div className="space-y-2">
              <Label
                htmlFor="businessDescription"
                className="text-sm font-medium text-foreground"
              >
                Business Description (Optional)
              </Label>
              <Textarea
                id="businessDescription"
                value={businessDetails.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                placeholder="Describe your business..."
                className="w-full min-h-[120px] resize-none"
                disabled={verificationStatus === "approved"}
              />
            </div>

            {/* Phone Number */}
            <div className="space-y-2">
              <Label
                htmlFor="phoneNumber"
                className="text-sm font-medium text-foreground"
              >
                Phone Number with Country Code *
              </Label>
              <Input
                id="phoneNumber"
                value={businessDetails.phoneNumber}
                onChange={(e) =>
                  handleInputChange("phoneNumber", e.target.value)
                }
                placeholder="+1 (555) 123-4567"
                className="w-full"
                disabled={verificationStatus === "approved"}
              />
            </div>
          </CardContent>
        )}
      </Card>

      {/* Quick Response Templates */}
      <Card className="border border-border shadow-sm">
        <CardContent className="p-6">
          <div className="text-center space-y-4">
            <p className="text-muted-foreground text-sm">No messages yet</p>
            <div className="flex flex-wrap justify-center gap-2">
              <Button variant="outline" size="sm" className="text-xs px-3 py-1">
                Greeting
              </Button>
              <Button variant="outline" size="sm" className="text-xs px-3 py-1">
                Appointment
              </Button>
              <Button variant="outline" size="sm" className="text-xs px-3 py-1">
                Offers
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Submit Button */}
      <div className="flex justify-end pt-4">
        <Button
          onClick={handleSubmit}
          className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-2"
          disabled={
            !businessDetails.name ||
            !businessDetails.category ||
            isSubmitting ||
            verificationStatus === "approved"
          }
        >
          {isSubmitting ? "Submitting..." : "Submit For Verification"}
        </Button>
      </div>
    </div>
  );
};

export default WhatsappSettings;

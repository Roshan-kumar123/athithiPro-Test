import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Checkbox } from "../ui/checkbox";
import { Switch } from "../ui/switch";
import { Label } from "../ui/label";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { toast } from "sonner";
import {
  onboardingSteps,
  // OnboardingStep,
  // FormField,
} from "../../utils/onboarding-utils";
import Layout from "../layouts/Layout";
import { checkEmailExists, submitOnboarding } from "../../store/slices/auth/authThunk";
import { clearEmailCheck, clearOnboardingStatus } from "../../store/slices/auth/authSlice";

const OnboardingWizard = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [emailCheckInitiated, setEmailCheckInitiated] = useState(false);

  // Get relevant state from Redux store
  const { 
    emailExists, 
    emailChecking, 
    emailCheckError,
    onboardingLoading, 
    onboardingError,
    onboardingSuccess
  } = useSelector((state) => state.auth);

  const currentStep = onboardingSteps[currentStepIndex];

  // Clear email check status when component unmounts
  useEffect(() => {
    return () => {
      dispatch(clearEmailCheck());
      dispatch(clearOnboardingStatus());
    };
  }, [dispatch]);

  // Watch for onboarding success and redirect
  useEffect(() => {
    if (onboardingSuccess) {
      toast.success("Onboarding completed successfully!");
      navigate("/onboarding/complete");
    }
  }, [onboardingSuccess, navigate]);

  // Watch for errors from the API
  useEffect(() => {
    if (onboardingError) {
      toast.error(onboardingError);
    }
    if (emailCheckError) {
      toast.error(emailCheckError);
    }
  }, [onboardingError, emailCheckError]);

  // Watch for email exists status and set error
  useEffect(() => {
    if (emailCheckInitiated && emailExists) {
      setErrors(prev => ({
        ...prev,
        email: "This email already exists. Please use another email."
      }));
    }
  }, [emailExists, emailCheckInitiated]);

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field.id]: value,
    }));

    // Clear error for this field if it exists
    if (errors[field.id]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field.id];
        return newErrors;
      });
    }

    // Reset email check initiated flag if changing email
    if (field.id === 'email') {
      setEmailCheckInitiated(false);
      dispatch(clearEmailCheck());
    }
  };

  // Add this new function to handle email blur
  const handleEmailBlur = async (email) => {
    // Only check if there's a valid email
    if (email && email.includes('@')) {
      setEmailCheckInitiated(true);
      const resultAction = await dispatch(checkEmailExists(email));
      
      // Check if the API call was successful and get the result
      if (checkEmailExists.fulfilled.match(resultAction)) {
        // If email exists, set error
        if (resultAction.payload.exists) {
          setErrors(prev => ({
            ...prev,
            email: "This email already exists. Please use another email."
          }));
          toast.error("This email already exists. Please use another email.");
        }
      } else if (checkEmailExists.rejected.match(resultAction)) {
        // Handle API call failure
        toast.error("Failed to check email. Please try again.");
      }
    }
  };

  const validateStep = async () => {
    const newErrors = {};
    let isValid = true;

    currentStep.fields.forEach((field) => {
      if (
        field.required &&
        (!formData[field.id] || formData[field.id] === "")
      ) {
        newErrors[field.id] = "This field is required";
        isValid = false;
      }

      if (
        field.type === "email" &&
        formData[field.id] &&
        !formData[field.id].includes("@")
      ) {
        newErrors[field.id] = "Please enter a valid email address";
        isValid = false;
      }

      if (
        field.type === "password" &&
        formData[field.id] &&
        formData[field.id].length < 8
      ) {
        newErrors[field.id] = "Password must be at least 8 characters";
        isValid = false;
      }
    });

    setErrors(newErrors);

    // If we're on the first step and we have a valid email field, check if it exists
    if (isValid && currentStepIndex === 0 && formData.email) {
      setEmailCheckInitiated(true);
      const resultAction = await dispatch(checkEmailExists(formData.email));
      
      // Check if the API call was successful and get the result
      if (checkEmailExists.fulfilled.match(resultAction)) {
        // If email exists, set error and return false
        if (resultAction.payload.exists) {
          setErrors(prev => ({
            ...prev,
            email: "This email already exists. Please use another email."
          }));
          return false;
        }
      } else if (checkEmailExists.rejected.match(resultAction)) {
        // Handle API call failure
        // toast.error("Failed to check email. Please try again.");
        return false;
      }
    }

    return isValid;
  };

  const handleNext = async () => {
    const isValid = await validateStep();
    
    if (isValid) {
      if (currentStepIndex < onboardingSteps.length - 1) {
        setCurrentStepIndex((prev) => prev + 1);
      } else {
        handleSubmit();
      }
    }
  };

  const handleBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = () => {
    // Prepare the payload according to the API requirements with proper defaults
    const payload = {
      // orgName: formData.orgName || "",  // Make sure orgName is included
      fullName: formData.fullName || "",
      email: formData.email || "",
      password: formData.password || "",
      agencyName: formData.agencyName || "",
      gstRegistered: formData.gstRegistered === true,
      gstNumber: formData.gstRegistered === true ? (formData.gstNumber || "") : "",
      yearsInBusiness: parseInt(formData.yearsInBusiness || "0", 10),
      primaryMarkets: formData.primaryMarkets || "",
      averageDailyEnquiry: formData.averageDailyEnquiry || "",
      brandColor: formData.brandColor || "#0F4C81",
      bio: formData.bio || "",
      mobileNumber: formData.mobileNumber || "",
      preferredContactMethod: formData.preferredContactMethod || "EMAIL", // Set default
      termsAccepted: formData.termsAccepted === true
    };

    console.log("Submitting form data:", payload);
    // Dispatch the onboarding submission thunk
    dispatch(submitOnboarding(payload))
      .unwrap()
      .then(() => {
        toast.success("Onboarding completed successfully!");
        navigate("/onboarding/complete");
      })
      .catch((error) => {
        if (error && error.errors) {
          // Handle structured validation errors from API
          const newErrors = {};
          error.errors.forEach(err => {
            newErrors[err.path] = err.msg;
          });
          setErrors(newErrors);
          
          // Show first error in toast
          if (error.errors.length > 0) {
            toast.error(error.errors[0].msg);
          }
        } else {
          toast.error(error || "An error occurred during submission");
        }
      });
  };

  const renderField = (field) => {
    switch (field.type) {
      case "text":
      case "email":
      case "password":
      case "tel":
      case "number":
        return (
          <div className="space-y-2" key={field.id}>
            <Label htmlFor={field.id}>{field.label}</Label>
            <Input
              id={field.id}
              type={field.type}
              placeholder={field.placeholder}
              value={formData[field.id] || ""}
              onChange={(e) => handleInputChange(field, e.target.value)}
              // Add onBlur handler for email fields
              onBlur={field.type === "email" ? 
                (e) => handleEmailBlur(e.target.value) : 
                undefined
              }
              className={errors[field.id] ? "border-red-500" : ""}
            />
            {errors[field.id] && (
              <p className="text-sm text-red-500">{errors[field.id]}</p>
            )}
          </div>
        );

      case "textarea":
        return (
          <div className="space-y-2" key={field.id}>
            <Label htmlFor={field.id}>{field.label}</Label>
            <Textarea
              id={field.id}
              placeholder={field.placeholder}
              value={formData[field.id] || ""}
              onChange={(e) => handleInputChange(field, e.target.value)}
              className={errors[field.id] ? "border-red-500" : ""}
            />
            {errors[field.id] && (
              <p className="text-sm text-red-500">{errors[field.id]}</p>
            )}
          </div>
        );

      case "checkbox":
        return (
          <div className="flex items-center space-x-2" key={field.id}>
            <Checkbox
              id={field.id}
              checked={formData[field.id] || false}
              onCheckedChange={(checked) => handleInputChange(field, !!checked)}
            />
            <Label htmlFor={field.id}>{field.label}</Label>
            {errors[field.id] && (
              <p className="text-sm text-red-500">{errors[field.id]}</p>
            )}
          </div>
        );

      case "toggle":
        return (
          <div className="flex items-center justify-between" key={field.id}>
            <Label htmlFor={field.id}>{field.label}</Label>
            <Switch
              id={field.id}
              checked={formData[field.id] || false}
              onCheckedChange={(checked) => handleInputChange(field, checked)}
            />
          </div>
        );

      case "radio":
        return (
          <div className="space-y-2" key={field.id}>
            <Label>{field.label}</Label>
            <RadioGroup
              value={formData[field.id] || ""}
              onValueChange={(value) => handleInputChange(field, value)}
            >
              <div className="space-y-2">
                {field.options?.map((option) => (
                  <div
                    className="flex items-center space-x-2"
                    key={option.value}
                  >
                    <RadioGroupItem
                      value={option.value}
                      id={`${field.id}-${option.value}`}
                    />
                    <Label htmlFor={`${field.id}-${option.value}`}>
                      {option.label}
                    </Label>
                  </div>
                ))}
              </div>
            </RadioGroup>
            {errors[field.id] && (
              <p className="text-sm text-red-500">{errors[field.id]}</p>
            )}
          </div>
        );

      case "select":
        return (
          <div className="space-y-2" key={field.id}>
            <Label htmlFor={field.id}>{field.label}</Label>
            <Select
              value={formData[field.id] || ""}
              onValueChange={(value) => handleInputChange(field, value)}
            >
              <SelectTrigger
                className={errors[field.id] ? "border-red-500" : ""}
              >
                <SelectValue placeholder="Select an option" />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors[field.id] && (
              <p className="text-sm text-red-500">{errors[field.id]}</p>
            )}
          </div>
        );

      case "multiselect":
        // Simplified implementation - in a real app, you'd want a proper multiselect component
        return (
          <div className="space-y-2" key={field.id}>
            <Label htmlFor={field.id}>{field.label}</Label>
            <Select
              value={formData[field.id]?.[0] || ""}
              onValueChange={(value) => handleInputChange(field, [value])}
            >
              <SelectTrigger
                className={errors[field.id] ? "border-red-500" : ""}
              >
                <SelectValue placeholder="Select options" />
              </SelectTrigger>
              <SelectContent>
                {field.options?.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground">
              In the full version, you would be able to select multiple options
            </p>
            {errors[field.id] && (
              <p className="text-sm text-red-500">{errors[field.id]}</p>
            )}
          </div>
        );

      case "file":
        return (
          <div className="space-y-2" key={field.id}>
            <Label htmlFor={field.id}>{field.label}</Label>
            <div className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-travel-blue transition-colors">
              <input
                type="file"
                id={field.id}
                className="hidden"
                onChange={(e) => handleInputChange(field, e.target.files?.[0])}
              />
              <label htmlFor={field.id} className="cursor-pointer">
                <div className="flex flex-col items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-travel-blue mb-2"
                  >
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="17 8 12 3 7 8"></polyline>
                    <line x1="12" y1="3" x2="12" y2="15"></line>
                  </svg>
                  <span className="text-sm text-gray-500">
                    {formData[field.id]?.name ||
                      field.placeholder ||
                      "Click to upload"}
                  </span>
                </div>
              </label>
            </div>
          </div>
        );

      case "color":
        return (
          <div className="space-y-2" key={field.id}>
            <Label htmlFor={field.id}>{field.label}</Label>
            <div className="flex items-center space-x-4">
              <input
                type="color"
                id={field.id}
                value={formData[field.id] || "#0F4C81"}
                onChange={(e) => handleInputChange(field, e.target.value)}
                className="w-10 h-10 rounded-full border-0 cursor-pointer"
              />
              <span className="text-sm">{formData[field.id] || "#0F4C81"}</span>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto px-6 md:px-0 py-10">
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-travel-blue">
              {currentStep.title}
            </h1>
            <div className="text-sm text-gray-500">
              Step {currentStepIndex + 1} of {onboardingSteps.length}
            </div>
          </div>

          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-travel-teal h-2 rounded-full transition-all duration-300"
              style={{
                width: `${
                  ((currentStepIndex + 1) / onboardingSteps.length) * 100
                }%`,
              }}
            ></div>
          </div>
        </div>

        <Card className="p-6 md:p-8">
          {currentStep.description && (
            <p className="text-gray-500 mb-6">{currentStep.description}</p>
          )}

          <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
            {currentStep.fields.map((field) => renderField(field))}

            <div className="flex justify-between pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleBack}
                disabled={currentStepIndex === 0}
              >
                Back
              </Button>

              <Button
                type="button"
                onClick={handleNext}
                disabled={onboardingLoading || emailChecking}
                className="bg-travel-blue hover:bg-travel-blue/90"
              >
                {onboardingLoading || emailChecking ? (
                  "Loading..."
                ) : currentStepIndex === onboardingSteps.length - 1 ? (
                  "Complete Setup"
                ) : (
                  "Continue"
                )}
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </Layout>
  );
};

export default OnboardingWizard;

import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "../../../hooks/use-toast.js";
import { updatePriorityScore } from "../../../store/slices/organizations/organizationThunk";

export const usePriorityScore = () => {
  const dispatch = useDispatch();
  const { isUpdating } = useSelector((state) => state.organizations);

  const [priorityScoring, setPriorityScoring] = useState({
    version: "1.0.0",
    attributes: [],
  });

  const [editingAttribute, setEditingAttribute] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const [currentAttribute, setCurrentAttribute] = useState({
    key: "",
    label: "",
    type: "date",
    weight: 1,
    orgId: "",
    orgName: "",
    orgEmail: "",
    rules: {
      ranges: [],
      values: {},
      sets: [],
      defaultScore: 0,
    },
  });

  // Add state for new enum value being added
  const [newEnumValue, setNewEnumValue] = useState({ key: "", value: "" });
  const [isAddingEnumValue, setIsAddingEnumValue] = useState(false);

  const resetForm = () => {
    setCurrentAttribute((prev) => ({
      key: "",
      label: "",
      type: "date",
      weight: 1,
      // Preserve organization data
      orgId: prev.orgId,
      orgName: prev.orgName,
      orgEmail: prev.orgEmail,
      rules: {
        ranges: [],
        values: {},
        sets: [],
        defaultScore: 0,
      },
    }));
    setEditingAttribute(null);
    setIsEditing(false);
    // Reset enum value state
    setNewEnumValue({ key: "", value: "" });
    setIsAddingEnumValue(false);
  };

  const validateAttribute = () => {
    if (!currentAttribute.orgId) {
      toast({
        title: "Error",
        description: "Agency is required",
        variant: "destructive",
      });
      return false;
    }
    if (!currentAttribute.key || !currentAttribute.label) {
      toast({
        title: "Error",
        description: "Key and Label are required",
        variant: "destructive",
      });
      return false;
    }

    if (
      currentAttribute.rules.defaultScore === undefined ||
      currentAttribute.rules.defaultScore === null
    ) {
      toast({
        title: "Error",
        description: "Default Score is required",
        variant: "destructive",
      });
      return false;
    }

    // Type-specific validations
    if (
      currentAttribute.type === "date" &&
      currentAttribute.rules.ranges.length === 0
    ) {
      toast({
        title: "Error",
        description: "At least one date range is required for date type",
        variant: "destructive",
      });
      return false;
    }

    if (
      currentAttribute.type === "enum" &&
      (!currentAttribute.rules.values ||
        Object.keys(currentAttribute.rules.values).length === 0)
    ) {
      toast({
        title: "Error",
        description: "At least one enum value is required for enum type",
        variant: "destructive",
      });
      return false;
    }

    if (
      currentAttribute.type === "set" &&
      currentAttribute.rules.sets.length === 0
    ) {
      toast({
        title: "Error",
        description: "At least one set is required for set type",
        variant: "destructive",
      });
      return false;
    }

    return true;
  };

  // Function to format attribute for API
  const formatAttributeForAPI = (attr) => {
    return {
      key: attr.key,
      label: attr.label,
      type: attr.type,
      weight: attr.weight,
      rules: {
        ranges: attr.rules.ranges || [],
        values: attr.rules.values || {},
        sets: attr.rules.sets || [],
        defaultScore: attr.rules.defaultScore || 0,
      },
    };
  };

  // Function to prepare payload for API
  const prepareAPIPayload = (attributes, orgId) => {
    return {
      orgId: orgId,
      attributes: attributes.map(formatAttributeForAPI),
    };
  };

  const addOrUpdateAttribute = async () => {
    if (!validateAttribute()) {
      return;
    }

    let updatedAttributes;

    if (isEditing && editingAttribute) {
      updatedAttributes = priorityScoring.attributes.map((attr) =>
        attr.key === editingAttribute.key ? currentAttribute : attr
      );

      setPriorityScoring((prev) => ({
        ...prev,
        attributes: updatedAttributes,
      }));

      toast({
        title: "Success",
        description: "Attribute updated successfully",
      });
    } else {
      // Check for duplicate keys in the current list
      if (
        priorityScoring.attributes.some(
          (attr) => attr.key === currentAttribute.key
        )
      ) {
        toast({
          title: "Error",
          description: "Attribute key must be unique",
          variant: "destructive",
        });
        return;
      }

      updatedAttributes = [...priorityScoring.attributes, currentAttribute];

      // Add new attribute to the existing list
      setPriorityScoring((prev) => ({
        ...prev,
        attributes: updatedAttributes,
      }));

      toast({
        title: "Success",
        description: "Attribute added successfully",
      });
    }

    // Call API to update priority score
    try {
      const payload = prepareAPIPayload(
        updatedAttributes,
        currentAttribute.orgId
      );
      await dispatch(updatePriorityScore(payload)).unwrap();

      toast({
        title: "Success",
        description: "Priority score configuration saved successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save priority score configuration",
        variant: "destructive",
      });
      console.error("Failed to update priority score:", error);
    }

    resetForm();
  };

  const editAttribute = (attribute) => {
    // Ensure the attribute has proper structure before editing
    const attributeToEdit = {
      ...attribute,
      rules: {
        ranges: attribute.rules?.ranges || [],
        values: attribute.rules?.values || {},
        sets: attribute.rules?.sets || [],
        defaultScore: attribute.rules?.defaultScore || 0,
      },
    };

    setCurrentAttribute({ ...attributeToEdit });
    setEditingAttribute(attributeToEdit);
    setIsEditing(true);
  };

  const deleteAttribute = async (key) => {
    const updatedAttributes = priorityScoring.attributes.filter(
      (attr) => attr.key !== key
    );

    setPriorityScoring((prev) => ({
      ...prev,
      attributes: updatedAttributes,
    }));

    toast({
      title: "Success",
      description: "Attribute deleted successfully",
    });

    // Call API to update priority score if there's an orgId
    if (currentAttribute.orgId && updatedAttributes.length >= 0) {
      try {
        const payload = prepareAPIPayload(
          updatedAttributes,
          currentAttribute.orgId
        );
        await dispatch(updatePriorityScore(payload)).unwrap();

        toast({
          title: "Success",
          description: "Priority score configuration updated successfully",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to update priority score configuration",
          variant: "destructive",
        });
        console.error("Failed to update priority score:", error);
      }
    }
  };

  const handleTypeChange = (value) => {
    setCurrentAttribute((prev) => ({ ...prev, type: value }));
  };

  const submitPriorityScoring = async () => {
    if (priorityScoring.attributes.length === 0) {
      toast({
        title: "Error",
        description: "At least one attribute is required before submitting",
        variant: "destructive",
      });
      return;
    }

    try {
      const payload = prepareAPIPayload(
        priorityScoring.attributes,
        currentAttribute.orgId
      );
      await dispatch(updatePriorityScore(payload)).unwrap();

      toast({
        title: "Success",
        description: `Priority scoring with ${priorityScoring.attributes.length} attributes submitted successfully!`,
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit priority score configuration",
        variant: "destructive",
      });
      console.error("Failed to submit priority score:", error);
    }
  };

  const addRange = () => {
    setCurrentAttribute((prev) => ({
      ...prev,
      rules: {
        ...prev.rules,
        ranges: [
          ...prev.rules.ranges,
          { minDaysAgo: 0, maxDaysAgo: null, score: 0 },
        ],
      },
    }));
  };

  const updateRange = (index, field, value) => {
    setCurrentAttribute((prev) => ({
      ...prev,
      rules: {
        ...prev.rules,
        ranges: prev.rules.ranges.map((range, i) =>
          i === index ? { ...range, [field]: value } : range
        ),
      },
    }));
  };

  const removeRange = (index) => {
    setCurrentAttribute((prev) => ({
      ...prev,
      rules: {
        ...prev.rules,
        ranges: prev.rules.ranges.filter((_, i) => i !== index),
      },
    }));
  };

  const addSet = () => {
    setCurrentAttribute((prev) => ({
      ...prev,
      rules: {
        ...prev.rules,
        sets: [...prev.rules.sets, { name: "", values: [], score: 0 }],
      },
    }));
  };

  const updateSet = (index, field, value) => {
    setCurrentAttribute((prev) => ({
      ...prev,
      rules: {
        ...prev.rules,
        sets: prev.rules.sets.map((set, i) =>
          i === index ? { ...set, [field]: value } : set
        ),
      },
    }));
  };

  const removeSet = (index) => {
    setCurrentAttribute((prev) => ({
      ...prev,
      rules: {
        ...prev.rules,
        sets: prev.rules.sets.filter((_, i) => i !== index),
      },
    }));
  };

  // Updated enum value functions
  const startAddingEnumValue = () => {
    setIsAddingEnumValue(true);
    setNewEnumValue({ key: "", value: "" });
  };

  const cancelAddingEnumValue = () => {
    setIsAddingEnumValue(false);
    setNewEnumValue({ key: "", value: "" });
  };

  const confirmAddEnumValue = () => {
    if (!newEnumValue.key.trim()) {
      toast({
        title: "Error",
        description: "Key is required",
        variant: "destructive",
      });
      return;
    }

    if (!newEnumValue.value.trim()) {
      toast({
        title: "Error",
        description: "Value is required",
        variant: "destructive",
      });
      return;
    }

    const numericValue = parseFloat(newEnumValue.value);
    if (isNaN(numericValue)) {
      toast({
        title: "Error",
        description: "Value must be a valid number",
        variant: "destructive",
      });
      return;
    }

    // Check for duplicate keys
    if (
      currentAttribute.rules.values &&
      currentAttribute.rules.values[newEnumValue.key]
    ) {
      toast({
        title: "Error",
        description: "Key already exists",
        variant: "destructive",
      });
      return;
    }

    setCurrentAttribute((prev) => ({
      ...prev,
      rules: {
        ...prev.rules,
        values: {
          ...prev.rules.values,
          [newEnumValue.key]: numericValue,
        },
      },
    }));

    // Reset the form
    setIsAddingEnumValue(false);
    setNewEnumValue({ key: "", value: "" });

    toast({
      title: "Success",
      description: "Enum value added successfully",
    });
  };

  const removeEnumValue = (key) => {
    setCurrentAttribute((prev) => {
      const newValues = { ...prev.rules.values };
      delete newValues[key];
      return {
        ...prev,
        rules: {
          ...prev.rules,
          values: newValues,
        },
      };
    });
  };

  return {
    // State
    priorityScoring,
    setPriorityScoring,
    currentAttribute,
    setCurrentAttribute,
    isEditing,
    editingAttribute,
    isUpdating,

    // Enum value state
    newEnumValue,
    setNewEnumValue,
    isAddingEnumValue,

    // Actions
    addOrUpdateAttribute,
    editAttribute,
    deleteAttribute,
    resetForm,
    handleTypeChange,
    submitPriorityScoring,

    // Range actions
    addRange,
    updateRange,
    removeRange,

    // Set actions
    addSet,
    updateSet,
    removeSet,

    // Updated enum actions
    startAddingEnumValue,
    cancelAddingEnumValue,
    confirmAddEnumValue,
    removeEnumValue,
  };
};

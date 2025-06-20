import React from "react";
import Header from "./Header";
import AttributeForm from "./AttributeForm";
import AttributesList from "./AttributeList";
import SubmitSection from "./SubmitSection";
import JsonPreview from "./JsonPreview";
import { usePriorityScore } from "./usePriorityScore";

const PriorityScore = () => {
  const {
    // State
    priorityScoring,
    setPriorityScoring,
    currentAttribute,
    setCurrentAttribute,
    isEditing,
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
  } = usePriorityScore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <Header />

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          {/* Form Section */}
          <AttributeForm
            currentAttribute={currentAttribute}
            setCurrentAttribute={setCurrentAttribute}
            isEditing={isEditing}
            handleTypeChange={handleTypeChange}
            addOrUpdateAttribute={addOrUpdateAttribute}
            resetForm={resetForm}
            addRange={addRange}
            updateRange={updateRange}
            removeRange={removeRange}
            startAddingEnumValue={startAddingEnumValue}
            cancelAddingEnumValue={cancelAddingEnumValue}
            confirmAddEnumValue={confirmAddEnumValue}
            removeEnumValue={removeEnumValue}
            newEnumValue={newEnumValue}
            setNewEnumValue={setNewEnumValue}
            isAddingEnumValue={isAddingEnumValue}
            addSet={addSet}
            updateSet={updateSet}
            removeSet={removeSet}
            setPriorityScoring={setPriorityScoring}
            priorityScoring={priorityScoring}
            isUpdating={isUpdating}
          />

          {/* Attributes List */}
          <AttributesList
            priorityScoring={priorityScoring}
            editAttribute={editAttribute}
            deleteAttribute={deleteAttribute}
          />
        </div>

        {/* Submit Section */}
        <SubmitSection
          priorityScoring={priorityScoring}
          submitPriorityScoring={submitPriorityScoring}
        />

        {/* JSON Preview */}
        <JsonPreview priorityScoring={priorityScoring} />
      </div>
    </div>
  );
};

export default PriorityScore;

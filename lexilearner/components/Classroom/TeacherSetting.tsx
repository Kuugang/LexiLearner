import React, { useState, useRef, useEffect, useCallback } from "react";
import { Text } from "@/components/ui/text";
import {
  ScrollView,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Keyboard,
} from "react-native";
import { Button } from "@/components/ui/button";
import BackHeader from "@/components/BackHeader";
import { Input } from "@/components/ui/input";
import { TextArea } from "@/components/ui/textarea";
import { SearchBarRef } from "@/components/Classroom/SearchBar";
import { Pupil } from "@/services/ClassroomService";
import { router } from "expo-router";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import AddPupilModal from "./AddPupilModal";

import { displayPupilName, getRandomColor } from "@/utils/utils";
import ConfirmModal from "../Modal";
import LoadingScreen from "../LoadingScreen";

type TeacherSettingsProps = {
  selectedClassroom: any;
  setSelectedClassroom: (classroom: any) => void;
  enrolledPupils: Pupil[] | undefined;
  loadingPupils: boolean;
  editClassroomMutation: any;
  deleteClassroomMutation: any;
  removePupilMutation: any;
  addPupilMutation: any;
  apiSearchPupils: (query: string) => Promise<Pupil[]>;
};

export default function TeacherSetting({
  selectedClassroom,
  setSelectedClassroom,
  enrolledPupils,
  loadingPupils,
  editClassroomMutation,
  deleteClassroomMutation,
  addPupilMutation,
  removePupilMutation,
  apiSearchPupils,
}: TeacherSettingsProps) {
  const [editClassroomForm, setEditClassroomForm] = useState({
    name: selectedClassroom?.name || "",
    description: selectedClassroom?.description || "",
  });

  const [searchText, setSearchText] = useState("");
  const [filteredPupils, setFilteredPupils] = useState<Pupil[]>([]);
  const [showAddPupilModal, setShowAddPupilModal] = useState(false);
  const [searching, setSearching] = useState(false);
  const [showCurrentPupils, setShowCurrentPupils] = useState(false);
  const [selectedPupils, setSelectedPupils] = useState<Pupil[]>([]);

  const [showRemovePupilModal, setShowRemovePupilModal] = useState(false);
  const [pupilToRemove, setPupilToRemove] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [showDeleteClassroomModal, setShowDeleteClassroomModal] =
    useState(false);
  const [showEditClassroomModal, setShowEditClassroomModal] = useState(false);
  const [showAddPupilsConfirmModal, setShowAddPupilsConfirmModal] =
    useState(false);
  const [showCancelAddPupilsModal, setShowCancelAddPupilsModal] =
    useState(false);

  const [isLoading, setIsLoading] = useState(false);

  const searchInputRef = useRef<SearchBarRef>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isClearing = useRef(false);
  const [showNoResults, setShowNoResults] = useState(false);

  useEffect(() => {
    if (showAddPupilModal && searchInputRef.current) {
      setTimeout(() => {
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }, 100);
    }
  }, [showAddPupilModal]);

  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    setShowNoResults(false);

    if (searchText.length === 0 && !isClearing.current) {
      setTimeout(() => {
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }, 100);
    }

    if (!showAddPupilModal) {
      setFilteredPupils([]);
      return;
    }

    if (searchText.length <= 1) {
      setFilteredPupils([]);
      setSearching(false);
    }

    if (searchText.length > 2) {
      setSearching(true);
    }

    debounceTimerRef.current = setTimeout(async () => {
      if (searchText.length <= 2) {
        setSearching(false);
        return;
      }

      try {
        const results = await apiSearchPupils(searchText);

        const filteredResults = results.filter(
          (pupil) =>
            !enrolledPupils?.some(
              (enrolledPupil) => enrolledPupil.id === pupil.id
            )
        );

        setFilteredPupils(filteredResults);

        if (filteredResults.length === 0 && searchText.length > 2) {
          setTimeout(() => {
            setShowNoResults(true);
          }, 200);
        }

        setTimeout(() => {
          if (searchInputRef.current && !isClearing.current) {
            searchInputRef.current.focus();
          }
        }, 200);
      } catch (error) {
        console.error("Error searching pupils:", error);
        const mockResults: Pupil[] = [
          {
            id: "1",
            firstName: searchText,
            lastName: "Smith",
          },
          {
            id: "2",
            firstName: searchText,
            lastName: "Johnson",
          },
          {
            id: "3",
            firstName: searchText,
            lastName: "Williams",
          },
        ];
        setFilteredPupils(mockResults);

        if (mockResults.length === 0) {
          setTimeout(() => {
            setShowNoResults(true);
          }, 200);
        }

        setTimeout(() => {
          if (searchInputRef.current && !isClearing.current) {
            searchInputRef.current.focus();
          }
        }, 200);
      } finally {
        setSearching(false);
      }
    }, 1000);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [searchText, enrolledPupils, showAddPupilModal, apiSearchPupils]);

  const handleCancelAddPupilModal = () => {
    if (selectedPupils.length >= 2) {
      setShowCancelAddPupilsModal(true);
    } else {
      handleConfirmCancelAddPupils();
    }
  };

  const handleConfirmCancelAddPupils = () => {
    isClearing.current = true;
    Keyboard.dismiss();
    setSearchText("");
    setSelectedPupils([]);
    setShowAddPupilModal(false);
    setShowCancelAddPupilsModal(false);
    setTimeout(() => {
      isClearing.current = false;
    }, 300);
  };

  const handleDeleteClassroomPress = () => {
    setShowDeleteClassroomModal(true);
  };

  const handleConfirmDeleteClassroom = async () => {
    if (selectedClassroom?.id) {
      try {
        setIsLoading(true);
        await deleteClassroomMutation({
          classroomId: selectedClassroom.id,
        });
        setSelectedClassroom(null);
        setShowDeleteClassroomModal(false);
        router.push("/classroom");
      } catch (error) {
        console.error("Error deleting classroom:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleEditClassroomPress = () => {
    setShowEditClassroomModal(true);
  };

  const handleConfirmEditClassroom = async () => {
    if (selectedClassroom?.id) {
      try {
        await editClassroomMutation({
          classroomForm: editClassroomForm,
          classroomId: selectedClassroom.id,
        });

        setSelectedClassroom({
          ...selectedClassroom,
          ...editClassroomForm,
        });

        setShowEditClassroomModal(false);
        router.back();
        console.log("Classroom edited successfully");
      } catch (error) {
        console.error("Error editing classroom:", error);
      }
    } else {
      console.error("Classroom ID is not available");
    }
  };

  const handleSelectPupil = (pupil: Pupil) => {
    if (selectedPupils.some((p) => p.id === pupil.id)) {
      setSelectedPupils(selectedPupils.filter((p) => p.id !== pupil.id));
    } else {
      setSelectedPupils([...selectedPupils, pupil]);
    }
  };

  const handleRemoveSelectedPupil = (pupilId: string) => {
    setSelectedPupils(selectedPupils.filter((p) => p.id !== pupilId));
  };

  const handleRemovePupilPress = (pupilId: string, pupilName: string) => {
    setPupilToRemove({ id: pupilId, name: pupilName });
    setShowRemovePupilModal(true);
  };

  const handleConfirmRemovePupil = async () => {
    if (selectedClassroom?.id && pupilToRemove) {
      try {
        setIsLoading(true);
        await removePupilMutation({
          classroomId: selectedClassroom.id,
          pupilId: pupilToRemove.id,
        });
        setShowRemovePupilModal(false);
        setPupilToRemove(null);
        console.log("Pupil removed successfully");
      } catch (error) {
        console.error("Error removing pupil:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleRemovePupil = useCallback(
    async (pupilId: string) => {
      if (selectedClassroom?.id && pupilId) {
        try {
          await removePupilMutation({
            classroomId: selectedClassroom.id,
            pupilId: pupilId,
          });
          console.log("Pupil removed successfully");
        } catch (error) {
          console.error("Error removing pupil:", error);
        }
      }
    },
    [selectedClassroom?.id, removePupilMutation]
  );

  const handleAddSelectedPupils = async () => {
    if (selectedClassroom?.id && selectedPupils.length > 0) {
      try {
        isClearing.current = true;
        Keyboard.dismiss();

        for (const pupil of selectedPupils) {
          await addPupilMutation({
            classroomId: selectedClassroom.id,
            pupilId: pupil.id || "",
          });
        }

        setSelectedPupils([]);
        setSearchText("");
        setShowAddPupilModal(false);
        console.log("Pupils added successfully");

        setTimeout(() => {
          isClearing.current = false;
        }, 300);
      } catch (error) {
        console.error("Error adding pupils:", error);
      }
    }
  };

  const handleAddSelectedPupilsPress = () => {
    if (selectedPupils.length > 0) {
      setShowAddPupilsConfirmModal(true);
    }
  };

  const handleConfirmAddPupils = async () => {
    if (selectedClassroom?.id && selectedPupils.length > 0) {
      try {
        setIsLoading(true);
        isClearing.current = true;
        Keyboard.dismiss();

        for (const pupil of selectedPupils) {
          await addPupilMutation({
            classroomId: selectedClassroom.id,
            pupilId: pupil.id || "",
          });
        }

        setSelectedPupils([]);
        setSearchText("");
        setShowAddPupilModal(false);
        setShowAddPupilsConfirmModal(false);
        console.log("Pupils added successfully");

        setTimeout(() => {
          isClearing.current = false;
        }, 300);
      } catch (error) {
        console.error("Error adding pupils:", error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handleTextChange = (text: string) => {
    setSearchText(text);
    setShowNoResults(false);
  };

  return (
    <View className="flex-1">
      <ScrollView className="bg-background p-8">
        <BackHeader />

        <View className="py-1">
          <Text className="text-[22px] text-center m-5 font-bold">
            Classroom
          </Text>
          <Text className="font-bold">Classroom Name</Text>
          <View>
            <Input
              className="border border-lightGray rounded-md p-2 my-2"
              placeholder={editClassroomForm.name}
              value={editClassroomForm.name}
              onChangeText={(value: string) =>
                setEditClassroomForm({ ...editClassroomForm, name: value })
              }
            />
          </View>
        </View>
        <TextArea
          placeholder="Classroom Description..."
          value={editClassroomForm.description}
          onChangeText={(value: string) =>
            setEditClassroomForm({
              ...editClassroomForm,
              description: value,
            })
          }
        />

        {/* Add Pupil Button */}
        <TouchableOpacity
          className="mt-6 mb-2 p-3 rounded-md flex-row justify-left items-center border border-lightGray rounded-md"
          onPress={() => setShowAddPupilModal(true)}
        >
          <Ionicons name="person-add-outline" size={20} color="black" />
          <Text className="text-black font-semibold ml-2">Add Pupils</Text>
        </TouchableOpacity>

        {/* Current Pupils */}
        <View className="py-4 mt-4">
          <TouchableOpacity
            className="flex-row justify-between items-center border border-lightGray rounded-md p-3"
            onPress={() => setShowCurrentPupils(!showCurrentPupils)}
          >
            <Text className="font-bold text-black">Current Pupils</Text>
            <MaterialIcons
              name={
                showCurrentPupils ? "keyboard-arrow-up" : "keyboard-arrow-down"
              }
              size={24}
              color="#333"
            />
          </TouchableOpacity>

          {showCurrentPupils ? (
            <View className="border-x border-b border-lightGray rounded-b-md">
              {loadingPupils ? (
                <View className="p-4 items-center">
                  <ActivityIndicator size="small" color="#0000ff" />
                </View>
              ) : enrolledPupils && enrolledPupils.length > 0 ? (
                <>
                  {enrolledPupils.map((pupil) => {
                    const avatarColor = getRandomColor(
                      (pupil.firstName || "") + (pupil.lastName || "")
                    );

                    const initials = `${pupil.firstName?.charAt(0) || ""}${
                      pupil.lastName?.charAt(0) || ""
                    }`;

                    return (
                      <View
                        key={pupil.id}
                        className="p-3 border-b border-gray-200 flex-row items-center justify-between"
                      >
                        <View className="flex-row items-center flex-1">
                          <View
                            className="h-8 w-8 rounded-full overflow-hidden mr-3 justify-center items-center"
                            style={{ backgroundColor: avatarColor }}
                          >
                            <Text className="text-white font-bold text-xs">
                              {initials.toUpperCase()}
                            </Text>
                          </View>
                          <Text className="text-black">
                            {displayPupilName(pupil)}
                          </Text>
                        </View>
                        <TouchableOpacity
                          onPress={() =>
                            handleRemovePupilPress(
                              pupil.id || "",
                              displayPupilName(pupil)
                            )
                          }
                          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                        >
                          <Ionicons name="close" size={16} color="#ef4444" />
                        </TouchableOpacity>
                      </View>
                    );
                  })}
                </>
              ) : (
                <View className="p-3">
                  <Text className="text-gray-500 italic">
                    No pupils enrolled in this classroom yet
                  </Text>
                </View>
              )}
            </View>
          ) : null}
        </View>

        <View className="p-5 bottom-0">
          {/* disables sa ni ha  */}
          {/* <Button className="m-5 bg-yellow-500" onPress={() => {}}>
            <Text className="text-black font-semibold">
              Generate Classroom Report
            </Text>
          </Button>  */}
          <Button
            className="mx-4 bg-yellowOrange"
            onPress={handleEditClassroomPress}
          >
            <Text className="text-black font-semibold">Edit Classroom</Text>
          </Button>
          <Button
            className="bg-orange m-4"
            onPress={handleDeleteClassroomPress}
          >
            <Text className="text-white font-semibold">Delete Classroom</Text>
          </Button>
        </View>
      </ScrollView>

      {showAddPupilModal && (
        <AddPupilModal
          searchText={searchText}
          setSearchText={setSearchText}
          filteredPupils={filteredPupils}
          selectedPupils={selectedPupils}
          searching={searching}
          showNoResults={showNoResults}
          handleSelectPupil={handleSelectPupil}
          handleRemoveSelectedPupil={handleRemoveSelectedPupil}
          handleAddSelectedPupils={handleAddSelectedPupilsPress}
          handleTextChange={handleTextChange}
          searchInputRef={searchInputRef}
          isClearing={isClearing}
          onClose={handleCancelAddPupilModal}
        />
      )}

      <ConfirmModal
        visible={showCancelAddPupilsModal}
        title="Cancel Adding Pupils"
        message={`You have ${selectedPupils.length} pupils selected. Are you sure you want to cancel without adding them?`}
        confirmText="Discard"
        cancelText="Cancel"
        onConfirm={handleConfirmCancelAddPupils}
        onCancel={() => setShowCancelAddPupilsModal(false)}
        icon="close"
        highlightedText={selectedPupils.length.toString()}
      />
      <ConfirmModal
        visible={showAddPupilsConfirmModal}
        title="Add Pupils"
        message={`Add ${selectedPupils.length} pupil${
          selectedPupils.length > 1 ? "s" : ""
        } to your classroom?`}
        confirmText="Add"
        cancelText="Cancel"
        onConfirm={handleConfirmAddPupils}
        onCancel={() => setShowAddPupilsConfirmModal(false)}
        icon="person-add"
      />

      <ConfirmModal
        visible={showRemovePupilModal}
        title="Remove Pupil"
        message={`Are you sure to remove ${pupilToRemove?.name} in your classroom?`}
        confirmText="Remove"
        cancelText="Cancel"
        onConfirm={handleConfirmRemovePupil}
        onCancel={() => {
          setShowRemovePupilModal(false);
          setPupilToRemove(null);
        }}
        icon="person-remove"
        highlightedText={pupilToRemove?.name}
      />

      <ConfirmModal
        visible={showDeleteClassroomModal}
        title="Delete Classroom"
        message={`Are you sure you want to delete your classroom ${selectedClassroom?.name}? This action cannot be undone.`}
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={handleConfirmDeleteClassroom}
        onCancel={() => setShowDeleteClassroomModal(false)}
        icon="delete"
        highlightedText={selectedClassroom?.name}
      />

      <ConfirmModal
        visible={showEditClassroomModal}
        title="Edit Classroom"
        message={`Are you sure you want to save changes to your Classroom's name into ${editClassroomForm?.name} and description ${editClassroomForm?.description}?`}
        confirmText="Save"
        cancelText="Cancel"
        onConfirm={handleConfirmEditClassroom}
        onCancel={() => setShowEditClassroomModal(false)}
        icon="edit"
        highlightedText={[
          editClassroomForm.name,
          editClassroomForm.description,
        ]}
      />

      <LoadingScreen
        visible={isLoading}
        overlay={true}
        message="Processing..."
      />
    </View>
  );
}

import React, { useState, useRef, useEffect } from "react";
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

type TeacherSettingsProps = {
  selectedClassroom: any;
  setSelectedClassroom: (classroom: any) => void;
  enrolledPupils: Pupil[] | undefined;
  loadingPupils: boolean;
  editClassroomMutation: any;
  deleteClassroomMutation: any;

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
          { id: "1", firstName: searchText, lastName: "Smith" },
          { id: "2", firstName: searchText, lastName: "Johnson" },
          { id: "3", firstName: searchText, lastName: "Williams" },
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
              className="border border-gray-300 rounded-md p-2 mt-2"
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
          className="mt-6 mb-2 p-3 bg-blue-500 rounded-md flex-row justify-left items-center"
          onPress={() => setShowAddPupilModal(true)}
        >
          <Ionicons name="person-add-outline" size={20} color="black" />
          <Text className="text-black font-semibold ml-2">Add Pupils</Text>
        </TouchableOpacity>

        {/* Current Pupils */}
        <View className="py-4 mt-4">
          <TouchableOpacity
            className="flex-row justify-between items-center border border-gray-300 rounded-md p-3"
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
            <View className="border-x border-b border-gray-300 rounded-b-md bg-white">
              {loadingPupils ? (
                <View className="p-4 items-center">
                  <ActivityIndicator size="small" color="#0000ff" />
                </View>
              ) : enrolledPupils && enrolledPupils.length > 0 ? (
                <>
                  {enrolledPupils.map((pupil) => {
                    const avatarColor = getRandomColor(
                      pupil.firstName + pupil.lastName
                    );
                    const initials = `${pupil.firstName?.charAt(0) || ""}${
                      pupil.lastName?.charAt(0) || ""
                    }`;

                    return (
                      <View
                        key={pupil.id}
                        className="p-3 border-b border-gray-200 flex-row items-center"
                      >
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
          <Button className="m-5 bg-yellow-500" onPress={() => {}}>
            <Text className="text-black font-semibold">
              Generate Classroom Report
            </Text>
          </Button>
          <Button
            className="mx-5 bg-yellow-500"
            onPress={async () => {
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

                  router.back();
                  console.log("Classroom edited successfully");
                } catch (error) {
                  console.error("Error editing classroom:", error);
                }
              } else {
                console.error("Classroom ID is not available");
              }
            }}
          >
            <Text className="text-black font-semibold">Edit Classroom</Text>
          </Button>
          <Button
            className="bg-red-500 m-5"
            onPress={async () => {
              if (selectedClassroom?.id) {
                try {
                  await deleteClassroomMutation({
                    classroomId: selectedClassroom.id,
                  });
                  setSelectedClassroom(null);
                  router.push("/classroom");
                } catch (error) {
                  console.error("Error deleting classroom:", error);
                }
              }
            }}
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
          handleAddSelectedPupils={handleAddSelectedPupils}
          handleTextChange={handleTextChange}
          searchInputRef={searchInputRef}
          isClearing={isClearing}
          onClose={() => {
            isClearing.current = true;
            Keyboard.dismiss();
            setSearchText("");
            setSelectedPupils([]);
            setShowAddPupilModal(false);
            setTimeout(() => {
              isClearing.current = false;
            }, 300);
          }}
        />
      )}
    </View>
  );
}

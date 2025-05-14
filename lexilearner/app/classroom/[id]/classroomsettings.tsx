import React, { useContext, useState, useEffect } from "react";
import { Text } from "@/components/ui/text";
import {
  ScrollView,
  View,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Button } from "@/components/ui/button";
import BackHeader from "@/components/BackHeader";
import { Input } from "@/components/ui/input";
import { useClassroomStore } from "@/stores/classroomStore";
import { TextArea } from "@/components/ui/textarea";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import {
  editClassroom as apiEditClassroom,
  deleteClassroom as apiDeleteClassroom,
  addPupilToClassroom as apiAddPupilToClassroom,
  searchPupils as apiSearchPupils,
  getPupilsFromClassroom,
  Pupil,
  leaveClassroom as apiLeaveClassroom,
} from "@/services/ClassroomService";
import { router } from "expo-router";
import { useUserStore } from "@/stores/userStore";

export default function ClassroomSettings() {
  const queryClient = useQueryClient();
  const selectedClassroom = useClassroomStore(
    (state) => state.selectedClassroom
  );
  const setSelectedClassroom = useClassroomStore(
    (state) => state.setSelectedClassroom
  );

  const [editClassroomForm, setEditClassroomForm] = useState({
    name: selectedClassroom?.name || "",
    description: selectedClassroom?.description || "",
  });

  const [pupilName, setPupilName] = useState("");
  const [filteredPupils, setFilteredPupils] = useState<Pupil[]>([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searching, setSearching] = useState(false);
  const user = useUserStore((state) => state.user);

  const { data: enrolledPupils, isLoading: loadingPupils } = useQuery({
    queryKey: ["classroomPupils", selectedClassroom?.id],
    queryFn: () =>
      selectedClassroom?.id
        ? getPupilsFromClassroom(selectedClassroom.id)
        : Promise.resolve([]),
    enabled: !!selectedClassroom?.id,
  });

  useEffect(() => {
    const searchPupils = async () => {
      if (pupilName.length > 1) {
        setSearching(true);
        try {
          const results = await apiSearchPupils(pupilName);

          const filteredResults = results.filter(
            (pupil) =>
              !enrolledPupils?.some(
                (enrolledPupil) => enrolledPupil.id === pupil.id
              )
          );

          setFilteredPupils(filteredResults);
          setShowDropdown(true);
        } catch (error) {
          console.error("Error searching pupils:", error);
          const mockResults: Pupil[] = [
            { id: "1", firstName: pupilName, lastName: "Smith" },
            { id: "2", firstName: pupilName, lastName: "Johnson" },
            { id: "3", firstName: pupilName, lastName: "Williams" },
          ];

          setFilteredPupils(mockResults);
          setShowDropdown(true);
        } finally {
          setSearching(false);
        }
      } else {
        setFilteredPupils([]);
        setShowDropdown(false);
      }
    };

    const timeoutId = setTimeout(searchPupils, 500);
    return () => clearTimeout(timeoutId);
  }, [pupilName, enrolledPupils]);

  const { mutateAsync: editClassroomMutation } = useMutation({
    mutationFn: ({
      classroomForm,
      classroomId,
    }: {
      classroomForm: Record<string, any>;
      classroomId: string;
    }) => apiEditClassroom(classroomForm, classroomId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classroomsData"] });
    },
  });

  const { mutateAsync: deleteClassroomMutation } = useMutation({
    mutationFn: ({ classroomId }: { classroomId: string }) =>
      apiDeleteClassroom(classroomId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classroomsData"] });
    },
  });

  const { mutateAsync: leaveClassroomMutation } = useMutation({
    mutationFn: ({ classroomId }: { classroomId: string }) =>
      apiLeaveClassroom(classroomId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["classroomsData"] });
    },
  });

  const { mutateAsync: addPupilMutation } = useMutation({
    mutationFn: ({
      classroomId,
      pupilId,
    }: {
      classroomId: string;
      pupilId: string;
    }) => apiAddPupilToClassroom(classroomId, pupilId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["classroomPupils", selectedClassroom?.id],
      });
      setPupilName("");
      setShowDropdown(false);
    },
  });

  const handlePupilNameChange = (text: string) => {
    setPupilName(text);
  };

  const handleSelectPupil = async (pupil: Pupil) => {
    setPupilName("");
    setShowDropdown(false);

    if (selectedClassroom?.id && pupil.id) {
      try {
        await addPupilMutation({
          classroomId: selectedClassroom.id,
          pupilId: pupil.id || "",
        });
        console.log("Pupil added successfully");
      } catch (error) {
        console.error("Error adding pupil:", error);
      }
    }
  };

  const displayPupilName = (pupil: Pupil): string => {
    return `${pupil.firstName} ${pupil.lastName}`;
  };

  function TeacherSettings() {
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

          <View className="py-1 relative z-40">
            <Text className="font-bold">Add Pupil</Text>
            <Input
              className="border border-gray-300 rounded-md p-2 mt-2"
              placeholder="Type pupil name..."
              value={pupilName}
              onChangeText={handlePupilNameChange}
            />

            {showDropdown && (
              <View className="absolute z-50 top-20 w-full bg-white border border-gray-300 rounded-md shadow-md">
                {searching ? (
                  <View className="p-3 flex items-center justify-center">
                    <ActivityIndicator size="small" color="#0000ff" />
                    <Text className="text-gray-600 mt-2">Searching...</Text>
                  </View>
                ) : filteredPupils.length > 0 ? (
                  <ScrollView style={{ maxHeight: 150 }}>
                    {filteredPupils.map((pupil) => (
                      <TouchableOpacity
                        key={pupil.id}
                        className="p-3 border-b border-gray-200"
                        onPress={() => handleSelectPupil(pupil)}
                      >
                        <Text>{displayPupilName(pupil)}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                ) : (
                  <View className="p-3">
                    <Text className="text-gray-600">No pupils found</Text>
                  </View>
                )}
              </View>
            )}
          </View>

          <View className="py-4 mt-4">
            <Text className="font-bold">Current Pupils</Text>
            {loadingPupils ? (
              <ActivityIndicator size="small" color="#0000ff" />
            ) : enrolledPupils && enrolledPupils.length > 0 ? (
              <View className="mt-2 border border-gray-200 rounded-md">
                {enrolledPupils.map((pupil) => (
                  <View
                    key={pupil.id}
                    className="p-3 border-b border-gray-200 flex-row justify-between items-center"
                  >
                    <Text>{displayPupilName(pupil)}</Text>
                  </View>
                ))}
              </View>
            ) : (
              <Text className="text-gray-500 italic mt-2">
                No pupils enrolled in this classroom yet
              </Text>
            )}
          </View>

          <View className="p-5 bottom-0">
            <Button className="m-5" onPress={() => {}}>
              <Text>Generate Classroom Report</Text>
            </Button>
            <Button
              className="mx-5"
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
              <Text>Edit Classroom</Text>
            </Button>
            <Button
              className="bg-orange m-5"
              onPress={async () => {
                if (selectedClassroom?.id) {
                  try {
                    await deleteClassroomMutation({
                      classroomId: selectedClassroom.id,
                    });
                    setSelectedClassroom(null);
                    router.replace("/classroom");
                  } catch (error) {
                    console.error("Error deleting classroom:", error);
                  }
                }
              }}
            >
              <Text>Delete Classroom</Text>
            </Button>
          </View>
        </ScrollView>
      </View>
    );
  }

  function PupilSettings() {
    return (
      <View className="flex-1">
        <ScrollView className="bg-background p-8">
          <BackHeader />
          <View className="py-1">
            <Text className="text-[22px] text-center m-5 font-bold">
              Classroom
            </Text>
          </View>
          <View className="p-5 bottom-0 my-5">
            <Button
              className="m-5 bg-orange"
              onPress={async () => {
                if (selectedClassroom?.id) {
                  try {
                    await leaveClassroomMutation({
                      classroomId: selectedClassroom?.id,
                    });

                    setSelectedClassroom(null);
                    router.replace("/classroom");
                  } catch (error) {
                    console.error("Error leaving classroom:", error);
                  }
                }
              }}
            >
              <Text>Leave Classroom</Text>
            </Button>
          </View>
        </ScrollView>
      </View>
    );
  }

  return user?.role === "Teacher" ? <TeacherSettings /> : <PupilSettings />;
}

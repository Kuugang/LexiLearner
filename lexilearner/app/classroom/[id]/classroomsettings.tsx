import React, { useState, useRef, useEffect } from "react";
import { Text } from "@/components/ui/text";
import {
  ScrollView,
  View,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
  ActivityIndicator,
  Keyboard,
} from "react-native";
import { Button } from "@/components/ui/button";
import BackHeader from "@/components/BackHeader";
import { Input } from "@/components/ui/input";
import { useClassroomStore } from "@/stores/classroomStore";
import { TextArea } from "@/components/ui/textarea";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import SearchBar, { SearchBarRef } from "@/components/Classroom/SearchBar";
import {
  editClassroom as apiEditClassroom,
  deleteClassroom as apiDeleteClassroom,
  addPupilToClassroom as apiAddPupilToClassroom,
  searchPupils as apiSearchPupils,
  getPupilsFromClassroom,
  Pupil,
} from "@/services/ClassroomService";
import { router } from "expo-router";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { P } from "@/components/ui/typography";
import PupilSettings from "@/components/PupilSettings";
import { useUserStore } from "@/stores/userStore";

export default function ClassroomSettings() {
  const queryClient = useQueryClient();
  const user = useUserStore((state) => state.user);

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

  const [searchText, setSearchText] = useState("");
  const [filteredPupils, setFilteredPupils] = useState<Pupil[]>([]);
  const [showAddPupilModal, setShowAddPupilModal] = useState(false);
  const [searching, setSearching] = useState(false);
  const [showCurrentPupils, setShowCurrentPupils] = useState(false);
  const [selectedPupils, setSelectedPupils] = useState<Pupil[]>([]);

  const searchInputRef = useRef<SearchBarRef>(null);

  const { data: enrolledPupils, isLoading: loadingPupils } = useQuery({
    queryKey: ["classroomPupils", selectedClassroom?.id],
    queryFn: () =>
      selectedClassroom?.id
        ? getPupilsFromClassroom(selectedClassroom.id)
        : Promise.resolve([]),
    enabled: !!selectedClassroom?.id,
  });

  useEffect(() => {
    if (showAddPupilModal && searchInputRef.current) {
      searchInputRef.current.allowKeyboardReturn();

      setTimeout(() => {
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }, 100);

      const keyboardDidHideSubscription = Keyboard.addListener(
        "keyboardDidHide",
        () => {
          if (showAddPupilModal && searchInputRef.current) {
            setTimeout(() => {
              searchInputRef.current?.focus();
            }, 50);
          }
        }
      );

      const keyboardWillHideSubscription = Keyboard.addListener(
        "keyboardWillHide",
        (event) => {
          if (
            showAddPupilModal &&
            searchInputRef.current &&
            searchText.length > 0
          ) {
            searchInputRef.current.focus();
          }
        }
      );

      return () => {
        keyboardDidHideSubscription.remove();
        keyboardWillHideSubscription.remove();
      };
    }
  }, [showAddPupilModal, searchText]);

  useEffect(() => {
    if (!showAddPupilModal || searchText.length <= 1) {
      setFilteredPupils([]);
      return;
    }

    setSearching(true);
    const performSearch = async () => {
      try {
        const results = await apiSearchPupils(searchText);

        const filteredResults = results.filter(
          (pupil) =>
            !enrolledPupils?.some(
              (enrolledPupil) => enrolledPupil.id === pupil.id
            )
        );

        setFilteredPupils(filteredResults);

        setTimeout(() => {
          if (searchInputRef.current) {
            searchInputRef.current.focus();
          }
        }, 10);
      } catch (error) {
        console.error("Error searching pupils:", error);
        const mockResults: Pupil[] = [
          { id: "1", firstName: searchText, lastName: "Smith" },
          { id: "2", firstName: searchText, lastName: "Johnson" },
          { id: "3", firstName: searchText, lastName: "Williams" },
        ];
        setFilteredPupils(mockResults);

        setTimeout(() => {
          if (searchInputRef.current) {
            searchInputRef.current.focus();
          }
        }, 10);
      } finally {
        setSearching(false);
      }
    };

    performSearch();
  }, [searchText, enrolledPupils, showAddPupilModal]);

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
    },
  });

  const handleSelectPupil = (pupil: Pupil) => {
    if (searchInputRef.current) {
      searchInputRef.current.preventKeyboardReturn();
    }

    if (selectedPupils.some((p) => p.id === pupil.id)) {
      setSelectedPupils(selectedPupils.filter((p) => p.id !== pupil.id));
    } else {
      setSelectedPupils([...selectedPupils, pupil]);
    }

    setTimeout(() => {
      if (searchInputRef.current) {
        searchInputRef.current.allowKeyboardReturn();
        searchInputRef.current.focus();
      }
    }, 10);
  };

  const handleRemoveSelectedPupil = (pupilId: string) => {
    setSelectedPupils(selectedPupils.filter((p) => p.id !== pupilId));
  };

  const handleAddSelectedPupils = async () => {
    if (selectedClassroom?.id && selectedPupils.length > 0) {
      try {
        if (searchInputRef.current) {
          searchInputRef.current.preventKeyboardReturn();
        }

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
      } catch (error) {
        console.error("Error adding pupils:", error);

        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      }
    }
  };

  const displayPupilName = (pupil: Pupil): string => {
    return `${pupil.firstName} ${pupil.lastName}`;
  };

  const getRandomColor = (name: string) => {
    const colors = [
      "#845EC2",
      "#D65DB1",
      "#FF6F91",
      "#FF9671",
      "#FFC75F",
      "#F9F871",
      "#0089BA",
      "#2C73D2",
    ];
    const hash = name.split("").reduce((acc, char) => {
      return char.charCodeAt(0) + acc;
    }, 0);
    return colors[hash % colors.length];
  };

  const AddPupilModal = () => {
    const isClosingModal = useRef(false);

    const handleCloseModal = () => {
      isClosingModal.current = true;
      searchInputRef.current?.preventKeyboardReturn();
      Keyboard.dismiss();
      setSearchText("");
      setSelectedPupils([]);
      setShowAddPupilModal(false);
    };

    return (
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "white",
          zIndex: 50,
          height: "100%",
        }}
      >
        <View className="flex-1 bg-white">
          {/* Header with Cancel, title, and Add button */}
          <View className="relative flex-row items-center justify-center p-4 border-b border-gray-200">
            {/* Cancel Button (Left) */}
            <TouchableOpacity
              onPress={handleCloseModal}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              className="absolute left-4"
            >
              <Text className="text-blue-500 text-lg">Cancel</Text>
            </TouchableOpacity>

            {/* Center Title */}
            <Text className="text-black text-lg font-semibold">
              Choose pupil
            </Text>

            {/* Add Button (Right) */}
            {selectedPupils.length > 0 && (
              <TouchableOpacity
                onPress={handleAddSelectedPupils}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                className="absolute right-4"
              >
                <Text className="text-lg text-black">Add</Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Use SearchBar component with onClearPress to handle X button */}
          <View className="p-2 px-4 mb-3">
            <SearchBar
              placeholder="Search"
              initialValue={searchText}
              onSearch={setSearchText}
              ref={searchInputRef}
              debounceTime={1000}
              onClearPress={() => {
                if (searchInputRef.current) {
                  searchInputRef.current.preventKeyboardReturn();

                  setTimeout(() => {
                    if (!isClosingModal.current && searchInputRef.current) {
                      searchInputRef.current.allowKeyboardReturn();
                      searchInputRef.current.focus();
                    }
                  }, 10);
                }
              }}
            />
          </View>

          {/* Selected Pupils */}
          <View>
            {selectedPupils.length > 0 && (
              <View style={{ marginBottom: 5 }}>
                <ScrollView
                  horizontal
                  className="pt-1 pb-1 px-2"
                  showsHorizontalScrollIndicator={false}
                  keyboardShouldPersistTaps="always"
                  keyboardDismissMode="none"
                >
                  {selectedPupils.map((pupil) => {
                    const avatarColor = getRandomColor(
                      pupil.firstName + pupil.lastName
                    );
                    const initials = `${pupil.firstName?.charAt(0) || ""}${
                      pupil.lastName?.charAt(0) || ""
                    }`;

                    return (
                      <View key={pupil.id} className="items-center mx-2 w-20">
                        <View className="relative">
                          <View
                            className="h-16 w-16 rounded-full overflow-hidden justify-center items-center"
                            style={{ backgroundColor: avatarColor }}
                          >
                            <Text className="text-white font-bold text-lg">
                              {initials.toUpperCase()}
                            </Text>
                          </View>
                          <TouchableOpacity
                            style={{
                              position: "absolute",
                              top: -4,
                              right: -4,
                              backgroundColor: "grey",
                              borderRadius: 999,
                              padding: 4,
                              zIndex: 10,
                            }}
                            onPress={() => {
                              handleRemoveSelectedPupil(pupil.id || "");
                              setTimeout(() => {
                                if (searchInputRef.current) {
                                  searchInputRef.current.focus();
                                }
                              }, 50);
                            }}
                            hitSlop={{
                              top: 10,
                              bottom: 10,
                              left: 10,
                              right: 10,
                            }}
                          >
                            <Ionicons name="close" size={14} color="black" />
                          </TouchableOpacity>
                        </View>
                        <Text
                          className="text-black text-center mt-1 text-xs"
                          numberOfLines={1}
                          ellipsizeMode="tail"
                        >
                          {pupil.firstName}
                        </Text>
                        <Text
                          className="text-black text-center text-xs"
                          numberOfLines={1}
                          ellipsizeMode="tail"
                        >
                          {pupil.lastName}
                        </Text>
                      </View>
                    );
                  })}
                </ScrollView>
                <View className="border-b border-gray-200 mt-1" />
              </View>
            )}

            {/* Suggested Label */}
            <Text
              className="text-gray-500 text-lg font-medium px-4 mt-0"
              style={{ marginBottom: -5 }}
            >
              Suggested
            </Text>
          </View>

          {/* Pupil List */}
          {searching ? (
            <View className="flex-1 justify-center items-center">
              <ActivityIndicator size="large" color="#0A84FF" />
            </View>
          ) : (
            <ScrollView
              className="flex-1"
              keyboardShouldPersistTaps="always"
              keyboardDismissMode="none"
            >
              {filteredPupils.length > 0 ? (
                <>
                  {filteredPupils.map((pupil) => {
                    const avatarColor = getRandomColor(
                      pupil.firstName + pupil.lastName
                    );
                    const initials = `${pupil.firstName?.charAt(0) || ""}${
                      pupil.lastName?.charAt(0) || ""
                    }`;
                    const isSelected = selectedPupils.some(
                      (p) => p.id === pupil.id
                    );

                    return (
                      <TouchableOpacity
                        key={pupil.id}
                        className="flex-row items-center justify-between p-4 border-b border-gray-200"
                        onPress={() => {
                          handleSelectPupil(pupil);
                          setTimeout(() => {
                            if (searchInputRef.current) {
                              searchInputRef.current.focus();
                            }
                          }, 50);
                        }}
                      >
                        <View className="flex-row items-center">
                          <View
                            className="h-12 w-12 rounded-full overflow-hidden mr-3 justify-center items-center"
                            style={{ backgroundColor: avatarColor }}
                          >
                            <Text className="text-white font-bold text-base">
                              {initials.toUpperCase()}
                            </Text>
                          </View>
                          <Text className="text-black text-base font-medium">
                            {displayPupilName(pupil)}
                          </Text>
                        </View>
                        <View
                          className={`h-7 w-7 rounded-full border ${
                            isSelected
                              ? "bg-black-500 border-black-500 items-center justify-center"
                              : "border-gray-400"
                          }`}
                        >
                          {isSelected && (
                            <Ionicons
                              name="checkmark"
                              size={18}
                              color="black"
                            />
                          )}
                        </View>
                      </TouchableOpacity>
                    );
                  })}
                </>
              ) : (
                <>
                  {searchText.length > 1 && !searching && (
                    <View className="p-4 justify-center items-center">
                      <Text className="text-gray-500">
                        No matching pupils found
                      </Text>
                    </View>
                  )}
                </>
              )}
            </ScrollView>
          )}
        </View>
      </KeyboardAvoidingView>
    );
  };

  return user?.role === "Pupil" ? (
    <PupilSettings />
  ) : (
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

      {showAddPupilModal && <AddPupilModal />}
    </View>
  );
}

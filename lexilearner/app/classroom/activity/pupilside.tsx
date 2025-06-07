import ClassroomHeader from "@/components/Classroom/ClassroomHeader";
import { useClassroomStore } from "@/stores/classroomStore";
import React, { useCallback, useEffect } from "react";
import { View, Text, Image, ScrollView } from "react-native";
import { useReadingAssignmentStore } from "@/stores/readingAssignmentStore";
import { useGetReadingMaterialById } from "@/services/ReadingMaterialService";
import ReadingContent from "@/components/ReadingContent";
import { useGetReadingAssignmentLogs } from "@/services/ClassroomService";
import InteractionBlocker from "@/components/ui/interactionblocker";
import { useFocusEffect } from "expo-router";
import { useGetCoverFromGDrive } from "@/hooks/useExtractDriveFileId";

type ResultData = { score: number; duration: number };
export default function activity() {
  const selectedClassroom = useClassroomStore(
    (state) => state.selectedClassroom
  );

  const selectedReadingAssignment = useReadingAssignmentStore(
    (state) => state.selectedReadingAssignment
  );

  const {
    data: book,
    isLoading: isBookLoading,
    error: fetchingBookError,
  } = useGetReadingMaterialById(
    selectedReadingAssignment?.readingMaterialId ?? ""
  );

  const {
    data: assignmentlogs,
    isLoading: isLogsLoading,
    error: fetchingLogsError,
    refetch: refetchAssignmentLogs,
  } = useGetReadingAssignmentLogs(selectedReadingAssignment?.id ?? "");

  var imageUrl = useGetCoverFromGDrive(selectedReadingAssignment!.cover);

  useFocusEffect(
    useCallback(() => {
      refetchAssignmentLogs();
    }, [selectedReadingAssignment?.id])
  );

  return (
    <ScrollView>
      <View>
        <ClassroomHeader
          name={`${selectedClassroom?.name}`}
          joinCode={`${selectedClassroom?.joinCode}`}
        />
        <View className="p-8">
          <View className="flex flex-row gap-5">
            <Image
              source={{ uri: imageUrl }}
              className="rounded-lg"
              style={{ width: 100, height: 140 }}
              resizeMode="contain"
            />
            <View className="flex flex-1 flex-col justify-center">
              <Text className="font-bold text-lg">
                {selectedReadingAssignment?.title}
              </Text>

              <Text>{selectedReadingAssignment?.description}</Text>

              <Text>
                MinigameType: {selectedReadingAssignment?.minigameType}
              </Text>

              <Text>
                Created at: {selectedReadingAssignment?.createdAt.split("T")[0]}
              </Text>
              <Text className="font-bold text-lg text-red-500">
                {selectedReadingAssignment?.isActive == true
                  ? "ACTIVE"
                  : "NOT ACTIVE"}
              </Text>
            </View>
          </View>
          <View className="border-b border-gray-200 my-3" />
          <View>
            {(isBookLoading || isLogsLoading) && (
              <Text>Loading assignment...</Text>
            )}
            {!isBookLoading && book && !isLogsLoading && assignmentlogs && (
              <InteractionBlocker disabled={assignmentlogs.length > 0}>
                <ReadingContent
                  type="ScrollView"
                  id={book.id}
                  title={book.title}
                  author={book.author}
                  description={book.description}
                  cover={book.cover}
                  content={book.content}
                  genres={book.genres}
                  difficulty={book.difficulty}
                />
              </InteractionBlocker>
            )}

            {!isBookLoading && !book && (
              <Text>Reading material not found.</Text>
            )}
            <View className="mt-5">
              <Text className="font-bold">Result:</Text>
              {!isLogsLoading &&
                assignmentlogs &&
                (assignmentlogs.length == 0 ? (
                  <Text>You have not attempted this activity.</Text>
                ) : (
                  assignmentlogs.map((item) => {
                    let parsedResult: ResultData = { score: 0, duration: 0 };
                    try {
                      let rawResult = item.result;
                      let objResult;

                      if (typeof rawResult === "string") {
                        rawResult = JSON.parse(rawResult);

                        if (typeof rawResult === "string") {
                          objResult = JSON.parse(rawResult);
                        }
                      }

                      parsedResult = {
                        score: objResult.score,
                        duration: objResult.duration,
                      };
                    } catch (err) {
                      console.error("Invalid JSON in result:", err);
                    }

                    return (
                      <View
                        key={item.id}
                        className="flex flex-row w-full p-5 justify-between border-gray"
                      >
                        <Text className="text-red-500">
                          Score: {parsedResult.score}
                        </Text>
                        <Text>
                          Duration: {formatDuration(parsedResult.duration)}
                        </Text>
                        <Text>{item.completedAt.split("T")[0]}</Text>
                      </View>
                    );
                  })
                ))}
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const formatDuration = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs}s`;
};

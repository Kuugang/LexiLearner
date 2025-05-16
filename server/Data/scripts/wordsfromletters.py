import json
import random
import string
from itertools import permutations

with open("../Seed/all_complete_data.json", "r") as file:
    dataset = json.load(file)

with open("5_letter_words.json", "r") as file:
    data = json.load(file)

word_set = set(word.lower() for word in data)


def is_clean_alpha(word):
    return word.isalpha() and len(word) >= 5


for entry in dataset:
    passage = entry["passage"]

    words = [word.strip(string.punctuation) for word in passage.split()]

    valid_base_words = [word.lower() for word in words if is_clean_alpha(word)]

    final_entries = []

    tried_words = set()
    for word in valid_base_words:
        if word in tried_words:
            continue
        tried_words.add(word)

        perms = set("".join(p) for p in permutations(word, 5))
        valid_words = [p for p in perms if p in word_set]

        if len(valid_words) >= 3:
            final_entries.append({"letters": list(word), "words": valid_words})

    if final_entries:
        if "minigames" not in entry:
            entry["minigames"] = {}
        if "WordsFromLetters" not in entry["minigames"]:
            entry["minigames"]["WordsFromLetters"] = []

        entry["minigames"]["WordsFromLetters"].extend(final_entries)

with open("../Seed/all_complete_data.json", "w") as file:
    json.dump(dataset, file, indent=2)

export interface Story {
  id: number;
  storyId: string;
  storySubject: string;
  storyType: string;
  ageGroup: string;
  imageStyle: string;
  output: StoryOutput;
  coverImage: string;
  userEmail: string;
  userName: string;
  userImage: string;
}

interface StoryOutput {
  bookTitle: string;
  cover: Cover;
  chapters: Chapter[];
}

interface Cover {
  imagePrompt: string;
  altText: string;
}

export interface Chapter {
  chapterNumber: number;
  chapterTitle: string;
  storyText: string;
  imagePrompt: string;
  altText: string;
  educationalNote: string;
}

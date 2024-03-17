export type IdShortNameMap = Record<string, string | undefined>;

export interface IdOptions {
  shortNameLength?: number;
  shortNamePaddingChar?: string;
  nanoidLength?: number;
  shortNameIdSeparator?: string;
}

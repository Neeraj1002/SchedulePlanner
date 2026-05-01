export type SemesterLabel = 'AUTUMN' | 'SPRING';

export interface ParserConfig {
  codePattern: RegExp;
  yearPattern: RegExp;
  semesterPatterns: Record<SemesterLabel, RegExp>;
  yearMap: Record<string, number>;
}

export const PARSER_CONFIGS: Record<string, ParserConfig> = {
  IIT_ROORKEE: {
    codePattern: /^[A-Z]{2,4}-\d{3}$/,
    yearPattern: /Year\s*:\s*(I|II|III|IV)/i,
    semesterPatterns: {
      AUTUMN: /\(Autumn\)/i,
      SPRING: /\(Spring\)/i,
    },
    yearMap: {
      I: 1,
      II: 2,
      III: 3,
      IV: 4,
    },
  },
};

export type ParserType = keyof typeof PARSER_CONFIGS;

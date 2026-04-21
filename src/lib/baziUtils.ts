import { Solar, Lunar, EightChar } from 'lunar-typescript';

export interface BaziData {
  solarDate: string;
  lunarDate: string;
  yearPillar: Pillar;
  monthPillar: Pillar;
  dayPillar: Pillar;
  hourPillar: Pillar;
  fiveElements: string;
}

export interface Pillar {
  heavenlyStem: string;
  earthlyBranch: string;
  hiddenStems: string[];
  element: string;
  animal: string;
}

export function calculateBazi(date: Date): BaziData {
  const solar = Solar.fromDate(date);
  const lunar = solar.getLunar();
  const eightChar = lunar.getEightChar();

  const splitPillar = (pillarStr: string): Pillar => {
    return {
      heavenlyStem: pillarStr.charAt(0),
      earthlyBranch: pillarStr.charAt(1),
      hiddenStems: [],
      element: '',
      animal: '',
    };
  };

  return {
    solarDate: solar.toFullString(),
    lunarDate: lunar.toFullString(),
    yearPillar: splitPillar(eightChar.getYear()),
    monthPillar: splitPillar(eightChar.getMonth()),
    dayPillar: splitPillar(eightChar.getDay()),
    hourPillar: splitPillar(eightChar.getTime()),
    fiveElements: '',
  };
}

export type ArtistAvailability = {
  mon: boolean;
  tue: boolean;
  wed: boolean;
  thu: boolean;
  fri: boolean;
  sat: boolean;
  sun: boolean;
  start_time: string;
  end_time: string;
  notes: string;
};

export const DEFAULT_AVAILABILITY: ArtistAvailability = {
  mon: true, tue: true, wed: true, thu: true, fri: true,
  sat: false, sun: false,
  start_time: "10:00", end_time: "18:00", notes: "",
};
